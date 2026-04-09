import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Github, Twitter } from 'lucide-react';
import { useLocation } from 'wouter';

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-8 overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
          }} />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="font-orbitron text-5xl md:text-6xl font-bold mb-4">
              <span className="text-neon-cyan glitch">ABOUT</span>
              <span className="text-neon-magenta ml-4">ONI</span>
            </h1>
            <p className="font-space-mono text-neon-green text-lg">
              [ ANIME & MOVIE INTELLIGENCE NETWORK ]
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Mission */}
            <Card className="p-8 border-neon-cyan/30 backdrop-blur-sm">
              <h2 className="font-orbitron text-2xl font-bold text-neon-cyan mb-4">
                &gt; MISSION.STATEMENT
              </h2>
              <p className="font-space-mono text-foreground leading-relaxed">
                ONIBlog is your gateway to the latest anime and movie insights, reviews, and discoveries. 
                We aggregate trending content from IMDb, analyze cultural phenomena, and deliver curated 
                intelligence on what's happening in the entertainment sphere. Our mission is to keep you 
                informed about the anime and movie landscape with deep dives, critical analysis, and 
                real-time updates.
              </p>
            </Card>

            {/* What We Cover */}
            <Card className="p-8 border-neon-magenta/30 backdrop-blur-sm">
              <h2 className="font-orbitron text-2xl font-bold text-neon-magenta mb-4">
                &gt; COVERAGE_AREAS
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-orbitron text-neon-green font-bold">ANIME</h3>
                  <p className="font-space-mono text-sm text-foreground">
                    Latest anime releases, seasonal reviews, character analysis, and trending series
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-orbitron text-neon-cyan font-bold">MOVIES</h3>
                  <p className="font-space-mono text-sm text-foreground">
                    Film reviews, box office analysis, director spotlights, and cinematic trends
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-orbitron text-neon-magenta font-bold">REVIEWS</h3>
                  <p className="font-space-mono text-sm text-foreground">
                    In-depth critical analysis, ratings, and viewer perspectives
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-orbitron text-neon-green font-bold">NEWS</h3>
                  <p className="font-space-mono text-sm text-foreground">
                    Breaking updates, announcements, and industry developments
                  </p>
                </div>
              </div>
            </Card>

            {/* Features */}
            <Card className="p-8 border-neon-green/30 backdrop-blur-sm">
              <h2 className="font-orbitron text-2xl font-bold text-neon-green mb-4">
                &gt; PLATFORM_FEATURES
              </h2>
              <ul className="space-y-3 font-space-mono text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-neon-cyan font-bold">→</span>
                  <span>Real-time content updates with IMDb data integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon-magenta font-bold">→</span>
                  <span>Advanced search and category filtering</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon-green font-bold">→</span>
                  <span>Community comments and discussions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon-cyan font-bold">→</span>
                  <span>Personalized reading history and subscriptions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon-magenta font-bold">→</span>
                  <span>Affiliate links to streaming platforms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon-green font-bold">→</span>
                  <span>Email notifications for new content</span>
                </li>
              </ul>
            </Card>

            {/* Technology */}
            <Card className="p-8 border-neon-cyan/30 backdrop-blur-sm">
              <h2 className="font-orbitron text-2xl font-bold text-neon-cyan mb-4">
                &gt; TECH_STACK
              </h2>
              <p className="font-space-mono text-sm text-foreground mb-4">
                Built with cutting-edge web technologies for optimal performance and user experience:
              </p>
              <div className="grid md:grid-cols-2 gap-2 font-space-mono text-xs">
                <div>
                  <p className="text-neon-magenta font-bold">Frontend</p>
                  <p className="text-foreground">React 19 • Tailwind CSS 4 • Framer Motion</p>
                </div>
                <div>
                  <p className="text-neon-green font-bold">Backend</p>
                  <p className="text-foreground">Express • tRPC • MySQL/TiDB</p>
                </div>
                <div>
                  <p className="text-neon-cyan font-bold">Features</p>
                  <p className="text-foreground">OAuth Authentication • LLM Integration</p>
                </div>
                <div>
                  <p className="text-neon-magenta font-bold">Infrastructure</p>
                  <p className="text-foreground">Manus Platform • S3 Storage • Analytics</p>
                </div>
              </div>
            </Card>

            {/* Contact */}
            <Card className="p-8 border-neon-magenta/30 backdrop-blur-sm">
              <h2 className="font-orbitron text-2xl font-bold text-neon-magenta mb-4">
                &gt; GET_IN_TOUCH
              </h2>
              <p className="font-space-mono text-sm text-foreground mb-6">
                Have feedback, suggestions, or want to collaborate? Reach out to us:
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:Onimolesodiq282@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 font-orbitron"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    EMAIL
                  </Button>
                </a>
                <a
                  href="https://wa.me/2349169623604"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10 font-orbitron"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    WHATSAPP
                  </Button>
                </a>
                <a
                  href="https://github.com/OnimoleTosin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="border-neon-green text-neon-green hover:bg-neon-green/10 font-orbitron"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GITHUB
                  </Button>
                </a>
              </div>
            </Card>

            {/* CTA */}
            <div className="text-center pt-8">
              <Button
                onClick={() => navigate('/blog')}
                className="bg-neon-cyan text-background hover:bg-neon-green font-orbitron font-bold px-8 py-6 text-lg"
              >
                EXPLORE POSTS →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer accent */}
      <div className="relative h-32 bg-gradient-to-t from-neon-cyan/5 to-transparent" />
    </div>
  );
}
