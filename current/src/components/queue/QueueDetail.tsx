import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { X, TrendingUp, Users, Clock, Award, Target, Crown, Zap, BarChart3 } from 'lucide-react';
import { LiveProfileUpgrade } from '../landing/LiveProfileUpgrade';
import { QueueLeaderboard } from './QueueLeaderboard';

// Local interface for queue metrics (backend endpoint not yet available)
interface QueueMetrics {
  usersInQueue: number;
  yourPosition: number;
  topPercentage: string;
  avgTimeToInterview: string;
  startingKnowledge: number;
  currentKnowledge: number;
  knowledgeGain: number;
  successRate: number;
  avgSalary: string;
  hiringRate: string;
}

interface QueueDetailProps {
  queue: {
    id: string;
    title: string;
    description: string;
    current: number;
    total: number;
    trend: 'up' | 'down';
    icon: any;
    color: string;
    isAuto?: boolean;
    category: string;
  };
  onClose: () => void;
  userPosition?: number;
  isUserInQueue?: boolean;
}

export function QueueDetail({ queue, onClose, userPosition = 75 }: Readonly<QueueDetailProps>) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'upgrade' | 'leaderboard'>('analytics');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const IconComponent = queue.icon;
  const topPercentage = Math.round((userPosition / queue.total) * 100);

  // TODO: Connect to backend metrics endpoint when available
  // For now, use queue data directly
  useEffect(() => {
    setIsLoading(false);
  }, [queue.id]);

  // Default metrics from queue data (backend endpoint not yet available)
  const metrics: QueueMetrics = {
    usersInQueue: queue.total || 0,
    yourPosition: userPosition,
    topPercentage: `Top ${topPercentage}%`,
    avgTimeToInterview: '--',
    startingKnowledge: 0,
    currentKnowledge: 0,
    knowledgeGain: 0,
    successRate: 0,
    avgSalary: '--',
    hiringRate: '--'
  };

  const skillsAnalysis = [
    { skill: 'Python', current: 85, required: 90, gap: 5 },
    { skill: 'SQL', current: 78, required: 85, gap: 7 },
    { skill: 'Data Analysis', current: 92, required: 88, gap: 0 },
    { skill: 'Machine Learning', current: 65, required: 80, gap: 15 },
    { skill: 'AWS', current: 70, required: 75, gap: 5 }
  ];

  const recentActivity = [
    { action: 'Profile updated', time: '2 hours ago', impact: '+3 positions' },
    { action: 'New certification added', time: '1 day ago', impact: '+8 positions' },
    { action: 'Skill endorsement', time: '3 days ago', impact: '+2 positions' }
  ];

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${queue.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-medium text-white mb-1">{queue.title}</h1>
                <p className="text-orange-100">{queue.description}</p>
                {queue.isAuto && (
                  <Badge className="bg-white/20 text-white border-white/30 mt-2">
                    Auto-Selected
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={onClose} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-[#ff6b35] text-[#ff6b35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Analytics
              </button>
              <button
                onClick={() => {
                  setActiveTab('upgrade');
                  setShowUpgrade(true);
                }}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'upgrade'
                    ? 'border-[#ff6b35] text-[#ff6b35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Profile Upgrade
                <Crown className="w-3 h-3 inline ml-1 text-yellow-500" />
              </button>
              <button
                onClick={() => {
                  setActiveTab('leaderboard');
                  setShowLeaderboard(true);
                }}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'leaderboard'
                    ? 'border-[#ff6b35] text-[#ff6b35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Award className="w-4 h-4 inline mr-2" />
                Leaderboard
                <Crown className="w-3 h-3 inline ml-1 text-yellow-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35]"></div>
                <span className="ml-3 text-gray-600">Loading metrics...</span>
              </div>
            ) : activeTab === 'analytics' ? (
              <div className="space-y-6">
                {/* Queue Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <Card className="p-6 bg-white border-2 border-blue-100/50 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-medium text-gray-900">{metrics.usersInQueue}</div>
                    </div>
                    <p className="text-gray-600 font-medium">Users in queue</p>
                  </Card>

                  <Card className="p-6 bg-white border-2 border-orange-100/50 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-medium text-gray-900">{metrics.yourPosition}</div>
                        <div className="text-sm text-[#ff6b35] font-medium">{metrics.topPercentage}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium">Your Position</p>
                  </Card>

                  <Card className="p-6 bg-white border-2 border-green-100/50 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-medium text-gray-900">{metrics.avgTimeToInterview}</div>
                    </div>
                    <p className="text-gray-600 font-medium">Av. time before interview</p>
                  </Card>
                </div>

                {/* Knowledge Progress */}
                <div className="grid grid-cols-3 gap-6">
                  <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-700 mb-2">Starting Knowledge</h3>
                      <div className="text-3xl font-medium text-gray-900 mb-2">{metrics.startingKnowledge}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                          style={{ width: `${metrics.startingKnowledge}%` }}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-700 mb-2">Current Knowledge</h3>
                      <div className="text-3xl font-medium text-gray-900 mb-2">{metrics.currentKnowledge}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                          style={{ width: `${metrics.currentKnowledge}%` }}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-700 mb-2">Knowledge Gain</h3>
                      <div className="text-3xl font-medium text-green-600 mb-2">+{metrics.knowledgeGain}%</div>
                      <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Improving
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Skills Analysis */}
                <Card className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-6">Skills Analysis</h3>
                  <div className="space-y-4">
                    {skillsAnalysis.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{skill.skill}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">{skill.current}% / {skill.required}%</span>
                              {skill.gap > 0 && (
                                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                                  Gap: {skill.gap}%
                                </Badge>
                              )}
                              {skill.gap === 0 && (
                                <Badge className="text-xs bg-green-100 text-green-800">
                                  ✓ Meets requirement
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                skill.current >= skill.required 
                                  ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                  : 'bg-gradient-to-r from-orange-500 to-orange-600'
                              }`}
                              style={{ width: `${(skill.current / skill.required) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {activity.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : activeTab === 'upgrade' ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600">Upgrade view coming soon...</p>
              </div>
            ) : activeTab === 'leaderboard' ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600">Leaderboard view coming soon...</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Premium Feature Modals */}
      {showUpgrade && (
        <LiveProfileUpgrade
          onSimulationComplete={() => {
            setShowUpgrade(false);
            setActiveTab('analytics');
          }}
        />
      )}

      {showLeaderboard && (
        <QueueLeaderboard
          onClose={() => {
            setShowLeaderboard(false);
            setActiveTab('analytics');
          }}
          queueTitle={queue.title}
          userPosition={userPosition}
        />
      )}
    </>
  );
}