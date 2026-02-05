import { JobApplication } from '../types/job';
import { JobCard } from './JobCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  title: string;
  status: JobApplication['status'];
  jobs: JobApplication[];
  onEditJob: (job: JobApplication) => void;
  onNavigateToJobDetails?: (job: JobApplication) => void;
}

export function KanbanColumn({ title, status, jobs, onEditJob, onNavigateToJobDetails }: Readonly<KanbanColumnProps>) {
  const getColumnColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'application-received': return 'bg-blue-50 border-blue-200';
      case 'not-considered': return 'bg-gray-50 border-gray-200';
      case 'under-consideration': return 'bg-yellow-50 border-yellow-200';
      case 'interview-stage': return 'bg-green-50 border-green-200';
      case 'rejected': return 'bg-red-50 border-red-200';
      case 'offer': return 'bg-emerald-50 border-emerald-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`rounded-lg border-2 border-dashed p-3 min-h-[450px] w-64 flex-shrink-0 ${getColumnColor(status)}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{title}</h3>
        <span className="text-sm text-muted-foreground bg-white px-2 py-1 rounded">
          {jobs.length}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onEdit={onEditJob} onNavigateToJobDetails={onNavigateToJobDetails} />
        ))}
      </div>
      
      {jobs.length === 0 && (
        <div className="flex items-center justify-center h-24 text-gray-400">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <p className="text-xs">Jobs appear here automatically</p>
          </div>
        </div>
      )}
    </div>
  );
}