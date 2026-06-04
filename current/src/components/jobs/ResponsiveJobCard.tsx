import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, DollarSign, Building, Clock, Heart, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  rank: string;
  postedTime: string;
  logo?: string;
  isFavorited: boolean;
  description: string;
  workModel: string;
  experienceLevel: string;
  companySize: string;
  companyIndustry: string;
}

interface ResponsiveJobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
  onSave?: (job: Job) => void;
  onDetails?: (job: Job) => void;
  compact?: boolean; // For mobile grid view
}

export function ResponsiveJobCard({ 
  job, 
  onApply, 
  onSave, 
  onDetails, 
  compact = false 
}: Readonly<ResponsiveJobCardProps>) {
  if (compact) {
    // Compact version for mobile grid
    return (
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onDetails?.(job)}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{job.title}</h3>
              <p className="text-xs text-gray-600 truncate">{job.company}</p>
            </div>
            <Avatar className="h-8 w-8 flex-shrink-0 ml-2">
              <AvatarImage src={job.logo} />
              <AvatarFallback className="text-xs">{job.company[0]}</AvatarFallback>
            </Avatar>
          </div>

          {/* Key Details */}
          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <DollarSign className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{job.salary}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {job.type}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              {job.workModel}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">{job.postedTime}</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e: { stopPropagation: () => void; }) => {
                  e.stopPropagation();
                  onSave?.(job);
                }}
                className="p-1 h-6 w-6"
              >
                <Heart className={`h-3 w-3 ${job.isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                size="sm"
                onClick={(e: { stopPropagation: () => void; }) => {
                  e.stopPropagation();
                  onApply?.(job);
                }}
                className="text-xs px-2 py-1 h-6"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Full version for desktop/tablet
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={job.logo} />
              <AvatarFallback>{job.company[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <button
                className="text-lg font-semibold text-gray-900 hover:text-[#ff6b35] text-left"
                onClick={() => onDetails?.(job)}
              >
                {job.title}
              </button>
              <p className="text-gray-600">{job.company}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500">{job.postedTime}</span>
                <Badge variant="secondary" className="text-xs">
                  {job.rank}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave?.(job)}
            className="flex-shrink-0"
          >
            <Heart className={`h-5 w-5 ${job.isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>

        {/* Description */}
        <p className="text-gray-700 line-clamp-2 text-sm leading-relaxed">
          {job.description}
        </p>

        {/* Key Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-[#ff6b35]" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 text-[#ff6b35]" />
            <span className="truncate">{job.salary}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Building className="h-4 w-4 mr-2 text-[#ff6b35]" />
            <span className="truncate">{job.companySize}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-[#ff6b35]" />
            <span className="truncate">{job.type}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {job.workModel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {job.experienceLevel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {job.companyIndustry}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => onApply?.(job)}
            className="flex-1 sm:flex-none bg-[#ff6b35] hover:bg-[#e55a2b]"
          >
            Apply Now
          </Button>
          <Button
            variant="outline"
            onClick={() => onDetails?.(job)}
            className="flex-1 sm:flex-none"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
