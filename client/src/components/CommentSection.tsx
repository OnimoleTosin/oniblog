import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Send, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  const { data: comments = [], isLoading, refetch } = trpc.comments.getByPost.useQuery({
    postId,
  });

  // Create comment mutation
  const createCommentMutation = trpc.comments.create.useMutation({
    onSuccess: () => {
      setName('');
      setEmail('');
      setContent('');
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

    if (!name.trim() || !email.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    await createCommentMutation.mutateAsync({
      postId,
      authorName: name.trim(),
      authorEmail: email.trim(),
      content: content.trim(),
    });
  };

  return (
    <div className="mt-12 pt-8 border-t border-cyan-500/30">
      <div className="space-y-8">
        {/* Comments Header */}
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-cyan-400" />
          <h3 className="text-2xl font-bold text-white glitch-text">
            COMMENTS ({comments.length})
          </h3>
        </div>

        {/* Comment Form */}
        <Card className="bg-black/50 border border-cyan-500/30 p-6 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-400 mb-4">
              [LEAVE YOUR THOUGHTS]
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-cyan-300 mb-2">
                  NAME *
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  disabled={isSubmitting}
                  className="bg-black/30 border border-cyan-500/50 text-white placeholder-gray-500 focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-cyan-300 mb-2">
                  EMAIL *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                  className="bg-black/30 border border-cyan-500/50 text-white placeholder-gray-500 focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono text-cyan-300 mb-2">
                COMMENT *
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts about this post..."
                disabled={isSubmitting}
                rows={4}
                className="bg-black/30 border border-cyan-500/50 text-white placeholder-gray-500 focus:border-cyan-400 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  POSTING...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
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
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            </div>
          ) : comments.length === 0 ? (
            <Card className="bg-black/50 border border-cyan-500/30 p-6 text-center">
              <p className="text-gray-400 font-mono">
                [NO COMMENTS YET] Be the first to share your thoughts...
              </p>
            </Card>
          ) : (
            comments.map((comment) => (
              <Card
                key={comment.id}
                className="bg-black/50 border border-cyan-500/20 p-5 hover:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-bold text-cyan-400 text-lg">
                      {comment.authorName}
                    </h5>
                    <p className="text-xs text-gray-500 font-mono">
                      {comment.authorEmail}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>

                {/* Decorative elements */}
                <div className="mt-3 pt-3 border-t border-cyan-500/10 flex gap-2">
                  <span className="text-xs text-cyan-500/50 font-mono">
                    [ID: {comment.id}]
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
