import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { BarChart3, FileText, Folder, TrendingUp, Settings, LogOut } from 'lucide-react';
import AdminPostManager from '@/components/admin/AdminPostManager';
import AdminCategoryManager from '@/components/admin/AdminCategoryManager';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

type AdminTab = 'dashboard' | 'posts' | 'categories' | 'analytics';

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const { data: posts } = trpc.posts.getPublished.useQuery({ limit: 100 });
  const { data: categories } = trpc.categories.getAll.useQuery();

  const { data: isOwner } = trpc.users.isOwner.useQuery();

  if (!isAuthenticated || !isOwner) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-orbitron text-4xl text-neon-magenta mb-4">ACCESS DENIED</h1>
          <p className="font-space-mono text-muted-foreground">Owner access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r border-neon-cyan/20 bg-card/50 backdrop-blur-sm overflow-y-auto">
          <div className="p-6">
            <div className="font-orbitron font-black text-xl mb-8">
              <span className="text-neon-cyan">ADMIN</span>
              <span className="text-neon-magenta">PANEL</span>
            </div>

            <nav className="space-y-2 mb-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-4 py-3 rounded-sm font-space-mono text-sm font-bold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-neon-cyan text-background'
                    : 'hover:bg-neon-cyan/10 text-foreground'
                }`}
              >
                <BarChart3 size={18} className="inline mr-2" />
                DASHBOARD
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`w-full text-left px-4 py-3 rounded-sm font-space-mono text-sm font-bold transition-all ${
                  activeTab === 'posts'
                    ? 'bg-neon-magenta text-background'
                    : 'hover:bg-neon-magenta/10 text-foreground'
                }`}
              >
                <FileText size={18} className="inline mr-2" />
                POSTS
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full text-left px-4 py-3 rounded-sm font-space-mono text-sm font-bold transition-all ${
                  activeTab === 'categories'
                    ? 'bg-neon-green text-background'
                    : 'hover:bg-neon-green/10 text-foreground'
                }`}
              >
                <Folder size={18} className="inline mr-2" />
                CATEGORIES
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full text-left px-4 py-3 rounded-sm font-space-mono text-sm font-bold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-neon-purple text-background'
                    : 'hover:bg-neon-purple/10 text-foreground'
                }`}
              >
                <TrendingUp size={18} className="inline mr-2" />
                ANALYTICS
              </button>
            </nav>

            {/* User Info */}
            <div className="border-t border-neon-cyan/20 pt-6">
              <div className="mb-4 p-3 border border-neon-cyan/30 rounded-sm">
                <p className="font-space-mono text-xs text-muted-foreground mb-1">LOGGED IN AS</p>
                <p className="font-orbitron font-bold text-neon-cyan text-sm">{user?.name}</p>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="w-full border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background font-space-mono text-xs"
              >
                <LogOut size={16} className="mr-2" />
                LOGOUT
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-orbitron text-4xl font-bold text-neon-cyan mb-2">
                {activeTab === 'dashboard' && 'DASHBOARD'}
                {activeTab === 'posts' && 'POST MANAGEMENT'}
                {activeTab === 'categories' && 'CATEGORY MANAGEMENT'}
                {activeTab === 'analytics' && 'ANALYTICS'}
              </h1>
              <p className="font-space-mono text-sm text-muted-foreground">
                {activeTab === 'dashboard' && 'System overview and quick stats'}
                {activeTab === 'posts' && 'Create, edit, and manage blog posts'}
                {activeTab === 'categories' && 'Manage blog categories'}
                {activeTab === 'analytics' && 'View traffic and engagement metrics'}
              </p>
            </div>

            {/* Content */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-6 border-neon-cyan/30">
                    <div className="font-space-mono text-xs text-neon-cyan mb-2">TOTAL POSTS</div>
                    <div className="font-orbitron text-3xl font-bold text-neon-cyan">
                      {posts?.length || 0}
                    </div>
                  </Card>
                  <Card className="p-6 border-neon-magenta/30">
                    <div className="font-space-mono text-xs text-neon-magenta mb-2">CATEGORIES</div>
                    <div className="font-orbitron text-3xl font-bold text-neon-magenta">
                      {categories?.length || 0}
                    </div>
                  </Card>
                  <Card className="p-6 border-neon-green/30">
                    <div className="font-space-mono text-xs text-neon-green mb-2">PUBLISHED</div>
                    <div className="font-orbitron text-3xl font-bold text-neon-green">
                      {posts?.filter(p => p.status === 'published').length || 0}
                    </div>
                  </Card>
                  <Card className="p-6 border-neon-purple/30">
                    <div className="font-space-mono text-xs text-neon-purple mb-2">DRAFTS</div>
                    <div className="font-orbitron text-3xl font-bold text-neon-purple">
                      {posts?.filter(p => p.status === 'draft').length || 0}
                    </div>
                  </Card>
                </div>

                {/* Recent Posts */}
                <Card className="p-6 border-neon-cyan/30">
                  <h2 className="font-orbitron text-xl font-bold text-neon-cyan mb-4">RECENT POSTS</h2>
                  <div className="space-y-3">
                    {posts?.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-3 border border-neon-cyan/20 rounded-sm">
                        <div>
                          <p className="font-orbitron font-bold text-sm line-clamp-1">{post.title}</p>
                          <p className="font-space-mono text-xs text-muted-foreground">
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`font-space-mono text-xs px-2 py-1 rounded-sm ${
                          post.status === 'published'
                            ? 'bg-neon-green/20 text-neon-green'
                            : 'bg-neon-magenta/20 text-neon-magenta'
                        }`}>
                          {post.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'posts' && <AdminPostManager />}
            {activeTab === 'categories' && <AdminCategoryManager />}
            {activeTab === 'analytics' && <AdminAnalytics />}
          </div>
        </main>
      </div>
    </div>
  );
}
