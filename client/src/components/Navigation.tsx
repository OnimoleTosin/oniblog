import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { getLoginUrl } from '@/const';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-neon-cyan/20 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="font-orbitron font-black text-2xl">
              <span className="text-neon-cyan group-hover:text-neon-green transition-colors">ONI</span>
              <span className="text-neon-magenta">BLOG</span>
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/blog">
            <span className="font-space-mono text-sm hover:text-neon-cyan transition-colors cursor-pointer">
              BLOG
            </span>
          </Link>
          <Link href="/categories">
            <span className="font-space-mono text-sm hover:text-neon-cyan transition-colors cursor-pointer">
              CATEGORIES
            </span>
          </Link>
          <Link href="/about">
            <span className="font-space-mono text-sm hover:text-neon-cyan transition-colors cursor-pointer">
              ABOUT
            </span>
          </Link>
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background font-space-mono">
                    <Settings size={16} className="mr-2" />
                    ADMIN
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="outline" size="sm" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background font-space-mono">
                  <User size={16} className="mr-2" />
                  {user?.name || 'PROFILE'}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-neon-magenta font-space-mono"
              >
                <LogOut size={16} className="mr-2" />
                LOGOUT
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a href={getLoginUrl()}>
                <Button variant="outline" size="sm" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background font-space-mono">
                  LOGIN
                </Button>
              </a>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-neon-cyan text-background hover:bg-neon-green font-space-mono">
                  SIGNUP
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:text-neon-cyan transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-neon-cyan/20 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="/blog">
              <span className="block font-space-mono text-sm hover:text-neon-cyan transition-colors cursor-pointer py-2">
                BLOG
              </span>
            </Link>
            <Link href="/categories">
              <span className="block font-space-mono text-sm hover:text-neon-cyan transition-colors cursor-pointer py-2">
                CATEGORIES
              </span>
            </Link>
            <Link href="/about">
              <span className="block font-space-mono text-sm hover:text-neon-cyan transition-colors cursor-pointer py-2">
                ABOUT
              </span>
            </Link>
            <div className="border-t border-neon-cyan/20 pt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link href="/admin">
                      <Button variant="outline" size="sm" className="w-full border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background font-space-mono">
                        <Settings size={16} className="mr-2" />
                        ADMIN
                      </Button>
                    </Link>
                  )}
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background font-space-mono">
                      <User size={16} className="mr-2" />
                      PROFILE
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full text-muted-foreground hover:text-neon-magenta font-space-mono justify-start"
                  >
                    <LogOut size={16} className="mr-2" />
                    LOGOUT
                  </Button>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()} className="w-full">
                    <Button variant="outline" size="sm" className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background font-space-mono">
                      LOGIN
                    </Button>
                  </a>
                  <Link href="/auth/signup" className="w-full">
                    <Button size="sm" className="w-full bg-neon-cyan text-background hover:bg-neon-green font-space-mono">
                      SIGNUP
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
