import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../utils/api';
import { formatDate, formatPercentage } from '../utils/helpers';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';
import { useToast } from '../hooks';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts';

interface PerformanceMetric {
  category: string;
  average_score: number;
  total_interviews: number;
  improvement_rate: number;
  last_updated: string;
}

interface ProgressData {
  weekly_progress: Array<{
    week: string;
    score: number;
    interviews_completed: number;
  }>;
  skill_breakdown: Array<{
    skill: string;
    progress: number;
    students_count: number;
  }>;
  performance_trends: Array<{
    date: string;
    score: number;
    category: string;
    change: string;
    count: number;
  }>;
}

interface AnalyticsData {
  total_interviews: number;
  average_score: number;
  daily_trends: Array<{
    date: string;
    count: number;
    avg_score: number;
  }>;
  period: string;
  category: string;
}

interface TeacherStats {
  active_students: number;
  total_interviews_conducted: number;
  average_student_score: number;
  completion_rate: number;
  improvement_rate: number;
  top_performing_students: Array<{
    name: string;
    score: number;
    interviews: number;
  }>;
  category_breakdown: Array<{
    category: string;
    count: number;
    avg_score: number;
  }>;
}

const AnalyticsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [teacherStats, setTeacherStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { showToast } = useToast();

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  const SKILL_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    fetchAnalyticsData();
  }, [isAuthenticated, router, selectedPeriod, selectedCategory]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const promises = [
        apiService.getProgressTracking(),
        apiService.getPerformanceMetrics({
          period: selectedPeriod,
          category: selectedCategory === 'all' ? undefined : selectedCategory
        })
      ];

      // Add teacher stats if user is teacher
      if (user?.role === 'teacher') {
        promises.push(apiService.getTeacherStats());
      }

      const responses = await Promise.all(promises);
      
      setProgressData(responses[0].data);
      
      // Transform performance data
      const perfData = responses[1].data;
      const transformedMetrics: PerformanceMetric[] = [];
      
      if (perfData.daily_trends && perfData.daily_trends.length > 0) {
        // Group by category and calculate metrics
        const categories = ['technical', 'communication', 'aptitude', 'overall'];
        
        categories.forEach(category => {
          const categoryData = perfData.daily_trends.filter((d: any) => 
            category === 'overall' || d.category === category
          );
          
          if (categoryData.length > 0) {
            const avgScore = categoryData.reduce((sum: number, d: any) => sum + (d.avg_score || 0), 0) / categoryData.length;
            const totalInterviews = categoryData.reduce((sum: number, d: any) => sum + (d.count || 0), 0);
            
            transformedMetrics.push({
              category,
              average_score: avgScore,
              total_interviews: totalInterviews,
              improvement_rate: Math.random() * 10 - 5, // Mock improvement rate
              last_updated: new Date().toISOString()
            });
          }
        });
      }
      
      setPerformanceMetrics(transformedMetrics);
      setAnalyticsData(perfData);
      
      if (responses[2]) {
        setTeacherStats(responses[2].data);
      }
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      showToast('Failed to load analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTrendIcon = (improvement: number) => {
    if (improvement > 0) {
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      );
    } else if (improvement < 0) {
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      );
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!progressData) return { weeklyData: [], skillData: [], trendsData: [] };

    const weeklyData = progressData.weekly_progress.map(week => ({
      name: week.week,
      score: week.score,
      interviews: week.interviews_completed
    }));

    const skillData = progressData.skill_breakdown.map((skill, index) => ({
      name: skill.skill,
      value: skill.progress,
      students: skill.students_count,
      fill: SKILL_COLORS[index % SKILL_COLORS.length]
    }));

    const trendsData = progressData.performance_trends.map(trend => ({
      name: trend.category,
      score: trend.score,
      count: trend.count,
      fill: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    return { weeklyData, skillData, trendsData };
  };

  const { weeklyData, skillData, trendsData } = prepareChartData();

  if (loading) {
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Teacher Analytics Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Comprehensive insights into student performance and progress
            </p>
          </div>
          
          <div className="flex space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
            </select>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="communication">Communication</option>
              <option value="aptitude">Aptitude</option>
            </select>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.length > 0 ? (
            performanceMetrics.map((metric, index) => (
              <Card key={`${metric.category}-${index}`}>
                <Card.Content className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 capitalize">
                        {metric.category.replace('_', ' ')}
                      </p>
                      <p className={`text-2xl font-bold ${getScoreColor(metric.average_score)}`}>
                        {metric.average_score.toFixed(1)}%
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${getScoreBackground(metric.average_score)}`}>
                      <svg className={`w-6 h-6 ${getScoreColor(metric.average_score)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {metric.total_interviews} interviews
                    </span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metric.improvement_rate)}
                      <span className={`font-medium ${
                        metric.improvement_rate > 0 ? 'text-green-600' : 
                        metric.improvement_rate < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {Math.abs(metric.improvement_rate).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <Card.Content className="text-center py-8">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-500">
                  Interview data will appear here once students complete assessments
                </p>
              </Card.Content>
            </Card>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends Chart */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
              <p className="text-sm text-gray-600">Weekly performance over time</p>
            </Card.Header>
            <Card.Content>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Average Score"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="interviews" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Interviews"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Content>
          </Card>

          {/* Skill Breakdown Chart */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">Skill Performance</h3>
              <p className="text-sm text-gray-600">Performance by skill category</p>
            </Card.Header>
            <Card.Content>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Distribution */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">Interview Categories</h3>
              <p className="text-sm text-gray-600">Distribution by type</p>
            </Card.Header>
            <Card.Content>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trendsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="score"
                    >
                      {trendsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Content>
          </Card>

          {/* Score Distribution */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">Score Distribution</h3>
              <p className="text-sm text-gray-600">Performance range analysis</p>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Excellent (80-100)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }} />
                    </div>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Good (60-79)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }} />
                    </div>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Needs Improvement (0-59)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }} />
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Quick Stats */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              <p className="text-sm text-gray-600">Key performance indicators</p>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Students</span>
                  <span className="text-lg font-bold text-blue-600">
                    {teacherStats?.active_students || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Interviews</span>
                  <span className="text-lg font-bold text-green-600">
                    {teacherStats?.total_interviews_conducted || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Student Score</span>
                  <span className="text-lg font-bold text-purple-600">
                    {teacherStats?.average_student_score?.toFixed(1) || '0.0'}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {teacherStats?.completion_rate?.toFixed(1) || '0.0'}%
                  </span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Detailed Analytics Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Performance */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">Recent Performance</h3>
              <p className="text-sm text-gray-600">Latest interview results</p>
            </Card.Header>
            <Card.Content>
              {progressData?.performance_trends && progressData.performance_trends.length > 0 ? (
                <div className="space-y-3">
                  {progressData.performance_trends.slice(0, 5).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getScoreBackground(trend.score)}`}>
                          <div className={`w-full h-full rounded-full ${
                            trend.score >= 80 ? 'bg-green-500' :
                            trend.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {trend.category.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(trend.date)} • {trend.count} interviews
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getScoreColor(trend.score)}`}>
                          {trend.score.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">{trend.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent performance data available</p>
              )}
            </Card.Content>
          </Card>

          {/* Top Performing Students */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
              <p className="text-sm text-gray-600">Students with highest scores</p>
            </Card.Header>
            <Card.Content>
              {teacherStats?.top_performing_students && teacherStats.top_performing_students.length > 0 ? (
                <div className="space-y-3">
                  {teacherStats.top_performing_students.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.interviews} interviews</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${getScoreColor(student.score)}`}>
                          {student.score.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No student performance data available</p>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            variant="primary"
            onClick={() => router.push('/interviews')}
          >
            Schedule Interview
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/students')}
          >
            Manage Students
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
          >
            Export Report
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;

// Prevent static generation for this page since it requires authentication
export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
