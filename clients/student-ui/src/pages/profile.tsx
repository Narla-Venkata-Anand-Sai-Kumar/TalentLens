import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import { formatDate } from '../utils/helpers';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card';
import Loading from '../components/ui/Loading';
import { useToast } from '../hooks';
import ProfileStats from '../components/ProfileStats';
import RecentActivity from '../components/RecentActivity';
import { 
  UserIcon, 
  ShieldCheckIcon, 
  CalendarIcon, 
  IdentificationIcon, 
  CogIcon, 
  HomeIcon,
  ChartBarIcon,
  ChatIcon,
  DocumentIcon,
  MailIcon,
  PhoneIcon
} from '../components/ui/Icons';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    phone_number: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { showToast } = useToast();

  // Sample recent activity data - in a real app, this would come from an API
  const recentActivities = [
    {
      id: '1',
      type: 'interview' as const,
      title: 'Technical Interview Completed',
      description: 'Successfully completed a technical interview with a score of 8.5/10',
      timestamp: '2 hours ago',
      status: 'completed' as const
    },
    {
      id: '2',
      type: 'resume' as const,
      title: 'Resume Updated',
      description: 'Updated your resume with new skills and experience',
      timestamp: '1 day ago',
      status: 'completed' as const
    },
    {
      id: '3',
      type: 'score' as const,
      title: 'New Personal Best',
      description: 'Achieved your highest score yet in behavioral interviews',
      timestamp: '3 days ago',
      status: 'completed' as const
    },
    {
      id: '4',
      type: 'interview' as const,
      title: 'Interview Scheduled',
      description: 'Upcoming behavioral interview scheduled for tomorrow',
      timestamp: '5 days ago',
      status: 'scheduled' as const
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        bio: user.profile?.bio || '',
        phone_number: user.profile?.phone_number || '',
      });
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        profile: {
          bio: formData.bio,
          phone_number: formData.phone_number,
        },
      });

      if (result.success) {
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast(result.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordData.new_password.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement password change API call
      showToast('Password changed successfully!', 'success');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Password change error:', error);
      showToast('Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'Administrator';
      case 'teacher':
        return 'Teacher';
      case 'student':
        return 'Student';
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'bg-purple-100 text-purple-800';
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <UserIcon className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {user.first_name} {user.last_name}
          </h1>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
              <IdentificationIcon className="w-4 h-4 mr-2" />
              {getRoleDisplay(user.role)}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <ShieldCheckIcon className="w-3 h-3 mr-1" />
              {user.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {user.profile?.bio || 'Welcome to your profile! Add a bio to tell others about yourself.'}
          </p>
        </div>

        {/* Profile Statistics */}
        <ProfileStats
          stats={{
            totalInterviews: 12, // This would come from API in real app
            completedInterviews: 8,
            averageScore: 7.8,
            resumesUploaded: 3,
            memberSince: formatDate(user.date_joined),
            lastActivity: formatDate(new Date().toISOString())
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">Update your personal information and bio</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MailIcon className="w-4 h-4 mr-2 text-gray-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <ShieldCheckIcon className="w-3 h-3 mr-1" />
                      Email address cannot be changed for security reasons
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <ChatIcon className="w-4 h-4 mr-2 text-gray-500" />
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Tell us about yourself, your goals, and what you're passionate about..."
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <Button
                      type="submit"
                      isLoading={loading}
                      className="px-6 py-3"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <CogIcon className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Password & Security</h3>
                  </div>
                  {!showPasswordForm && (
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordForm(true)}
                      className="flex items-center space-x-2"
                    >
                      <CogIcon className="w-4 h-4" />
                      <span>Change Password</span>
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">Keep your account secure with a strong password</p>
              </CardHeader>
              
              {showPasswordForm && (
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password *
                      </label>
                      <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                        minLength={8}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                        minLength={8}
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({
                            current_password: '',
                            new_password: '',
                            confirm_password: '',
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        isLoading={loading}
                      >
                        Change Password
                      </Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Account Information */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <IdentificationIcon className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-500 flex items-center">
                        <ShieldCheckIcon className="w-4 h-4 mr-2" />
                        Account Status
                      </label>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Member Since
                    </label>
                    <p className="text-sm text-gray-900 font-medium">
                      {formatDate(user.date_joined)}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <IdentificationIcon className="w-4 h-4 mr-2" />
                      User ID
                    </label>
                    <p className="text-sm text-gray-900 font-mono">
                      #{user.id}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <UserIcon className="w-4 h-4 mr-2" />
                      Role
                    </label>
                    <p className="text-sm text-gray-900 font-medium">
                      {getRoleDisplay(user.role)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <HomeIcon className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">Navigate to key areas of your account</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="w-full justify-start hover:bg-primary-50 hover:border-primary-300 transition-all duration-200"
                >
                  <HomeIcon className="w-4 h-4 mr-3 text-primary-600" />
                  Go to Dashboard
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push('/interviews')}
                  className="w-full justify-start hover:bg-primary-50 hover:border-primary-300 transition-all duration-200"
                >
                  <ChatIcon className="w-4 h-4 mr-3 text-primary-600" />
                  View Interviews
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push('/analytics')}
                  className="w-full justify-start hover:bg-primary-50 hover:border-primary-300 transition-all duration-200"
                >
                  <ChartBarIcon className="w-4 h-4 mr-3 text-primary-600" />
                  View Progress
                </Button>

                {user.role === 'student' && (
                  <Button
                    variant="outline"
                    onClick={() => router.push('/resumes')}
                    className="w-full justify-start hover:bg-primary-50 hover:border-primary-300 transition-all duration-200"
                  >
                    <DocumentIcon className="w-4 h-4 mr-3 text-primary-600" />
                    Manage Resumes
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;

// Prevent static generation for this page since it requires authentication
export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
