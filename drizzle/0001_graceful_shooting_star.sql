CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int,
	`affiliateLinkId` varchar(255),
	`eventType` enum('view','click','affiliate_click') NOT NULL,
	`userId` int,
	`ipAddress` varchar(45),
	`userAgent` text,
	`referrer` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`icon` varchar(50),
	`color` varchar(7),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int,
	`authorName` varchar(100),
	`authorEmail` varchar(320),
	`content` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`userId` int,
	`isSubscribed` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailSubscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `imdbIntegration` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imdbId` varchar(20) NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` enum('movie','anime') NOT NULL,
	`rating` decimal(3,1),
	`posterUrl` text,
	`lastSyncedAt` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `imdbIntegration_id` PRIMARY KEY(`id`),
	CONSTRAINT `imdbIntegration_imdbId_unique` UNIQUE(`imdbId`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` longtext NOT NULL,
	`excerpt` text,
	`featuredImage` text,
	`thumbnail` text,
	`categoryId` int NOT NULL,
	`authorId` int NOT NULL,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`imdbReference` text,
	`affiliateLinks` longtext,
	`views` int DEFAULT 0,
	`metaDescription` text,
	`metaKeywords` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `readingHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`postId` int NOT NULL,
	`readAt` timestamp NOT NULL DEFAULT (now()),
	`timeSpent` int,
	CONSTRAINT `readingHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
CREATE INDEX `post_idx` ON `analytics` (`postId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `analytics` (`userId`);--> statement-breakpoint
CREATE INDEX `createdAt_idx` ON `analytics` (`createdAt`);--> statement-breakpoint
CREATE INDEX `post_idx` ON `comments` (`postId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `comments` (`userId`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `emailSubscriptions` (`email`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `emailSubscriptions` (`userId`);--> statement-breakpoint
CREATE INDEX `imdbId_idx` ON `imdbIntegration` (`imdbId`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `posts` (`categoryId`);--> statement-breakpoint
CREATE INDEX `author_idx` ON `posts` (`authorId`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `readingHistory` (`userId`);--> statement-breakpoint
CREATE INDEX `post_idx` ON `readingHistory` (`postId`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);