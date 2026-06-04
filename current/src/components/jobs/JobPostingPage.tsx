import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Step1BasicInfo } from './posting/Step1BasicInfo';
import { Step2Description } from './posting/Step2Description';
import { Step3Queues } from './posting/Step3Queues';
import { Step4Advanced } from './posting/Step4Advanced';
import { Step5Review } from './posting/Step5Review';
import { useJobPDFParser } from '../../hooks/useJobPDFParser';
import { ArrowLeft, Plus, Eye, CheckCircle, Code } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { JobData, ExperienceLevel, EducationLevel } from '../../api/jobPosts';
import { jobPostsApi } from '../../api/jobPosts';

interface JobPostingPageProps {
  onBack: () => void;
  user: any;
}

interface Queue {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  members: number;
  avgSalary: string;
  matchPercentage: number;
  description: string;
  topSkills: string[];
  hiringTrends: string;
  responseRate: string;
}

const steps = [
  { id: 1, title: 'Basic Information', subtitle: 'Job title, location, and compensation' },
  { id: 2, title: 'Job Details', subtitle: 'Description, requirements, and responsibilities' },
  { id: 3, title: 'Queue Targeting', subtitle: 'Select job seeker queues to target' },
  { id: 4, title: 'Advanced Settings', subtitle: 'Deadlines, requirements, and preferences' },
  { id: 5, title: 'Review & Publish', subtitle: 'Final review before posting' }
];

// Queues will be fetched dynamically from API based on ML predictions

