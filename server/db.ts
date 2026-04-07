import { eq, desc, and, like, inArray, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, posts, categories, comments, emailSubscriptions, analytics, readingHistory, imdbIntegration } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Posts queries
export async function getPublishedPosts(limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(eq(posts.status, 'published')).orderBy(desc(posts.publishedAt)).limit(limit).offset(offset);
}

export async function getPostsByCategory(categoryId: number, limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(and(eq(posts.categoryId, categoryId), eq(posts.status, 'published'))).orderBy(desc(posts.publishedAt)).limit(limit).offset(offset);
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchPosts(query: string, limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(and(like(posts.title, `%${query}%`), eq(posts.status, 'published'))).orderBy(desc(posts.publishedAt)).limit(limit).offset(offset);
}

export async function getRelatedPosts(categoryId: number, currentPostId: number, limit = 5) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(and(eq(posts.categoryId, categoryId), eq(posts.status, 'published'))).limit(limit);
}

// Categories queries
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Comments queries
export async function getPostComments(postId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comments).where(and(eq(comments.postId, postId), eq(comments.status, 'approved'))).orderBy(desc(comments.createdAt));
}

export async function createComment(comment: typeof comments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(comments).values(comment);
}

export async function getPendingComments(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comments).where(eq(comments.status, 'pending')).orderBy(desc(comments.createdAt)).limit(limit).offset(offset);
}

// Analytics queries
export async function trackEvent(event: typeof analytics.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(analytics).values(event);
}

export async function getDailyVisitors(date: Date) {
  const db = await getDb();
  if (!db) return 0;
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const result = await db.select().from(analytics).where(and(
    eq(analytics.eventType, 'view'),
    gte(analytics.createdAt, startOfDay),
    lte(analytics.createdAt, endOfDay)
  ));
  
  return result.length;
}

export async function getDailyStatsAggregated(date: Date) {
  const db = await getDb();
  if (!db) return { visitors: 0, clicks: 0, affiliateClicks: 0 };
  
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const allEvents = await db.select().from(analytics).where(and(
    gte(analytics.createdAt, startOfDay),
    lte(analytics.createdAt, endOfDay)
  ));
  
  return {
    visitors: allEvents.filter(e => e.eventType === 'view').length,
    clicks: allEvents.filter(e => e.eventType === 'click').length,
    affiliateClicks: allEvents.filter(e => e.eventType === 'affiliate_click').length,
  };
}

export async function getAnalyticsForDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(analytics).where(and(
    gte(analytics.createdAt, startDate),
    lte(analytics.createdAt, endDate)
  ));
}

export async function getAnalyticsForDateRangeAggregated(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  
  const allEvents = await db.select().from(analytics).where(and(
    gte(analytics.createdAt, startDate),
    lte(analytics.createdAt, endDate)
  ));
  
  // Group by day
  const grouped: Record<string, { visitors: number; clicks: number; affiliateClicks: number }> = {};
  
  allEvents.forEach(event => {
    const dateKey = new Date(event.createdAt).toISOString().split('T')[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = { visitors: 0, clicks: 0, affiliateClicks: 0 };
    }
    
    if (event.eventType === 'view') grouped[dateKey].visitors++;
    if (event.eventType === 'click') grouped[dateKey].clicks++;
    if (event.eventType === 'affiliate_click') grouped[dateKey].affiliateClicks++;
  });
  
  return Object.entries(grouped).map(([date, stats]) => ({
    date,
    ...stats,
  }));
}

// Email subscriptions
export async function subscribeEmail(email: string, userId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(emailSubscriptions).values({ email, userId }).onDuplicateKeyUpdate({
    set: { isSubscribed: true, updatedAt: new Date() }
  });
}

export async function getSubscribedEmails() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emailSubscriptions).where(eq(emailSubscriptions.isSubscribed, true));
}

// Reading history
export async function addToReadingHistory(userId: number, postId: number, timeSpent?: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(readingHistory).values({ userId, postId, timeSpent });
}

export async function getUserReadingHistory(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(readingHistory).where(eq(readingHistory.userId, userId)).orderBy(desc(readingHistory.readAt)).limit(limit);
}

// IMDb integration
export async function getImdbEntry(imdbId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(imdbIntegration).where(eq(imdbIntegration.imdbId, imdbId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createImdbEntry(entry: typeof imdbIntegration.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(imdbIntegration).values(entry).onDuplicateKeyUpdate({
    set: { lastSyncedAt: new Date() }
  });
}
