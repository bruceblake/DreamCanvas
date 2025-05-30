import React from 'react';
import { useAppSelector } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Award, Edit2, Save } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const ProfilePage: React.FC = () => {
  const { user, profile } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(user?.displayName || '');
  const [bio, setBio] = React.useState(profile?.bio || '');

  const handleSave = async () => {
    // Save profile changes
    setIsEditing(false);
  };

  if (!user || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <Card variant="glass" className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {displayName || user.email?.split('@')[0]}
                    </CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
                <Button
                  variant={isEditing ? 'default' : 'outline'}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  leftIcon={isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                >
                  {isEditing ? 'Save' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {bio || 'No bio added yet. Edit your profile to add one!'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">User ID</p>
                  <p className="font-mono text-sm">{user.uid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                  <p className="font-medium">{formatDate(profile.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Account Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">Free User</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Unlimited image generations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600">∞</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generations Available</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Collections</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">0</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;