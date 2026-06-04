import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { getJobInterviews, type Interview } from '@/api/interviews';
import { jobPostsApi } from '../../api/jobPosts';
import { JobHeader } from './details/JobHeader';
import { JobInfoCard } from './details/JobInfoCard';
import { RequirementsSection } from './details/RequirementsSection';
import { BenefitsSection } from './details/BenefitsSection';
import { JobDescriptionTabs } from './details/JobDescriptionTabs';
import { RecruiterContactCard } from './details/RecruiterContactCard';
import { ApplicationStatusCard } from './details/ApplicationStatusCard';
import { InterviewCard } from './details/InterviewCard';
import { RecruiterChat } from './details/RecruiterChat';
import { PremiumChatTeaser } from './details/PremiumChatTeaser';
import { NotesSection } from './details/NotesSection';

interface JobDetailsPageProps {
  onBack: () => void;
  user?: any;
  onNavigate?: (view: string) => void;
  onLogout?: () => void;
  onJobApplication?: (job: any, method: string) => void;
  onNavigateToQueueDetail?: (queue: any) => void;
  fromTracker?: boolean; // Track if navigated from tracker
  job?: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    rank?: string;
    postedTime?: string;
    logo?: string;
    description: string;
    requirements?: string[];
    benefits?: string[];
    skills?: string[];
    companySize?: string;
    companyIndustry?: string;
    workModel?: string;
    experienceLevel?: string;
    companyRating?: number;
    totalEmployees?: string;
    status?: 'application-received' | 'not-considered' | 'under-consideration' | 'interview-stage' | 'rejected' | 'offer'; // Application status from tracker
    recruiter?: {
      id: string;
      name: string;
      title: string;
      company: string;
      avatar: string;
      yearsExperience: number;
      contactInfo?: {
        email: string;
        phone: string;
      };
    };
    applicationMethod?: 'manual' | 'quick-apply' | 'recruiter-consideration';
    isApplied?: boolean;
    isSaved?: boolean;
    hasApplied?: boolean;
    applied?: boolean;
  };
}

