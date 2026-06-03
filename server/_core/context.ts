import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { attachFirebaseUser } from "./firebase-middleware";
import { getUserByOpenId, upsertUser } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Try to authenticate with Firebase
    const firebaseUser = await attachFirebaseUser({
      req: opts.req,
      res: opts.res,
      user: null,
    });

    if (firebaseUser) {
      // Sync Firebase user to database
      await upsertUser({
        openId: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        loginMethod: 'firebase',
      });

      // Retrieve user from database
      const dbUser = await getUserByOpenId(firebaseUser.uid);
      user = dbUser || null;
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    console.error('[Context] Authentication error:', error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
