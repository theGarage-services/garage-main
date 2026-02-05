export interface JobApplication {
  id: string;
  title: string;
  company: string;
  status: 'application-received' | 'not-considered' | 'under-consideration' | 'interview-stage' | 'rejected' | 'offer';
  dateAdded: string;
  dateApplied?: string;
  lastUpdated?: string;
  notes?: string;
  salary?: string;
  location?: string;
  jobUrl?: string;
  recruiterNotes?: string;
  interviewDate?: string;
  interviewType?: 'phone' | 'video' | 'onsite';
  interviewNotes?: string;
  // Application tracking fields
  applicationMethod?: 'manual' | 'quick-apply' | 'recruiter-consideration';
  isApplied?: boolean;
  isSaved?: boolean;
  hasApplied?: boolean;
}

export interface Column {
  id: string;
  title: string;
  status: JobApplication['status'];
  count: number;
}