import { getDb } from './db';
import { posts, categories, imdbIntegration } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { notifyOwner } from './_core/notification';

/**
 * IMDb integration service - fetches and creates blog posts from IMDb data
 * This is a placeholder that demonstrates the integration structure.
 * In production, you would connect to the OMDB API or IMDb API.
 */

export interface IMDbTitle {
  imdbId: string;
  title: string;
  year: number;
  type: 'movie' | 'anime';
  rating: number;
  plot: string;
  posterUrl?: string;
  genre: string[];
}

/**
 * Fetch trending titles from IMDb (placeholder implementation)
 * In production, integrate with OMDB API or IMDb API
 */
export async function fetchTrendingTitles(count: number = 5): Promise<IMDbTitle[]> {
  try {
    // This is a placeholder. In production, you would call the OMDB API:
    // const response = await fetch(`https://www.omdbapi.com/?s=trending&type=movie&apikey=${OMDB_API_KEY}`);
    
    console.log(`[IMDb] Placeholder: Would fetch ${count} trending titles from IMDb`);
    return [];
  } catch (error) {
    console.error('[IMDb] Failed to fetch trending titles:', error);
    return [];
  }
}

/**
 * Create a blog post from IMDb data
 */
export async function createPostFromIMDb(
  title: IMDbTitle,
  categoryId: number,
  ownerId: number
): Promise<{ success: boolean; postId?: number; error?: string }> {
  try {
    const db = await getDb();
    if (!db) {
      return { success: false, error: 'Database not available' };
    }

    // Check if we've already created a post for this IMDb ID
    const existing = await db
      .select()
      .from(imdbIntegration)
      .where(eq(imdbIntegration.imdbId, title.imdbId))
      .limit(1);

    if (existing.length > 0) {
      console.log(`[IMDb] Post already exists for ${title.imdbId}`);
      return { success: false, error: 'Post already exists for this IMDb title' };
    }

    // Create slug from title
    const slug = title.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Create the blog post
    const postResult = await db.insert(posts).values({
      title: `${title.title} (${title.year}) - ${title.type === 'movie' ? 'Movie' : 'Anime'} Review`,
      slug,
      content: `
# ${title.title}

**Year:** ${title.year}  
**Type:** ${title.type === 'movie' ? 'Movie' : 'Anime'}  
**Rating:** ⭐ ${title.rating}/10  
**Genres:** ${title.genre.join(', ')}

## Overview

${title.plot}

## Where to Watch

Check your favorite streaming platforms for availability.

---

*This post was automatically generated from IMDb data.*
      `.trim(),
      excerpt: title.plot.substring(0, 160) + '...',
      categoryId,
      authorId: ownerId,
      status: 'published',
      publishedAt: new Date(),
      featuredImage: title.posterUrl,
      imdbReference: `IMDb ID: ${title.imdbId} | Rating: ${title.rating}/10`,
      metaDescription: `${title.title} - ${title.year} ${title.type === 'movie' ? 'movie' : 'anime'} review and information.`,
      metaKeywords: `${title.title}, ${title.year}, ${title.genre.join(', ')}, review`,
    });

    // Track the IMDb integration
    await db.insert(imdbIntegration).values({
      imdbId: title.imdbId,
      title: title.title,
      type: title.type,
      rating: title.rating.toString() as any,
      posterUrl: title.posterUrl,
      lastSyncedAt: new Date(),
    });

    console.log(`[IMDb] Created post for ${title.title} (${title.imdbId})`);
    return { success: true, postId: postResult[0].insertId };
  } catch (error) {
    console.error('[IMDb] Failed to create post:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Automated daily IMDb sync (5 posts per day)
 * This should be called by a scheduled job/cron
 */
export async function syncDailyIMDbPosts(ownerId: number): Promise<{ created: number; failed: number }> {
  try {
    console.log('[IMDb] Starting daily sync...');

    // Fetch trending titles
    const titles = await fetchTrendingTitles(5);

    if (titles.length === 0) {
      console.log('[IMDb] No titles fetched from IMDb');
      return { created: 0, failed: 0 };
    }

    // Get or create "IMDb" category
    const db = await getDb();
    if (!db) {
      return { created: 0, failed: 5 };
    }

    let categoryId: number;

    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, 'imdb'))
      .limit(1);

    if (existingCategory.length > 0) {
      categoryId = existingCategory[0].id;
    } else {
      const categoryResult = await db.insert(categories).values({
        name: 'IMDb',
        slug: 'imdb',
        description: 'Automatically curated content from IMDb',
        color: '#FFB000',
      });
      categoryId = categoryResult[0].insertId;
    }

    // Create posts for each title
    let created = 0;
    let failed = 0;

    for (const title of titles) {
      const result = await createPostFromIMDb(title, categoryId, ownerId);
      if (result.success) {
        created++;
      } else {
        failed++;
      }
    }

    // Notify owner
    if (created > 0) {
      await notifyOwner({
        title: 'Daily IMDb Sync Complete',
        content: `Successfully created ${created} new posts from IMDb. ${failed} posts failed.`,
      });
    }

    console.log(`[IMDb] Sync complete: ${created} created, ${failed} failed`);
    return { created, failed };
  } catch (error) {
    console.error('[IMDb] Daily sync failed:', error);
    return { created: 0, failed: 5 };
  }
}

/**
 * Get IMDb integration status
 */
export async function getIMDbStatus() {
  try {
    const db = await getDb();
    if (!db) return { totalSynced: 0, lastSync: null };

    const result = await db.select().from(imdbIntegration).orderBy((t) => t.lastSyncedAt);
    const lastSync = result.length > 0 ? result[result.length - 1].lastSyncedAt : null;

    return {
      totalSynced: result.length,
      lastSync,
    };
  } catch (error) {
    console.error('[IMDb] Failed to get status:', error);
    return { totalSynced: 0, lastSync: null };
  }
}
