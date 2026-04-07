import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  text, 
  timestamp, 
  varchar,
  boolean,
  decimal,
  longtext,
  datetime,
  index,
  unique
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Blog categories (anime, movies, reviews, news, etc.)
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 7 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Blog posts
 */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: longtext("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featuredImage"),
  thumbnail: text("thumbnail"),
  categoryId: int("categoryId").notNull(),
  authorId: int("authorId").notNull(),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  imdbReference: text("imdbReference"), // JSON or URL reference to IMDb data
  affiliateLinks: longtext("affiliateLinks"), // JSON array of affiliate links
  views: int("views").default(0),
  metaDescription: text("metaDescription"),
  metaKeywords: text("metaKeywords"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
}, (table) => ({
  categoryIdx: index("category_idx").on(table.categoryId),
  authorIdx: index("author_idx").on(table.authorId),
  slugIdx: index("slug_idx").on(table.slug),
  statusIdx: index("status_idx").on(table.status),
}));

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * Comments on blog posts
 */
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId"),
  authorName: varchar("authorName", { length: 100 }),
  authorEmail: varchar("authorEmail", { length: 320 }),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  postIdx: index("post_idx").on(table.postId),
  userIdx: index("user_idx").on(table.userId),
}));

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * Email subscriptions for notifications
 */
export const emailSubscriptions = mysqlTable("emailSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  userId: int("userId"),
  isSubscribed: boolean("isSubscribed").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  userIdx: index("user_idx").on(table.userId),
  emailUnique: unique("email_unique").on(table.email),
}));

export type EmailSubscription = typeof emailSubscriptions.$inferSelect;
export type InsertEmailSubscription = typeof emailSubscriptions.$inferInsert;

/**
 * Analytics tracking for posts and affiliate links
 */
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId"),
  affiliateLinkId: varchar("affiliateLinkId", { length: 255 }),
  eventType: mysqlEnum("eventType", ["view", "click", "affiliate_click"]).notNull(),
  userId: int("userId"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  referrer: text("referrer"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  postIdx: index("post_idx").on(table.postId),
  userIdx: index("user_idx").on(table.userId),
  createdAtIdx: index("createdAt_idx").on(table.createdAt),
}));

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

/**
 * Reading history for users
 */
export const readingHistory = mysqlTable("readingHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  postId: int("postId").notNull(),
  readAt: timestamp("readAt").defaultNow().notNull(),
  timeSpent: int("timeSpent"), // in seconds
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  postIdx: index("post_idx").on(table.postId),
}));

export type ReadingHistory = typeof readingHistory.$inferSelect;
export type InsertReadingHistory = typeof readingHistory.$inferInsert;

/**
 * IMDb integration tracking
 */
export const imdbIntegration = mysqlTable("imdbIntegration", {
  id: int("id").autoincrement().primaryKey(),
  imdbId: varchar("imdbId", { length: 20 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["movie", "anime"]).notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }),
  posterUrl: text("posterUrl"),
  lastSyncedAt: timestamp("lastSyncedAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  imdbIdIdx: index("imdbId_idx").on(table.imdbId),
}));

export type ImdbIntegration = typeof imdbIntegration.$inferSelect;
export type InsertImdbIntegration = typeof imdbIntegration.$inferInsert;
