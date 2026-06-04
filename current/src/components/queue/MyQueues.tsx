import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Edit3, Crown, Sparkles, Eye, Zap, X, Target, Bot } from 'lucide-react';
import { LiveProfileUpgrade } from '../landing/LiveProfileUpgrade';
import { BucketManager } from './BucketManager';

interface MyQueuesProps {
  onEditQueues?: () => void;
  onQueueClick?: (queue: any) => void;
  className?: string;
  onBack?: () => void;
  showAsPage?: boolean;
  user?: any;
}


interface QueueInfoBannerProps {
  showUpgradePreview: boolean;
  isPremium: boolean;
}

function QueueInfoBanner({ showUpgradePreview, isPremium }: Readonly<QueueInfoBannerProps>) {
  if (showUpgradePreview) {
    return (
      <p className="text-sm text-gray-700">
        <Sparkles className="w-4 h-4 text-purple-600 inline mr-1" />
        <span className="font-medium text-purple-600">Preview Mode:</span> See how profile upgrades could improve your queue positions.
        <br />
        <span className="font-medium text-[#ff6b35]">{isPremium ? 'Enhanced AI' : '3'} queues</span> {isPremium ? 'with premium features' : '+ AI recommendations'} with enhanced auto-apply matching.
      </p>
    );
  }

  if (isPremium) {
    return (
      <p className="text-sm text-gray-700">
        <span className="font-medium text-[#ff6b35]">3 AI-recommended queues + 2 manual queues</span> optimized for your profile with premium insights. These queues determine which jobs you get auto-applied to.
      </p>
    );
  }

  return (
    <p className="text-sm text-gray-700">
      <span className="font-medium text-[#ff6b35]">3 AI-recommended queues</span> automatically optimized based on your profile and preferences.
      <span className="ml-2 text-orange-600 font-medium">
        Upgrade to Premium to add 2 manual queues of your choice!
      </span>
    </p>
  );
}

interface ProfileImprovementSectionProps {
  showUpgradePreview: boolean;
  isPremium: boolean;
  userQueues: string[];
  onClosePreview: () => void;
}

function ProfileImprovementSection({
  showUpgradePreview,
  isPremium,
  userQueues,
  onClosePreview
}: Readonly<ProfileImprovementSectionProps>) {
  if (!showUpgradePreview) return null;

  if (isPremium) {
    return (
      <div className="mb-6">
        <LiveProfileUpgrade
          userQueues={userQueues}
          onSimulationComplete={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 via-orange-50 to-blue-50 rounded-xl border-2 border-blue-200 relative">
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <Crown className="w-5 h-5 text-orange-500" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onClosePreview}
          className="rounded-full w-8 h-8 p-0 hover:bg-blue-100"
        >
          <X className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
      <div className="pr-16">
        <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Profile Improvement Simulator
        </h3>

        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-3">
            The <strong>Profile Improvement Simulator</strong> shows you exactly how adding skills, certifications, or experience would improve your queue rankings.
          </p>

          <div className="bg-white/80 rounded-lg p-4 mb-4 border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              What You'll Discover:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Your new queue ranking after adding specific skills</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Which certifications would boost you the most</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Estimated time to improve your position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Priority recommendations based on your profile</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 mb-4 border border-orange-200">
            <p className="text-sm text-orange-800">
              <strong>Example:</strong> Adding &quot;AWS Certification&quot; could move you from position #87 to #69 in the Data Engineer queue, improving your chances by 25%!
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            <strong>Upgrade to Premium</strong> to see your personalized improvement predictions and new rankings across all your queues.
          </p>
        </div>

        <Button
          size="sm"
          className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white shadow-lg"
          onClick={() => alert('Upgrade to Premium to unlock Profile Improvement Simulator and see your new rankings!')}
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to See Your New Rankings
        </Button>
      </div>
    </div>
  );
}

interface BasicUserNoticeProps {
  userQueues: string[];
  onTrySimulator: () => void;
}

function BasicUserNotice({ userQueues, onTrySimulator }: Readonly<BasicUserNoticeProps>) {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Basic Plan - AI Queues Only</h3>
            <p className="text-sm text-gray-600">
              You have <span className="font-medium">{userQueues.length} AI-recommended queues</span> optimized for your profile.
              <span className="text-orange-600 font-medium ml-1">Upgrade to Premium to add 2 manual queues of your choice!</span>
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-blue-500 text-blue-600 hover:bg-blue-50"
          onClick={onTrySimulator}
        >
          <Eye className="w-4 h-4 mr-2" />
          Try Simulator Info
        </Button>
      </div>
    </div>
  );
}


export function MyQueues({ onEditQueues, onQueueClick, className = "", showAsPage = false, user }: Readonly<MyQueuesProps>) {
  
  // NEW STRUCTURE:
  // Basic users: 3 AI queues (data-engineer, product-analyst, business-intelligence)
  // Premium users: 3 AI queues + 2 manual queues (senior-analyst, machine-learning)
  const isPremium = user?.isPremium || false;
  
  // User's selected queue IDs - fetched from API
  const [userQueues, setUserQueues] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Fetch user's selected queue IDs from backend when endpoint is available
    setUserQueues([]);
  }, []);

  const [showUpgradePreview, setShowUpgradePreview] = useState(false);

  // Function to handle opening preferences modal

  // Function to handle saving queue preferences

  const content = (
    <div className={className}>
      {/* My Queues Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-medium text-gray-900">My Queues ({userQueues.length})</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Profile Improvement Preview Toggle - Premium Only */}
            {isPremium && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-orange-50 rounded-full px-4 py-2 border border-blue-200/50">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Preview Improvements</span>
                <Switch
                  checked={showUpgradePreview}
                  onCheckedChange={setShowUpgradePreview}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#ff6b35] data-[state=checked]:to-[#ff8c42]"
                />
                <Zap className="w-4 h-4 text-orange-500" />
              </div>
            )}
            {onEditQueues && (
              <Button
                size="sm"
                variant="outline"
                className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white shadow-sm"
                onClick={onEditQueues}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Queues
              </Button>
            )}
          </div>
        </div>

        {/* Queue Info */}
        <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
          <QueueInfoBanner showUpgradePreview={showUpgradePreview} isPremium={isPremium} />
        </div>

        {/* Profile Improvement Preview Section */}
        <ProfileImprovementSection
          showUpgradePreview={showUpgradePreview}
          isPremium={isPremium}
          userQueues={userQueues}
          onClosePreview={() => setShowUpgradePreview(false)}
        />

        {/* Basic User Limitation Notice */}
        {!isPremium && <BasicUserNotice userQueues={userQueues} onTrySimulator={() => setShowUpgradePreview(true)} />}

        {/* AI Bucket Predictions */}
        <div className="mb-8">
          <BucketManager
            user={user}
            onBucketSelect={(bucket) => {
              // Forward bucket selection to parent for queue ranking view
              onQueueClick?.({
                id: bucket.industry,
                title: bucket.industry,
                level: bucket.predicted_level,
                industry: bucket.industry,
              });
            }}
          />
        </div>
      </div>
    </div>
  );

  // If used as a standalone page, wrap with proper page structure
  if (showAsPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
