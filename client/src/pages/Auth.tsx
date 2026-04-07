import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getLoginUrl } from '@/const';
import { Zap, ArrowRight } from 'lucide-react';

export function Login() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-12 px-4 page-transition">
      <div className="w-full max-w-md">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <Card className="p-8 border-neon-cyan/30 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 px-4 py-2 border border-neon-cyan rounded-sm bg-background/50 neon-glow-cyan">
                <Zap size={16} className="text-neon-cyan animate-pulse" />
                <span className="font-space-mono text-xs text-neon-cyan">AUTH SYSTEM</span>
              </div>
            </div>
            <h1 className="font-orbitron text-4xl font-bold text-neon-cyan mb-2">LOGIN</h1>
            <p className="font-space-mono text-sm text-muted-foreground">
              ACCESS YOUR ONI NETWORK ACCOUNT
            </p>
          </div>

          {/* Login Button */}
          <a href={getLoginUrl()} className="block mb-6">
            <Button className="w-full bg-neon-cyan text-background hover:bg-neon-green font-orbitron font-bold py-6 text-lg neon-glow-cyan transition-all duration-300 hover:shadow-neon-cyan">
              <Zap size={20} className="mr-2" />
              CONNECT WITH MANUS OAUTH
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </a>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neon-cyan/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground font-space-mono">OR</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Button
            variant="outline"
            className="w-full border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background font-orbitron font-bold py-6 text-lg transition-all duration-300"
            onClick={() => setLocation('/auth/signup')}
          >
            CREATE NEW ACCOUNT
          </Button>

          {/* Info */}
          <div className="mt-8 p-4 border border-neon-green/30 rounded-sm bg-background/50">
            <p className="font-space-mono text-xs text-muted-foreground">
              [ SYSTEM INFO ] Secure OAuth authentication powered by Manus. Your data is encrypted and protected.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function Signup() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-12 px-4 page-transition">
      <div className="w-full max-w-md">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <Card className="p-8 border-neon-magenta/30 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 px-4 py-2 border border-neon-magenta rounded-sm bg-background/50 neon-glow-magenta">
                <Zap size={16} className="text-neon-magenta animate-pulse" />
                <span className="font-space-mono text-xs text-neon-magenta">NEW USER</span>
              </div>
            </div>
            <h1 className="font-orbitron text-4xl font-bold text-neon-magenta mb-2">SIGNUP</h1>
            <p className="font-space-mono text-sm text-muted-foreground">
              JOIN THE ONI NETWORK TODAY
            </p>
          </div>

          {/* Signup Button */}
          <a href={getLoginUrl()} className="block mb-6">
            <Button className="w-full bg-neon-magenta text-background hover:bg-neon-cyan font-orbitron font-bold py-6 text-lg neon-glow-magenta transition-all duration-300 hover:shadow-neon-magenta">
              <Zap size={20} className="mr-2" />
              CREATE ACCOUNT WITH MANUS
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </a>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neon-magenta/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground font-space-mono">OR</span>
            </div>
          </div>

          {/* Login Link */}
          <Button
            variant="outline"
            className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background font-orbitron font-bold py-6 text-lg transition-all duration-300"
            onClick={() => setLocation('/auth/login')}
          >
            EXISTING USER? LOGIN
          </Button>

          {/* Benefits */}
          <div className="mt-8 space-y-3">
            <div className="flex gap-3 p-3 border border-neon-green/30 rounded-sm bg-background/50">
              <span className="text-neon-green flex-shrink-0">✓</span>
              <p className="font-space-mono text-xs text-muted-foreground">
                Access personalized reading history
              </p>
            </div>
            <div className="flex gap-3 p-3 border border-neon-green/30 rounded-sm bg-background/50">
              <span className="text-neon-green flex-shrink-0">✓</span>
              <p className="font-space-mono text-xs text-muted-foreground">
                Receive email notifications for new posts
              </p>
            </div>
            <div className="flex gap-3 p-3 border border-neon-green/30 rounded-sm bg-background/50">
              <span className="text-neon-green flex-shrink-0">✓</span>
              <p className="font-space-mono text-xs text-muted-foreground">
                Comment and engage with the community
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
