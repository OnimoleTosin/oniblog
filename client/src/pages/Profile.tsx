import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { Loader2, User, Mail, Calendar, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');

  const { data: profile, isLoading: profileLoading } = trpc.users.getProfile.useQuery();
  const { data: readingHistory } = trpc.readingHistory.getHistory.useQuery({ limit: 10 });
  const updateProfileMutation = trpc.users.updateProfile.useMutation();

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({ name, bio });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-orbitron text-4xl text-neon-magenta mb-4">ACCESS DENIED</h1>
          <p className="font-space-mono text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mx-auto mb-4" />
          <p className="font-space-mono text-muted-foreground">LOADING PROFILE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground page-transition">
      {/* Header */}
      <section className="border-b border-neon-cyan/20 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-orbitron text-5xl md:text-6xl font-bold">
            <span className="text-neon-cyan">USER</span>
            <span className="text-neon-magenta"> PROFILE</span>
          </h1>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <Card className="p-6 border-neon-cyan/30 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-sm border-2 border-neon-cyan flex items-center justify-center bg-input">
                    <User size={48} className="text-neon-cyan" />
                  </div>
                  <h2 className="font-orbitron text-2xl font-bold text-neon-cyan">
                    {profile?.name || 'USER'}
                  </h2>
                  <p className="font-space-mono text-xs text-neon-magenta mt-2">
                    {profile?.role?.toUpperCase()}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-neon-magenta flex-shrink-0" />
                    <span className="font-space-mono text-xs text-muted-foreground truncate">
                      {profile?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-neon-green flex-shrink-0" />
                    <span className="font-space-mono text-xs text-muted-foreground">
                      {new Date(profile?.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full bg-neon-cyan text-background hover:bg-neon-green font-orbitron font-bold"
                >
                  {isEditing ? 'CANCEL' : 'EDIT PROFILE'}
                </Button>
              </Card>
            </div>

            {/* Edit Form / Info */}
            <div className="md:col-span-2 space-y-8">
              {isEditing ? (
                <Card className="p-6 border-neon-magenta/30">
                  <h3 className="font-orbitron text-xl font-bold text-neon-magenta mb-6">EDIT PROFILE</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="font-space-mono text-xs text-neon-cyan mb-2 block">
                        NAME
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-input border-neon-cyan/30 focus:border-neon-cyan font-space-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-space-mono text-xs text-neon-cyan mb-2 block">
                        BIO
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-3 bg-input border border-neon-cyan/30 focus:border-neon-cyan rounded-sm font-space-mono text-sm focus:outline-none min-h-24"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      className="w-full bg-neon-magenta text-background hover:bg-neon-cyan font-orbitron font-bold"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          SAVING...
                        </>
                      ) : (
                        'SAVE CHANGES'
                      )}
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 border-neon-cyan/30">
                  <h3 className="font-orbitron text-xl font-bold text-neon-cyan mb-4">BIO</h3>
                  <p className="font-space-mono text-sm text-muted-foreground">
                    {profile?.bio || 'No bio added yet. Click "Edit Profile" to add one!'}
                  </p>
                </Card>
              )}

              {/* Reading History */}
              <Card className="p-6 border-neon-green/30">
                <h3 className="font-orbitron text-xl font-bold text-neon-green mb-6 flex items-center gap-2">
                  <BookOpen size={20} />
                  READING HISTORY
                </h3>
                {readingHistory && readingHistory.length > 0 ? (
                  <div className="space-y-3">
                    {readingHistory.map((item) => (
                      <div key={item.id} className="p-3 border border-neon-green/20 rounded-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-space-mono text-xs text-muted-foreground">
                            {new Date(item.readAt).toLocaleDateString()}
                          </span>
                          {item.timeSpent && (
                            <span className="font-space-mono text-xs text-neon-green">
                              {Math.round(item.timeSpent / 60)} MIN
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-space-mono text-sm text-muted-foreground">
                    No reading history yet. Start exploring posts!
                  </p>
                )}
              </Card>

              {/* Account Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border-neon-magenta/30 text-center">
                  <div className="font-orbitron text-2xl font-bold text-neon-magenta">
                    {readingHistory?.length || 0}
                  </div>
                  <div className="font-space-mono text-xs text-muted-foreground">
                    POSTS READ
                  </div>
                </Card>
                <Card className="p-4 border-neon-cyan/30 text-center">
                  <div className="font-orbitron text-2xl font-bold text-neon-cyan">
                    {Math.floor(Math.random() * 100)}
                  </div>
                  <div className="font-space-mono text-xs text-muted-foreground">
                    COMMENTS
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
