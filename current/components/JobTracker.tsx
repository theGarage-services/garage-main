import { useState } from 'react';
import { JobApplication } from '../types/job';
import { KanbanColumn } from './KanbanColumn';
import { JobDialog } from './JobDialog';
import { ApplicationsList } from './ApplicationsList';
import { CalendarView } from './CalendarView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { BarChart3, Lightbulb, Calendar, List, TrendingUp, Clock, Target } from 'lucide-react';
import { AppHeader } from './AppHeader';

// Sample data - Applications from job seeker's perspective
const initialJobs: JobApplication[] = [
  {
    id: '1',
    title: 'UI Designer',
    company: 'Tech Corp',
    status: 'application-received',
    dateAdded: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    dateApplied: new Date(Date.now() - 172800000).toISOString(),
    lastUpdated: new Date(Date.now() - 172800000).toISOString(),
    location: 'San Francisco, CA',
    salary: '$80k - $120k',
    notes: 'Applied through company website'
  },
  {
    id: '2',
    title: 'UX Writer',
    company: 'Design Studio',
    status: 'under-consideration',
    dateAdded: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    dateApplied: new Date(Date.now() - 345600000).toISOString(),
    lastUpdated: new Date(Date.now() - 86400000).toISOString(), // Updated yesterday
    location: 'Remote',
    salary: '$70k - $100k',
    notes: 'Submitted portfolio and writing samples',
    recruiterNotes: 'Portfolio review in progress'
  },
  {
    id: '3',
    title: 'Product Designer',
    company: 'Startup Inc',
    status: 'interview-stage',
    dateAdded: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    dateApplied: new Date(Date.now() - 604800000).toISOString(),
    lastUpdated: new Date(Date.now() - 43200000).toISOString(), // Updated 12 hours ago
    location: 'New York, NY',
    salary: '$90k - $130k',
    notes: 'Applied via LinkedIn',
    recruiterNotes: 'Phone screen scheduled for next week',
    interviewDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    interviewType: 'video',
    interviewNotes: 'Initial team interview with design lead'
  },
  {
    id: '4',
    title: 'Senior UX Designer',
    company: 'Creative Agency',
    status: 'interview-stage',
    dateAdded: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    dateApplied: new Date(Date.now() - 518400000).toISOString(),
    lastUpdated: new Date(Date.now() - 21600000).toISOString(), // Updated 6 hours ago
    location: 'Los Angeles, CA',
    salary: '$95k - $140k',
    notes: 'Found through company careers page',
    recruiterNotes: 'Moving to final round - portfolio review',
    interviewDate: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    interviewType: 'onsite',
    interviewNotes: 'Final round with creative director'
  }
];

interface TrackedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  applicationMethod: 'manual' | 'quick-apply' | 'recruiter-consideration';
  dateApplied: string;
  status: 'application-received' | 'not-considered' | 'under-consideration' | 'interview-stage' | 'rejected' | 'offer';
  notes?: string;
  recruiterNotes?: string;
  logo?: string;
  recruiter?: any;
  fullJobData?: any;
}

interface JobTrackerProps {
  onNavigate: (view: 'homepage' | 'job-tracker' | 'profile' | 'notifications' | 'settings' | 'support' | 'report-issue') => void;
  onNavigateToJobDetails?: (job: any) => void;
  trackedJobs: TrackedJob[];
  onUpdateTrackedJobs: (jobs: TrackedJob[]) => void;
  onBack?: () => void;
  user?: any;
  onLogout?: () => void;
}

