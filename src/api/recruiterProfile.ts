import apiClient from './client';
import type { User } from './auth';

export interface RecruiterProfile {
  id: number;
  user: User;
  company: string;
  company_size: string;
  industry: string;
  department: string;
  website: string;
  institution: Record<string, unknown>;
  bio: string;
  phone: string;
  location: string;
  linkedin: string;
  profile_image: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateRecruiterProfileData {
  company?: string;
  company_size?: string;
  industry?: string;
  department?: string;
  website?: string;
  institution?: Record<string, unknown>;
  bio?: string;
  // User fields that can be updated
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  profile_image?: string;
}

// Company size options matching backend
export const COMPANY_SIZES = [
  { value: '1-50', label: '1-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-1000', label: '201-1,000 employees' },
  { value: '1000+', label: '1,000+ employees' },
];

// Industry options matching backend CandidateProfile.INDUSTRY_CHOICES
export const INDUSTRY_OPTIONS = [
  { value: 'accountant', label: 'Accountant' },
  { value: 'advocate', label: 'Advocate' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'arts', label: 'Arts' },
  { value: 'automobile', label: 'Automobile' },
  { value: 'aviation', label: 'Aviation' },
  { value: 'banking', label: 'Banking' },
  { value: 'bpo', label: 'Business Process Outsourcing' },
  { value: 'business-development', label: 'Business Development' },
  { value: 'chef', label: 'Chef' },
  { value: 'construction', label: 'Construction' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'designer', label: 'Designer' },
  { value: 'digital-marketing', label: 'Digital Marketing' },
  { value: 'education', label: 'Education' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'finance', label: 'Finance' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'information-technology', label: 'Information Technology' },
  { value: 'public-relations', label: 'Public Relations' },
  { value: 'sales', label: 'Sales' },
];

class RecruiterProfileService {
  /**
   * Get the current user's recruiter profile
   */
  async getProfile(): Promise<RecruiterProfile | null> {
    try {
      const response = await apiClient.request('/accounts/profile/', {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch recruiter profile');
      }

      const data = await response.json();
      return data as RecruiterProfile;
    } catch (error) {
      console.error('Error fetching recruiter profile:', error);
      return null;
    }
  }

  /**
   * Update the recruiter profile
   */
  async updateProfile(data: UpdateRecruiterProfileData): Promise<RecruiterProfile> {
    const response = await apiClient.request('/accounts/update-profile/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to update recruiter profile');
    }

    return await response.json() as RecruiterProfile;
  }

  /**
   * Transform backend profile to frontend format
   */
  transformProfileForFrontend(profile: RecruiterProfile): Record<string, unknown> {
    return {
      firstName: profile.user.first_name,
      lastName: profile.user.last_name,
      email: profile.user.email,
      phone: profile.phone || '', // Now stored in RecruiterProfile
      company: profile.company,
      title: profile.company, // For backwards compatibility
      companySize: profile.company_size,
      industry: profile.industry,
      department: profile.department,
      bio: profile.bio,
      location: profile.location || '', // Now stored in RecruiterProfile
      website: profile.website,
      institution: profile.institution,
      timezone: 'America/Los_Angeles', // Default, not stored in backend
      linkedin: profile.linkedin || '', // Now stored in RecruiterProfile
      profileImage: profile.profile_image || '', // Profile photo URL
    };
  }

  /**
   * Transform frontend data to backend format
   */
  transformDataForBackend(data: Record<string, unknown>): UpdateRecruiterProfileData {
    return {
      first_name: (data.firstName as string) || '',
      last_name: (data.lastName as string) || '',
      phone: (data.phone as string) || '',
      location: (data.location as string) || '',
      company: (data.company as string) || (data.title as string) || '',
      company_size: (data.companySize as string) || '',
      industry: (data.industry as string) || '',
      department: (data.department as string) || '',
      website: (data.website as string) || '',
      institution: (data.institution as Record<string, unknown>) || {},
      bio: (data.bio as string) || '',
      profile_image: (data.profileImage as string) || '',
    };
  }
}

export const recruiterProfileService = new RecruiterProfileService();
