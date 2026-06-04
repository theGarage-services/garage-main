import { JobApplication } from '../types/job';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin, DollarSign, MessageCircle, Video, Crown } from 'lucide-react';

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onNavigateToJobDetails?: (job: JobApplication) => void;
}

export function JobCard({ job, onEdit, onNavigateToJobDetails }: JobCardProps) {
  const handleClick = () => {
    // If onNavigateToJobDetails is provided, navigate to job details
    // Otherwise, use the edit dialog (legacy behavior)
    if (onNavigateToJobDetails) {
      onNavigateToJobDetails(job);
    } else {
      onEdit(job);
    }
  };

  // Check if job has recruiter communication features
  const hasRecruiterContact = (job as any).hasRecruiterContact;
  const lastRecruiterMessage = (job as any).lastRecruiterMessage;
  const lastRecruiterMessageTime = (job as any).lastRecruiterMessageTime;
  const interviewScheduled = (job as any).interviewScheduled;
  const isPremiumCandidate = (job as any).applicationMethod === 'recruiter-consideration';

  return (
    <Card 
      className={`p-3 mb-2 hover:shadow-md transition-shadow cursor-pointer border-l-4 ${
        hasRecruiterContact ? 'border-l-[#ff6b35]' : 'border-l-blue-500'
      }`}
      onClick={handleClick}
    >
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{job.title}</h4>
            <div className="flex items-center gap-1">
              {isPremiumCandidate && (
                <span title="Premium consideration">
                  <Crown className="w-3 h-3 text-yellow-500" />
                </span>
              )}
              {hasRecruiterContact && (
                <span title="Recruiter contact">
                  <MessageCircle className="w-3 h-3 text-[#ff6b35]" />
                </span>
              )}
              {interviewScheduled && (
                <span title="Interview scheduled">
                  <Video className="w-3 h-3 text-green-600" />
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{job.company}</p>
        </div>
        
        {(job.location || job.salary) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{job.location}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>
        )}
        
        {hasRecruiterContact && lastRecruiterMessage && (
          <div className="p-2 bg-orange-50 border border-orange-200 rounded text-xs">
            <div className="flex items-center gap-1 mb-1">
              <MessageCircle className="w-3 h-3 text-[#ff6b35]" />
              <span className="font-medium text-[#ff6b35]">Recruiter message</span>
              <span className="text-gray-500">• {lastRecruiterMessageTime}</span>
            </div>
            <p className="text-gray-700">{lastRecruiterMessage}</p>
          </div>
        )}

        {interviewScheduled && (
          <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
            <div className="flex items-center gap-1 mb-1">
              <Video className="w-3 h-3 text-green-600" />
              <span className="font-medium text-green-700">Interview Scheduled</span>
            </div>
            <p className="text-gray-700">
              {new Date(interviewScheduled.date).toLocaleDateString()} at {interviewScheduled.time}
            </p>
            <p className="text-gray-600">{interviewScheduled.type} call • {interviewScheduled.duration} min</p>
          </div>
        )}

        {job.recruiterNotes && !hasRecruiterContact && (
          <div className="p-2 bg-muted rounded text-xs">
            <span className="font-medium">Recruiter: </span>
            {job.recruiterNotes}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Applied {new Date(job.dateApplied || job.dateAdded).toLocaleDateString()}</span>
          </div>
          
          {job.lastUpdated && (
            <Badge variant="secondary" className="text-xs">
              Updated {new Date(job.lastUpdated).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}