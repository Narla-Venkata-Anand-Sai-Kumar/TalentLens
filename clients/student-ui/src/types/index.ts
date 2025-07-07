// User and Authentication Types
export interface User {
  id: number;
  username?: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'administrator' | 'teacher' | 'student';
  is_active: boolean;
  date_joined: string;
  phone_number?: string;
  profile_picture?: string;
  full_name?: string;
  profile?: {
    bio?: string;
    phone_number?: string;
    avatar?: string;
  };
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  role: 'administrator' | 'teacher' | 'student';
  username?: string;
  phone_number?: string;
}

// Interview Types
export interface InterviewSession {
  id: number;
  title?: string;
  description?: string;
  category?: string;
  interview_type?: 'technical' | 'communication' | 'aptitude';
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'pending' | 'missed';
  student: number;
  teacher?: number;
  student_name?: string; // From API
  teacher_name?: string; // From API
  scheduled_time?: string; // Maps to scheduled_datetime from API
  scheduled_datetime?: string; // Direct from API
  end_datetime?: string; // From API
  started_at?: string;
  completed_at?: string;
  duration?: number; // Duration in minutes
  duration_minutes?: number; // From API
  actual_duration?: number; // Actual duration in minutes
  total_questions?: number;
  overall_score?: number;
  max_score?: number;
  score_breakdown?: Record<string, number>;
  ai_feedback?: string;
  feedback?: string;
  recommendations?: string[];
  is_ai_generated?: boolean;
  security_enabled?: boolean;
  is_secure_mode?: boolean; // From API
  session_id?: string; // From API
  security_config?: any; // From API
  security_violations?: number; // From API
  session_token?: string; // From API
  is_session_valid?: boolean; // From API
  tab_switches?: number; // From API
  warning_count?: number; // From API
  instructions?: string; // From API
  questions?: InterviewQuestion[];
  created_at: string;
  updated_at: string;
}

export interface InterviewQuestion {
  id: number;
  interview_session: number;
  question_text: string;
  question_type: 'technical' | 'behavioral' | 'situational' | 'coding';
  expected_answer?: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  time_limit?: number;
  order: number;
  score?: number;
  user_answer?: string;
  ai_feedback?: string;
  is_ai_generated: boolean;
  ai_context?: string;
  created_at: string;
}

export interface InterviewResponse {
  id: number;
  question: number;
  answer_text: string;
  time_taken?: number;
  score?: number;
  max_score?: number;
  ai_feedback?: string;
  created_at: string;
}

// Resume Types
export interface Resume {
  id: number;
  student: number; // Changed from 'user' to 'student' to match API
  student_name?: string; // Added from API
  title?: string; // Made optional since API might not always include it
  description?: string;
  file_path?: string;
  file_url?: string;
  file_size?: number;
  file_name?: string;
  content?: string;
  extracted_skills?: string[];
  skills_extracted?: string[]; // Alternative field name from API
  analysis_result?: string;
  analysis?: {
    id: number;
    overall_score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    content_quality_score: number;
    formatting_score: number;
    keywords_score: number;
    experience_relevance_score: number;
    recommended_roles: string[];
    skill_gaps: string[];
    market_relevance: string;
    created_at: string;
    updated_at: string;
  };
  experience_years?: number;
  education_level?: string;
  education_details?: any[];
  job_titles?: string[];
  technologies?: string[];
  last_analyzed?: string;
  analysis_version?: string;
  is_active: boolean;
  created_at?: string; // Made optional
  updated_at?: string; // Made optional
  upload_date: string; // Made required since API always returns this
  uploaded_by?: number;
  uploaded_by_name?: string; // Added for completeness
  word_count?: number; // Added from API response
  overall_score?: number; // Added from API response
}

// Dashboard Types
export interface DashboardMetrics {
  id: number;
  user: number;
  total_interviews: number;
  completed_interviews: number;
  average_score: number;
  total_time_spent: number;
  skills_practiced: string[];
  improvement_areas: string[];
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_interviews: number;
  completed_interviews: number;
  average_score: number;
  score_trend: string;
  technical_average: number;
  communication_average: number;
  aptitude_average: number;
  improvement_percentage: number;
  streak_days: number;
  next_interview?: {
    id: number;
    interview_type: string;
    scheduled_datetime: string;
    teacher_name: string;
  } | null;
  recent_interviews: Array<{
    id: number;
    interview_type: string;
    status: string;
    scheduled_datetime: string;
    score: number;
    teacher_name: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    icon: string;
    earned_at: string;
  }>;
}

// Notification Types
export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

// Component Props Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Form Types
export interface InterviewFormData {
  title: string;
  description?: string;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  student?: number;
  scheduled_time?: string;
  is_ai_generated: boolean;
  security_enabled: boolean;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  bio?: string;
  phone_number?: string;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface PerformanceData {
  date: string;
  score: number;
  category: string;
}
