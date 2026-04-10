import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

type AuthenticatedUser = NonNullable<TrpcContext['user']>;

function createContext(user?: AuthenticatedUser): TrpcContext {
  return {
    user: user || null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  };
}

describe('Comments Router', () => {
  describe('comments.create', () => {
    it('should create a public comment without authentication', async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.comments.create({
        postId: 1,
        authorName: 'Test User',
        authorEmail: 'test@example.com',
        content: 'Great post!',
      });

      expect(result).toBeDefined();
    });
  });

  describe('comments.getByPost', () => {
    it('should retrieve comments for a post', async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const comments = await caller.comments.getByPost({ postId: 1 });
      expect(Array.isArray(comments)).toBe(true);
    });
  });
});
