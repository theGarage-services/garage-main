export interface JobApplication {
  jobUrl: any;
  id: string;
  title: string;
  company: string;
  status: 'application-received' | 'not-considered' | 'under-consideration' | 'interview-stage' | 'rejected' | 'offer';
  dateAdded: string;
  dateApplied: string;
  lastUpdated: string;
  location: string;
  salary: string;
  notes?: string;
  recruiterNotes?: string;
  interviewDate?: string;
  interviewType?: 'phone' | 'video' | 'onsite';
  interviewNotes?: string;
}
