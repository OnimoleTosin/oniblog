import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { CommentSection } from '@/components/CommentSection';
import { Streamdown } from 'streamdown';
import { Share2, Heart, Loader2, Eye, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  const { data: post, isLoading: postLoading } = trpc.posts.getBySlug.useQuery({
    slug: slug || '',
  });

  const { data: relatedPosts } = trpc.posts.getRelated.useQuery(
    { categoryId: post?.categoryId || 0, currentPostId: post?.id || 0 },
    { enabled: !!post?.id }
  );

  const trackClickMutation = trpc.analytics.trackClick.useMutation();
  const addToHistoryMutation = trpc.readingHistory.add.useMutation();

  useEffect(() => {
    if (post) {
      // Track view
      trackClickMutation.mutate({ postId: post.id });

      // Add to reading history if authenticated
      if (isAuthenticated) {
        addToHistoryMutation.mutate({ postId: post.id });
      }
    }
  }, [post?.id, isAuthenticated]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'ONIBlog Post',
        text: post?.excerpt || post?.title || 'Check out this post',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  if (postLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-black/50 border border-red-500/50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">POST NOT FOUND</h1>
          <p className="text-gray-400">The post you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden border border-cyan-500/30 h-96">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Header */}
        <div className="mb-8 space-y-4">
          {/* Category Badge */}
          <div className="flex gap-2 items-center">
            <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 text-sm font-mono">
              [CATEGORY]
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold glitch-text leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 text-gray-400 font-mono text-sm pt-4 border-t border-cyan-500/20">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>
                {post.publishedAt
                  ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
                  : 'Not published'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>{post.views || 0} views</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>By System</span>
            </div>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <Card className="bg-cyan-500/10 border border-cyan-500/30 p-6 mb-8">
            <p className="text-lg text-gray-200 italic">{post.excerpt}</p>
          </Card>
        )}

        {/* Post Content */}
        <div className="prose prose-invert max-w-none mb-12">
          <Streamdown>{post.content}</Streamdown>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-12 pb-8 border-b border-cyan-500/20">
          <Button
            onClick={handleShare}
            className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 px-6 py-2 rounded transition-all"
          >
            <Share2 className="w-4 h-4" />
            SHARE
          </Button>
          <Button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-2 rounded transition-all ${
              isLiked
                ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30'
                : 'bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'LIKED' : 'LIKE'}
          </Button>
        </div>

        {/* Comment Section */}
        {post.id && <CommentSection postId={post.id} />}

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-cyan-500/30">
            <h3 className="text-3xl font-bold text-white mb-8 glitch-text">
              RELATED POSTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <a
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <Card className="bg-black/50 border border-cyan-500/20 hover:border-cyan-500/50 overflow-hidden transition-all duration-300 h-full">
                    {relatedPost.thumbnail && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={relatedPost.thumbnail}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
