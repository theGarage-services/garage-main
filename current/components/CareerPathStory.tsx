import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import {
  Sparkles, BookOpen, Edit3, Save, Plus, X, ChevronRight, Target, TrendingUp, Calendar, 
  Lightbulb, Zap, CheckCircle, Clock, MapPin, Star, Brain, Rocket, Flag, Trophy, Crown
} from 'lucide-react';

interface CareerPathStoryProps {
  user?: any;
  onNavigate: (view: string) => void;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  chapter: 'current' | 'next' | 'dream';
  requiredSkills: string[];
  recommendations: string[];
}

interface CareerChapter {
  id: string;
  name: string;
  type: 'current' | 'next' | 'dream';
  story: string;
  color: string;
  icon: any;
}

export function CareerPathStory({ user, onNavigate }: Readonly<CareerPathStoryProps>) {
  const isPremium = user?.isPremium || false;

  // Career Story State
  const [careerStory, setCareerStory] = useState({
    currentChapter: "I'm currently a Senior Data Analyst at BMO Financial Group, where I lead data-driven initiatives and collaborate with cross-functional teams. I've built a strong foundation in analytics, risk modeling, and financial analysis over the past few years.",
    nextChapter: "In the next 2-3 years, I want to transition into a Data Science Lead role where I can mentor junior team members, drive strategic ML initiatives, and influence business decisions at a higher level. I'm passionate about combining technical expertise with leadership.",
    dreamChapter: "My ultimate dream is to become a VP of Data Science at a leading fintech company, building and scaling world-class data teams. I want to be known for creating innovative AI solutions that transform how businesses understand risk and make decisions."
  });

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [tempStory, setTempStory] = useState('');

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Master Advanced ML Techniques',
      description: 'Complete deep learning specialization and apply ML models to production',
      targetDate: '2025-06',
      completed: false,
      chapter: 'next',
      requiredSkills: ['Deep Learning', 'TensorFlow', 'MLOps'],
      recommendations: [
        'Complete Andrew Ng\'s Deep Learning Specialization',
        'Build and deploy 2-3 production ML models',
        'Contribute to open-source ML projects'
      ]
    },
    {
      id: '2',
      title: 'Lead First Cross-Functional Project',
      description: 'Successfully lead a major data initiative involving multiple teams',
      targetDate: '2025-09',
      completed: false,
      chapter: 'next',
      requiredSkills: ['Project Management', 'Stakeholder Communication', 'Team Leadership'],
      recommendations: [
        'Volunteer to lead the next major analytics project',
        'Take a leadership training course',
        'Build relationships with stakeholders across departments'
      ]
    },
    {
      id: '3',
      title: 'Transition to Data Science Lead',
      description: 'Secure a Data Science Lead position at a top-tier company',
      targetDate: '2026-03',
      completed: false,
      chapter: 'next',
      requiredSkills: ['Advanced ML', 'Team Management', 'Strategic Planning'],
      recommendations: [
        'Network with hiring managers at target companies',
        'Build portfolio showcasing leadership and technical skills',
        'Get certified in cloud ML platforms (AWS/GCP)'
      ]
    },
    {
      id: '4',
      title: 'Build & Scale a Data Science Team',
      description: 'Grow team from 3 to 15+ data scientists and engineers',
      targetDate: '2028-01',
      completed: false,
      chapter: 'dream',
      requiredSkills: ['Hiring & Recruitment', 'Team Building', 'Budget Management'],
      recommendations: [
        'Study best practices from successful DS leaders',
        'Develop a clear team growth strategy',
        'Build strong relationships with executive leadership'
      ]
    },
    {
      id: '5',
      title: 'Drive Company-Wide AI Transformation',
      description: 'Lead AI strategy and implementation across entire organization',
      targetDate: '2029-06',
      completed: false,
      chapter: 'dream',
      requiredSkills: ['AI Strategy', 'Executive Communication', 'Change Management'],
      recommendations: [
        'Publish thought leadership content on AI in fintech',
        'Speak at industry conferences',
        'Build strategic partnerships with AI vendors'
      ]
    }
  ]);

  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Milestone>({
    id: '',
    title: '',
    description: '',
    targetDate: '',
    completed: false,
    chapter: 'next',
    requiredSkills: [],
    recommendations: []
  });

  const chapters: CareerChapter[] = [
    {
      id: 'current',
      name: 'Current Chapter',
      type: 'current',
      story: careerStory.currentChapter,
      color: 'from-blue-500 to-blue-600',
      icon: MapPin
    },
    {
      id: 'next',
      name: 'Next Chapter',
      type: 'next',
      story: careerStory.nextChapter,
      color: 'from-[#ff6b35] to-[#ff8c42]',
      icon: Rocket
    },
    {
      id: 'dream',
      name: 'Dream Chapter',
      type: 'dream',
      story: careerStory.dreamChapter,
      color: 'from-purple-500 to-purple-600',
      icon: Trophy
    }
  ];

  const handleEditChapter = (chapterType: string, currentStory: string) => {
    setIsEditing(chapterType);
    setTempStory(currentStory);
  };

  const handleSaveChapter = (chapterType: string) => {
    setCareerStory({
      ...careerStory,
      [`${chapterType}Chapter`]: tempStory
    });
    setIsEditing(null);
  };

  const handleAddMilestone = () => {
    if (newMilestone.title && newMilestone.targetDate) {
      setMilestones([...milestones, { ...newMilestone, id: Date.now().toString() }]);
      setNewMilestone({
        id: '',
        title: '',
        description: '',
        targetDate: '',
        completed: false,
        chapter: 'next',
        requiredSkills: [],
        recommendations: []
      });
      setIsAddingMilestone(false);
    }
  };

  const handleToggleMilestone = (id: string) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ));
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const getMilestonesByChapter = (chapter: 'current' | 'next' | 'dream') => {
    return milestones.filter(m => m.chapter === chapter);
  };

  const getProgress = () => {
    const completed = milestones.filter(m => m.completed).length;
    return milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0;
  };

  const getAllRequiredSkills = () => {
    const skills = new Set<string>();
    milestones.forEach(m => {
      m.requiredSkills.forEach(skill => skills.add(skill));
    });
    return Array.from(skills);
  };

  // Premium restriction check
  if (!isPremium) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 max-w-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-200">
          <div className="text-center space-y-6">
            {/* Premium Badge */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">Career Path Story</h2>
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium Feature
              </Badge>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              Create your personalized career journey with AI-powered insights, milestone tracking, and strategic recommendations to achieve your dream role.
            </p>

            {/* Benefits */}
            <div className="bg-white/80 rounded-lg p-6 border border-orange-200">
              <h3 className="font-medium text-gray-900 mb-4">What you'll get:</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Write your career story across multiple chapters</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Set and track career milestones with target dates</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Get AI-powered recommendations for each goal</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Visualize your career progression timeline</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Build a personalized skills roadmap</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Track progress toward your dream career</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => onNavigate('account-settings')}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl text-gray-900">My Career Journey</h2>
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
          <p className="text-gray-600">Write your career story and get AI-powered guidance to achieve your goals</p>
        </div>
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white"
        >
          <Brain className="w-4 h-4 mr-2" />
          AI Analysis
        </Button>
      </div>

      {/* Overall Progress */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg text-gray-900">Journey Progress</h3>
              <p className="text-sm text-gray-600">{milestones.filter(m => m.completed).length} of {milestones.length} milestones completed</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1">{getProgress()}%</div>
            <p className="text-sm text-gray-600">Complete</p>
          </div>
        </div>
        <Progress value={getProgress()} className="h-3" />
      </Card>

      {/* Career Chapters */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#ff6b35]" />
          <h3 className="text-lg text-gray-900">Your Career Story</h3>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-blue-500 via-[#ff6b35] to-purple-500 hidden md:block" />

          <div className="space-y-8">
            {chapters.map((chapter, index) => {
              const IconComponent = chapter.icon;
              const chapterMilestones = getMilestonesByChapter(chapter.type);

              return (
                <Card key={chapter.id} className="p-6 bg-white/80 border-2 hover:shadow-lg transition-all relative">
                  {/* Chapter Number Badge */}
                  <div className="absolute -left-3 top-6 w-12 h-12 bg-white rounded-full border-4 border-white hidden md:flex items-center justify-center shadow-lg">
                    <div className={`w-10 h-10 bg-gradient-to-r ${chapter.color} rounded-full flex items-center justify-center text-white`}>
                      {index + 1}
                    </div>
                  </div>

                  <div className="md:ml-12">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${chapter.color} rounded-xl flex items-center justify-center shadow-md`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg text-gray-900">{chapter.name}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {chapterMilestones.length} milestone{chapterMilestones.length === 1 ? '' : 's'}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => isEditing === chapter.type 
                          ? handleSaveChapter(chapter.type)
                          : handleEditChapter(chapter.type, chapter.story)
                        }
                      >
                        {isEditing === chapter.type ? (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </>
                        ) : (
                          <>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </>
                        )}
                      </Button>
                    </div>

                    {isEditing === chapter.type ? (
                      <Textarea
                        value={tempStory}
                        onChange={(e) => setTempStory(e.target.value)}
                        className="min-h-[120px] mb-4"
                        placeholder={`Write about your ${chapter.name.toLowerCase()}...`}
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {chapter.story}
                      </p>
                    )}

                    {/* Milestones for this chapter */}
                    {chapterMilestones.length > 0 && (
                      <div className="space-y-3 mt-4">
                        {chapterMilestones.map((milestone) => (
                          <div 
                            key={milestone.id} 
                            className={`p-4 rounded-lg border-2 transition-all ${
                              milestone.completed 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-white border-gray-200 hover:border-orange-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => handleToggleMilestone(milestone.id)}
                                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  milestone.completed
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-300 hover:border-[#ff6b35]'
                                }`}
                              >
                                {milestone.completed && <CheckCircle className="w-4 h-4 text-white" />}
                              </button>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h5 className={`font-medium ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                      {milestone.title}
                                    </h5>
                                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {new Date(milestone.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </Badge>
                                    <button
                                      onClick={() => handleDeleteMilestone(milestone.id)}
                                      className="p-1 hover:bg-red-50 rounded transition-colors"
                                    >
                                      <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                    </button>
                                  </div>
                                </div>

                                {!milestone.completed && milestone.requiredSkills.length > 0 && (
                                  <div className="mb-2">
                                    <p className="text-xs text-gray-500 mb-1">Required Skills:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {milestone.requiredSkills.map((skill) => (
                                        <Badge key={skill} variant="outline" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {!milestone.completed && milestone.recommendations.length > 0 && (
                                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Lightbulb className="w-4 h-4 text-blue-600" />
                                      <p className="text-xs text-blue-900">AI Recommendations:</p>
                                    </div>
                                    <ul className="space-y-1">
                                      {milestone.recommendations.map((rec, idx) => (
                                        <li key={idx} className="text-xs text-blue-700 flex items-start gap-2">
                                          <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                          <span>{rec}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Milestone */}
      <Card className="p-6 bg-white/80 border-2 border-dashed border-gray-300 hover:border-[#ff6b35] transition-colors">
        {isAddingMilestone ? (
          <div className="space-y-4">
            <h4 className="text-lg text-gray-900">Add New Milestone</h4>
            <Input
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              placeholder="Milestone title"
            />
            <Textarea
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              placeholder="Description"
              className="min-h-[80px]"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={newMilestone.targetDate}
                onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
              />
              <select
                value={newMilestone.chapter}
                onChange={(e) => setNewMilestone({ ...newMilestone, chapter: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="next">Next Chapter</option>
                <option value="dream">Dream Chapter</option>
              </select>
            </div>
            <Input
              placeholder="Required skills (comma-separated)"
              onChange={(e) => setNewMilestone({ 
                ...newMilestone, 
                requiredSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
              })}
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleAddMilestone}
                className="bg-[#ff6b35] hover:bg-[#e55a2b]"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Milestone
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsAddingMilestone(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingMilestone(true)}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-[#ff6b35] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Milestone</span>
          </button>
        )}
      </Card>

      {/* Skills Roadmap */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg text-gray-900">Skills Roadmap</h3>
            <p className="text-sm text-gray-600">Skills you'll need to achieve your career goals</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {getAllRequiredSkills().map((skill) => (
            <Badge key={skill} className="bg-white border-orange-200 text-gray-700 hover:bg-orange-100 transition-colors">
              <Star className="w-3 h-3 mr-1" />
              {skill}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Success Insights */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-white/80 border-orange-100">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <div className="text-2xl">{milestones.length}</div>
          </div>
          <p className="text-sm text-gray-600">Total Milestones</p>
        </Card>
        <Card className="p-4 bg-white/80 border-orange-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div className="text-2xl">{milestones.filter(m => m.completed).length}</div>
          </div>
          <p className="text-sm text-gray-600">Completed</p>
        </Card>
        <Card className="p-4 bg-white/80 border-orange-100">
          <div className="flex items-center gap-3 mb-2">
            <Flag className="w-5 h-5 text-[#ff6b35]" />
            <div className="text-2xl">{getAllRequiredSkills().length}</div>
          </div>
          <p className="text-sm text-gray-600">Skills to Develop</p>
        </Card>
      </div>
    </div>
  );
}
