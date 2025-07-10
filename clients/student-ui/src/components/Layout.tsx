import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks';
import { cn } from '../utils/helpers';
import NotificationCenter from './NotificationCenter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  // Check if the current route requires authentication
  const protectedRoutes = ['/dashboard', '/interviews', '/resumes', '/analytics', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some(route => router.pathname.startsWith(route));

  // Handle redirects in useEffect to avoid render-time navigation
  React.useEffect(() => {
    if (!loading && !isAuthenticated && isProtectedRoute) {
      setRedirecting(true);
      router.push('/').catch((error) => {
        console.error('Navigation error:', error);
        setRedirecting(false);
      });
    }
  }, [loading, isAuthenticated, isProtectedRoute, router]);

  // Show loading state during auth check or redirect
  if (loading || redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, return children without layout (for public pages)
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      roles: ['student'],
    },
    {
      name: 'My Interviews',
      href: '/interviews',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      roles: ['student'],
    },
    {
      name: 'My Resume',
      href: '/resumes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L16 6.586A1 1 0 0116 7v10a2 2 0 01-2 2z" />
        </svg>
      ),
      roles: ['student'],
    },
    {
      name: 'My Progress',
      href: '/analytics',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      roles: ['administrator', 'teacher', 'student'],
    },
    {
      name: 'My Profile',
      href: '/profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      roles: ['student'],
    },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-0 flex z-50 md:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/80 bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <SidebarContent navigation={filteredNavigation} user={user} />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-neutral-200 shadow-soft">
          <SidebarContent navigation={filteredNavigation} user={user} />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-72 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gradient-to-br from-neutral-50 to-neutral-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-neutral-500 hover:text-neutral-700 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500 transition-all duration-200"
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-neutral-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex-1">
                <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">
                  {getPageTitle(router.pathname)}
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                  {getPageSubtitle(router.pathname)}
                </p>
              </div>
              
              {/* Header actions */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setNotificationCenterOpen(true)}
                    className="p-3 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-all duration-200 relative group"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-4a7.97 7.97 0 01-5.417-2.83A5.97 5.97 0 018 11.5V11a8 8 0 018-8 8 8 0 018 8v.5c0 .81-.267 1.56-.733 2.17A7.97 7.97 0 0120 17v-4z" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse-soft">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* User menu */}
                <div className="relative">
                  <div className="flex items-center space-x-3 bg-neutral-50 rounded-xl px-4 py-3 hover:bg-neutral-100 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-medium">
                        <span className="text-sm font-semibold text-white">
                          {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="text-sm font-medium text-neutral-900">
                        {user?.first_name} {user?.last_name}
                      </div>
                      <div className="text-xs text-neutral-500 capitalize">
                        {user?.role}
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (confirm('Are you sure you want to logout?')) {
                          await logout();
                        }
                      }}
                      className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-200 transition-all duration-200"
                      title="Logout"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 animate-fade-in">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />
    </div>
  );
};

interface SidebarContentProps {
  navigation: any[];
  user: any;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ navigation, user }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center h-20 flex-shrink-0 px-6 bg-gradient-to-r from-accent-600 to-accent-700 shadow-medium">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">TalentLens</h1>
            <p className="text-xs text-accent-100">Student Portal</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto bg-white">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = router.pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  isActive
                    ? 'bg-accent-50 text-accent-700 border-accent-200'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border-transparent',
                  'group flex items-center px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-200 hover:shadow-soft'
                )}
              >
                <span className={cn(
                  isActive ? 'text-accent-600' : 'text-neutral-400 group-hover:text-neutral-600',
                  'mr-4 flex-shrink-0 transition-colors duration-200'
                )}>
                  {item.icon}
                </span>
                {item.name}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-accent-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* User info in sidebar */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-medium">
              <span className="text-sm font-semibold text-white">
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-neutral-500 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function getPageTitle(pathname: string): string {
  const titles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/interviews': 'My Interviews',
    '/resumes': 'My Resumes',
    '/students': 'Students',
    '/analytics': 'Progress Analytics',
    '/profile': 'My Profile',
  };

  return titles[pathname] || 'TalentLens';
}

function getPageSubtitle(pathname: string): string {
  const subtitles: { [key: string]: string } = {
    '/dashboard': 'Overview of your learning journey',
    '/interviews': 'Practice and review your interviews',
    '/resumes': 'Manage your professional documents',
    '/analytics': 'Track your progress and performance',
    '/profile': 'Manage your account settings',
  };

  return subtitles[pathname] || 'Welcome to your learning platform';
}

export default Layout;
