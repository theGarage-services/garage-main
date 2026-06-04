import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { CheckCircle , LucideIcon } from 'lucide-react';

interface Queue {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  members: number;
  avgSalary: string;
  matchScore?: number;
  description: string;
  topSkills: string[];
  hiringTrends: string;
  responseRate: string;
}

interface QueueCardProps {
  queue: Queue;
  isSelected: boolean;
  onToggle: () => void;
  getQueueColor: (color: string) => string;
  compact?: boolean;
}

export function QueueCard({ queue, isSelected, onToggle, getQueueColor, compact = false }: Readonly<QueueCardProps>) {
  const IconComponent = queue.icon;

  if (compact) {
    return (
      <Card
        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-[#ff6b35] border-[#ff6b35] bg-orange-50' : 'hover:border-gray-300'
        }`}
        onClick={onToggle}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${getQueueColor(queue.color).replace('text-', 'text-').replace('border-', '')}`}
            >
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">{queue.name}</h3>
              <p className="text-xs text-gray-600">{queue.members.toLocaleString()} members</p>
            </div>
          </div>
          {isSelected && <CheckCircle className="w-4 h-4 text-[#ff6b35]" />}
        </div>

        <div className="text-xs text-gray-600 mb-2">{queue.description}</div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Avg. ${queue.avgSalary}</span>
          <span className="text-green-600">{queue.responseRate}</span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-[#ff6b35] border-[#ff6b35] bg-orange-50' : 'hover:border-gray-300'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${getQueueColor(queue.color).replace('text-', 'text-').replace('border-', '')}`}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{queue.name}</h3>
            <p className="text-sm text-gray-600">{queue.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {queue.matchScore && (
            <Badge className={`${getQueueColor(queue.color)} border`}>{queue.matchScore}% match</Badge>
          )}
          {isSelected && <CheckCircle className="w-5 h-5 text-[#ff6b35]" />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Members</p>
          <p className="font-medium text-gray-900">{queue.members.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Avg. Salary</p>
          <p className="font-medium text-gray-900">${queue.avgSalary}</p>
        </div>
        <div>
          <p className="text-gray-500">Response Rate</p>
          <p className="font-medium text-green-600">{queue.responseRate}</p>
        </div>
        <div>
          <p className="text-gray-500">Demand</p>
          <p className="font-medium text-gray-900">{queue.hiringTrends}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-2">Top Skills</p>
        <div className="flex flex-wrap gap-1">
          {queue.topSkills.slice(0, 3).map((skill, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {queue.topSkills.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{queue.topSkills.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
