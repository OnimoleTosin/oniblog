import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { ChevronRight, Layers } from 'lucide-react';

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Fetch all categories
  const { data: categories = [], isLoading: categoriesLoading } = trpc.categories.getAll.useQuery();

  // Fetch all published posts
  const { data: allPosts = [], isLoading: postsLoading } = trpc.posts.getPublished.useQuery({
    limit: 1000,
    offset: 0,
  });

  // Group posts by category
  const postsByCategory = useMemo(() => {
    const grouped: Record<number, typeof allPosts> = {};
    categories.forEach(cat => {
      grouped[cat.id] = allPosts.filter(post => post.categoryId === cat.id);
    });
    return grouped;
  }, [categories, allPosts]);

  const isLoading = categoriesLoading || postsLoading;

  return (
    <div className="min-h-screen bg-background text-foreground page-transition">
      {/* Header */}
      <section className="border-b border-neon-cyan/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Layers className="w-8 h-8 text-neon-cyan" />
            <h1 className="font-orbitron text-5xl md:text-6xl font-bold">
              <span className="text-neon-cyan">BROWSE</span>
              <span className="text-neon-magenta"> CATEGORIES</span>
            </h1>
          </div>
          <p className="font-space-mono text-muted-foreground">
            Explore content organized by anime, movies, reviews, and news.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-64 rounded-sm" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="font-orbitron text-2xl text-neon-magenta mb-4">NO CATEGORIES FOUND</h2>
              <p className="font-space-mono text-muted-foreground">
                Categories will appear here once they are created.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const categoryPosts = postsByCategory[category.id] || [];
                const isSelected = selectedCategory === category.id;

                return (
                  <Card
                    key={category.id}
                    className={`overflow-hidden transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-neon-magenta shadow-neon-magenta'
                        : 'border-neon-cyan/30 hover:border-neon-cyan'
                    }`}
                    onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                  >
                    <div className="p-6 bg-gradient-to-br from-black/50 to-black/80">
                      {/* Category Header */}
                      <div className="mb-6">
                        <h3 className="font-orbitron text-2xl font-bold text-neon-cyan mb-2">
                          {category.name.toUpperCase()}
                        </h3>
                        <p className="font-space-mono text-sm text-neon-magenta">
                          {categoryPosts.length} POST{categoryPosts.length !== 1 ? 'S' : ''}
                        </p>
                      </div>

                      {/* Category Description */}
                      <p className="font-space-mono text-sm text-muted-foreground mb-6 line-clamp-3">
                        {category.slug === 'anime' && 'Explore the latest anime series, reviews, and recommendations.'}
                        {category.slug === 'movies' && 'Discover trending movies, reviews, and cinematic insights.'}
                        {category.slug === 'reviews' && 'In-depth reviews and analysis of anime and movies.'}
                        {category.slug === 'news' && 'Stay updated with the latest news from the entertainment world.'}
                      </p>

                      {/* Browse Button */}
                      <Link href={`/category/${category.id}`}>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neon-cyan text-background hover:bg-neon-green font-orbitron font-bold rounded-sm transition-all duration-200 group">
                          BROWSE
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>

                    {/* Expanded Posts List */}
                    {isSelected && categoryPosts.length > 0 && (
                      <div className="border-t border-neon-cyan/20 p-6 bg-black/30">
                        <p className="font-space-mono text-xs text-neon-magenta mb-4">RECENT POSTS</p>
                        <div className="space-y-2">
                          {categoryPosts.slice(0, 5).map(post => (
                            <Link key={post.id} href={`/blog/${post.slug}`}>
                              <div className="p-2 hover:bg-neon-cyan/10 rounded transition-colors cursor-pointer">
                                <p className="font-space-mono text-sm text-neon-cyan line-clamp-1">
                                  {post.title}
                                </p>
                                <p className="font-space-mono text-xs text-muted-foreground">
                                  {post.views || 0} views
                                </p>
                              </div>
                            </Link>
                          ))}
                          {categoryPosts.length > 5 && (
                            <p className="font-space-mono text-xs text-muted-foreground pt-2">
                              +{categoryPosts.length - 5} more posts
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
