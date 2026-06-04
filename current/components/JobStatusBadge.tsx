import { useState } from 'react';
import { Activity, Clock, Users, CheckCircle, Lock } from 'lucide-react';
import { JobStatusModal } from './JobStatusModal';

interface JobStatusBadgeProps {
  job: any;
  isPremium: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function JobStatusBadge({ job, isPremium, size = 'md', showLabel = false }: JobStatusBadgeProps) {
  const [showModal, setShowModal] = useState(false);

  // Get status info from job
  const status = job.hiringStatus || {
    stage: 'open',
    isVisible: true,
    lastUpdated: new Date().toISOString()
  };

  // Don't show badge if status is not visible
  if (!status.isVisible) return null;

  // Status configuration
  const statusConfig = {
    open: {
      icon: Clock,
      label: 'Accepting',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      glowColor: 'shadow-green-500/50'
    },
    reviewing: {
      icon: Users,
      label: 'Reviewing',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      glowColor: 'shadow-blue-500/50'
    },
    interviewing: {
      icon: Activity,
      label: 'Interviewing',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      glowColor: 'shadow-purple-500/50'
    },
    final: {
      icon: CheckCircle,
      label: 'Final Stage',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      glowColor: 'shadow-orange-500/50'
    },
    partial: {
      icon: CheckCircle,
      label: 'Filling',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      glowColor: 'shadow-yellow-500/50'
    },
    filled: {
      icon: CheckCircle,
      label: 'Filled',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      glowColor: 'shadow-gray-500/50'
    }
  };

  const config = statusConfig[status.stage as keyof typeof statusConfig] || statusConfig.open;
  const Icon = config.icon;

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-6 h-6',
      icon: 'w-3 h-3',
      text: 'text-xs',
      padding: 'p-1'
    },
    md: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-xs',
      padding: 'p-1.5'
    },
    lg: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
      text: 'text-sm',
      padding: 'p-2'
    }
  };

  const sizing = sizeConfig[size];

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        className={`
          ${sizing.container} ${sizing.padding}
          ${config.bgColor} ${config.borderColor} ${config.color}
          border-2 rounded-full flex items-center justify-center
          cursor-pointer transition-all duration-300 hover:scale-110
          animate-pulse shadow-lg ${config.glowColor}
          ${showLabel ? 'px-3 w-auto gap-1.5' : ''}
        `}
        title={isPremium ? "View hiring status" : "Upgrade to view status"}
      >
        {!isPremium && <Lock className={`${sizing.icon} opacity-60`} />}
        {isPremium && <Icon className={sizing.icon} />}
        {showLabel && (
          <span className={`${sizing.text} font-medium whitespace-nowrap`}>
            {config.label}
          </span>
        )}
      </button>

      {showModal && (
        <JobStatusModal
          job={job}
          isPremium={isPremium}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
