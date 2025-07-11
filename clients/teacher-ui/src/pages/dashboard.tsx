import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../utils/api';
import { formatDate, formatDuration, getScoreColor } from '../utils/helpers';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import { InterviewSession } from '../types';
import { useToast } from '../hooks';

interface TeacherDashboardData {
  total_students: number;
  active_students: number;
  interviews_conducted: number;
  interviews_this_month: number;
  average_student_score: number;
  recent_interviews: Array<{
    id: number;
    student_name: string;
    interview_type: string;
    status: string;
    scheduled_datetime: string;
    score: number;
  }>;
  student_progress: Array<{
    student_id: number;
    student_name: string;
    average_score: number;
    score_trend: string;
    total_interviews: number;
    last_interview_date: string | null;
  }>;
  pending_reviews: Array<{
    id: number;
    student_name: string;
    interview_type: string;
    completed_at: string;
    score: number;
  }>;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardStats();
      console.log('Dashboard data received:', response.data);
      setDashboardData(response.data as TeacherDashboardData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      showToast('Failed to load dashboard data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading size="lg" text="Loading dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.first_name}!
              </h1>
              <p className="text-emerald-100">
                Ready to guide your students to interview success? Check your class progress and manage training sessions.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadDashboardData}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              disabled={loading}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Interviews"
            value={dashboardData?.interviews_conducted || 0}
            icon={
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            change={`+${dashboardData?.interviews_this_month || 0} this month`}
            changeType="positive"
          />
          
          <StatsCard
            title="Total Students"
            value={dashboardData?.total_students || 0}
            icon={
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            change={`${dashboardData?.active_students || 0} active`}
            changeType="positive"
          />
          
          <StatsCard
            title="Average Score"
            value={`${dashboardData?.average_student_score?.toFixed(1) || '0.0'}%`}
            icon={
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            change="Student average"
            changeType="neutral"
          />
          
          <StatsCard
            title="Pending Reviews"
            value={dashboardData?.pending_reviews?.length || 0}
            icon={
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
            change="Need attention"
            changeType={dashboardData?.pending_reviews?.length > 0 ? "negative" : "neutral"}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Interviews */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Interviews</CardTitle>
                <CardDescription>
                  Your latest interview sessions and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.recent_interviews && dashboardData.recent_interviews.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recent_interviews.map((interview) => (
                      <div 
                        key={interview.id} 
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/interview/${interview.id}`)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            interview.status === 'completed' ? 'bg-green-500' :
                            interview.status === 'in_progress' ? 'bg-yellow-500' :
                            interview.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-500'
                          }`} />
                          <div>
                            <p className="font-medium text-gray-900">
                              {interview.student_name || 'Unknown Student'}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">
                              {interview.interview_type.replace('_', ' ')} • {formatDate(interview.scheduled_datetime)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                            interview.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {interview.status.replace('_', ' ')}
                          </span>
                          {interview.status === 'completed' && interview.score !== undefined && (
                            <p className={`text-sm font-medium mt-1 ${getScoreColor(interview.score)}`}>
                              Score: {interview.score}%
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>No interviews yet</p>
                    <p className="text-sm mt-1">Create your first interview to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user?.role === 'student' && (
                  <>
                    <Button 
                      fullWidth 
                      variant="primary"
                      onClick={() => router.push('/interviews/new')}
                    >
                      Start New Interview
                    </Button>
                    <Button 
                      fullWidth 
                      variant="outline"
                      onClick={() => router.push('/resumes')}
                    >
                      Upload Resume
                    </Button>
                    <Button 
                      fullWidth 
                      variant="outline"
                      onClick={() => router.push('/analytics')}
                    >
                      View Progress
                    </Button>
                  </>
                )}
                
                {user?.role === 'teacher' && (
                  <>
                    <Button 
                      fullWidth 
                      variant="primary"
                      onClick={() => router.push('/interviews/new')}
                    >
                      Create Professional Interview
                    </Button>
                    <Button 
                      fullWidth 
                      variant="outline"
                      onClick={() => router.push('/students')}
                    >
                      Manage Students
                    </Button>
                    <Button 
                      fullWidth 
                      variant="outline"
                      onClick={() => router.push('/analytics')}
                    >
                      View Analytics
                    </Button>
                  </>
                )}
                
                {user?.role === 'administrator' && (
                  <>
                    <Button 
                      fullWidth 
                      variant="primary"
                      onClick={() => router.push('/admin/dashboard')}
                    >
                      System Overview
                    </Button>
                    <Button 
                      fullWidth 
                      variant="outline"
                      onClick={() => router.push('/admin/users')}
                    >
                      User Management
                    </Button>
                    <Button 
                      fullWidth 
                      variant="outline"
                      onClick={() => router.push('/admin/settings')}
                    >
                      Platform Settings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Student Progress Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>Overview of your students' performance</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.student_progress && dashboardData.student_progress.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.student_progress.slice(0, 5).map((student) => (
                      <div 
                        key={student.student_id} 
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/students/${student.student_id}`)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {student.student_name || 'Unknown Student'}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{student.total_interviews} interviews</span>
                            <span className={`capitalize ${
                              student.score_trend === 'improving' ? 'text-green-600' :
                              student.score_trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {student.score_trend}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${getScoreColor(student.average_score)}`}>
                            {student.average_score.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {dashboardData.student_progress.length > 5 && (
                      <div className="text-center pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push('/students')}
                        >
                          View All Students
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-sm text-gray-500">No student progress yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Reviews */}
            {dashboardData?.pending_reviews && dashboardData.pending_reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Reviews</CardTitle>
                  <CardDescription>Interviews waiting for your feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.pending_reviews.map((review) => (
                      <div key={review.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {review.student_name || 'Unknown Student'}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {review.interview_type.replace('_', ' ')} • {formatDate(review.completed_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Button 
                            size="sm" 
                            variant="primary"
                            onClick={() => router.push(`/interviews/${review.id}/review`)}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change, changeType }) => {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-sm ${changeColors[changeType]}`}>
              {change} from last month
            </p>
          </div>
          <div className="flex-shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPage;

// Prevent static generation for this page since it requires authentication
export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
