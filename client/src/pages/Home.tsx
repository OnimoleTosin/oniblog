import { useEffect, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Zap, Film, Tv, TrendingUp, ChevronRight } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  
  const { data: posts, isLoading: postsLoading } = trpc.posts.getPublished.useQuery({ limit: 6 });
  const { data: categories } = trpc.categories.getAll.useQuery();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground page-transition">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-neon-cyan rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="mb-8 inline-block">
            <div className="flex items-center gap-2 px-4 py-2 border border-neon-cyan rounded-sm bg-background/50 backdrop-blur-sm neon-glow-cyan">
              <Zap size={16} className="text-neon-cyan animate-pulse" />
              <span className="font-space-mono text-xs text-neon-cyan">SYSTEM ONLINE</span>
            </div>
          </div>

          <h1 className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="block text-neon-cyan">ONI</span>
            <span className="block text-white">BLOG</span>
          </h1>

          <p className="font-space-mono text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            [ ANIME & MOVIE INTELLIGENCE NETWORK ] - Your gateway to the latest anime and movie insights, reviews, and discoveries.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/blog">
              <Button className="bg-neon-cyan text-background hover:bg-neon-green font-orbitron font-bold px-8 py-6 text-lg neon-glow-cyan transition-all duration-300 hover:shadow-neon-cyan">
                <Film size={20} className="mr-2" />
                EXPLORE POSTS
                <ChevronRight size={20} className="ml-2" />
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/auth/signup">
                <Button variant="outline" className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background font-orbitron font-bold px-8 py-6 text-lg transition-all duration-300">
                  JOIN NETWORK
                </Button>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="border border-neon-cyan/30 p-4 rounded-sm">
              <div className="font-orbitron text-2xl text-neon-cyan font-bold">{posts?.length || 0}</div>
              <div className="font-space-mono text-xs text-muted-foreground">POSTS</div>
            </div>
            <div className="border border-neon-magenta/30 p-4 rounded-sm">
              <div className="font-orbitron text-2xl text-neon-magenta font-bold">{categories?.length || 0}</div>
              <div className="font-space-mono text-xs text-muted-foreground">CATEGORIES</div>
            </div>
            <div className="border border-neon-green/30 p-4 rounded-sm">
              <div className="font-orbitron text-2xl text-neon-green font-bold">24/7</div>
              <div className="font-space-mono text-xs text-muted-foreground">ACTIVE</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="text-neon-cyan font-space-mono text-xs mb-2">SCROLL</div>
          <div className="w-6 h-10 border-2 border-neon-cyan rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-neon-cyan rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-20 border-t border-neon-cyan/20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-neon-cyan" size={24} />
              <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-cyan">
                TRENDING NOW
              </h2>
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-neon-cyan to-neon-magenta" />
          </div>

          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-96 rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts?.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full overflow-hidden hover:border-neon-cyan transition-all duration-300 hover:shadow-neon-cyan group cursor-pointer">
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
                    <div className="p-6">
                      <div className="font-space-mono text-xs text-neon-cyan mb-2">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                      </div>
                      <h3 className="font-orbitron text-lg font-bold mb-3 line-clamp-2 group-hover:text-neon-cyan transition-colors">
                        {post.title}
                      </h3>
                      <p className="font-space-mono text-sm text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt || post.content.substring(0, 100)}...
                      </p>
                      <div className="flex items-center text-neon-cyan font-space-mono text-xs">
                        READ MORE <ChevronRight size={14} className="ml-2" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button className="bg-neon-magenta text-background hover:bg-neon-cyan font-orbitron font-bold px-8 py-6 text-lg transition-all duration-300 hover:shadow-neon-magenta">
                VIEW ALL POSTS
                <ChevronRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 border-t border-neon-cyan/20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Tv className="text-neon-magenta" size={24} />
              <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-magenta">
                CATEGORIES
              </h2>
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-neon-magenta to-neon-cyan" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/blog?category=${cat.slug}`}>
                <Card className="p-6 text-center hover:border-neon-magenta transition-all duration-300 hover:shadow-neon-magenta cursor-pointer group">
                  <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">
                    {cat.icon || '📺'}
                  </div>
                  <h3 className="font-orbitron font-bold text-sm group-hover:text-neon-magenta transition-colors">
                    {cat.name.toUpperCase()}
                  </h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 border-t border-neon-cyan/20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4 text-neon-green">
            STAY CONNECTED
          </h2>
          <p className="font-space-mono text-muted-foreground mb-8">
            Subscribe to receive the latest anime and movie updates directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => {
            e.preventDefault();
            // Newsletter signup logic here
          }}>
            <input
              type="email"
              placeholder="ENTER EMAIL ADDRESS"
              className="flex-1 px-4 py-3 bg-input border border-neon-cyan/30 rounded-sm font-space-mono text-sm focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan transition-all"
              required
            />
            <Button className="bg-neon-green text-background hover:bg-neon-cyan font-orbitron font-bold px-8 transition-all duration-300">
              SUBSCRIBE
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
