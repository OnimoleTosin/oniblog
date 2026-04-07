import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminPostEditor from './AdminPostEditor';

export default function AdminPostManager() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts, refetch } = trpc.posts.getPublished.useQuery({ limit: 100 });
  const deletePostMutation = trpc.posts.delete.useMutation();

  const filteredPosts = posts?.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePostMutation.mutateAsync({ id });
      await refetch();
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  if (showEditor) {
    return (
      <AdminPostEditor
        post={editingPost}
        onClose={() => {
          setShowEditor(false);
          setEditingPost(null);
          refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="SEARCH POSTS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-input border-neon-cyan/30 focus:border-neon-cyan font-space-mono text-sm"
        />
        <Button
          onClick={() => {
            setEditingPost(null);
            setShowEditor(true);
          }}
          className="bg-neon-cyan text-background hover:bg-neon-green font-orbitron font-bold"
        >
          <Plus size={18} className="mr-2" />
          NEW POST
        </Button>
      </div>

      {/* Posts Table */}
      <Card className="border-neon-cyan/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neon-cyan/10 border-b border-neon-cyan/20">
              <tr>
                <th className="px-6 py-3 text-left font-orbitron font-bold text-neon-cyan text-sm">TITLE</th>
                <th className="px-6 py-3 text-left font-orbitron font-bold text-neon-cyan text-sm">STATUS</th>
                <th className="px-6 py-3 text-left font-orbitron font-bold text-neon-cyan text-sm">DATE</th>
                <th className="px-6 py-3 text-left font-orbitron font-bold text-neon-cyan text-sm">VIEWS</th>
                <th className="px-6 py-3 text-right font-orbitron font-bold text-neon-cyan text-sm">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts && filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="border-b border-neon-cyan/10 hover:bg-neon-cyan/5 transition-colors">
                    <td className="px-6 py-4 font-space-mono text-sm">{post.title}</td>
                    <td className="px-6 py-4">
                      <span className={`font-space-mono text-xs px-2 py-1 rounded-sm ${
                        post.status === 'published'
                          ? 'bg-neon-green/20 text-neon-green'
                          : 'bg-neon-magenta/20 text-neon-magenta'
                      }`}>
                        {post.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-space-mono text-xs text-muted-foreground">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-space-mono text-sm text-neon-cyan">{post.views}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingPost(post);
                          setShowEditor(true);
                        }}
                        className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background font-space-mono text-xs"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletePostMutation.isPending}
                        className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background font-space-mono text-xs"
                      >
                        {deletePostMutation.isPending ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <p className="font-space-mono text-muted-foreground">NO POSTS FOUND</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