export function JobTracker({ onNavigate, onNavigateToJobDetails, trackedJobs, onUpdateTrackedJobs, user, onLogout }: Readonly<JobTrackerProps>) {
  // Convert TrackedJob[] to JobApplication[] format for existing components
  const convertTrackedJobsToJobApplications = (tracked: TrackedJob[]): JobApplication[] => {
    return tracked.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      status: job.status,
      dateAdded: job.dateApplied,
      dateApplied: job.dateApplied,
      lastUpdated: job.dateApplied,
      location: job.location,
      salary: job.salary,
      notes: job.notes || `Applied via ${job.applicationMethod === 'quick-apply' ? 'Quick Apply' : job.applicationMethod === 'manual' ? 'Manual Application' : 'Recruiter Consideration'}`,
      recruiterNotes: job.recruiterNotes,
      // Additional fields
      applicationMethod: job.applicationMethod,
      logo: job.logo,
      recruiter: job.recruiter
    }));
  };

  // Use tracked jobs from parent, fallback to initial jobs for demo
  const jobs = trackedJobs.length > 0 ? convertTrackedJobsToJobApplications(trackedJobs) : initialJobs;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [newJobStatus] = useState<JobApplication['status']>('application-received');

  const columns = [
    { id: 'application-received', title: 'Application Received', status: 'application-received' as const },
    { id: 'not-considered', title: 'Not Considered', status: 'not-considered' as const },
    { id: 'under-consideration', title: 'Under Consideration', status: 'under-consideration' as const },
    { id: 'interview-stage', title: 'Interview Stage', status: 'interview-stage' as const },
    { id: 'rejected', title: 'Rejected', status: 'rejected' as const },
    { id: 'offer', title: 'Offer', status: 'offer' as const },
  ];

  // Jobs are automatically added when users apply or are selected by recruiters
  // No manual add functionality needed

  const handleEditJob = (job: JobApplication) => {
    setEditingJob(job);
    setDialogOpen(true);
  };

  const handleSaveJob = (jobData: Partial<JobApplication>) => {
    if (editingJob) {
      // Update existing job in tracked jobs
      const updatedTrackedJobs = trackedJobs.map(job => 
        job.id === editingJob.id 
          ? { 
              ...job, 
              notes: jobData.notes || job.notes,
              status: jobData.status || job.status,
              recruiterNotes: jobData.recruiterNotes || job.recruiterNotes
            }
          : job
      );
      onUpdateTrackedJobs(updatedTrackedJobs);
    }
    // Note: New jobs cannot be manually added - they come from applications
    setDialogOpen(false);
    setEditingJob(null);
  };

  const getJobsByStatus = (status: JobApplication['status']) => {
    return jobs.filter(job => job.status === status);
  };

  const totalApplications = jobs.length;
  const activeCount = jobs.filter(job => 
    job.status === 'under-consideration' || 
    job.status === 'interview-stage' || 
    job.status === 'offer'
  ).length;
  const interviewCount = jobs.filter(job => job.status === 'interview-stage').length;
  const offerCount = jobs.filter(job => job.status === 'offer').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <AppHeader
        userRole="job-seeker"
        user={user}
        currentView="job-tracker"
        onNavigate={onNavigate as (view: string) => void}
        onLogout={onLogout || (() => {})}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 border-2 border-orange-100/50 shadow-2xl shadow-orange-500/10 ring-1 ring-orange-100/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-medium text-gray-900 mb-3">Job Application Tracker</h1>
              <p className="text-xl text-gray-600">Track and manage your job applications through every stage</p>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-6 py-3">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-blue-900">Jobs appear here automatically</p>
                <p className="text-sm text-blue-700">When you apply or recruiters select you</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-blue-100/50 shadow-blue-500/10 ring-1 ring-blue-100/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-medium text-gray-900">{totalApplications}</span>
              </div>
              <p className="text-gray-600 font-medium">Total Applications</p>
              <div className="mt-2 text-xs text-blue-600 font-medium">+2 this week</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-orange-100/50 shadow-orange-500/10 ring-1 ring-orange-100/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-medium text-gray-900">{activeCount}</span>
              </div>
              <p className="text-gray-600 font-medium">Active Applications</p>
              <div className="mt-2 text-xs text-[#ff6b35] font-medium">In progress</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-green-100/50 shadow-green-500/10 ring-1 ring-green-100/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-medium text-gray-900">{interviewCount}</span>
              </div>
              <p className="text-gray-600 font-medium">Interviews Scheduled</p>
              <div className="mt-2 text-xs text-green-600 font-medium">Coming up</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-purple-100/50 shadow-purple-500/10 ring-1 ring-purple-100/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-medium text-gray-900">{offerCount}</span>
              </div>
              <p className="text-gray-600 font-medium">Offers Received</p>
              <div className="mt-2 text-xs text-purple-600 font-medium">Awaiting</div>
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="mb-8">
          <Alert className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200/50 rounded-2xl shadow-lg shadow-yellow-500/10 ring-1 ring-yellow-100/30">
            <Lightbulb className="h-5 w-5 text-[#ff6b35]" />
            <AlertDescription className="text-gray-700 font-medium">
              <strong className="text-[#ff6b35]">Pro Tip:</strong> Application statuses are updated by recruiters in real-time. Check the{' '}
              <span className="text-blue-600 font-medium">Applications</span>{' '}
              tab for detailed view or calendar for interview schedules.
            </AlertDescription>
          </Alert>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="phase" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border-2 border-gray-100/50 ring-1 ring-gray-100/30">
            <TabsTrigger 
              value="phase" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff6b35] data-[state=active]:to-[#ff8c42] data-[state=active]:text-white data-[state=active]:shadow-lg font-medium"
            >
              <BarChart3 className="w-4 h-4" />
              Phase View
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff6b35] data-[state=active]:to-[#ff8c42] data-[state=active]:text-white data-[state=active]:shadow-lg font-medium"
            >
              <List className="w-4 h-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff6b35] data-[state=active]:to-[#ff8c42] data-[state=active]:text-white data-[state=active]:shadow-lg font-medium"
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phase" className="mt-8">
            {/* Kanban Board */}
            <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px]">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  title={column.title}
                  status={column.status}
                  jobs={getJobsByStatus(column.status)}
                  onEditJob={handleEditJob}
                  onNavigateToJobDetails={onNavigateToJobDetails}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="mt-8">
            <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
              <ApplicationsList jobs={jobs} onEditJob={handleEditJob} />
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-8">
            <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
              <CalendarView jobs={jobs} onEditJob={handleEditJob} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Job Dialog */}
        <JobDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveJob}
          job={editingJob}
          initialStatus={newJobStatus}
          onNavigateToJobDetails={onNavigateToJobDetails}
          onNavigate={onNavigate as (view: string) => void}
        />
      </div>
    </div>
  );
}