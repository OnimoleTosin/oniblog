import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/_core/hooks/useAuth';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  postId: number;
}

interface Comment {
  id: number;
  postId: number;
  authorName: string;
  authorEmail?: string | null;
  content: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: Date;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  const { data: comments = [], isLoading, refetch } = trpc.comments.getByPost.useQuery({
    postId,
  });

  // Create comment mutation
  const createCommentMutation = trpc.comments.create.useMutation({
    onSuccess: () => {
      setContent('');
      if (!isAuthenticated) {
        setAuthorName('');
      }
      setIsSubmitting(false);
      toast.success('Comment posted successfully!');
      refetch();
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(error.message || 'Failed to post comment');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (!isAuthenticated && !authorName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    await createCommentMutation.mutateAsync({
      postId,
      authorName: isAuthenticated ? user?.name || 'Anonymous' : authorName.trim(),
      authorEmail: isAuthenticated ? (user?.email || undefined) : undefined,
      content: content.trim(),
    });
  };

  const approvedComments = (comments as Comment[]).filter(c => c.status === 'approved');

  return (
    <div className="mt-12 pt-8 border-t border-neon-cyan/30">
      <div className="space-y-8">
        {/* Comments Header */}
        <div>
          <h3 className="font-orbitron text-2xl font-bold text-neon-cyan glitch mb-2">
            COMMENTS ({approvedComments.length})
          </h3>
          <p className="font-space-mono text-sm text-muted-foreground">
            [ COMMUNITY DISCUSSION THREAD ]
          </p>
        </div>

        {/* Comment Form */}
        <Card className="bg-background/50 border border-neon-cyan/30 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="font-orbitron text-lg font-bold text-neon-magenta mb-4">
              LEAVE YOUR THOUGHTS
            </h4>

            {/* Name field - only for non-authenticated users */}
            {!isAuthenticated ? (
              <div>
                <label className="block font-space-mono text-sm text-neon-magenta mb-2">
                  YOUR NAME *
                </label>
                <Input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={isSubmitting}
                  className="bg-input border-neon-cyan/30 focus:border-neon-cyan font-space-mono text-sm"
                />
              </div>
            ) : (
              <div className="p-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-sm">
                <p className="font-space-mono text-sm text-neon-green">
                  Posting as: <span className="text-neon-cyan font-bold">{user?.name}</span>
                </p>
              </div>
            )}

            {/* Comment field */}
            <div>
              <label className="block font-space-mono text-sm text-neon-magenta mb-2">
                COMMENT *
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                disabled={isSubmitting}
                rows={4}
                className="bg-input border-neon-cyan/30 focus:border-neon-cyan font-space-mono text-sm resize-none"
              />
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim() || (!isAuthenticated && !authorName.trim())}
              className="w-full bg-neon-cyan text-background hover:bg-neon-green font-orbitron font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  POSTING...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  POST COMMENT
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
            </div>
          ) : approvedComments.length === 0 ? (
            <Card className="bg-background/50 border border-neon-magenta/30 p-6 text-center">
              <p className="font-space-mono text-muted-foreground">
                [ NO COMMENTS YET ] Be the first to share your thoughts...
              </p>
            </Card>
          ) : (
            approvedComments.map((comment) => (
              <Card
                key={comment.id}
                className="bg-background/50 border border-neon-cyan/20 hover:border-neon-cyan/50 p-5 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-orbitron font-bold text-neon-cyan text-lg">
                      {comment.authorName}
                    </h5>
                  </div>
                  <span className="font-space-mono text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <p className="font-space-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
