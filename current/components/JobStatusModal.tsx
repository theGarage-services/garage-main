import { X, Clock, Users, CheckCircle, TrendingUp, Calendar, MessageSquare, Crown, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface JobStatusModalProps {
  job: any;
  isPremium: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export function JobStatusModal({ job, isPremium, onClose, onUpgrade }: JobStatusModalProps) {
  const status = job.hiringStatus || {
    stage: 'open',
    positionsFilled: 0,
    totalPositions: job.numberOfCandidates || 1,
    applicationsCount: Math.floor(Math.random() * 200) + 50,
    interviewCount: Math.floor(Math.random() * 30) + 5,
    plannedInterviewCount: Math.floor(Math.random() * 40) + 10,
    customMessage: '',
    isVisible: true,
    lastUpdated: new Date().toISOString()
  };

  // Status stage information
  const stageInfo = {
    open: {
      title: 'Open - Accepting Applications',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    reviewing: {
      title: 'Reviewing Applications',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    interviewing: {
      title: 'Conducting Interviews',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    final: {
      title: 'Final Selection Phase',
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    partial: {
      title: 'Positions Partially Filled',
      icon: CheckCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    filled: {
      title: 'All Positions Filled',
      icon: CheckCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  };

  const currentStage = stageInfo[status.stage as keyof typeof stageInfo] || stageInfo.open;
  const Icon = currentStage.icon;

  // Calculate progress
  const progressPercentage = status.totalPositions > 0 
    ? (status.positionsFilled / status.totalPositions) * 100 
    : 0;

  // Format last updated time
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const updated = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  // Show upgrade prompt for basic users
  if (!isPremium) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Premium Feature</h2>
            <p className="text-gray-600">Get real-time hiring status updates for all job postings</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Current Hiring Stage</h3>
                <p className="text-sm text-gray-600">Know exactly where they are in the process</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Positions Filled vs Remaining</h3>
                <p className="text-sm text-gray-600">See how many spots are still available</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Application & Interview Counts</h3>
                <p className="text-sm text-gray-600">Understand the competition level</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Updates from Hiring Teams</h3>
                <p className="text-sm text-gray-600">Direct insights from recruiters</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onUpgrade || onClose}
              className="flex-1 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Starting at $9.99/month
          </p>
        </Card>
      </div>
    );
  }

  // Show detailed status for premium users
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 ${currentStage.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${currentStage.color}`} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
              <p className="text-sm text-gray-600">{job.company}</p>
            </div>
            <Badge className={`${currentStage.bgColor} ${currentStage.color} border ${currentStage.borderColor}`}>
              Active
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Stage */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              Current Hiring Stage
            </h3>
            <Card className={`p-4 ${currentStage.bgColor} border-2 ${currentStage.borderColor}`}>
              <p className={`font-medium ${currentStage.color}`}>{currentStage.title}</p>
            </Card>
          </div>

          {/* Hiring Progress */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              Hiring Progress
            </h3>
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Positions to fill</span>
                <span className="font-medium text-gray-900">{status.totalPositions}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Positions filled</span>
                <span className="font-medium text-green-600">{status.positionsFilled} ✓</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Positions remaining</span>
                <span className="font-medium text-[#ff6b35]">
                  {status.totalPositions - status.positionsFilled}
                </span>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-medium text-gray-900">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </Card>
          </div>

          {/* Application Metrics */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              Application Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-sm text-gray-600 mb-1">Applications Received</p>
                <p className="text-2xl font-semibold text-gray-900">{status.applicationsCount}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600 mb-1">In Interview Process</p>
                <p className="text-2xl font-semibold text-purple-600">{status.interviewCount}</p>
              </Card>
            </div>
          </div>

          {/* Interview Progress */}
          {status.stage === 'interviewing' && status.plannedInterviewCount > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                Interview Progress
              </h3>
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Interviewing candidates</span>
                  <span className="font-medium text-gray-900">
                    {status.interviewCount} of {status.plannedInterviewCount}
                  </span>
                </div>
                <Progress 
                  value={(status.interviewCount / status.plannedInterviewCount) * 100} 
                  className="h-2" 
                />
              </Card>
            </div>
          )}

          {/* Custom Message from Recruiter */}
          {status.customMessage && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                From the Hiring Team
              </h3>
              <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-gray-700 italic">"{status.customMessage}"</p>
              </Card>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-200">
            <Clock className="w-4 h-4" />
            <span>Updated {getTimeAgo(status.lastUpdated)} (automatic)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
