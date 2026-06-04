import { Building, MapPin, Clock, Users, Briefcase, Star, Share2 } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { JobStatusBadge } from '../JobStatusBadge';

interface JobData {
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  logo?: string;
  postedTime?: string;
  workModel?: string;
  experienceLevel?: string;
  rank?: string;
  companySize?: string;
  companyIndustry?: string;
  companyRating?: number;
  hasApplied?: boolean;
  isApplied?: boolean;
  status?: string;
  hiringStatus?: {
    stage: string;
    isVisible: boolean;
    lastUpdated: string;
  };
}

interface JobInfoCardProps {
  jobData: JobData;
  isPremium: boolean;
  fromTracker: boolean;
  onNavigate?: (view: string) => void;
  onJobApplication?: (job: JobData, method: string) => void;
}

function getStatusBadgeClass(status: string): string {
  const statusMap: Record<string, string> = {
    'application-received': 'bg-blue-100 text-blue-800',
    'not-considered': 'bg-gray-100 text-gray-800',
    'under-consideration': 'bg-yellow-100 text-yellow-800',
    'interview-stage': 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    offer: 'bg-emerald-100 text-emerald-800'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
}

function formatStatusLabel(status: string): string {
  return status
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function JobInfoCard({
  jobData,
  isPremium,
  fromTracker,
  onNavigate,
  onJobApplication
}: Readonly<JobInfoCardProps>) {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {jobData.logo ? (
              <ImageWithFallback
                src={jobData.logo}
                alt={jobData.company}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
                <Building className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Job Title and Company */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-semibold text-gray-900">{jobData.title}</h1>
                <JobStatusBadge job={jobData} isPremium={isPremium} size="lg" />
              </div>
              {/* Application Status from Tracker */}
              {fromTracker && jobData.status && (
                <div className="mb-3">
                  <Badge className={`text-sm px-3 py-1 ${getStatusBadgeClass(jobData.status)}`}>
                    Status: {formatStatusLabel(jobData.status)}
                  </Badge>
                </div>
              )}
              <div className="flex items-center gap-4 text-gray-600 mb-3">
                <button
                  onClick={() => onNavigate?.('company-profile')}
                  className="flex items-center gap-1 hover:text-[#ff6b35] transition-colors"
                >
                  <Building className="w-4 h-4" />
                  <span className="font-medium underline decoration-dotted">{jobData.company}</span>
                </button>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{jobData.location}</span>
                </div>
                {jobData.postedTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{jobData.postedTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Job Details Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">{jobData.salary}</Badge>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{jobData.type}</Badge>
              {jobData.workModel && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  {jobData.workModel}
                </Badge>
              )}
              {jobData.experienceLevel && (
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                  {jobData.experienceLevel}
                </Badge>
              )}
              {jobData.rank && (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{jobData.rank}</Badge>
              )}
            </div>

            {/* Company Info */}
            {(jobData.companySize || jobData.companyIndustry || jobData.companyRating) && (
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                {jobData.companySize && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{jobData.companySize}</span>
                  </div>
                )}
                {jobData.companyIndustry && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{jobData.companyIndustry}</span>
                  </div>
                )}
                {jobData.companyRating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{jobData.companyRating}/5.0</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => onJobApplication?.(jobData, 'quick-apply')}
                className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white px-6"
              >
                {jobData.hasApplied || jobData.isApplied ? 'Applied ✓' : 'Quick Apply'}
              </Button>
              <Button variant="outline" className="border-gray-300">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
