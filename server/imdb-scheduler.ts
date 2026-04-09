import { getDb } from './db';
import { posts, categories } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * IMDb Scheduler - Automatically fetches and creates 5 posts per day from IMDb
 * This runs as a background job and creates posts with IMDb data
 */

interface IMDbMovie {
  id: string;
  title: string;
  year: number;
  rating: number;
  plot: string;
  poster: string;
  type: 'movie' | 'series';
}

// Mock IMDb data - in production, replace with real API calls
const mockIMDbData: IMDbMovie[] = [
  {
    id: 'tt0111161',
    title: 'The Shawshank Redemption',
    year: 1994,
    rating: 9.3,
    plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    poster: 'https://m.media-amazon.com/images/M/MV5BMDFlYTk3YzAtNDU4Zi00YzAwLWJiMTUtYTk0YjYwOWVkYTQ1XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg',
    type: 'movie',
  },
  {
    id: 'tt0068646',
    title: 'The Godfather',
    year: 1972,
    rating: 9.2,
    plot: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.',
    poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNC00MTMyLWFwM2ItYjAwM2M2MTg0MjY3XkEyXkFqcGdeQXVyNzc4ODk3Nzk@._V1_SX300.jpg',
    type: 'movie',
  },
  {
    id: 'tt0071562',
    title: 'The Godfather Part II',
    year: 1974,
    rating: 9.0,
    plot: 'The early life and rise of Vito Corleone in 1920s New York is portrayed while his son Michael expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, to Las Vegas to New York.',
    poster: 'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZmItWFlhMC00M2ItWJkxOWFiMGJkMGVkXkEyXkFqcGdeQXVyNzc4ODk3Nzk@._V1_SX300.jpg',
    type: 'movie',
  },
  {
    id: 'tt0110912',
    title: 'Pulp Fiction',
    year: 1994,
    rating: 8.9,
    plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItMDJlM2RlMDg2NmE2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    type: 'movie',
  },
  {
    id: 'tt0816692',
    title: 'Interstellar',
    year: 2014,
    rating: 8.6,
    plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMTAtODZjNDZhNjAxNDFmXkEyXkFqcGdeQXVyMzQ0MjM5NjU@._V1_SX300.jpg',
    type: 'movie',
  },
];

async function fetchIMDbData(): Promise<IMDbMovie[]> {
  // TODO: Replace with real OMDB/IMDb API integration
  // Example: https://www.omdbapi.com/?apikey=YOUR_KEY&s=anime&type=series
  
  // For now, return mock data
  console.log('[IMDb Scheduler] Fetching IMDb data (using mock data)');
  return mockIMDbData.slice(0, 5);
}

async function createPostFromIMDb(movie: IMDbMovie, categoryId: number): Promise<void> {
  const db_instance = await getDb();
  if (!db_instance) {
    console.error('[IMDb Scheduler] Database not available');
    return;
  }

  try {
    // Check if post already exists
    const existingPost = await db_instance
      .select()
      .from(posts)
      .where(eq(posts.imdbReference, movie.id))
      .limit(1);

    if (existingPost.length > 0) {
      console.log(`[IMDb Scheduler] Post for ${movie.title} already exists, skipping`);
      return;
    }

    const slug = movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const content = `
# ${movie.title} (${movie.year})

**Rating:** ${movie.rating}/10

## Overview
${movie.plot}

## Details
- **Type:** ${movie.type === 'series' ? 'TV Series' : 'Movie'}
- **Year:** ${movie.year}
- **IMDb Rating:** ${movie.rating}/10

## About This Post
This post was automatically generated from IMDb data. For more information, visit [IMDb](https://www.imdb.com/title/${movie.id}/).
    `.trim();

    const excerpt = movie.plot.substring(0, 150) + '...';

    await db_instance.insert(posts).values({
      title: movie.title,
      slug,
      content,
      excerpt,
      categoryId,
      authorId: 1, // System/Admin user
      status: 'published',
      featuredImage: movie.poster,
      thumbnail: movie.poster,
      imdbReference: movie.id,
      publishedAt: new Date(),
      views: 0,
      metaDescription: `${movie.title} - IMDb Rating: ${movie.rating}/10`,
      metaKeywords: `${movie.title}, ${movie.year}, imdb, ${movie.type}`,
    });

    console.log(`[IMDb Scheduler] Created post for ${movie.title}`);
  } catch (error) {
    console.error(`[IMDb Scheduler] Failed to create post for ${movie.title}:`, error);
  }
}

export async function syncDailyIMDbPosts(): Promise<void> {
  console.log('[IMDb Scheduler] Starting daily IMDb sync...');

  try {
    const db_instance = await getDb();
    if (!db_instance) {
      console.error('[IMDb Scheduler] Database not available');
      return;
    }

    // Get or create "IMDb" category
    let imdbCategory = await db_instance
      .select()
      .from(categories)
      .where(eq(categories.slug, 'imdb'))
      .limit(1);

    let categoryId: number;

    if (imdbCategory.length === 0) {
      const result = await db_instance.insert(categories).values({
        name: 'IMDb Updates',
        slug: 'imdb',
        description: 'Automatically curated content from IMDb',
        color: '#FFB81C',
      });
      categoryId = result[0].insertId;
      console.log('[IMDb Scheduler] Created IMDb category');
    } else {
      categoryId = imdbCategory[0].id;
    }

    // Fetch IMDb data
    const movies = await fetchIMDbData();
    console.log(`[IMDb Scheduler] Fetched ${movies.length} movies from IMDb`);

    // Create posts
    for (const movie of movies) {
      await createPostFromIMDb(movie, categoryId);
    }

    console.log('[IMDb Scheduler] Daily sync completed successfully');
  } catch (error) {
    console.error('[IMDb Scheduler] Sync failed:', error);
  }
}

// Schedule the sync to run daily at 2 AM
export function startIMDbScheduler(): void {
  console.log('[IMDb Scheduler] Initializing scheduler...');

  // Calculate time until next 2 AM
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(2, 0, 0, 0);

  const timeUntilNextSync = tomorrow.getTime() - now.getTime();

  // Run first sync after calculated delay
  setTimeout(() => {
    syncDailyIMDbPosts();

    // Then run every 24 hours
    setInterval(() => {
      syncDailyIMDbPosts();
    }, 24 * 60 * 60 * 1000);
  }, timeUntilNextSync);

  console.log(`[IMDb Scheduler] Scheduler started. Next sync in ${Math.round(timeUntilNextSync / 1000 / 60)} minutes`);
}
