import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { appRouter } from './routers';
import { getDb } from './db';
import { eq } from 'drizzle-orm';
import { posts, categories, users } from '../drizzle/schema';

describe('Posts Router', () => {
  let testUserId: number;
  let testCategoryId: number;
  let testPostId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Create test category
    const categoryResult = await db.insert(categories).values({
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test category for posts',
    });
    testCategoryId = categoryResult[0].insertId;

    // Create test user
    const userResult = await db.insert(users).values({
      openId: 'test-user-' + Date.now(),
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin',
    });
    testUserId = userResult[0].insertId;
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;

    // Cleanup
    if (testPostId) {
      await db.delete(posts).where(eq(posts.id, testPostId));
    }
    if (testCategoryId) {
      await db.delete(categories).where(eq(categories.id, testCategoryId));
    }
    if (testUserId) {
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });

  it('should create a post', async () => {
    const mockContext = {
      user: {
        id: testUserId,
        openId: process.env.OWNER_OPEN_ID || 'owner-user',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin' as const,
        loginMethod: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: { protocol: 'https', headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    };

    const caller = appRouter.createCaller(mockContext);

    const result = await caller.posts.create({
      title: 'Test Post',
      content: 'This is a test post content',
      excerpt: 'Test excerpt',
      categoryId: testCategoryId,
      status: 'published',
    });

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('slug');
    testPostId = result.id;
  });

  it('should retrieve published posts', async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: 'https', headers: {} } as any,
      res: {} as any,
    });

    const posts = await caller.posts.getPublished({ limit: 10, offset: 0 });
    expect(Array.isArray(posts)).toBe(true);
  });

  it('should search posts', async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: 'https', headers: {} } as any,
      res: {} as any,
    });

    const results = await caller.posts.search({ query: 'Test', limit: 10, offset: 0 });
    expect(Array.isArray(results)).toBe(true);
  });

  it('should deny admin access to non-admin users', async () => {
    const mockContext = {
      user: {
        id: testUserId,
        openId: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user' as const,
        loginMethod: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: { protocol: 'https', headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    };

    const caller = appRouter.createCaller(mockContext);

    try {
      await caller.posts.create({
        title: 'Unauthorized Post',
        content: 'Should fail',
        categoryId: testCategoryId,
        status: 'published',
      });
      expect.fail('Should have thrown FORBIDDEN error');
    } catch (error: any) {
      expect(error.code).toBe('FORBIDDEN');
    }
  });
});

describe('Categories Router', () => {
  let testCategoryId: number;

  it('should retrieve all categories', async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: 'https', headers: {} } as any,
      res: {} as any,
    });

    const categories = await caller.categories.getAll();
    expect(Array.isArray(categories)).toBe(true);
  });

  it('should create a category (admin only)', async () => {
    const mockContext = {
      user: {
        id: 1,
        openId: process.env.OWNER_OPEN_ID || 'owner-user',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin' as const,
        loginMethod: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: { protocol: 'https', headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    };

    const caller = appRouter.createCaller(mockContext);

    const result = await caller.categories.create({
      name: 'Test Category',
      slug: 'test-category-' + Date.now(),
      description: 'Test category',
    });

    expect(result).toHaveProperty('id');
    testCategoryId = result.id;
  });

  afterAll(async () => {
    if (testCategoryId) {
      const db = await getDb();
      if (db) {
        await db.delete(categories).where(eq(categories.id, testCategoryId));
      }
    }
  });
});

describe('Comments Router', () => {
  it('should allow public comments', async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: 'https', headers: {} } as any,
      res: {} as any,
    });

    // This should not throw an error
    const result = await caller.comments.create({
      postId: 1,
      content: 'Great post!',
      authorName: 'John Doe',
      authorEmail: 'john@example.com',
    });

    expect(result).toHaveProperty('success');
    expect(result.success).toBe(true);
  });
});
