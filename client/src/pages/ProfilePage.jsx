import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit,
  Camera,
  Settings,
  Trophy,
  Star,
  GamepadIcon,
  Shield,
  Bell,
  Eye,
  Lock,
  Trash2,
  Download,
  Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, updateUser, uploadAvatar, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  const [activeTab, setActiveTab] = useState('profile');

  // User stats
  const stats = user?.gameStats || {
    gamesPlayed: 0,
    highestScore: 0,
    averageScore: 0,
    level: 1,
    experience: 0,
    lastGameDate: null
  };
  const handleSaveProfile = async () => {
    try {
      await updateUser(editForm);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setIsUploadingAvatar(true);
      try {
        await uploadAvatar(file);
        toast.success('Avatar updated successfully!');
      } catch (error) {
        toast.error('Failed to upload avatar');
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would call an API to delete the account
      toast.success('Account deletion requested. You will be contacted via email.');
    }
  };

  const handleExportData = () => {
    const userData = {
      profile: {
        username: user.username,
        email: user.email,
        joinDate: user.createdAt
      },
      gameStats: stats,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bubble-game-data-${user.username}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently';
  const lastActive = stats.lastGameDate ? new Date(stats.lastGameDate).toLocaleDateString() : 'Never';

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">              <div className="relative inline-block">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={user?.avatar?.url} alt={user?.username} />
                  <AvatarFallback className="bg-blue-500 text-white text-2xl">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <label className={`absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors ${isUploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isUploadingAvatar ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />
                </label>
              </div>
              <CardTitle className="text-2xl">{user?.username || 'Guest'}</CardTitle>
              <div className="flex justify-center space-x-2">
                <Badge variant="secondary">Level {stats.level}</Badge>
                <Badge variant="outline">{stats.gamesPlayed} games</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email || 'No email set'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {memberSince}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <GamepadIcon className="h-4 w-4" />
                  <span>Last active {lastActive}</span>
                </div>
              </div>

              {user?.bio && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">{user.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Profile & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        placeholder="Enter your username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Username</Label>
                      <p className="text-lg">{user?.username || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="text-lg">{user?.email || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Bio</Label>
                      <p className="text-lg">{user?.bio || 'No bio added yet'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Game Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Game Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.gamesPlayed}</div>
                    <div className="text-sm text-gray-600">Games Played</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{stats.highestScore.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Best Score</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.averageScore.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.experience.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total XP</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notifications */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive updates about your games and achievements</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              {/* Visibility */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-medium">Profile Visibility</h3>
                    <p className="text-sm text-gray-600">Control who can see your profile and statistics</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-gray-600">Update your account password for security</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>

              {/* Data Export */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Download className="h-5 w-5 text-purple-600" />
                  <div>
                    <h3 className="font-medium">Export Data</h3>
                    <p className="text-sm text-gray-600">Download your profile and game data</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Deletion */}
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center space-x-3 mb-3">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <h3 className="font-medium text-red-800">Delete Account</h3>
                </div>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete your account, there is no going back. This will permanently delete your profile, 
                  game statistics, and all associated data.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>

              {/* Data Usage */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Data Usage</h3>
                <p className="text-sm text-gray-600 mb-4">
                  We collect and store your game statistics, profile information, and preferences to provide 
                  you with a personalized gaming experience. Your data is never shared with third parties.
                </p>
                <div className="text-xs text-gray-500">
                  <p>• Game scores and statistics</p>
                  <p>• Profile information (username, email, avatar)</p>
                  <p>• Gameplay preferences and settings</p>
                  <p>• Account creation and last activity dates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
