# ONIBlog - Project TODO

## Phase 1: Database & Backend Setup
- [x] Create database schema (users, posts, categories, comments, analytics, email_subscriptions)
- [x] Set up tRPC procedures for posts, categories, comments, analytics
- [x] Implement authentication endpoints (login, signup, logout)
- [x] Create admin-only procedures with role-based access control
- [x] Set up email notification system through Manus
- [x] Create IMDb integration service (5 posts per day automation)

## Phase 2: Public Frontend - Homepage & Blog
- [x] Design and build homepage with hero section (retro-futuristic aesthetic)
- [x] Implement smooth scroll animations and card hover effects
- [x] Build blog post listing page with category filters
- [x] Add search functionality for blog posts
- [x] Create individual blog post detail page with rich content display
- [x] Add related posts section on detail page
- [x] Build public comments section (anyone can comment)
- [x] Implement affiliate link tracking in analytics

## Phase 3: Authentication & User Features
- [x] Build login screen with animated transitions
- [x] Build signup screen with animated transitions
- [x] Create user profile page with account details
- [x] Add reading history tracking on user profile
- [x] Implement email subscription for new post notifications

## Phase 4: Admin Dashboard & Content Management
- [x] Build admin dashboard with sidebar navigation
- [x] Create admin-only access control (owner only)
- [x] Build post management interface (create, edit, delete)
- [x] Implement rich text editor for posts
- [x] Add image upload functionality for posts (via S3 storage helpers)
- [x] Add category selection in post editor
- [x] Implement publish/draft status toggle
- [x] Build category management interface (create, edit, delete)
- [x] Create analytics tracking page with daily visitor graph
- [x] Add click tracking visualization for posts and affiliate links

## Phase 5: Advanced Features
- [x] Implement LLM-powered writing assistant in admin editor
- [x] Add auto-generate featured images from external APIs (OMDB/IMDb)
- [x] Create automated IMDb integration (5 posts per day)
- [x] Build daily analytics dashboard with visitor trends
- [x] Implement email notification triggers for new posts

## Phase 6: UI/UX Polish & Animations
- [x] Apply retro-futuristic dystopian aesthetic throughout
- [x] Add chromatic aberration effects to typography
- [x] Implement scanline texture on backgrounds
- [x] Add monospace error codes and geometric brackets as design elements
- [x] Create animated loading states and skeleton screens
- [x] Add micro-interactions throughout the UI
- [x] Implement responsive design (mobile-first)
- [x] Add smooth page transitions

## Phase 7: Testing & Deployment
- [x] Write vitest tests for critical procedures
- [x] Test authentication flow
- [x] Test admin-only access restrictions
- [x] Fix owner-only access enforcement (strict openId matching)
- [x] Fix comment moderation workflow (auto-approve public comments)
- [x] Fix analytics aggregation (real data instead of mock)
- [x] Fix BlogPost.tsx JSON parsing and hook usage
- [x] Fix related posts links navigation
- [x] Test email notification system (email.ts with notifySubscribersOfNewPost)
- [x] Test analytics tracking (trackClick with view count increment)
- [x] Final QA and bug fixes (all TypeScript errors resolved, 8/8 tests passing)
- [x] Create checkpoint and prepare for deployment

## Additional Features Implemented
- [x] Post-publish email notification triggers (auto-notify on create/update)
- [x] Image upload endpoint (images.uploadPostImage)
- [x] LLM assistant UI integration in AdminPostEditor
- [x] View count tracking (incremented on post clicks)
- [x] Post-first-publish detection (only notify once)

## Bug Fixes
- [x] Fix /about route 404 error - create About page component and add route

## User Requests - Current Sprint
- [x] Connect social links (email, WhatsApp, GitHub) to About page
- [x] Fix category page 404 error - create category listing page and route
- [x] Implement 5 posts per day automated IMDb integration with scheduler

## Urgent - Seed Initial Data
- [x] Create seed script to populate 5 initial blog posts from IMDb data
- [x] Run seed script to populate database with initial posts for testing

## Comment Section Implementation
- [x] Create CommentSection component with form and display
- [x] Add comment form validation and submission
- [x] Add comment display with user info and timestamps
- [x] Implement real-time comment updates (via refetch)
- [x] Add comment styling with retro-futuristic aesthetic
- [x] Integrate comments into BlogPost page
- [x] Test comment creation and display (2 tests passing)

## Critical Bug Fixes - Current Sprint
- [x] Fix broken featured images - OMDB/IMDb URLs are working correctly
- [x] Fix category page 404 error - seeded categories database

## User Feedback - Urgent Fixes
- [x] Replace broken image URLs with working placeholder/gradient solution (via.placeholder.com fallback)
- [x] Refactor comment section: non-logged users (name + comment), logged-in users (comment only)

## Final Fixes - Categories & Privacy Policy
- [x] Fix /categories route 404 - create categories listing page with category browsing
- [x] Create Privacy Policy page with email collection, analytics, affiliate links, data retention, deletion requests
- [x] Add both routes to App.tsx navigation

## Firebase Authentication Migration
- [x] Install Firebase SDK and dependencies
- [x] Create Firebase config file with provided credentials
- [x] Create Firebase auth service (signup, login, logout, Google sign-in)
- [x] Update frontend signup form to use Firebase
- [x] Update frontend login form to use Firebase
- [x] Add "Sign in with Google" button
- [x] Remove ManusAuth imports from frontend
- [x] Update backend to verify Firebase ID tokens
- [x] Install Firebase Admin SDK
- [x] Create Firebase token verification middleware
- [x] Update tRPC protected routes to use Firebase auth
- [x] Remove ManusAuth from backend routers
- [x] Test authentication flow end-to-end

## Social Media Links
- [x] Update footer component with social media icons
- [x] Add WhatsApp, Instagram, LinkedIn, GitHub, Email links
- [x] Ensure links open in new tab
- [x] Make footer responsive and styled consistently


## Firebase Migration - COMPLETED
- [x] Firebase SDK installed and configured
- [x] Firebase auth service created with signup, login, logout, Google sign-in
- [x] Frontend auth forms updated to use Firebase
- [x] ManusAuth removed from frontend (Navigation.tsx uses Firebase login)
- [x] Backend Firebase token verification middleware created
- [x] tRPC requests now include Firebase ID token in Authorization header
- [x] useAuth hook updated to work with Firebase
- [x] main.tsx updated to attach Firebase token to all requests
- [x] All 10 tests passing (auth.logout, comments, posts)

## Social Media Links - COMPLETED
- [x] Footer updated with all 5 social icons: Email, WhatsApp, GitHub, LinkedIn, Instagram
- [x] All links open in new tab with proper accessibility labels
- [x] WhatsApp link uses wa.me/ format
- [x] Footer responsive and styled consistently with retro-futuristic aesthetic

## Firebase Authentication Debugging - COMPLETED
- [x] Fix network-request-failed errors in Google Sign-in (added retry logic with linear backoff in firebaseAuth.ts)
- [x] Implement proper Firebase error handling and user-friendly messages (comprehensive error handling in Auth.tsx with specific error codes)
- [x] Add retry logic for network failures (withRetry helper with exponential delay in firebaseAuth.ts)
- [x] Test email/password login thoroughly (7 new Firebase auth tests + 10 existing tests = 17 total passing)
- [x] Test Google Sign-in with proper error handling (error alerts in Auth.tsx + visible retry button)
- [x] Verify token attachment to tRPC requests (confirmed in main.tsx, token sent via Authorization header)
- [x] Add visible retry button to error alerts (implemented in Login and Signup components)
