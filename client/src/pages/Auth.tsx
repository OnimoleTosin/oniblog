import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { signIn, signInWithGoogle, signUp } from '@/lib/firebaseAuth';
import { Zap, ArrowRight, Loader2, Mail, Lock, User, AlertCircle, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      toast.success('Login successful!');
      setLocation('/');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error?.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please sign up first.';
      } else if (error?.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error?.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error?.code === 'auth/too-many-requests') {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (error?.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      toast.success('Login successful!');
      setLocation('/');
    } catch (error: any) {
      console.error('Google login error:', error);
      
      let errorMessage = 'Google login failed. Please try again.';
      
      if (error?.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
      } else if (error?.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled.';
      } else if (error?.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const retryLastAction = async () => {
    if (email && password) {
      await handleEmailLogin({ preventDefault: () => {} } as React.FormEvent);
    }
  };

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

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 rounded-sm">
              <div className="flex gap-3 mb-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-space-mono text-sm text-red-500">{error}</p>
                </div>
              </div>
              <Button
                onClick={retryLastAction}
                disabled={loading || googleLoading}
                variant="outline"
                size="sm"
                className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10 font-space-mono text-xs"
              >
                <RotateCw size={14} className="mr-2" />
                RETRY
              </Button>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div>
              <label className="block font-space-mono text-xs text-neon-cyan mb-2">EMAIL</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-neon-cyan" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border-neon-cyan/30 text-foreground placeholder:text-muted-foreground"
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            <div>
              <label className="block font-space-mono text-xs text-neon-cyan mb-2">PASSWORD</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-neon-cyan" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-background border-neon-cyan/30 text-foreground placeholder:text-muted-foreground"
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-neon-cyan text-background hover:bg-neon-green font-orbitron font-bold py-6 text-lg neon-glow-cyan transition-all duration-300 hover:shadow-neon-cyan"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  SIGNING IN...
                </>
              ) : (
                <>
                  <Zap size={20} className="mr-2" />
                  SIGN IN
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neon-cyan/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground font-space-mono">OR</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full bg-white text-black hover:bg-gray-100 font-orbitron font-bold py-6 text-lg transition-all duration-300 mb-4"
          >
            {googleLoading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                CONNECTING...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                SIGN IN WITH GOOGLE
              </>
            )}
          </Button>

          {/* Sign Up Link */}
          <Button
            variant="outline"
            className="w-full border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background font-orbitron font-bold py-6 text-lg transition-all duration-300"
            onClick={() => setLocation('/auth/signup')}
            disabled={loading || googleLoading}
          >
            CREATE NEW ACCOUNT
          </Button>

          {/* Info */}
          <div className="mt-8 p-4 border border-neon-green/30 rounded-sm bg-background/50">
            <p className="font-space-mono text-xs text-muted-foreground">
              [ SYSTEM INFO ] Secure Firebase authentication. Your data is encrypted and protected.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function Signup() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !displayName) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signUp(email, password, displayName);
      toast.success('Account created successfully!');
      setLocation('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error?.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Please log in or use a different email.';
      } else if (error?.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (error?.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error?.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      toast.success('Account created successfully!');
      setLocation('/');
    } catch (error: any) {
      console.error('Google signup error:', error);
      
      let errorMessage = 'Google signup failed. Please try again.';
      
      if (error?.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
      } else if (error?.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-up was cancelled.';
      } else if (error?.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

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

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 rounded-sm flex gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-space-mono text-sm text-red-500">{error}</p>
              </div>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4 mb-6">
            <div>
              <label className="block font-space-mono text-xs text-neon-magenta mb-2">DISPLAY NAME</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-neon-magenta" />
                <Input
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10 bg-background border-neon-magenta/30 text-foreground placeholder:text-muted-foreground"
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            <div>
              <label className="block font-space-mono text-xs text-neon-magenta mb-2">EMAIL</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-neon-magenta" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border-neon-magenta/30 text-foreground placeholder:text-muted-foreground"
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            <div>
              <label className="block font-space-mono text-xs text-neon-magenta mb-2">PASSWORD</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-neon-magenta" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-background border-neon-magenta/30 text-foreground placeholder:text-muted-foreground"
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            <div>
              <label className="block font-space-mono text-xs text-neon-magenta mb-2">CONFIRM PASSWORD</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-neon-magenta" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-background border-neon-magenta/30 text-foreground placeholder:text-muted-foreground"
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-neon-magenta text-background hover:bg-neon-cyan font-orbitron font-bold py-6 text-lg neon-glow-magenta transition-all duration-300 hover:shadow-neon-magenta"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  CREATING ACCOUNT...
                </>
              ) : (
                <>
                  <Zap size={20} className="mr-2" />
                  CREATE ACCOUNT
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neon-magenta/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground font-space-mono">OR</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
            className="w-full bg-white text-black hover:bg-gray-100 font-orbitron font-bold py-6 text-lg transition-all duration-300 mb-4"
          >
            {googleLoading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                CONNECTING...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                SIGN UP WITH GOOGLE
              </>
            )}
          </Button>

          {/* Login Link */}
          <Button
            variant="outline"
            className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background font-orbitron font-bold py-6 text-lg transition-all duration-300"
            onClick={() => setLocation('/auth/login')}
            disabled={loading || googleLoading}
          >
            ALREADY HAVE AN ACCOUNT?
          </Button>

          {/* Info */}
          <div className="mt-8 p-4 border border-neon-green/30 rounded-sm bg-background/50">
            <p className="font-space-mono text-xs text-muted-foreground">
              [ SYSTEM INFO ] Secure Firebase authentication. Your data is encrypted and protected.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