export function JobPostingPage({ onBack, user }: Readonly<JobPostingPageProps>) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedJobId, setSavedJobId] = useState<number | null>(null);
  const [availableQueues, setAvailableQueues] = useState<Queue[]>([]);
  const [isLoadingQueues, setIsLoadingQueues] = useState(false);
  const [platformStats, setPlatformStats] = useState({
    activeJobSeekers: 41237,
    avgResponseTime: 2.3,
    matchSuccessRate: 87
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [jobData, setJobData] = useState<JobData>({
    title: '',
    department: '',
    location: '',
    industry: '',
    workArrangement: 'hybrid',
    employmentType: 'full-time',
    salaryMin: '',
    salaryMax: '',
    currency: 'CAD' as const,
    experienceLevel: '' as ExperienceLevel | '',
    educationLevel: '' as EducationLevel | '',
    summary: '',
    description: '',
    responsibilities: '',
    requirements: '',
    niceToHave: '',
    benefits: '',
    selectedQueues: [] as string[],
    targetingMode: 'recommended' as 'recommended' | 'manual',
    applicationDeadline: '',
    startDate: '',
    isUrgent: false,
    requiresCoverLetter: false,
    requiresPortfolio: false,
    portfolioSubmissionType: 'link' as 'link' | 'document',
    portfolioDescription: '',
    numberOfCandidates: '1',
    interviewRounds: {
      'phone-screening': 0,
      'technical-interview': 0,
      'final-interview': 0
    },
    hiringManager: '',
    recruiterNotes: '',
    internalJobCode: ''
  });

  const {
    fileInputRef,
    uploadedFile,
    isParsingPDF,
    parsedContent,
    showParsedData,
    handleFileUpload,
    discardParsedData,
    applyParsedData
  } = useJobPDFParser();

  // Fetch real queue statistics from API
  const fetchRecommendedQueues = async () => {
    setIsLoadingQueues(true);
    try {
      const response = await jobPostsApi.getQueueStats();

      if (response.success && response.data) {
        // Transform API queue data to component format
        const queues: Queue[] = response.data.map((queue, index) => ({
          id: queue.id,
          name: queue.name,
          icon: Code,
          color: ['blue', 'purple', 'green', 'orange', 'cyan'][index % 5],
          members: queue.members,
          avgSalary: `$${Math.round((queue.avg_salary_min + queue.avg_salary_max) / 2000)}k`,
          matchPercentage: queue.match_score || Math.round(70 + Math.random() * 25),
          description: queue.description,
          topSkills: queue.top_skills || [],
          hiringTrends: queue.hiring_trend,
          responseRate: queue.response_rate
        }));
        setAvailableQueues(queues);
      }
    } catch (error) {
      console.error('Failed to fetch queue stats:', error);
    } finally {
      setIsLoadingQueues(false);
    }
  };

  // Fetch queues on component mount
  useEffect(() => {
    fetchRecommendedQueues();
  }, []);

  // Fetch platform stats on component mount
  useEffect(() => {
    const fetchPlatformStats = async () => {
      setIsLoadingStats(true);
      try {
        const response = await jobPostsApi.getPlatformStats();
        if (response.success && response.data) {
          setPlatformStats({
            activeJobSeekers: response.data.active_job_seekers,
            avgResponseTime: response.data.avg_response_time_days,
            matchSuccessRate: response.data.match_success_rate
          });
        }
      } catch (error) {
        console.error('Failed to fetch platform stats:', error);
        // Keep default values on error
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchPlatformStats();
  }, []);

  const queueColorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    pink: 'bg-pink-100 text-pink-800 border-pink-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  };

  const getQueueColor = (color: string): string => queueColorMap[color] || queueColorMap.blue;

  const validateBasicInfo = (errors: Record<string, string>) => {
    if (!jobData.title.trim()) errors.title = 'Job title is required';
    if (!jobData.department) errors.department = 'Department is required';
    if (!jobData.location.trim()) errors.location = 'Location is required';
    if (!jobData.salaryMin.trim()) errors.salaryMin = 'Minimum salary is required';
    if (!jobData.salaryMax.trim()) errors.salaryMax = 'Maximum salary is required';
  };

  const validateDescription = (errors: Record<string, string>) => {
    if (!jobData.summary.trim()) errors.summary = 'Job summary is required';
    if (!jobData.description.trim()) errors.description = 'Job description is required';
    if (!jobData.requirements.trim()) errors.requirements = 'Requirements are required';
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) validateBasicInfo(newErrors);
    else if (step === 2) validateDescription(newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    // Save job as draft when moving between steps
    if (currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === 4) {
      setIsSubmitting(true);
      try {
        let response;
        
        // Update existing job if savedJobId exists, otherwise create new
        if (savedJobId) {
          response = await jobPostsApi.updateJobPost(savedJobId, jobData);
        } else {
          response = await jobPostsApi.createJobPost(jobData);
        }

        if (response.success) {
          setSavedJobId(response.data.id);
          setCurrentStep(currentStep + 1);
        } else {
          console.error('Failed to save job:', response.message);
          // Could add toast notification here
        }
      } catch (error) {
        console.error('Error saving job:', error);
        // Could add toast notification here
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (action: 'draft' | 'publish') => {
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);
    try {
      let response;
      if (action === 'draft') {
        // Save as draft
        response = await jobPostsApi.createJobPost(jobData);
      } else {
        // Publish with ML prediction
        response = await jobPostsApi.createJobPostWithPrediction(jobData);
      }

      if (response.success) {
        console.log(`${action === 'draft' ? 'Draft saved' : 'Job published'}:`, response.data);
        onBack();
      } else {
        console.error('Failed to save job:', response.message);
        // Could add toast notification here
      }
    } catch (error) {
      console.error('Error submitting job:', error);
      // Could add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyParsedData = () => {
    applyParsedData((data) => {
      setJobData(prev => ({ ...prev, ...data } as JobData));
      if (currentStep === 1) {
        setCurrentStep(2);
      }
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            jobData={jobData}
            setJobData={setJobData}
            errors={errors}
            fileInputRef={fileInputRef}
            uploadedFile={uploadedFile}
            isParsingPDF={isParsingPDF}
            parsedContent={parsedContent}
            showParsedData={showParsedData}
            onFileUpload={handleFileUpload}
            onApplyParsedData={handleApplyParsedData}
            onDiscardParsedData={discardParsedData}
            onTriggerFileInput={() => fileInputRef.current?.click()}
          />
        );
      case 2:
        return <Step2Description jobData={jobData} setJobData={setJobData} errors={errors} />;
      case 3:
        return (
          <Step3Queues
            jobData={jobData}
            setJobData={setJobData}
            errors={errors}
            availableQueues={availableQueues}
            recommendedQueues={availableQueues}
            isLoadingQueues={isLoadingQueues}
            getQueueColor={getQueueColor}
            onBackToBasicInfo={() => setCurrentStep(1)}
            savedJobId={savedJobId}
          />
        );
      case 4:
        return <Step4Advanced jobData={jobData} setJobData={setJobData} />;
      case 5:
        return (
          <Step5Review
            jobData={jobData}
            user={user}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-medium text-gray-900">Create Job Posting</h1>
                  <p className="text-sm text-gray-500">
                    Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <div className="text-sm text-gray-500">Auto-saved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-medium text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        currentStep > step.id
                          ? 'bg-green-100 text-green-800'
                          : currentStep === step.id
                          ? 'bg-[#ff6b35] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{step.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Platform Insights</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Active Job Seekers</span>
                    <span className="font-medium text-gray-900">
                      {isLoadingStats ? '...' : platformStats.activeJobSeekers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avg. Response Time</span>
                    <span className="font-medium text-gray-900">
                      {isLoadingStats ? '...' : `${platformStats.avgResponseTime} days`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Match Success Rate</span>
                    <span className="font-medium text-green-600">
                      {isLoadingStats ? '...' : `${platformStats.matchSuccessRate}%`}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              {renderStep()}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
                <div className="flex items-center gap-2">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Step {currentStep} of {steps.length}
                  </span>
                  <Progress value={(currentStep / steps.length) * 100} className="w-24" />
                </div>

                <div className="flex items-center gap-2">
                  {currentStep < steps.length && (
                    <Button onClick={handleNext} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                      Next
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
