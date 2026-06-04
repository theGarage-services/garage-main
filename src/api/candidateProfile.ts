import apiClient from './client';
import type { User } from './auth';

// JobPost interface for filtered jobs API
export interface FilteredJobPost {
  id: number;
  title: string;
  company: string;
  location: string;
  salary_min: string | null;
  salary_max: string | null;
  currency: string;
  employment_type: string;
  work_arrangement: string;
  experience_level: string;
  industry: string;
  summary: string;
  description: string;
  requirements: string;
  benefits: string;
  status: string;
  created_at: string;
  published_at: string | null;
}

export interface FilteredJobsResponse {
  success: boolean;
  count: number;
  results: FilteredJobPost[];
  offset: number;
  limit: number;
  candidate_profile: {
    industry: string;
    exp_level: string;
    preferred_locations: string[] | null;
    preferred_salary_ranges: string[] | null;
    preferred_job_types: string[] | null;
    preferred_work_arrangements: string[] | null;
  };
}

// New structured profile response from backend
export interface ProfileResponse {
  success: boolean;
  id: number;
  industry: string;
  user_data: {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  };
  candidate_profile_data: {
    job_title: string;
    bio: string;
    phone: string;
    address: string;
    skills: string;
    education: EducationItem[];
    work_history: WorkHistoryItem[];
    exp_level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | '';
    industry: string;
    linkedin: string | null;
    github: string | null;
    portfolio: string | null;
    current_company: string | null;
    profile_image: string | null;
    resume_file: string | null;
    preferred_locations: string[] | null;
    preferred_salary_ranges: string[] | null;
    preferred_job_types: string[] | null;
    preferred_work_arrangements: string[] | null;
    // Optional JSON fields
    projects?: any[] | null;
    certifications?: any[] | null;
  } | null;
}

// Legacy interface for backward compatibility
export interface CandidateProfile {
  id: number;
  user: User;
  job_title: string;
  industry: string;
  bio: string;
  phone: string;
  address: string;
  skills: string; // Comma-separated string from backend
  education: EducationItem[];
  work_history: WorkHistoryItem[];
  exp_level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | '';
  profile_image: string | null;
  resume_file: string | null;
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
  // Individual preference fields (replacing single preferences JSON field)
  preferred_locations: string[] | null;
  preferred_salary_ranges: string[] | null;
  preferred_job_types: string[] | null;
  preferred_work_arrangements: string[] | null;
  // Optional social links and professional info
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  website: string | null;
  current_company: string | null;
  // Optional JSON fields
  projects: any[] | null;
  certifications: any[] | null;
}

export interface EducationItem {
  id?: string;
  degree: string;
  school: string;
  field?: string;
  location?: string;
  start_year?: string;
  end_year?: string;
  current?: boolean;
  gpa?: string;
  relevant?: string[];
}

export interface WorkHistoryItem {
  id?: string;
  title: string;
  company: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
  technologies?: string[];
}

// Individual preference fields (replacing CandidatePreferences)
export interface CandidatePreferences {
  locations?: string[];
  salary_ranges?: string[];
  job_types?: string[];
  work_arrangements?: string[];
}

export interface UpdateCandidateProfileData {
  // User model fields
  first_name?: string;
  last_name?: string;
  email?: string;
  // Candidate profile fields
  job_title?: string;
  industry?: string;
  bio?: string;
  phone?: string;
  address?: string;
  skills?: string; // Comma-separated
  education?: EducationItem[];
  work_history?: WorkHistoryItem[];
  exp_level?: string;
  // Individual preference fields (replacing single preferences field)
  preferred_locations?: string[];
  preferred_salary_ranges?: string[];
  preferred_job_types?: string[];
  preferred_work_arrangements?: string[];
  // Optional social links and professional info
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
  current_company?: string;
  // Optional JSON fields
  projects?: any[];
  certifications?: any[];
}

