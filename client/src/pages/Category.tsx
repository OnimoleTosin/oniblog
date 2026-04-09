import { useParams, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  thumbnail: string | null;
  categoryId: number;
  authorId: number;
  status: 'draft' | 'published';
  views: number;
  publishedAt: Date | null;
}

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [, navigate] = useLocation();
  const [page, setPage] = useState(0);
  const pageSize = 12;

  const categoryIdNum = parseInt(categoryId || '0', 10);

  // Fetch category details
  const { data: category, isLoading: categoryLoading } = trpc.categories.getById.useQuery(
    { id: categoryIdNum },
    { enabled: categoryIdNum > 0 }
  );

  // Fetch posts in this category
  const { data: postsData, isLoading: postsLoading } = trpc.posts.getByCategory.useQuery(
    { categoryId: categoryIdNum, limit: pageSize, offset: page * pageSize },
    { enabled: categoryIdNum > 0 }
  );

  if (!categoryIdNum) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 border-neon-magenta/30 text-center">
          <h1 className="font-orbitron text-2xl font-bold text-neon-magenta mb-4">
            INVALID CATEGORY
          </h1>
          <p className="font-space-mono text-foreground mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate('/blog')}
            className="bg-neon-cyan text-background hover:bg-neon-green font-orbitron"
          >
            BACK TO BLOG
          </Button>
        </Card>
      </div>
    );
  }

  if (categoryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 border-neon-magenta/30 text-center">
          <h1 className="font-orbitron text-2xl font-bold text-neon-magenta mb-4">
            CATEGORY NOT FOUND
          </h1>
          <p className="font-space-mono text-foreground mb-6">
            This category doesn't exist in our database.
          </p>
          <Button
            onClick={() => navigate('/blog')}
            className="bg-neon-cyan text-background hover:bg-neon-green font-orbitron"
          >
            BACK TO BLOG
          </Button>
        </Card>
      </div>
    );
  }

  const posts: Post[] = (postsData as Post[]) || [];
  const totalPosts = posts.length > 0 ? posts.length : 0;
  const totalPages = Math.ceil(totalPosts / pageSize);

  return (
    <div className="min-h-screen bg-background">
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
        }} />
      </div>

      {/* Header */}
      <section className="relative py-12 px-4 md:px-8 border-b border-neon-cyan/20 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/blog')}
              className="text-neon-cyan hover:text-neon-green font-space-mono text-sm"
            >
              ← BLOG
            </Button>
            <span className="text-neon-cyan font-space-mono text-sm">/</span>
            <span className="text-neon-magenta font-orbitron font-bold">{category.name}</span>
          </div>
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-cyan glitch mb-2">
            {category.name}
          </h1>
          <p className="font-space-mono text-neon-green text-sm">
            [ {totalPosts} POST{totalPosts !== 1 ? 'S' : ''} IN THIS CATEGORY ]
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="relative py-12 px-4 md:px-8 z-10">
        <div className="max-w-6xl mx-auto">
          {postsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
            </div>
          ) : posts.length === 0 ? (
            <Card className="p-12 border-neon-magenta/30 text-center">
              <h2 className="font-orbitron text-2xl font-bold text-neon-magenta mb-4">
                NO POSTS YET
              </h2>
              <p className="font-space-mono text-foreground mb-6">
                There are no posts in this category yet. Check back soon!
              </p>
              <Button
                onClick={() => navigate('/blog')}
                className="bg-neon-cyan text-background hover:bg-neon-green font-orbitron"
              >
                EXPLORE OTHER CATEGORIES
              </Button>
            </Card>
          ) : (
            <>
              {/* Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {posts.map((post: Post) => (
                  <Card
                    key={post.id}
                    className="border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 cursor-pointer overflow-hidden group"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    {post.featuredImage && (
                      <div className="relative h-40 overflow-hidden bg-black">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-orbitron text-xs font-bold text-neon-magenta">
                          {category.name}
                        </span>
                        <span className="font-space-mono text-xs text-neon-green">
                          {post.views || 0} VIEWS
                        </span>
                      </div>
                      <h3 className="font-orbitron font-bold text-neon-cyan mb-2 line-clamp-2 group-hover:text-neon-green transition-colors">
                        {post.title}
                      </h3>
                      <p className="font-space-mono text-xs text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt || post.content.substring(0, 100)}
                      </p>
                      <div className="flex items-center justify-between text-xs font-space-mono text-neon-cyan">
                        <span>
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString()
                            : 'DRAFT'}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 font-orbitron"
                  >
                    ← PREVIOUS
                  </Button>
                  <div className="flex items-center gap-2 font-space-mono text-sm text-neon-cyan">
                    <span>PAGE {page + 1} OF {totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page === totalPages - 1}
                    className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 font-orbitron"
                  >
                    NEXT →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
