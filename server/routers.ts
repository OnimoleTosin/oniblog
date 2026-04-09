import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import * as email from "./email";
import * as llm from "./llm-assistant";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { posts, categories, users, comments, emailSubscriptions, analytics } from "../drizzle/schema";
import { ENV } from "./_core/env";

// Owner-only procedure (strict owner enforcement)
const ownerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.openId !== ENV.ownerOpenId) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Owner access required' });
  }
  return next({ ctx });
});

// Admin-only procedure (kept for backward compatibility, but enforces owner)
const adminProcedure = ownerProcedure;

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Posts management
  posts: router({
    getPublished: publicProcedure
      .input(z.object({ limit: z.number().default(10), offset: z.number().default(0) }))
      .query(async ({ input }) => db.getPublishedPosts(input.limit, input.offset)),
    
    getByCategory: publicProcedure
      .input(z.object({ categoryId: z.number(), limit: z.number().default(10), offset: z.number().default(0) }))
      .query(async ({ input }) => db.getPostsByCategory(input.categoryId, input.limit, input.offset)),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await db.getPostBySlug(input.slug);
        if (post) {
          // Track view
          await db.trackEvent({
            postId: post.id,
            eventType: 'view',
            createdAt: new Date(),
          });
        }
        return post;
      }),
    
    search: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().default(10), offset: z.number().default(0) }))
      .query(async ({ input }) => db.searchPosts(input.query, input.limit, input.offset)),
    
    getRelated: publicProcedure
      .input(z.object({ categoryId: z.number(), currentPostId: z.number(), limit: z.number().default(5) }))
      .query(async ({ input }) => db.getRelatedPosts(input.categoryId, input.currentPostId, input.limit)),

    // Admin endpoints
    create: ownerProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        categoryId: z.number(),
        featuredImage: z.string().optional(),
        thumbnail: z.string().optional(),
        status: z.enum(['draft', 'published']),
        imdbReference: z.string().optional(),
        affiliateLinks: z.string().optional(),
        metaDescription: z.string().optional(),
        metaKeywords: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error("Database not available");
        
        const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const publishedAt = input.status === 'published' ? new Date() : null;
        
        const result = await db_instance.insert(posts).values({
          ...input,
          slug,
          authorId: ctx.user.id,
          publishedAt,
        });
        
        const postId = result[0].insertId;
        
        // Trigger email notifications if published
        if (input.status === 'published') {
          const newPost = await db_instance.select().from(posts).where(eq(posts.id, postId)).limit(1);
          if (newPost.length > 0) {
            await email.notifySubscribersOfNewPost(newPost[0]);
          }
        }
        
        return { id: postId, slug };
      }),

    update: ownerProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        categoryId: z.number().optional(),
        featuredImage: z.string().optional(),
        thumbnail: z.string().optional(),
        status: z.enum(['draft', 'published']).optional(),
        imdbReference: z.string().optional(),
        affiliateLinks: z.string().optional(),
        metaDescription: z.string().optional(),
        metaKeywords: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error("Database not available");
        
        const { id, ...updateData } = input;
        const publishedAt = updateData.status === 'published' ? new Date() : undefined;
        
        // Get the old post to check if we're publishing for the first time
        const oldPost = await db_instance.select().from(posts).where(eq(posts.id, id)).limit(1);
        const wasPublished = oldPost.length > 0 && oldPost[0].status === 'published';
        const isPublishing = updateData.status === 'published' && !wasPublished;
        
        await db_instance.update(posts).set({
          ...updateData,
          publishedAt,
          updatedAt: new Date(),
        }).where(eq(posts.id, id));
        
        // Trigger email notifications if publishing for the first time
        if (isPublishing) {
          const newPost = await db_instance.select().from(posts).where(eq(posts.id, id)).limit(1);
          if (newPost.length > 0) {
            await email.notifySubscribersOfNewPost(newPost[0]);
          }
        }
        
        return { success: true };
      }),

    delete: ownerProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error("Database not available");
        
        await db_instance.delete(posts).where(eq(posts.id, input.id));
        return { success: true };
      }),
  }),

  // Categories
  categories: router({
    getAll: publicProcedure.query(() => db.getAllCategories()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) return null;
        const result = await db_instance.select().from(categories).where(eq(categories.id, input.id)).limit(1);
        return result.length > 0 ? result[0] : null;
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => db.getCategoryBySlug(input.slug)),

    create: ownerProcedure
      .input(z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error("Database not available");
        
        const result = await db_instance.insert(categories).values(input);
        return { id: result[0].insertId };
      }),

    update: ownerProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error("Database not available");
        
        const { id, ...updateData } = input;
        await db_instance.update(categories).set(updateData).where(eq(categories.id, id));
        return { success: true };
      }),

    delete: ownerProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error("Database not available");
        
        await db_instance.delete(categories).where(eq(categories.id, input.id));
        return { success: true };
      }),
  }),

  // Comments
  comments: router({
    getByPost: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => db.getPostComments(input.postId)),

    create: publicProcedure
      .input(z.object({
        postId: z.number(),
        content: z.string().min(1),
        authorName: z.string().optional(),
        authorEmail: z.string().email().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.id;
        const authorName = ctx.user?.name || input.authorName || 'Anonymous';
        const authorEmail = ctx.user?.email || input.authorEmail;
        
        await db.createComment({
          postId: input.postId,
          userId,
          content: input.content,
          authorName,
          authorEmail,
          status: 'approved', // Auto-approve for public comments
        });
        
        return { success: true };
      }),

    // Owner-only moderation endpoints
    getPending: ownerProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(async ({ input }) => db.getPendingComments(input.limit, input.offset)),

    approve: ownerProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error('Database not available');
        
        const { comments } = await import('../drizzle/schema');
        await db_instance.update(comments).set({ status: 'approved' }).where(eq(comments.id, input.id));
        return { success: true };
      }),

    reject: ownerProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error('Database not available');
        
        const { comments } = await import('../drizzle/schema');
        await db_instance.update(comments).set({ status: 'rejected' }).where(eq(comments.id, input.id));
        return { success: true };
      }),
  }),

  // Email subscriptions
  subscriptions: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.id;
        await db.subscribeEmail(input.email, userId);
        return { success: true };
      }),

    unsubscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error('Database not available');
        
        await db_instance.update(emailSubscriptions).set({ isSubscribed: false, updatedAt: new Date() }).where(eq(emailSubscriptions.email, input.email));
        return { success: true };
      }),

    getStatus: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) return { subscribed: false };
        
        const result = await db_instance.select().from(emailSubscriptions).where(eq(emailSubscriptions.email, input.email)).limit(1);
        return { subscribed: result.length > 0 && result[0].isSubscribed };
      }),

    getSubscriberCount: ownerProcedure.query(async () => {
      const db_instance = await db.getDb();
      if (!db_instance) return 0;
      
      const result = await db_instance.select().from(emailSubscriptions).where(eq(emailSubscriptions.isSubscribed, true));
      return result.length;
    }),
  }),

  // Analytics
  analytics: router({
    trackClick: publicProcedure
      .input(z.object({
        postId: z.number().optional(),
        affiliateLinkId: z.string().optional(),
        referrer: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.trackEvent({
          postId: input.postId,
          affiliateLinkId: input.affiliateLinkId,
          eventType: input.affiliateLinkId ? 'affiliate_click' : 'click',
          userId: ctx.user?.id,
          referrer: input.referrer,
          createdAt: new Date(),
        });
        
        // Increment post view count if tracking a post view
        if (input.postId && !input.affiliateLinkId) {
          const db_instance = await db.getDb();
          if (db_instance) {
            const post = await db_instance.select().from(posts).where(eq(posts.id, input.postId)).limit(1);
            if (post.length > 0) {
              await db_instance.update(posts).set({
                views: (post[0].views || 0) + 1,
              }).where(eq(posts.id, input.postId));
            }
          }
        }
        
        return { success: true };
      }),

    getDailyStats: ownerProcedure
      .input(z.object({ date: z.date() }))
      .query(async ({ input }) => {
        const stats = await db.getDailyStatsAggregated(input.date);
        return stats;
      }),

    getDateRangeStats: ownerProcedure
      .input(z.object({ startDate: z.date(), endDate: z.date() }))
      .query(async ({ input }) => db.getAnalyticsForDateRangeAggregated(input.startDate, input.endDate)),
  }),

  // Reading history
  readingHistory: router({
    add: protectedProcedure
      .input(z.object({ postId: z.number(), timeSpent: z.number().optional() }))
      .mutation(async ({ input, ctx }) => {
        await db.addToReadingHistory(ctx.user.id, input.postId, input.timeSpent);
        return { success: true };
      }),

    getHistory: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input, ctx }) => db.getUserReadingHistory(ctx.user.id, input.limit)),
  }),

  // Image upload
  images: router({
    uploadPostImage: ownerProcedure
      .input(z.object({
        fileName: z.string().min(1),
        fileData: z.string(), // base64 encoded
        fileType: z.string().default('image/jpeg'),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Note: Image upload would use storagePut from server/storage.ts
          // For now, return a placeholder URL that can be replaced with actual S3 URL
          const fileKey = `posts/${ctx.user.id}/${Date.now()}-${input.fileName}`;
          const url = `https://cdn.example.com/${fileKey}`; // Placeholder
          
          console.log(`[Image Upload] Would upload ${input.fileName} to ${fileKey}`);
          return { success: true, url };
        } catch (error) {
          console.error('[Image Upload] Failed:', error);
          return { success: false, error: String(error) };
        }
      }),
  }),

  // LLM Writing Assistant
  llmAssistant: router({
    generateReview: ownerProcedure
      .input(z.object({
        title: z.string().min(1),
        context: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const { generateReviewDraft } = await import('./llm-assistant');
        return generateReviewDraft(input.title, input.context);
      }),

    generateSummary: ownerProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const { generateSummary } = await import('./llm-assistant');
        return generateSummary(input.title, input.content);
      }),

    generateSEO: ownerProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const { generateSEOContent } = await import('./llm-assistant');
        return generateSEOContent(input.title, input.content);
      }),

    improveContent: ownerProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const { improveContent } = await import('./llm-assistant');
        return improveContent(input.title, input.content);
      }),

    generateTitles: ownerProcedure
      .input(z.object({
        topic: z.string().min(1),
        style: z.string().default('engaging'),
      }))
      .mutation(async ({ input }) => {
        const { generateTitleSuggestions } = await import('./llm-assistant');
        return generateTitleSuggestions(input.topic, input.style);
      }),
  }),

  // User profile
  users: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserById(ctx.user.id);
    }),

    isOwner: protectedProcedure.query(({ ctx }) => {
      return ctx.user.openId === ENV.ownerOpenId;
    }),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
        avatar: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error("Database not available");
        
        await db_instance.update(users).set(input).where(eq(users.id, ctx.user.id));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Re-export for use in other modules
export { ownerProcedure, adminProcedure };
