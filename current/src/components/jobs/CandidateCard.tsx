import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Calendar, Clock, Eye, Mail, Phone } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  avatar: string | null;
  status: string;
  appliedDate: string;
  lastUpdated: string;
  source: string;
  matchScore?: number;
  email: string;
  phone: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  getStatusBadge: (status: string) => React.ReactNode;
  getDaysAgo: (dateString: string) => string;
  onViewProfile?: (candidate: Candidate) => void;
}

export function CandidateCard({
  candidate,
  getStatusBadge,
  getDaysAgo,
  onViewProfile
}: Readonly<CandidateCardProps>) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-orange-100 text-orange-700">
              {candidate.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg text-gray-900 mb-1">{candidate.name}</h3>
            <p className="text-gray-600 mb-2">{candidate.title}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                📍 {candidate.location}
              </span>
              <span className="flex items-center gap-1">
                💼 {candidate.experience}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Applied {getDaysAgo(candidate.appliedDate)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Updated {getDaysAgo(candidate.lastUpdated)}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          {getStatusBadge(candidate.status)}
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {candidate.source}
            </Badge>
          </div>
          {candidate.matchScore && (
            <div className="mt-2 text-xs text-gray-500">
              Match: {candidate.matchScore}%
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {candidate.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {candidate.phone}
          </span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewProfile?.(candidate)}
          className="text-orange-600 border-orange-300 hover:bg-orange-50"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Profile
        </Button>
      </div>
    </Card>
  );
}
