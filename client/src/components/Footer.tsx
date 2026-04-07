import { Link } from 'wouter';
import { Heart, Github, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neon-cyan/20 bg-background/50 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="font-orbitron font-black text-xl mb-4">
              <span className="text-neon-cyan">ONI</span>
              <span className="text-neon-magenta">BLOG</span>
            </div>
            <p className="font-space-mono text-xs text-muted-foreground">
              Anime & Movie Intelligence Network
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-orbitron font-bold text-sm mb-4 text-neon-cyan">NAVIGATION</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog">
                  <span className="font-space-mono text-xs hover:text-neon-cyan transition-colors cursor-pointer">
                    Blog Posts
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/categories">
                  <span className="font-space-mono text-xs hover:text-neon-cyan transition-colors cursor-pointer">
                    Categories
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="font-space-mono text-xs hover:text-neon-cyan transition-colors cursor-pointer">
                    About Us
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-orbitron font-bold text-sm mb-4 text-neon-magenta">LEGAL</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="font-space-mono text-xs hover:text-neon-magenta transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="font-space-mono text-xs hover:text-neon-magenta transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="font-space-mono text-xs hover:text-neon-magenta transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-orbitron font-bold text-sm mb-4 text-neon-green">SOCIAL</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 hover:text-neon-green transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 hover:text-neon-green transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neon-cyan/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-space-mono text-xs text-muted-foreground text-center md:text-left">
              © {currentYear} ONIBlog. All rights reserved. Made with{' '}
              <Heart size={12} className="inline text-neon-magenta" /> for anime and movie enthusiasts.
            </p>
            <div className="font-space-mono text-xs text-neon-cyan">
              [ SYSTEM STATUS: OPERATIONAL ]
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