export function JobDetailsPage({ onBack, user, onNavigate, onLogout, fromTracker = false, job: jobProp, onJobApplication }: Readonly<JobDetailsPageProps>) {
  const { id } = useParams<{ id: string }>();
  const isPremium = user?.isPremium || false;

  // State for job data
  const [jobData, setJobData] = useState<any>(jobProp || null);
  const [isLoading, setIsLoading] = useState(!jobProp);
  const [error, setError] = useState<string | null>(null);

  // Helper function to fetch recruiter profile
  const fetchRecruiterData = async (recruiterId: number, department: string | null, jobPostsApi: any) => {
    try {
      const recruiterResponse = await jobPostsApi.getRecruiterPublicProfile(recruiterId);
      if (recruiterResponse.success && recruiterResponse.data) {
        const r = recruiterResponse.data;
        return {
          id: String(recruiterId),
          name: r.name,
          title: r.title,
          company: r.company || department || '',
          avatar: r.avatar,
          yearsExperience: 5,
          contactInfo: { email: '', phone: '' }
        };
      }
    } catch (error_) {
      console.error('Failed to fetch recruiter profile:', error_);
    }
    return undefined;
  };

  // Helper function to transform API job data
  const transformJobData = (apiJob: any, recruiterData: any) => ({
    id: String(apiJob.id),
    title: apiJob.title,
    company: apiJob.department || 'Unknown Company',
    location: apiJob.location,
    salary: apiJob.salary_min && apiJob.salary_max
      ? `$${apiJob.salary_min}k - $${apiJob.salary_max}k`
      : 'Salary not specified',
    type: apiJob.employment_type || 'Full-time',
    description: apiJob.description,
    requirements: apiJob.requirements ? apiJob.requirements.split('\n').filter((r: string) => r.trim()) : [],
    benefits: apiJob.benefits ? apiJob.benefits.split('\n').filter((b: string) => b.trim()) : [],
    skills: apiJob.target_skills || [],
    companyIndustry: apiJob.industry || 'Technology',
    workModel: apiJob.work_arrangement || 'hybrid',
    experienceLevel: apiJob.experience_level || 'Mid Level',
    companySize: apiJob.department ? `${apiJob.department} Team` : 'Unknown',
    companyRating: 4,
    hasApplied: false,
    isApplied: false,
    applied: false,
    applicationMethod: 'manual' as const,
    recruiter: recruiterData
  });

  // Fetch job from API if not passed as prop
  useEffect(() => {
    if (jobProp) {
      setJobData(jobProp);
      setIsLoading(false);
      return;
    }

    if (!id) {
      setError('No job ID provided');
      setIsLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        const response = await jobPostsApi.getJobPostById(Number(id));

        if (!response.success || !response.data) {
          setError('Failed to load job details');
          return;
        }

        const apiJob = response.data;
        const recruiterData = apiJob.recruiter
          ? await fetchRecruiterData(apiJob.recruiter, apiJob.department, jobPostsApi)
          : undefined;

        setJobData(transformJobData(apiJob, recruiterData));
      } catch (err: any) {
        console.error('Error fetching job:', err);
        setError(err.message || 'Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, jobProp]);


  const [scheduledInterviews, setScheduledInterviews] = useState<Interview[]>([]);

  // Fetch scheduled interviews when job loads
  useEffect(() => {
    const fetchInterviews = async () => {
      if (!jobData?.id) return;

      try {
        const jobId = Number.parseInt(jobData.id, 10);
        const interviews = await getJobInterviews(jobId);
        setScheduledInterviews(interviews);
      } catch (error) {
        console.error('Failed to fetch scheduled interviews:', error);
      }
    };

    fetchInterviews();
  }, [jobData?.id]);

  const handleJoinCall = (meetingUrl: string) => {
    window.open(meetingUrl, '_blank');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
        <JobHeader
          onBack={onBack}
          onNavigate={onNavigate}
          onLogout={onLogout}
          fromTracker={fromTracker}
          isPremium={isPremium}
          user={user}
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-gray-600">Loading job details...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !jobData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
        <JobHeader
          onBack={onBack}
          onNavigate={onNavigate}
          onLogout={onLogout}
          fromTracker={fromTracker}
          isPremium={isPremium}
          user={user}
        />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h3 className="text-lg text-red-600 mb-2">Error Loading Job</h3>
            <p className="text-gray-600 mb-4">{error || 'Job not found'}</p>
            <Button onClick={onBack} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <JobHeader
        onBack={onBack}
        onNavigate={onNavigate}
        onLogout={onLogout}
        fromTracker={fromTracker}
        isPremium={isPremium}
        user={user}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <JobInfoCard
              jobData={jobData}
              isPremium={isPremium}
              fromTracker={fromTracker}
              onNavigate={onNavigate}
              onJobApplication={onJobApplication}
            />

            <RequirementsSection requirements={jobData.requirements} />

            <BenefitsSection benefits={jobData.benefits} />

            <JobDescriptionTabs
              description={jobData.description}
              company={jobData.company}
              companyIndustry={jobData.companyIndustry}
            />

            <RecruiterContactCard recruiter={jobData.recruiter} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <ApplicationStatusCard
              hasApplied={jobData.hasApplied || jobData.isApplied || false}
              applicationMethod={jobData.applicationMethod}
              isPremium={isPremium}
            />

            {scheduledInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onJoinCall={handleJoinCall}
              />
            ))}

            {(jobData.hasApplied || jobData.isApplied) ? (
              <RecruiterChat
                isPremium={isPremium}
                applicationMethod={jobData.applicationMethod}
                recruiter={jobData.recruiter}
                user={user}
              />
            ) : (
              <PremiumChatTeaser />
            )}

            <NotesSection />
          </div>
        </div>
      </div>
    </div>
  );
}
