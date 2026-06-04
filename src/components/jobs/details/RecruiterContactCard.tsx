import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

interface Recruiter {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string | null;
  yearsExperience: number;
  linkedinUrl?: string;
  contactInfo?: {
    email: string;
    phone: string;
  };
}

interface RecruiterContactCardProps {
  recruiter?: Recruiter;
}

export function RecruiterContactCard({ recruiter }: Readonly<RecruiterContactCardProps>) {
  if (!recruiter) return null;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruiter Contact</h3>
        <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={recruiter.avatar || ''} />
            <AvatarFallback>
              {recruiter.name?.split(' ').map(n => n[0]).join('') || ''}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{recruiter.name}</div>
            <div className="text-sm text-gray-600">{recruiter.title}</div>
            <div className="text-xs text-gray-500 mt-1">
              {recruiter.yearsExperience} years experience
            </div>
          </div>
          <div className="flex gap-2">
            {recruiter.contactInfo?.email && (
              <Button size="sm" variant="outline" className="text-xs">
                Email
              </Button>
            )}
            <Button size="sm" variant="outline" className="text-xs">
              <ExternalLink className="w-3 h-3 mr-1" />
              LinkedIn
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
