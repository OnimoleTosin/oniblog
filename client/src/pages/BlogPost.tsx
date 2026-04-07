import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Streamdown } from 'streamdown';
import { MessageCircle, Share2, Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { data: post, isLoading: postLoading } = trpc.posts.getBySlug.useQuery({ slug: slug || '' });
  const { data: comments, refetch: refetchComments } = trpc.comments.getByPost.useQuery(
    { postId: post?.id || 0 },
    { enabled: !!post?.id }
  );
  const { data: relatedPosts } = trpc.posts.getRelated.useQuery(
    { categoryId: post?.categoryId || 0, currentPostId: post?.id || 0 },
    { enabled: !!post?.id }
  );

  const createCommentMutation = trpc.comments.create.useMutation();
  const trackClickMutation = trpc.analytics.trackClick.useMutation();
  const addToHistoryMutation = trpc.readingHistory.add.useMutation();

  useEffect(() => {
    if (post && isAuthenticated) {
      addToHistoryMutation.mutate({ postId: post.id });
    }
  }, [post?.id, isAuthenticated]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (!isAuthenticated && !authorName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!isAuthenticated && !authorEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setIsSubmittingComment(true);
    try {
      await createCommentMutation.mutateAsync({
        postId: post?.id || 0,
        content: commentContent,
        authorName: isAuthenticated ? undefined : authorName,
        authorEmail: isAuthenticated ? undefined : authorEmail,
      });
      
      setCommentContent('');
      setAuthorName('');
      setAuthorEmail('');
      await refetchComments();
      toast.success('Comment posted successfully!');
    } catch (error) {
      toast.error('Failed to submit comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAffiliateClick = async (linkId: string) => {
    if (!post?.id) return;
    await trackClickMutation.mutateAsync({
      postId: post.id,
      affiliateLinkId: linkId,
    });
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mx-auto mb-4" />
          <p className="font-space-mono text-muted-foreground">LOADING POST...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-orbitron text-4xl text-neon-magenta mb-4">POST NOT FOUND</h1>
          <p className="font-space-mono text-muted-foreground">The post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground page-transition">
      {/* Hero Image */}
      {post.featuredImage && (
        <div className="relative h-96 overflow-hidden border-b border-neon-cyan/20">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="font-space-mono text-xs text-neon-cyan px-3 py-1 border border-neon-cyan/30 rounded-sm">
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
              </span>
              <span className="font-space-mono text-xs text-neon-magenta px-3 py-1 border border-neon-magenta/30 rounded-sm">
                {post.views || 0} VIEWS
              </span>
            </div>

            <h1 className="font-orbitron text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="font-space-mono text-lg text-muted-foreground mb-6">
              {post.excerpt}
            </p>

            {/* Actions */}
            <div className="flex gap-4 flex-wrap">
              <Button variant="outline" className="border-neon-cyan/30 hover:border-neon-cyan font-space-mono">
                <Heart size={18} className="mr-2" />
                LIKE
              </Button>
              <Button variant="outline" className="border-neon-cyan/30 hover:border-neon-cyan font-space-mono">
                <Share2 size={18} className="mr-2" />
                SHARE
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neon-cyan/20 my-12" />

          {/* Main Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <Streamdown>{post.content}</Streamdown>
          </div>

          {/* IMDb Reference */}
          {post.imdbReference && (
            <Card className="mb-12 p-6 border-neon-green/30">
              <h3 className="font-orbitron text-lg font-bold text-neon-green mb-2">IMDb REFERENCE</h3>
              <p className="font-space-mono text-sm text-muted-foreground">{post.imdbReference}</p>
            </Card>
          )}

          {/* Affiliate Links */}
          {post.affiliateLinks && (() => {
            try {
              const links = JSON.parse(post.affiliateLinks);
              if (!Array.isArray(links) || links.length === 0) return null;
              
              return (
                <div className="mb-12">
                  <h3 className="font-orbitron text-2xl font-bold text-neon-magenta mb-6">WHERE TO WATCH</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {links.map((link: any, idx: number) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleAffiliateClick(`link-${idx}`)}
                        className="p-4 border border-neon-magenta/30 hover:border-neon-magenta hover:shadow-neon-magenta transition-all rounded-sm group"
                      >
                        <div className="font-orbitron font-bold text-neon-magenta group-hover:text-neon-green transition-colors">
                          {link.platform}
                        </div>
                        <div className="font-space-mono text-xs text-muted-foreground mt-1">
                          {link.price ? `$${link.price}` : 'FREE'}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              );
            } catch (e) {
              return null;
            }
          })()}

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mb-12 border-t border-neon-cyan/20 pt-12">
              <h3 className="font-orbitron text-2xl font-bold text-neon-cyan mb-6">RELATED POSTS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.slice(0, 2).map((relatedPost) => (
                  <a key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <Card className="overflow-hidden hover:border-neon-cyan transition-all hover:shadow-neon-cyan group cursor-pointer h-full">
                      {relatedPost.featuredImage && (
                        <div className="h-32 overflow-hidden">
                          <img
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-orbitron font-bold text-sm line-clamp-2 group-hover:text-neon-cyan transition-colors">
                          {relatedPost.title}
                        </h4>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t border-neon-cyan/20 pt-12">
            <h3 className="font-orbitron text-2xl font-bold text-neon-magenta mb-8 flex items-center gap-3">
              <MessageCircle size={24} />
              COMMENTS ({comments?.length || 0})
            </h3>

            {/* Comment Form */}
            <Card className="p-6 mb-8 border-neon-magenta/30">
              <h4 className="font-orbitron font-bold mb-4 text-neon-magenta">LEAVE A COMMENT</h4>
              <form onSubmit={handleSubmitComment} className="space-y-4">
                {!isAuthenticated && (
                  <>
                    <Input
                      type="text"
                      placeholder="YOUR NAME"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="bg-input border-neon-cyan/30 focus:border-neon-cyan font-space-mono text-sm"
                      required
                    />
                    <Input
                      type="email"
                      placeholder="YOUR EMAIL"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      className="bg-input border-neon-cyan/30 focus:border-neon-cyan font-space-mono text-sm"
                      required
                    />
                  </>
                )}
                <textarea
                  placeholder="YOUR COMMENT..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="w-full p-3 bg-input border border-neon-cyan/30 focus:border-neon-cyan rounded-sm font-space-mono text-sm focus:outline-none min-h-24"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="bg-neon-magenta text-background hover:bg-neon-cyan font-orbitron font-bold"
                >
                  {isSubmittingComment ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      POSTING...
                    </>
                  ) : (
                    'POST COMMENT'
                  )}
                </Button>
              </form>
            </Card>

            {/* Comments List */}
            <div className="space-y-6">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <Card key={comment.id} className="p-6 border-neon-cyan/20">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-orbitron font-bold text-neon-cyan">
                          {comment.authorName}
                        </h5>
                        <p className="font-space-mono text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-space-mono text-sm text-foreground">{comment.content}</p>
                  </Card>
                ))
              ) : (
                <p className="font-space-mono text-muted-foreground text-center py-8">
                  NO COMMENTS YET. BE THE FIRST TO COMMENT!
                </p>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
