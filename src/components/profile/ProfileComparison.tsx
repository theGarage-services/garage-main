import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  X, Target, Zap, 
  User, ArrowRight, CheckCircle, AlertCircle, Star, Trophy,
  Briefcase, Clock, Lightbulb
} from 'lucide-react';

interface ProfileComparisonProps {
  currentUser: any;
  compareUser: any;
  onClose: () => void;
  queue: any;
}

export function ProfileComparison({ currentUser, compareUser, onClose, queue }: Readonly<ProfileComparisonProps>) {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'experience' | 'insights'>('overview');

  // Mock comparison data
  const comparisonData = {
    overall: {
      yourScore: 85,
      theirScore: 92,
      difference: -7,
      yourRank: 75,
      theirRank: 12,
      strengthAreas: ['Technical Skills', 'Project Management'],
      improvementAreas: ['Leadership Experience', 'Industry Certifications']
    },
    skills: [
      { name: 'Python', you: 85, them: 95, required: 90, advantage: 'them', gap: 5 },
      { name: 'SQL', you: 78, them: 88, required: 85, advantage: 'them', gap: 3 },
      { name: 'Data Analysis', you: 92, them: 85, required: 80, advantage: 'you', gap: 7 },
      { name: 'Machine Learning', you: 65, them: 90, required: 85, advantage: 'them', gap: 25 },
      { name: 'Statistics', you: 88, them: 82, required: 75, advantage: 'you', gap: 6 },
      { name: 'AWS', you: 70, them: 85, required: 80, advantage: 'them', gap: 15 },
      { name: 'Tableau', you: 90, them: 70, required: 70, advantage: 'you', gap: 20 },
      { name: 'R Programming', you: 60, them: 88, required: 75, advantage: 'them', gap: 28 }
    ],
    experience: {
      you: {
        totalYears: 3.5,
        relevantYears: 2.8,
        companies: ['TechCorp', 'DataInc'],
        industries: ['Tech', 'Finance'],
        leadership: 1,
        certifications: 3
      },
      them: {
        totalYears: 5.2,
        relevantYears: 4.8,
        companies: ['Google', 'Meta', 'Microsoft'],
        industries: ['Tech', 'AI/ML'],
        leadership: 3,
        certifications: 7
      }
    },
    insights: [
      {
        type: 'strength',
        title: 'Your Advantage: Data Visualization',
        description: 'You excel in Tableau and data storytelling, ranking 20 points higher than your comparison.',
        action: 'Highlight this in applications and consider advanced visualization courses.'
      },
      {
        type: 'improvement',
        title: 'Priority Gap: Machine Learning',
        description: 'They outrank you by 25 points in ML. This is critical for senior data roles.',
        action: 'Complete Andrew Ng\'s ML course and build 2-3 ML projects.'
      },
      {
        type: 'strategic',
        title: 'Industry Positioning',
        description: 'They have FAANG experience which adds significant weight to their profile.',
        action: 'Consider targeting smaller tech companies first or getting referrals from your network.'
      },
      {
        type: 'opportunity',
        title: 'Certification Gap',
        description: 'They have 7 certifications vs your 3. Strategic certifications could boost your ranking.',
        action: 'Target AWS Solutions Architect Associate and Google Data Engineer certifications.'
      }
    ]
  };

  const getAdvantageColor = (advantage: string) => {
    if (advantage === 'you') return 'text-green-600 bg-green-50 border-green-200';
    if (advantage === 'them') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Trophy className="w-5 h-5 text-green-600" />;
      case 'improvement': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'strategic': return <Target className="w-5 h-5 text-blue-600" />;
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-purple-600" />;
      default: return <Star className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-7xl h-[95vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] p-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white/20">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-white/20 text-white text-lg">
                  {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-white font-semibold text-lg">You</h2>
                <p className="text-orange-100">Rank #{comparisonData.overall.yourRank}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 text-sm">vs</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white/20">
                <AvatarImage src={compareUser.avatar} />
                <AvatarFallback className="bg-white/20 text-white text-lg">
                  {compareUser.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-white font-semibold text-lg">{compareUser.name}</h2>
                <p className="text-orange-100">Rank #{comparisonData.overall.theirRank}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <h1 className="text-2xl font-semibold text-white mb-1">Profile Comparison</h1>
              <p className="text-orange-100">{queue.title} Queue Analysis</p>
            </div>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-8 bg-gray-50/50">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'skills', label: 'Skills Breakdown', icon: Zap },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'insights', label: 'AI Insights', icon: Lightbulb }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-5 px-3 border-b-3 font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-[#ff6b35] text-[#ff6b35] bg-orange-50/30'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                  } rounded-t-lg`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-50/30 to-white">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Overall Comparison */}
              <div className="grid grid-cols-2 gap-8">
                <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100/30 border-2 border-blue-200">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Profile Score</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">{comparisonData.overall.yourScore}</div>
                    <Badge className="bg-blue-100 text-blue-800">Rank #{comparisonData.overall.yourRank}</Badge>
                  </div>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100/30 border-2 border-purple-200">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{compareUser.name}'s Score</h3>
                    <div className="text-4xl font-bold text-purple-600 mb-2">{comparisonData.overall.theirScore}</div>
                    <Badge className="bg-purple-100 text-purple-800">Rank #{comparisonData.overall.theirRank}</Badge>
                  </div>
                </Card>
              </div>

              {/* Gap Analysis */}
              <Card className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Competitive Gap Analysis</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h4 className="text-lg font-semibold text-gray-900">Your Strengths</h4>
                    </div>
                    <div className="space-y-3">
                      {comparisonData.overall.strengthAreas.map((area, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <Star className="w-4 h-4 text-green-600" />
                          <span className="text-green-800 font-medium">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                      <h4 className="text-lg font-semibold text-gray-900">Improvement Areas</h4>
                    </div>
                    <div className="space-y-3">
                      {comparisonData.overall.improvementAreas.map((area, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <Target className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-800 font-medium">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Skills Comparison</h3>
                <p className="text-gray-600">Detailed breakdown of technical and soft skills</p>
              </div>

              <div className="grid gap-6">
                {comparisonData.skills.map((skill, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold text-gray-900">{skill.name}</h4>
                        <Badge className={`${getAdvantageColor(skill.advantage)} text-xs`}>
                          {skill.advantage === 'you' ? 'Your Advantage' : 
                           skill.advantage === 'them' ? 'Their Advantage' : 'Even'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Required: {skill.required}%
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">You</span>
                          <span className="text-sm font-bold text-blue-600">{skill.you}%</span>
                        </div>
                        <Progress value={skill.you} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{compareUser.name}</span>
                          <span className="text-sm font-bold text-purple-600">{skill.them}%</span>
                        </div>
                        <Progress value={skill.them} className="h-3" />
                      </div>
                    </div>
                    
                    {skill.gap > 10 && (
                      <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-800">
                          <strong>Gap Alert:</strong> {skill.gap} point difference. Consider focused improvement in this area.
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Experience Comparison</h3>
                <p className="text-gray-600">Professional background and career progression</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <Card className="p-8">
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Your Experience</h4>
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total Experience</span>
                      <span className="font-bold text-blue-600">{comparisonData.experience.you.totalYears} years</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Relevant Experience</span>
                      <span className="font-bold text-blue-600">{comparisonData.experience.you.relevantYears} years</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Leadership Roles</span>
                      <span className="font-bold text-blue-600">{comparisonData.experience.you.leadership}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Certifications</span>
                      <span className="font-bold text-blue-600">{comparisonData.experience.you.certifications}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h5 className="font-semibold text-gray-900 mb-3">Companies</h5>
                    <div className="flex flex-wrap gap-2">
                      {comparisonData.experience.you.companies.map((company, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="p-8">
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{compareUser.name}'s Experience</h4>
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total Experience</span>
                      <span className="font-bold text-purple-600">{comparisonData.experience.them.totalYears} years</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Relevant Experience</span>
                      <span className="font-bold text-purple-600">{comparisonData.experience.them.relevantYears} years</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Leadership Roles</span>
                      <span className="font-bold text-purple-600">{comparisonData.experience.them.leadership}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Certifications</span>
                      <span className="font-bold text-purple-600">{comparisonData.experience.them.certifications}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h5 className="font-semibold text-gray-900 mb-3">Companies</h5>
                    <div className="flex flex-wrap gap-2">
                      {comparisonData.experience.them.companies.map((company, index) => (
                        <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* AI Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">AI-Powered Career Insights</h3>
                <p className="text-gray-600">Strategic recommendations based on profile comparison</p>
              </div>

              <div className="grid gap-6">
                {comparisonData.insights.map((insight, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h4>
                        <p className="text-gray-600 mb-4">{insight.description}</p>
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#ff6b35]">
                          <p className="text-sm font-medium text-gray-900">
                            <strong>Recommended Action:</strong> {insight.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Action Plan */}
              <Card className="p-8 bg-gradient-to-r from-[#ff6b35]/5 to-[#ff8c42]/5 border-2 border-[#ff6b35]/20">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">📋 Personalized Action Plan</h3>
                  <p className="text-gray-600 mb-6">Based on this comparison, here's your strategic roadmap:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Immediate (1-2 weeks)</h4>
                      <p className="text-sm text-gray-600">Update profile, highlight strengths</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Short-term (1-3 months)</h4>
                      <p className="text-sm text-gray-600">Close skill gaps, earn certifications</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Long-term (3-6 months)</h4>
                      <p className="text-sm text-gray-600">Build portfolio, gain experience</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}