class CandidateProfileService {
  /**
   * Get the current user's profile (new structured format)
   */
  async getProfile(): Promise<ProfileResponse | null> {
    try {
      const response = await apiClient.request('/accounts/profile/', {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Profile not found
        }
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  /**
   * Transform new ProfileResponse to legacy CandidateProfile format (for backward compatibility)
   */
  transformResponseToLegacyFormat(response: ProfileResponse): CandidateProfile | null {
    if (!response.candidate_profile_data) {
      return null;
    }

    const userData = response.user_data;
    const candidateData = response.candidate_profile_data;

    return {
      id: response.id,
      user: {
        id: 0,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        username: userData.username,
      },
      job_title: candidateData.job_title,
      industry: candidateData.industry || response.industry,
      bio: candidateData.bio,
      phone: candidateData.phone,
      address: candidateData.address,
      skills: candidateData.skills,
      education: candidateData.education,
      work_history: candidateData.work_history,
      exp_level: candidateData.exp_level,
      profile_image: candidateData.profile_image,
      resume_file: candidateData.resume_file,
      profile_complete: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      preferred_locations: candidateData.preferred_locations,
      preferred_salary_ranges: candidateData.preferred_salary_ranges,
      preferred_job_types: candidateData.preferred_job_types,
      preferred_work_arrangements: candidateData.preferred_work_arrangements,
      linkedin: candidateData.linkedin,
      github: candidateData.github,
      portfolio: candidateData.portfolio,
      website: null,
      current_company: candidateData.current_company,
      projects: null,
      certifications: null,
    };
  }

  /**
   * Update the profile using new structured format
   */
  async updateProfile(data: UpdateCandidateProfileData): Promise<ProfileResponse> {
    // Transform to new nested format
    // Only include user_data fields that are provided
    const userData: Record<string, string | undefined> = {};
    if (data.first_name) userData.first_name = data.first_name;
    if (data.last_name) userData.last_name = data.last_name;
    if (data.email) userData.email = data.email;

    const requestBody = {
      user_data: Object.keys(userData).length > 0 ? userData : undefined,
      candidate_profile_data: {
        job_title: data.job_title,
        bio: data.bio,
        phone: data.phone,
        address: data.address,
        skills: data.skills,
        education: data.education,
        work_history: data.work_history,
        exp_level: data.exp_level,
        industry: data.industry,
        linkedin: data.linkedin,
        github: data.github,
        portfolio: data.portfolio,
        website: data.website,
        current_company: data.current_company,
        preferred_locations: data.preferred_locations,
        preferred_salary_ranges: data.preferred_salary_ranges,
        preferred_job_types: data.preferred_job_types,
        preferred_work_arrangements: data.preferred_work_arrangements,
        projects: data.projects,
        certifications: data.certifications,
      }
    };

    const response = await apiClient.request('/accounts/profile/', {
      method: 'PATCH',
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return await response.json();
  }

  /**
   * Upload profile image
   */
  async uploadProfileImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('profile_image', file);

    const response = await apiClient.request('/accounts/upload-profile-image/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile image');
    }

    const result = await response.json();
    return result.profile_image_url;
  }

  /**
   * Get filtered jobs matching candidate's preferences and industry/level classification
   */
  async getFilteredJobs(params?: { limit?: number; offset?: number }): Promise<FilteredJobsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const url = `/candidates/candidate-sort/filtered-jobs/${queryString ? '?' + queryString : ''}`;

    const response = await apiClient.request(url, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch filtered jobs');
    }

    return await response.json();
  }

  /**
   * Get queue-based jobs with ranking scores
   * @param category - Filter category: 'available', 'auto-matched', 'manual', 'saved'
   * @param params - Optional pagination params
   */
  async getQueueBasedJobs(
    category: 'available' | 'auto-matched' | 'manual' | 'saved',
    params?: { limit?: number; offset?: number }
  ): Promise<{
    success: boolean;
    count: number;
    results: any[];
    offset: number;
    limit: number;
    category: string;
    candidate_profile: {
      industry: string;
      exp_level: string;
      queue_buckets: Array<{ industry: string; level: string }>;
    };
  }> {
    const queryParams = new URLSearchParams();
    queryParams.append('category', category);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const url = `/candidates/candidate-sort/queue-jobs/?${queryString}`;

    const response = await apiClient.request(url, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[CandidateProfileService] getQueueBasedJobs failed: ${response.status}`, errorData);
      throw new Error(errorData.error || 'Failed to fetch queue-based jobs');
    }

    const data = await response.json();
    return data;
  }

  /**
   * Save a job for the candidate
   */
  async saveJob(jobId: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.request(`/candidates/save-job/${jobId}/`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save job');
    }

    return await response.json();
  }

  /**
   * Unsave a job for the candidate
   */
  async unsaveJob(jobId: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.request(`/candidates/save-job/${jobId}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to unsave job');
    }

    return await response.json();
  }

  /**
   * Convert skills array to comma-separated string for backend
   */
  skillsArrayToString(skills: string[]): string {
    return skills.join(', ');
  }

  /**
   * Convert skills string from backend to array for frontend
   */
  skillsStringToArray(skills: string): string[] {
    if (!skills) return [];
    return skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  /**
   * Convert experience level code to display text
   */
  expLevelToText(expLevel: string): string {
    const levels: Record<string, string> = {
      'L1': 'Entry Level (0-2 years)',
      'L2': 'Junior (2-4 years)',
      'L3': 'Mid Level (4-7 years)',
      'L4': 'Senior (7-10 years)',
      'L5': 'Expert (10+ years)',
    };
    return levels[expLevel] || 'Not specified';
  }

  /**
   * Convert display text or years to experience level code
   */
  textToExpLevel(experience: string): string {
    // If it contains years, try to parse
    const match = new RegExp(/(\d+)\+?\s*years?/i).exec(experience);
    if (match) {
      const years = Number.parseInt(match[1]);
      if (years <= 2) return 'L1';
      if (years <= 4) return 'L2';
      if (years <= 7) return 'L3';
      if (years <= 10) return 'L4';
      return 'L5';
    }
    // Check for keywords
    if (experience.toLowerCase().includes('entry')) return 'L1';
    if (experience.toLowerCase().includes('junior')) return 'L2';
    if (experience.toLowerCase().includes('mid')) return 'L3';
    if (experience.toLowerCase().includes('senior')) return 'L4';
    if (experience.toLowerCase().includes('expert')) return 'L5';
    return '';
  }

  /**
   * Transform backend profile to frontend format
   */
  transformProfileForFrontend(profile: CandidateProfile): Record<string, unknown> {
    return {
      firstName: profile.user.first_name,
      lastName: profile.user.last_name,
      email: profile.user.email,
      phone: profile.phone,
      location: profile.address,
      jobTitle: profile.job_title,
      title: profile.job_title, // alias
      industry: profile.industry,
      bio: profile.bio,
      summary: profile.bio, // alias
      experience: this.expLevelToText(profile.exp_level),
      expLevel: profile.exp_level,
      skills: this.skillsStringToArray(profile.skills),
      education: profile.education || [],
      experiences: profile.work_history || [],
      detailedExperience: profile.work_history || [],
      preferredLocations: profile.preferred_locations || ['No Preference'],
      preferredSalaryRanges: profile.preferred_salary_ranges || ['No Preference'],
      preferredJobTypes: profile.preferred_job_types || ['No Preference'],
      preferredWorkArrangements: profile.preferred_work_arrangements || ['No Preference'],
      profileImage: profile.profile_image,
      resumeFile: profile.resume_file,
      profileComplete: profile.profile_complete,
      // Optional social links and professional info
      linkedin: profile.linkedin || '',
      github: profile.github || '',
      portfolio: profile.portfolio || '',
      website: profile.website || '',
      currentCompany: profile.current_company || '',
      // Optional JSON fields
      projects: profile.projects || [],
      certifications: profile.certifications || [],
    };
  }

  /**
   * Transform frontend data to backend format
   */
  transformDataForBackend(data: Record<string, unknown>): UpdateCandidateProfileData {
    return {
      job_title: (data.jobTitle as string) || (data.title as string) || '',
      industry: (data.industry as string) || '',
      bio: (data.bio as string) || (data.summary as string) || '',
      phone: (data.phone as string) || '',
      address: (data.location as string) || '',
      skills: Array.isArray(data.skills) 
        ? this.skillsArrayToString(data.skills as string[])
        : (data.skills as string) || '',
      education: (data.education as EducationItem[]) || [],
      work_history: (data.experiences as WorkHistoryItem[]) || (data.detailedExperience as WorkHistoryItem[]) || [],
      exp_level: data.expLevel 
        ? (data.expLevel as string)
        : this.textToExpLevel((data.experience as string) || ''),
      preferred_locations: (data.preferredLocations as string[]) || ['No Preference'],
      preferred_salary_ranges: (data.preferredSalaryRanges as string[]) || ['No Preference'],
      preferred_job_types: (data.preferredJobTypes as string[]) || ['No Preference'],
      preferred_work_arrangements: (data.preferredWorkArrangements as string[]) || ['No Preference'],
      // Optional social links and professional info
      linkedin: (data.linkedin as string) || '',
      github: (data.github as string) || '',
      portfolio: (data.portfolio as string) || '',
      website: (data.website as string) || '',
      current_company: (data.currentCompany as string) || '',
      // Optional JSON fields
      projects: (data.projects as any[]) || [],
      certifications: (data.certifications as any[]) || [],
    };
  }

  /**
   * Get candidate count by industry and experience level
   */
  async getCandidateCountByIndustryLevel(industry?: string, experienceLevel?: string): Promise<{
    count: number;
    industry: string | undefined;
    experience_level: string | undefined;
  }> {
    const queryParams = new URLSearchParams();
    if (industry) queryParams.append('industry', industry);
    if (experienceLevel) queryParams.append('experience_level', experienceLevel);

    const queryString = queryParams.toString();
    const url = `/candidates/count/industry-level/${queryString ? '?' + queryString : ''}`;

    const response = await apiClient.request(url, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch candidate count');
    }

    return await response.json();
  }

  /**
   * Get candidate count for multiple industry/experience level combinations
   */
  async getCandidateCountByMultipleQueues(queues: Array<{
    industry: string;
    experience_level: string;
  }>): Promise<{
    total_count: number;
    queue_counts: Array<{
      industry: string;
      experience_level: string;
      count: number;
    }>;
  }> {
    const response = await apiClient.request('/candidates/count/multiple-queues/', {
      method: 'POST',
      body: JSON.stringify({ queues }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch candidate counts');
    }

    return await response.json();
  }

  /**
   * Get candidate profile analytics and insights
   */
  async getAnalytics(): Promise<{
    success: boolean;
    insights: {
      views: number;
      searchAppearances: number;
      recruiterEngagement: number;
      profileStrength: number;
    };
    quickStats: Array<{
      label: string;
      count: number | string;
      trend: string;
    }>;
  }> {
    const response = await apiClient.request('/accounts/profile/analytics/', {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch analytics');
    }

    return await response.json();
  }
}

export const candidateProfileService = new CandidateProfileService();
