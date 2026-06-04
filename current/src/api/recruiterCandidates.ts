/**
 * Recruiter Candidates API Service
 * Handles fetching and managing candidates across all recruiter's jobs
 */
import apiClient from './client';

// Job applied interface
export interface JobApplied {
  jobId: string;
  jobTitle: string;
  department: string;
  appliedDate: string;
  status: string;
  matchScore?: number | null;
}

// Candidate interface
export interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  avatar: string | null;
  status: string;
  appliedDate: string;
  lastUpdated: string;
  source: string;
  matchScore: number;
  email: string;
  phone: string | null;
  jobsApplied: JobApplied[];
  skills?: string[];
  resumeUrl?: string;
}

export interface CandidateDetail extends Omit<Candidate, 'jobsApplied'> {
  jobsApplied: JobApplied[];
  current_company?: string;
  summary?: string;
  lastActivity?: string;
  salary?: string;
  profileImage?: string;
  currentCompany?: string;
  socialLinks?: {
    linkedin?: string | null;
    github?: string | null;
    portfolio?: string | null;
  };
  experience_detailed?: Array<{
    title?: string;
    company?: string;
    location?: string;
    duration?: string;
    description?: string;
    achievements?: string[];
  }>;
  education?: Array<{
    degree?: string;
    school?: string;
    year?: string;
    gpa?: string;
  }>;
  isPremium?: boolean;
  premiumTier?: string;
  queueMetrics?: {
    currentQueues: string[];
    queueRankings: number[];
    totalApplications: number;
    responseRate: number;
    interviewRate: number;
    successfulPlacements: number;
  };
}

// Status counts interface
export interface StatusCounts {
  all: number;
  applied: number;
  interviewing: number;
  offers: number;
  hired: number;
  not_considered: number;
  withdrawn: number;
}

// Metrics interface
export interface CandidateMetrics {
  total_candidates: number;
  active_in_pipeline: number;
  total_hired: number;
  avg_match_score: number;
}

// All candidates response
export interface AllCandidatesResponse {
  candidates: Candidate[];
  status_counts: StatusCounts;
  metrics: CandidateMetrics;
  total_count: number;
}

// Fetch parameters
export interface FetchCandidatesParams {
  search?: string;
  jobId?: string;
  status?: string;
  source?: string;
  sortBy?: string;
}

// Job for filter dropdown
export interface FilterJob {
  id: string;
  title: string;
  department: string;
}

/**
 * Export candidates to CSV
 * Generates a CSV blob from the provided candidates
 */
const exportCandidatesToCSV = (candidates: Candidate[]): Blob => {
  const headers = [
    'Name',
    'Title',
    'Email',
    'Phone',
    'Location',
    'Experience',
    'Status',
    'Source',
    'Match Score',
    'Applied Date'
  ];

  const rows = candidates.map(c => [
    c.name,
    c.title,
    c.email,
    c.phone || '',
    c.location,
    c.experience,
    c.status,
    c.source,
    c.matchScore,
    c.appliedDate
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return new Blob([csvContent], { type: 'text/csv' });
};

/**
 * Trigger file download from blob
 */
const triggerDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// Recruiter Candidates API
export const recruiterCandidatesApi = {
  /**
   * Fetch all candidates across all recruiter's jobs
   * Includes status counts and metrics
   */
  async fetchAllCandidates(
    params: FetchCandidatesParams = {}
  ): Promise<AllCandidatesResponse> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.jobId) queryParams.append('job_id', params.jobId);
    if (params.status) queryParams.append('status', params.status);
    if (params.source) queryParams.append('source', params.source);
    if (params.sortBy) queryParams.append('sort_by', params.sortBy);

    const response = await apiClient.request(`/jobposts/all-candidates/?${queryParams}`, {
      method: 'GET'
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch candidates');
    }

    return data.data;
  },

  /**
   * Fetch recruiter's jobs for filter dropdown
   */
  async fetchRecruiterJobs(): Promise<FilterJob[]> {
    const response = await apiClient.request('/jobposts/?my_jobs=true', {
      method: 'GET'
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch jobs');
    }

    return data.data.map((job: any) => ({
      id: String(job.id),
      title: job.title,
      department: job.department || 'General'
    }));
  },

  /**
   * Download candidate resume
   * Triggers a file download of the candidate's resume PDF
   */
  async fetchCandidateDetails(
    candidateId: string,
    jobId?: string | number
  ): Promise<CandidateDetail> {
    const query = jobId == null ? '' : `?job_id=${encodeURIComponent(String(jobId))}`;
    const response = await apiClient.request(
      `/jobposts/candidates/${candidateId}${query}`,
      { method: 'GET' }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch candidate details');
    }

    return data.data as CandidateDetail;
  },

  async downloadCandidateResume(
    candidateId: string,
    candidateName: string,
    jobId?: string | number
  ): Promise<void> {
    const query = jobId == null ? '' : `?job_id=${encodeURIComponent(String(jobId))}`;
    const response = await apiClient.request(
      `/jobposts/candidates/${candidateId}/resume${query}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No resume file available for this candidate');
      }
      throw new Error('Failed to download resume');
    }

    const blob = await response.blob();
    const filename = `${candidateName.replace(/\s+/g, '_')}_resume.pdf`;

    triggerDownload(blob, filename);
  },

  /**
   * Export candidates to CSV
   * Triggers a download of the candidates as a CSV file
   */
  exportToCSV(candidates: Candidate[]): void {
    const blob = exportCandidatesToCSV(candidates);
    const filename = `candidates_export_${new Date().toISOString().split('T')[0]}.csv`;
    triggerDownload(blob, filename);
  },

  // Export utility functions for external use
  exportCandidatesToCSV,
  triggerDownload
};
