import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Edit3, TrendingUp, Database, BarChart3, Brain, Target, ChartBar, Bot, Crown, Sparkles, Eye, Zap, X } from 'lucide-react';
import { LiveProfileUpgrade } from './LiveProfileUpgrade';

interface MyQueuesProps {
  onEditQueues?: () => void;
  onQueueClick?: (queue: any) => void;
  className?: string;
  onBack?: () => void;
  showAsPage?: boolean;
  user?: any;
}

export function MyQueues({ onEditQueues, onQueueClick, className = "", showAsPage = false, user }: Readonly<MyQueuesProps>) {
  
  // NEW STRUCTURE:
  // Basic users: 3 AI queues (data-engineer, product-analyst, business-intelligence)
  // Premium users: 3 AI queues + 2 manual queues (senior-analyst, machine-learning)
  const isPremium = user?.isPremium || false;
  
  const basicUserQueues = ['data-engineer', 'product-analyst', 'business-intelligence'];
  const premiumUserQueues = ['data-engineer', 'product-analyst', 'business-intelligence', 'senior-analyst', 'machine-learning'];
  
  const [userQueues] = useState<string[]>(isPremium ? premiumUserQueues : basicUserQueues);

  const [showUpgradePreview, setShowUpgradePreview] = useState(false);
  const [simulatedQueues, setSimulatedQueues] = useState<any>(null);

  // All available job queues with dynamic ranking
  // NEW STRUCTURE: All basic users get AI queues, premium users can add manual ones
  const allJobQueues = [
    // AI-Recommended Queues (All Users Get These)
    { 
      id: 'data-engineer',
      title: 'Data Engineer Queue', 
      description: 'Advanced data pipeline and infrastructure roles',
      current: 87, 
      total: 255, 
      trend: 'up',
      icon: Database,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      category: 'AI Recommended',
      isAuto: true,
      userSelected: false,
      match: 92,
      change: 8,
      reason: 'Matches your technical skills and data engineering background',
      // Upgraded preview data
      upgradedCurrent: 15,
      upgradedMatch: 97,
      upgradedChange: 45
    },
    { 
      id: 'product-analyst',
      title: 'Product Analyst Queue', 
      description: 'Product-focused analytics and growth roles',
      current: 62, 
      total: 140, 
      trend: 'up',
      icon: Target,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      category: 'AI Recommended',
      isAuto: true,
      userSelected: false,
      match: 85,
      change: 15,
      reason: 'Based on your business analytics skills and experience with stakeholder collaboration',
      // Upgraded preview data
      upgradedCurrent: 12,
      upgradedMatch: 94,
      upgradedChange: 33
    },
    { 
      id: 'business-intelligence',
      title: 'BI Developer Queue', 
      description: 'Business intelligence and reporting solutions',
      current: 34, 
      total: 95, 
      trend: 'up',
      icon: ChartBar,
      color: 'bg-gradient-to-r from-teal-500 to-teal-600',
      category: 'AI Recommended',
      isAuto: true,
      userSelected: false,
      match: 90,
      change: 6,
      reason: 'Perfect match for your Tableau expertise and financial services background',
      // Upgraded preview data
      upgradedCurrent: 6,
      upgradedMatch: 98,
      upgradedChange: 29
    },
    // Manual Queues (Premium Only)
    { 
      id: 'senior-analyst',
      title: 'Senior Data Analyst', 
      description: 'Leadership roles in analytics and business intelligence',
      current: 45, 
      total: 180, 
      trend: 'up',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      category: 'Manual Selection',
      isAuto: false,
      userSelected: true,
      match: 88,
      change: 12,
      // Upgraded preview data
      upgradedCurrent: 8,
      upgradedMatch: 95,
      upgradedChange: 38
    },
    { 
      id: 'machine-learning',
      title: 'ML Engineer Queue', 
      description: 'Machine learning and AI engineering positions',
      current: 23, 
      total: 120, 
      trend: 'stable',
      icon: Brain,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      category: 'Manual Selection',
      isAuto: false,
      userSelected: true,
      match: 75,
      change: 0,
      // Upgraded preview data
      upgradedCurrent: 5,
      upgradedMatch: 91,
      upgradedChange: 42
    }
  ];

  // Filter to show only user's selected queues
  const jobQueues = allJobQueues.filter(queue => userQueues.includes(queue.id));

  // Function to handle profile simulation from LiveProfileUpgrade
  const handleSimulationComplete = (simulationResults: any) => {
    setSimulatedQueues(simulationResults);
  };

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
          <p className="text-sm text-gray-700">
            {showUpgradePreview ? (
              <>
                <Sparkles className="w-4 h-4 text-purple-600 inline mr-1" />
                <span className="font-medium text-purple-600">Preview Mode:</span> See how profile upgrades could improve your queue positions. 
                <br />
                <span className="font-medium text-[#ff6b35]">{isPremium ? 'Enhanced AI' : '3'} queues</span> {isPremium ? 'with premium features' : '+ AI recommendations'} with enhanced auto-apply matching.
              </>
            ) : (
              <>
                {isPremium ? (
                  <><span className="font-medium text-[#ff6b35]">3 AI-recommended queues + 2 manual queues</span> optimized for your profile with premium insights. These queues determine which jobs you get auto-applied to.</>
                ) : (
                  <><span className="font-medium text-[#ff6b35]">3 AI-recommended queues</span> automatically optimized based on your profile and preferences. 
                  <span className="ml-2 text-orange-600 font-medium">
                    Upgrade to Premium to add 2 manual queues of your choice!
                  </span></>
                )}
              </>
            )}
          </p>
        </div>

        {/* Profile Improvement Preview Notice - Now inline with queue cards */}
        {showUpgradePreview && isPremium && (
          <div className="mb-6">
            <LiveProfileUpgrade 
              onSimulationComplete={handleSimulationComplete}
              userQueues={userQueues}
              allJobQueues={allJobQueues}
            />
          </div>
        )}

        {/* Profile Improvement Preview Notice - Basic Users */}
        {showUpgradePreview && !isPremium && (
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 via-orange-50 to-blue-50 rounded-xl border-2 border-blue-200 relative">
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Crown className="w-5 h-5 text-orange-500" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpgradePreview(false)}
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
                    <strong>💡 Example:</strong> Adding "AWS Certification" could move you from position #87 to #69 in the Data Engineer queue, improving your chances by 25%!
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
        )}

        {/* Basic User Limitation Notice */}
        {!isPremium && (
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
                onClick={() => setShowUpgradePreview(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Try Simulator Info
              </Button>
            </div>
          </div>
        )}

        {/* Queue Grid */}
        <div className={`grid gap-6 ${
          jobQueues.length === 5 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5' :
          jobQueues.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
          jobQueues.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
          'grid-cols-1 md:grid-cols-2'
        }`}>
          {jobQueues.map((queue) => {
            const IconComponent = queue.icon;
            
            // Use simulated data if available, otherwise use improved data in preview mode
            const simulatedData = simulatedQueues?.queues?.[queue.id];
            const displayCurrent = simulatedData?.newPosition || (showUpgradePreview ? queue.upgradedCurrent : queue.current);
            const displayMatch = simulatedData?.newMatch || (showUpgradePreview ? queue.upgradedMatch : queue.match);
            const displayChange = simulatedData?.improvement || (showUpgradePreview ? queue.upgradedChange : queue.change);
            const isImprovementPreview = showUpgradePreview;
            const isNewQueue = simulatedData?.isNewQueue;
            const oldQueueTitle = simulatedData?.oldQueueTitle;
            
            return (
              <Card
                key={queue.id}
                className={`group p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 ring-1 ring-transparent hover:ring-orange-200/50 bg-white/80 backdrop-blur-sm hover:border-orange-200 ${
                  isImprovementPreview 
                    ? 'border-blue-200 bg-gradient-to-br from-blue-50/50 to-orange-50/50 ring-blue-200/30' 
                    : 'border-gray-100'
                }`}
                onClick={() => onQueueClick?.(queue)}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 ${queue.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 ${
                      isImprovementPreview ? 'ring-2 ring-blue-300/50' : ''
                    }`}>
                      <IconComponent className="w-7 h-7 text-white" />
                      {isImprovementPreview && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isImprovementPreview && (
                        <span title="Improved Position">
                          <Zap className="w-4 h-4 text-orange-500" />
                        </span>
                      )}
                      {queue.isAuto && (
                        <span title="Auto-selected by AI">
                          <Bot className="w-4 h-4 text-blue-500" />
                        </span>
                      )}
                      <div className={`w-3 h-3 rounded-full ${
                        isImprovementPreview ? 'bg-blue-500' :
                        queue.trend === 'up' ? 'bg-green-500' : 
                        queue.trend === 'down' ? 'bg-red-500' : 
                        'bg-yellow-500'
                      } animate-pulse`}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {isNewQueue && oldQueueTitle ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-gray-400 line-through">{oldQueueTitle}</h3>
                          <span className="text-blue-600">→</span>
                          <h3 className="font-medium text-blue-800 group-hover:text-[#ff6b35] transition-colors">{queue.title}</h3>
                        </div>
                      ) : (
                        <h3 className="font-medium text-gray-900 group-hover:text-[#ff6b35] transition-colors">{queue.title}</h3>
                      )}
                      {!queue.userSelected && (
                        <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                          {queue.category}
                        </Badge>
                      )}
                      {isImprovementPreview && (
                        <Badge className="text-xs bg-gradient-to-r from-blue-100 to-orange-100 text-blue-800 border border-blue-200">
                          {isNewQueue ? 'New Queue' : 'Preview'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">{queue.description}</p>
                    
                    {queue.isAuto && queue.reason && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                        <p className="text-xs text-blue-700">{queue.reason}</p>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className={`text-2xl font-medium ${isImprovementPreview ? 'text-blue-800' : 'text-gray-900'}`}>
                          #{displayCurrent}
                        </span>
                        {isImprovementPreview && queue.current !== displayCurrent && (
                          <span className="text-sm text-gray-400 line-through">#{queue.current}</span>
                        )}
                        <span className="text-sm text-gray-500">of {queue.total}</span>
                        <div className="ml-auto flex items-center gap-2">
                          {isImprovementPreview && displayMatch !== queue.match && (
                            <Badge className="text-xs bg-blue-100 text-blue-800 border border-blue-200">
                              +{displayMatch - queue.match}%
                            </Badge>
                          )}
                          <Badge className={`text-xs ${
                            displayMatch >= 90 ? 'bg-green-100 text-green-800' :
                            displayMatch >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {displayMatch}% match
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isImprovementPreview 
                              ? 'bg-gradient-to-r from-blue-500 to-orange-500'
                              : 'bg-gradient-to-r from-[#ff6b35] to-[#ff8c42]'
                          }`}
                          style={{ width: `${(displayCurrent / queue.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <TrendingUp className={`w-4 h-4 ${isImprovementPreview ? 'text-blue-600' : 'text-green-600'}`} />
                      <span className={`text-xs font-medium ${isImprovementPreview ? 'text-blue-600' : 'text-green-600'}`}>
                        {displayChange > 0 ? '+' : ''}{displayChange}% {isImprovementPreview ? '🚀' : '↗'} vs {isImprovementPreview ? 'current' : 'last month'}
                      </span>
                    </div>
                    

                  </div>
                </div>
              </Card>
            );
          })}
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
