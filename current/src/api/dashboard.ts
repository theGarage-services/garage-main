/**
 * Dashboard API Service
 * Provides aggregated dashboard statistics for recruiters
 */
import apiClient from './client';

// Dashboard Stats Interfaces
export interface JobPostingsStats {
  total: number;
  this_week: number;
  this_month: number;
}

export interface CandidatesStats {
  total: number;
  this_week: number;
  this_month: number;
}

export interface InterviewsStats {
  total: number;
  upcoming: number;
  this_week: number;
}

export interface CoffeeChatsStats {
  total: number;
  this_month: number;
}

export interface DashboardStats {
  job_postings: JobPostingsStats;
  candidates: CandidatesStats;
  interviews: InterviewsStats;
  coffee_chats: CoffeeChatsStats;
}

export interface RecentJobAnalytics {
  id: number;
  title: string;
  department: string;
  location: string;
  posted_date: string;
  status: string;
  views: number;
  applications: number;
  interviews: number;
  hires: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_jobs: RecentJobAnalytics[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  error?: string;
}

/**
 * Dashboard API
 * Handles all dashboard-related API calls
 */
export const dashboardApi = {
  /**
   * Get comprehensive recruiter dashboard statistics
   * Returns aggregated stats for job postings, candidates, interviews, coffee chats,
   * and recent jobs with analytics
   */
  async getDashboardStats(): Promise<DashboardResponse> {
    const response = await apiClient.request('/jobposts/dashboard/stats/', {
      method: 'GET',
    });
    return response.json();
  },
};

export default dashboardApi;
