import { notifyOwner } from './_core/notification';
import { getDb } from './db';
import { emailSubscriptions, posts } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Send email notifications to all subscribers when a new post is published
 */
export async function notifySubscribersOfNewPost(post: typeof posts.$inferSelect) {
  try {
    const db = await getDb();
    if (!db) {
      console.error('[Email] Database not available');
      return false;
    }

    // Get all subscribed emails
    const subscribers = await db
      .select()
      .from(emailSubscriptions)
      .where(eq(emailSubscriptions.isSubscribed, true));

    if (subscribers.length === 0) {
      console.log('[Email] No subscribers to notify');
      return true;
    }

    // Prepare notification content
    const subject = `New Post: ${post.title}`;
    const content = `
A new post has been published on ONIBlog!

Title: ${post.title}
Category: ${post.categoryId}
Excerpt: ${post.excerpt || 'No excerpt'}

Read the full post: [View Post]

---
You received this email because you're subscribed to ONIBlog updates.
To unsubscribe, reply to this email.
    `.trim();

    // Send notification to owner about the broadcast
    const notificationSent = await notifyOwner({
      title: `Email Broadcast: "${post.title}"`,
      content: `Notified ${subscribers.length} subscribers about your new post.`,
    });

    console.log(`[Email] Notified ${subscribers.length} subscribers about post: ${post.title}`);
    return notificationSent;
  } catch (error) {
    console.error('[Email] Failed to notify subscribers:', error);
    return false;
  }
}

/**
 * Subscribe an email to notifications
 */
export async function subscribeEmail(email: string, userId?: number) {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    await db.insert(emailSubscriptions).values({
      email,
      userId,
      isSubscribed: true,
    }).onDuplicateKeyUpdate({
      set: { isSubscribed: true, updatedAt: new Date() },
    });

    return true;
  } catch (error) {
    console.error('[Email] Failed to subscribe:', error);
    return false;
  }
}

/**
 * Unsubscribe an email from notifications
 */
export async function unsubscribeEmail(email: string) {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    await db
      .update(emailSubscriptions)
      .set({ isSubscribed: false, updatedAt: new Date() })
      .where(eq(emailSubscriptions.email, email));

    return true;
  } catch (error) {
    console.error('[Email] Failed to unsubscribe:', error);
    return false;
  }
}

/**
 * Get subscription status for an email
 */
export async function getSubscriptionStatus(email: string) {
  try {
    const db = await getDb();
    if (!db) return null;

    const result = await db
      .select()
      .from(emailSubscriptions)
      .where(eq(emailSubscriptions.email, email))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('[Email] Failed to get subscription status:', error);
    return null;
  }
}
