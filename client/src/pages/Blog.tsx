import { useState, useMemo } from 'react';
import { Link, useSearch } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { Search, Filter, ChevronRight } from 'lucide-react';

export default function Blog() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const categorySlug = params.get('category');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || '');
  const [page, setPage] = useState(0);

  const { data: posts, isLoading: postsLoading } = trpc.posts.getPublished.useQuery({ limit: 12, offset: page * 12 });
  const { data: categories } = trpc.categories.getAll.useQuery();
  const { data: searchResults, isLoading: searchLoading } = trpc.posts.search.useQuery(
    { query: searchQuery, limit: 12 },
    { enabled: searchQuery.length > 0 }
  );

  const filteredPosts = useMemo(() => {
    let results = searchQuery ? searchResults : posts;
    if (!results) return [];
    
    if (selectedCategory) {
      const category = categories?.find(c => c.slug === selectedCategory);
      if (category) {
        results = results.filter(p => p.categoryId === category.id);
      }
    }
    
    return results;
  }, [posts, searchResults, searchQuery, selectedCategory, categories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background text-foreground page-transition">
      {/* Header */}
      <section className="border-b border-neon-cyan/20 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-orbitron text-5xl md:text-6xl font-bold mb-4">
            <span className="text-neon-cyan">BLOG</span>
            <span className="text-neon-magenta"> POSTS</span>
          </h1>
          <p className="font-space-mono text-muted-foreground">
            Explore the latest anime and movie insights, reviews, and discoveries.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="border-b border-neon-cyan/20 py-8 sticky top-16 z-40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-cyan" size={20} />
              <Input
                type="text"
                placeholder="SEARCH POSTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-neon-cyan/30 focus:border-neon-cyan font-space-mono text-sm"
              />
            </div>
          </form>

          {/* Category Filter */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Filter size={18} className="text-neon-magenta flex-shrink-0" />
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-sm font-space-mono text-xs font-bold whitespace-nowrap transition-all ${
                !selectedCategory
                  ? 'bg-neon-cyan text-background'
                  : 'border border-neon-cyan/30 hover:border-neon-cyan'
              }`}
            >
              ALL
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-sm font-space-mono text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-neon-magenta text-background'
                    : 'border border-neon-magenta/30 hover:border-neon-magenta'
                }`}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {(postsLoading || searchLoading) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-96 rounded-sm" />
              ))}
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full overflow-hidden hover:border-neon-cyan transition-all duration-300 hover:shadow-neon-cyan group cursor-pointer flex flex-col">
                      {post.featuredImage && (
                        <div className="relative h-48 overflow-hidden bg-background">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-space-mono text-xs text-neon-cyan">
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                          </span>
                          <span className="font-space-mono text-xs text-neon-magenta">
                            {post.views || 0} VIEWS
                          </span>
                        </div>
                        <h3 className="font-orbitron text-lg font-bold mb-3 line-clamp-2 group-hover:text-neon-cyan transition-colors flex-1">
                          {post.title}
                        </h3>
                        <p className="font-space-mono text-sm text-muted-foreground line-clamp-2 mb-4">
                          {post.excerpt || post.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center text-neon-cyan font-space-mono text-xs mt-auto">
                          READ MORE <ChevronRight size={14} className="ml-2" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="border-neon-cyan/30 hover:border-neon-cyan font-space-mono"
                >
                  PREVIOUS
                </Button>
                <div className="flex items-center gap-2 font-space-mono text-sm">
                  PAGE <span className="text-neon-cyan font-bold">{page + 1}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={!filteredPosts || filteredPosts.length < 12}
                  className="border-neon-cyan/30 hover:border-neon-cyan font-space-mono"
                >
                  NEXT
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="font-orbitron text-2xl text-neon-magenta mb-4">NO POSTS FOUND</h2>
              <p className="font-space-mono text-muted-foreground mb-8">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="bg-neon-cyan text-background hover:bg-neon-green font-orbitron"
              >
                RESET FILTERS
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
