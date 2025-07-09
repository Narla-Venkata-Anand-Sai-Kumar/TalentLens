import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthTokens, User, InterviewSession, Resume, Notification, DashboardStats } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem('access_token', response.data.access);
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/signin';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<AxiosResponse<AuthTokens>> {
    return this.api.post('/auth/login/', { email, password });
  }

  async signin(email: string, password: string): Promise<AxiosResponse<AuthTokens>> {
    return this.api.post('/auth/signin/', { email, password });
  }

  async register(userData: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    role: string;
    username?: string;
    phone_number?: string;
  }): Promise<AxiosResponse<User>> {
    return this.api.post('/auth/register/', userData);
  }

  async refreshToken(refresh: string): Promise<AxiosResponse<{ access: string }>> {
    return this.api.post('/auth/token/refresh/', { refresh });
  }

  async logout(): Promise<AxiosResponse<void>> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    return this.api.post('/auth/logout/', { refresh: refreshToken });
  }

  async getCurrentUser(): Promise<AxiosResponse<User>> {
    return this.api.get('/auth/user/');
  }

  async updateProfile(data: Partial<User>): Promise<AxiosResponse<User>> {
    return this.api.patch('/auth/user/', data);
  }

  async changePassword(data: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<AxiosResponse<{ message: string }>> {
    return this.api.post('/auth/change-password/', data);
  }

  // Interview APIs
  async getInterviews(params?: {
    status?: string;
    category?: string;
    page?: number;
  }): Promise<AxiosResponse<{ results: InterviewSession[]; count: number }>> {
    return this.api.get('/interviews/', { params });
  }

  async getInterview(id: number): Promise<AxiosResponse<InterviewSession>> {
    return this.api.get(`/interviews/${id}/`);
  }

  async createInterview(data: Partial<InterviewSession>): Promise<AxiosResponse<InterviewSession>> {
    return this.api.post('/interviews/', data);
  }

  async updateInterview(id: number, data: Partial<InterviewSession>): Promise<AxiosResponse<InterviewSession>> {
    return this.api.patch(`/interviews/${id}/`, data);
  }

  async deleteInterview(id: number): Promise<AxiosResponse<void>> {
    return this.api.delete(`/interviews/${id}/`);
  }

  async startInterview(id: number): Promise<AxiosResponse<InterviewSession>> {
    return this.api.post(`/interviews/${id}/start/`);
  }

  async completeInterview(id: number): Promise<AxiosResponse<InterviewSession>> {
    return this.api.post(`/interviews/${id}/complete/`);
  }

  async generateQuestions(id: number, data: {
    num_questions: number;
    difficulty_level: string;
    category: string;
  }): Promise<AxiosResponse<{ questions: any[] }>> {
    return this.api.post(`/interviews/${id}/generate-questions/`, data);
  }

  async submitAnswer(questionId: number, data: {
    answer_text: string;
    time_taken?: number;
  }): Promise<AxiosResponse<any>> {
    return this.api.post(`/interviews/questions/${questionId}/submit/`, data);
  }

  async scheduleInterview(interviewData: {
    student: number;
    scheduled_datetime: string;
    end_datetime: string;
    interview_type: 'technical' | 'communication' | 'aptitude';
    duration_minutes: number;
    instructions?: string;
    is_secure_mode?: boolean;
    session_id?: string;
    security_config?: {
      tab_switch_limit: number;
      warning_limit: number;
      time_extension_allowed: boolean;
      copy_paste_disabled: boolean;
      screen_recording_detection: boolean;
    };
  }): Promise<AxiosResponse<InterviewSession>> {
    return this.api.post('/interviews/', interviewData);
  }

  // Resume APIs
  async getResumes(): Promise<AxiosResponse<Resume[]>> {
    return this.api.get('/resumes/');
  }

  async getResume(id: number): Promise<AxiosResponse<Resume>> {
    return this.api.get(`/resumes/${id}/`);
  }

  async uploadResume(formData: FormData): Promise<AxiosResponse<Resume>> {
    return this.api.post('/resumes/upload_resume/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async updateResume(id: number, data: Partial<Resume>): Promise<AxiosResponse<Resume>> {
    return this.api.patch(`/resumes/${id}/`, data);
  }

  async deleteResume(id: number): Promise<AxiosResponse<void>> {
    return this.api.delete(`/resumes/${id}/`);
  }

  async analyzeResume(id: number): Promise<AxiosResponse<{ analysis: string; skills: string[] }>> {
    return this.api.post(`/resumes/${id}/analyze/`);
  }

  async getResumePreview(id: number): Promise<AxiosResponse<{ content: string }>> {
    return this.api.get(`/resumes/${id}/preview/`);
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<AxiosResponse<DashboardStats>> {
    return this.api.get('/dashboard/overview/');
  }

  async getStudentProgress(): Promise<AxiosResponse<any>> {
    return this.api.get('/dashboard/student_progress/');
  }

  async getPerformanceMetrics(params?: {
    period?: string;
    category?: string;
  }): Promise<AxiosResponse<any[]>> {
    return this.api.get('/dashboard/performance/', { params });
  }

  async getProgressTracking(): Promise<AxiosResponse<any>> {
    return this.api.get('/dashboard/progress/');
  }

  // Notification APIs
  async getNotifications(): Promise<AxiosResponse<Notification[]>> {
    return this.api.get('/notifications/');
  }

  async markNotificationAsRead(id: number): Promise<AxiosResponse<Notification>> {
    return this.api.patch(`/notifications/${id}/`, { is_read: true });
  }

  async markAllNotificationsAsRead(): Promise<AxiosResponse<void>> {
    return this.api.post('/notifications/mark-all-read/');
  }

  // User Management APIs (Admin/Teacher only)
  async getUsers(params?: {
    role?: string;
    is_active?: boolean;
    page?: number;
  }): Promise<AxiosResponse<{ results: User[]; count: number }>> {
    return this.api.get('/users/', { params });
  }

  async getUser(id: number): Promise<AxiosResponse<User>> {
    return this.api.get(`/users/${id}/`);
  }

  async updateUser(id: number, data: Partial<User>): Promise<AxiosResponse<User>> {
    return this.api.patch(`/users/${id}/`, data);
  }

  async deleteUser(id: number): Promise<AxiosResponse<void>> {
    return this.api.delete(`/users/${id}/`);
  }

  // Enhanced user management with progress data
  async getUserProgress(id: number): Promise<AxiosResponse<{
    user: User;
    interviews_completed: number;
    total_interviews: number;
    average_score: number;
    last_activity: string;
  }>> {
    return this.api.get(`/users/${id}/progress/`);
  }

  async createUser(userData: {
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    phone_number?: string;
    is_active?: boolean;
  }): Promise<AxiosResponse<User>> {
    return this.api.post('/users/', userData);
  }

  // Create student account (for teachers)
  async createStudent(studentData: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone_number?: string;
    is_active?: boolean;
  }): Promise<AxiosResponse<User>> {
    return this.api.post('/users/create_student/', studentData);
  }

  // Enhanced student management
  async getStudentsWithProgress(): Promise<AxiosResponse<{
    students: Array<{
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      is_active: boolean;
      date_joined: string;
      last_activity: string;
      total_interviews: number;
      completed_interviews: number;
      average_score: number;
      progress_percentage: number;
      technical_score: number;
      communication_score: number;
      problem_solving_score: number;
      has_resume: boolean;
      resume: any;
      recent_performance: Array<{
        date: string;
        type: string;
        score: number;
        duration: number;
      }>;
      status: string;
      resume_status: string;
    }>;
    total_count: number;
    active_count: number;
    with_resume_count: number;
  }>> {
    return this.api.get('/dashboard/students_with_progress/');
  }

  async getStudentAnalytics(studentId: number): Promise<AxiosResponse<{
    total_interviews: number;
    average_score: number;
    trend: string;
    skills: {
      technical: number;
      communication: number;
      problem_solving: number;
    };
    recent_interviews: Array<{
      date: string;
      interview_type: string;
      score: number;
      duration: number;
    }>;
    performance_summary: {
      recent_average: number;
      overall_average: number;
      improvement: number;
    };
  }>> {
    return this.api.get(`/dashboard/${studentId}/student_analytics/`);
  }

  // Analytics APIs
  async getTeacherStats(): Promise<AxiosResponse<{
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
  }>> {
    return this.api.get('/dashboard/teacher_stats/');
  }

  async getAnalyticsOverview(params?: {
    period?: string;
    category?: string;
  }): Promise<AxiosResponse<{
    total_interviews: number;
    average_score: number;
    daily_trends: Array<{
      date: string;
      count: number;
      avg_score: number;
    }>;
    student_performance: Array<{
      student_name: string;
      avg_score: number;
      total_interviews: number;
    }>;
  }>> {
    return this.api.get('/dashboard/analytics/', { params });
  }

  // Generic GET method
  async get<T = any>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.api.get(url, { params });
  }

  // Generic POST method
  async post<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.api.post(url, data);
  }

  // Generic PUT method
  async put<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.api.put(url, data);
  }

  // Generic DELETE method
  async delete<T = any>(url: string): Promise<AxiosResponse<T>> {
    return this.api.delete(url);
  }
}

export const apiService = new ApiService();
export default apiService;
