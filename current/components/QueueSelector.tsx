import { useState, MouseEvent } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Search, Database, BarChart3, Brain, Target, ChartBar, Globe, Sparkles, Code, Server, PieChart, TrendingUp, Zap, Shield, Smartphone, Cpu, Layers, X, Check, Star, Filter, Pause, ArrowLeft, Crown, Bot, Lock, Award, Sliders } from 'lucide-react';
import { QueuePreferencesModal } from './QueuePreferencesModal';
import { JobPreferences } from './PreferencesSetup';

interface Queue {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  category: string;
  match: number;
  estimatedRank: number;
  totalInQueue: number;
  avgSalary: string;
  demandLevel: 'High' | 'Medium' | 'Low';
  growthRate: string;
  topCompanies: string[];
  requiredSkills: string[];
  timeToHire: string;
}

interface QueueSelectorProps {
  onClose: () => void;
  currentQueues: string[];
  onUpdateQueues: (selectedQueues: string[]) => void;
  queueStatuses?: Record<string, boolean>;
  onUpdateQueueStatuses?: (statuses: Record<string, boolean>) => void;
  user?: any;
}

export function QueueSelector({ onClose, currentQueues, onUpdateQueues, queueStatuses = {}, onUpdateQueueStatuses, user }: Readonly<QueueSelectorProps>) {
  const isPremium = user?.isPremium || false;
  
  // For premium users, filter out the AI queues to get manual selections
  // For basic users, no manual selections allowed
  const getInitialManualSelections = () => {
    if (!isPremium) return [];
    return currentQueues.filter(id => !['product-analyst', 'business-intelligence', 'data-engineer'].includes(id));
  };
  
  const [selectedQueues, setSelectedQueues] = useState<string[]>(getInitialManualSelections());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [localQueueStatuses, setLocalQueueStatuses] = useState<Record<string, boolean>>(queueStatuses);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [selectedQueueForPreferences, setSelectedQueueForPreferences] = useState<any>(null);
  const [queuePreferences, setQueuePreferences] = useState<Record<string, JobPreferences>>({});

  // Available queues to choose from (INCLUDING the AI queues)
  const availableQueues: Queue[] = [
    // AI-Recommended Queues
    {
      id: 'data-engineer',
      title: 'Data Engineer',
      description: 'Advanced data pipeline and infrastructure roles',
      icon: Database,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      category: 'Engineering',
      match: 92,
      estimatedRank: 87,
      totalInQueue: 255,
      avgSalary: '$105K - $145K',
      demandLevel: 'High',
      growthRate: '+15%',
      topCompanies: ['Shopify', 'Square', 'Databricks'],
      requiredSkills: ['Python', 'SQL', 'Apache Spark', 'AWS'],
      timeToHire: '2-4 weeks'
    },
    {
      id: 'product-analyst',
      title: 'Product Analyst',
      description: 'Product-focused analytics and growth roles',
      icon: Target,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      category: 'Analytics',
      match: 85,
      estimatedRank: 62,
      totalInQueue: 140,
      avgSalary: '$95K - $130K',
      demandLevel: 'High',
      growthRate: '+18%',
      topCompanies: ['Meta', 'Airbnb', 'Stripe'],
      requiredSkills: ['Product Analytics', 'SQL', 'A/B Testing', 'Metrics'],
      timeToHire: '2-4 weeks'
    },
    {
      id: 'business-intelligence',
      title: 'BI Developer',
      description: 'Business intelligence and reporting solutions',
      icon: ChartBar,
      color: 'bg-gradient-to-r from-teal-500 to-teal-600',
      category: 'Analytics',
      match: 90,
      estimatedRank: 34,
      totalInQueue: 95,
      avgSalary: '$90K - $125K',
      demandLevel: 'High',
      growthRate: '+16%',
      topCompanies: ['Tableau', 'Microsoft', 'Oracle'],
      requiredSkills: ['Tableau', 'Power BI', 'SQL', 'Data Modeling'],
      timeToHire: '3-5 weeks'
    },
    // Manual Selection Queues
    {
      id: 'senior-analyst',
      title: 'Senior Data Analyst',
      description: 'Leadership roles in analytics and business intelligence',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      category: 'Analytics',
      match: 88,
      estimatedRank: 45,
      totalInQueue: 180,
      avgSalary: '$85K - $115K',
      demandLevel: 'High',
      growthRate: '+12%',
      topCompanies: ['RBC', 'Scotiabank', 'Manulife'],
      requiredSkills: ['SQL', 'Tableau', 'Python', 'Statistics'],
      timeToHire: '3-5 weeks'
    },
    {
      id: 'machine-learning',
      title: 'ML Engineer',
      description: 'Machine learning and AI engineering positions',
      icon: Brain,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      category: 'AI/ML',
      match: 75,
      estimatedRank: 123,
      totalInQueue: 220,
      avgSalary: '$120K - $170K',
      demandLevel: 'High',
      growthRate: '+25%',
      topCompanies: ['Meta', 'Google', 'OpenAI'],
      requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
      timeToHire: '4-8 weeks'
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Advanced analytics and statistical modeling',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
      category: 'Science',
      match: 82,
      estimatedRank: 67,
      totalInQueue: 195,
      avgSalary: '$110K - $155K',
      demandLevel: 'High',
      growthRate: '+18%',
      topCompanies: ['Netflix', 'Uber', 'Airbnb'],
      requiredSkills: ['Python', 'R', 'Machine Learning', 'Statistics'],
      timeToHire: '3-6 weeks'
    },
    {
      id: 'cloud-engineer',
      title: 'Cloud Solutions Engineer',
      description: 'Cloud architecture and DevOps roles',
      icon: Globe,
      color: 'bg-gradient-to-r from-sky-500 to-sky-600',
      category: 'Cloud',
      match: 78,
      estimatedRank: 95,
      totalInQueue: 165,
      avgSalary: '$100K - $140K',
      demandLevel: 'High',
      growthRate: '+20%',
      topCompanies: ['Amazon', 'Microsoft', 'Google Cloud'],
      requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      timeToHire: '2-5 weeks'
    },
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      description: 'Full-stack and backend development roles',
      icon: Code,
      color: 'bg-gradient-to-r from-violet-500 to-violet-600',
      category: 'Engineering',
      match: 70,
      estimatedRank: 156,
      totalInQueue: 320,
      avgSalary: '$95K - $135K',
      demandLevel: 'High',
      growthRate: '+14%',
      topCompanies: ['Shopify', 'Stripe', 'GitHub'],
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
      timeToHire: '3-7 weeks'
    },
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      description: 'Infrastructure automation and deployment',
      icon: Server,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      category: 'Operations',
      match: 73,
      estimatedRank: 112,
      totalInQueue: 140,
      avgSalary: '$105K - $145K',
      demandLevel: 'High',
      growthRate: '+22%',
      topCompanies: ['HashiCorp', 'Docker', 'GitLab'],
      requiredSkills: ['CI/CD', 'Docker', 'Kubernetes', 'Jenkins'],
      timeToHire: '2-4 weeks'
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      description: 'Product strategy and roadmap development',
      icon: Target,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      category: 'Product',
      match: 65,
      estimatedRank: 98,
      totalInQueue: 155,
      avgSalary: '$110K - $160K',
      demandLevel: 'Medium',
      growthRate: '+10%',
      topCompanies: ['Spotify', 'Slack', 'Zoom'],
      requiredSkills: ['Product Strategy', 'Analytics', 'Agile', 'User Research'],
      timeToHire: '4-8 weeks'
    },
    {
      id: 'business-analyst',
      title: 'Business Analyst',
      description: 'Business process analysis and optimization',
      icon: PieChart,
      color: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      category: 'Business',
      match: 85,
      estimatedRank: 42,
      totalInQueue: 125,
      avgSalary: '$75K - $105K',
      demandLevel: 'Medium',
      growthRate: '+8%',
      topCompanies: ['Accenture', 'PwC', 'EY'],
      requiredSkills: ['Business Analysis', 'SQL', 'Excel', 'Process Mapping'],
      timeToHire: '2-4 weeks'
    },
    {
      id: 'security-analyst',
      title: 'Security Analyst',
      description: 'Cybersecurity and threat analysis',
      icon: Shield,
      color: 'bg-gradient-to-r from-gray-600 to-gray-700',
      category: 'Security',
      match: 68,
      estimatedRank: 134,
      totalInQueue: 180,
      avgSalary: '$90K - $125K',
      demandLevel: 'High',
      growthRate: '+28%',
      topCompanies: ['CrowdStrike', 'Palo Alto', 'FireEye'],
      requiredSkills: ['SIEM', 'Incident Response', 'Risk Assessment', 'Compliance'],
      timeToHire: '3-6 weeks'
    },
    {
      id: 'mobile-developer',
      title: 'Mobile Developer',
      description: 'iOS and Android application development',
      icon: Smartphone,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      category: 'Development',
      match: 62,
      estimatedRank: 167,
      totalInQueue: 200,
      avgSalary: '$90K - $130K',
      demandLevel: 'Medium',
      growthRate: '+12%',
      topCompanies: ['Uber', 'Instagram', 'TikTok'],
      requiredSkills: ['Swift', 'Kotlin', 'React Native', 'Flutter'],
      timeToHire: '3-5 weeks'
    },
    {
      id: 'systems-architect',
      title: 'Systems Architect',
      description: 'Enterprise system design and architecture',
      icon: Cpu,
      color: 'bg-gradient-to-r from-slate-500 to-slate-600',
      category: 'Architecture',
      match: 71,
      estimatedRank: 89,
      totalInQueue: 110,
      avgSalary: '$130K - $180K',
      demandLevel: 'Medium',
      growthRate: '+16%',
      topCompanies: ['IBM', 'Oracle', 'SAP'],
      requiredSkills: ['System Design', 'Enterprise Architecture', 'Cloud Platforms', 'Integration'],
      timeToHire: '4-10 weeks'
    },
    {
      id: 'frontend-developer',
      title: 'Frontend Developer',
      description: 'User interface and experience development',
      icon: Layers,
      color: 'bg-gradient-to-r from-rose-500 to-rose-600',
      category: 'Development',
      match: 67,
      estimatedRank: 145,
      totalInQueue: 240,
      avgSalary: '$85K - $120K',
      demandLevel: 'High',
      growthRate: '+18%',
      topCompanies: ['Meta', 'Netflix', 'Airbnb'],
      requiredSkills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
      timeToHire: '2-4 weeks'
    }
  ];

  const categories = ['All', 'Engineering', 'Analytics', 'AI/ML', 'Science', 'Cloud', 'Operations', 'Product', 'Security', 'Development', 'Architecture', 'Business'];

  const filteredQueues = availableQueues.filter(queue => {
    const matchesSearch = queue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         queue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         queue.requiredSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || queue.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleQueueToggle = (queueId: string) => {
    // Basic users cannot manually select queues - premium only feature
    if (!isPremium) {
      setShowPremiumPrompt(true);
      return;
    }

    if (selectedQueues.includes(queueId)) {
      setSelectedQueues(selectedQueues.filter(id => id !== queueId));
    } else if (selectedQueues.length < 2) {  // Premium users get 2 manual queues
      setSelectedQueues([...selectedQueues, queueId]);
    }
  };

  const handleSave = () => {
    // NEW STRUCTURE:
    // Basic users: 3 AI queues (data-engineer, product-analyst, business-intelligence)
    // Premium users: 3 AI queues + 2 manual queues
    const aiQueues = ['data-engineer', 'product-analyst', 'business-intelligence'];
    const allQueues = isPremium ? [...aiQueues, ...selectedQueues] : aiQueues;
    
    onUpdateQueues(allQueues);
    
    // Update queue statuses if callback provided
    if (onUpdateQueueStatuses) {
      onUpdateQueueStatuses(localQueueStatuses);
    }
    
    onClose();
  };

  const handleStatusToggle = (queueId: string, isActive: boolean) => {
    setLocalQueueStatuses(prev => ({
      ...prev,
      [queueId]: isActive
    }));
  };

  const handleOpenPreferences = (queue: Queue, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setSelectedQueueForPreferences(queue);
    setShowPreferencesModal(true);
  };

  const handleSavePreferences = (queueId: string, preferences: JobPreferences, applyToAll: boolean) => {
    if (applyToAll) {
      // Apply to all queues
      const allQueueIds = isPremium 
        ? [...aiQueueIds, ...selectedQueues]
        : aiQueueIds;
      const updatedPreferences: Record<string, JobPreferences> = {};
      allQueueIds.forEach(id => {
        updatedPreferences[id] = preferences;
      });
      setQueuePreferences(updatedPreferences);
    } else {
      // Apply only to the selected queue
      setQueuePreferences(prev => ({
        ...prev,
        [queueId]: preferences
      }));
    }
    setShowPreferencesModal(false);
  };

  const getRankColor = (rank: number, total: number) => {
    const percentage = (rank / total) * 100;
    if (percentage <= 25) return 'text-emerald-600';
    if (percentage <= 50) return 'text-[#ff6b35]';
    if (percentage <= 75) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getMatchColor = (match: number) => {
    if (match >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (match >= 75) return 'bg-orange-50 text-[#ff6b35] border-orange-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  // AI Queue IDs
  const aiQueueIds = ['data-engineer', 'product-analyst', 'business-intelligence'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header Section */}
      <div className="bg-white/60 backdrop-blur-md border-b border-orange-100 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-gray-700 hover:text-gray-900 hover:bg-orange-50 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl text-gray-900">Queue Management</h1>
                  {isPremium && (
                    <Badge className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white border-0 shadow-sm px-3 py-1">
                      <Crown className="w-3 h-3 mr-1.5" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {isPremium 
                    ? 'Manage your AI-recommended queues and custom selections'
                    : 'View your AI-optimized job queues'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-orange-100">
                <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse"></div>
                <span className="text-gray-700 font-medium">{isPremium ? '5' : '3'} Active Queues</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* AI Queues Section */}
        <div className="mb-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl text-gray-900 mb-1">AI-Recommended Queues</h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  These queues are automatically selected and optimized based on your profile, skills, and career preferences.
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50/80 px-3 py-1.5">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Always Active
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {availableQueues.filter(q => aiQueueIds.includes(q.id)).map((queue) => {
              const IconComponent = queue.icon;
              const queueStatus = localQueueStatuses[queue.id] ?? true;
              
              return (
                <Card key={queue.id} className="group p-6 border-2 border-orange-100 bg-white hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff6b35]">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${queue.color} rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
                        <Bot className="w-3 h-3 mr-1" />
                        AI
                      </Badge>
                      <Badge variant="outline" className={getMatchColor(queue.match)}>
                        {queue.match}% match
                      </Badge>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{queue.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{queue.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Your Rank</span>
                      <span className={`font-semibold ${getRankColor(queue.estimatedRank, queue.totalInQueue)}`}>
                        #{queue.estimatedRank} of {queue.totalInQueue}
                      </span>
                    </div>
                    <div className="w-full bg-orange-50 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] shadow-sm"
                        style={{ width: `${100 - (queue.estimatedRank / queue.totalInQueue) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{queue.avgSalary}</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <TrendingUp className="w-3 h-3" />
                        {queue.growthRate}
                      </span>
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {queueStatus ? (
                          <div className="flex items-center gap-2 text-emerald-600">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm font-medium">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Pause className="w-4 h-4" />
                            <span className="text-sm">Paused</span>
                          </div>
                        )}
                      </div>
                      <Switch
                        checked={queueStatus}
                        onCheckedChange={(checked: boolean) => handleStatusToggle(queue.id, checked)}
                        className="data-[state=checked]:bg-[#ff6b35]"
                      />
                    </div>
                  </div>

                  {/* Preferences Button */}
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e: MouseEvent) => handleOpenPreferences(queue, e)}
                      className="w-full border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white transition-all"
                    >
                      <Sliders className="w-4 h-4 mr-2" />
                      Preferences
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Manual Queue Selection Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${isPremium ? 'bg-gradient-to-br from-[#ff6b35] to-[#ff8c42]' : 'bg-gray-200'} rounded-xl flex items-center justify-center shadow-lg ${isPremium ? 'shadow-orange-500/30' : ''}`}>
                {isPremium ? (
                  <Award className="w-6 h-6 text-white" />
                ) : (
                  <Lock className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl text-gray-900 mb-1">Manual Queue Selection</h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  {isPremium 
                    ? 'Select up to 2 additional queues that align perfectly with your career goals.'
                    : 'Upgrade to Premium to manually select 2 additional queues beyond your AI recommendations.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isPremium ? (
                <Badge variant="outline" className={`${selectedQueues.length === 2 ? 'border-[#ff6b35] text-[#ff6b35] bg-orange-50' : 'border-gray-300 text-gray-700 bg-white'} px-3 py-1.5`}>
                  {selectedQueues.length}/2 Selected
                  {selectedQueues.length === 2 && <Check className="w-3 h-3 ml-1.5" />}
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setShowPremiumPrompt(true)}
                  className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </div>

          {/* Search and Filter Controls - Premium Only */}
          {isPremium && (
            <div className="bg-white rounded-xl border border-orange-100 p-4 mb-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by title, skills, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-orange-100 focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                  />
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                  <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div className="flex gap-2">
                    {categories.map(category => (
                      <Button
                        key={category}
                        size="sm"
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category 
                          ? "bg-[#ff6b35] hover:bg-[#e55a2b] text-white" 
                          : "border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-[#ff6b35]"}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Queue Grid */}
          {isPremium ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredQueues.filter(q => !aiQueueIds.includes(q.id)).map((queue) => {
                const IconComponent = queue.icon;
                const isSelected = selectedQueues.includes(queue.id);
                const canSelect = selectedQueues.length < 2 || isSelected;
                const queueStatus = localQueueStatuses[queue.id] ?? true;
                
                return (
                  <Card 
                    key={queue.id}
                    className={`group p-5 transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? 'border-2 border-[#ff6b35] bg-gradient-to-br from-orange-50 via-white to-orange-50/30 shadow-lg shadow-orange-100' 
                        : canSelect 
                          ? 'border border-orange-100 hover:border-[#ff6b35] hover:shadow-md bg-white' 
                          : 'border border-gray-200 opacity-50 cursor-not-allowed bg-white'
                    }`}
                    onClick={() => canSelect && handleQueueToggle(queue.id)}
                  >
                    {/* Selection indicator */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${queue.color} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-[#ff6b35] rounded-full flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <h3 className={`font-semibold mb-1.5 ${isSelected ? 'text-[#ff6b35]' : 'text-gray-800'}`}>
                      {queue.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">{queue.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline" className={getMatchColor(queue.match)}>
                        {queue.match}% match
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                        {queue.category}
                      </Badge>
                    </div>

                    {/* Status Toggle - Only for selected */}
                    {isSelected && (
                      <>
                        <div className="pt-3 border-t border-orange-100 mt-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {queueStatus ? (
                                <div className="flex items-center gap-2 text-emerald-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                  <span className="text-xs font-medium">Active</span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">Paused</span>
                              )}
                            </div>
                            <Switch
                              checked={queueStatus}
                              onCheckedChange={(checked: boolean) => {
                                handleStatusToggle(queue.id, checked);
                              }}
                              onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
                              className="data-[state=checked]:bg-[#ff6b35]"
                            />
                          </div>
                        </div>
                        
                        {/* Preferences Button */}
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e: MouseEvent) => handleOpenPreferences(queue, e)}
                            className="w-full border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white transition-all"
                          >
                            <Sliders className="w-4 h-4 mr-2" />
                            Preferences
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Quick Stats */}
                    <div className="text-xs text-gray-500 mt-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>#{queue.estimatedRank}/{queue.totalInQueue}</span>
                        <span className="flex items-center gap-1 text-emerald-600">
                          <TrendingUp className="w-3 h-3" />
                          {queue.growthRate}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Locked State for Basic Users */
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-30 pointer-events-none blur-sm">
                {availableQueues.filter(q => !aiQueueIds.includes(q.id)).slice(0, 8).map((queue) => {
                  const IconComponent = queue.icon;
                  return (
                    <Card key={queue.id} className="p-5 border border-gray-200 bg-white">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${queue.color} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1.5">{queue.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{queue.description}</p>
                    </Card>
                  );
                })}
              </div>
              
              {/* Unlock Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Card className="max-w-md p-8 text-center shadow-2xl border-2 border-orange-200 bg-white">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-[#ff6b35]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Manual Selection Locked</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Upgrade to Premium to choose 2 additional queues that perfectly match your career goals.
                  </p>
                  <Button
                    onClick={() => setShowPremiumPrompt(true)}
                    className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white shadow-lg hover:shadow-xl transition-all w-full"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-orange-100 bg-white/80 backdrop-blur-sm sticky bottom-0 -mx-6 px-6 py-4 rounded-t-xl shadow-lg">
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ff6b35]"></div>
                <span className="font-medium text-gray-900">
                  {isPremium 
                    ? `${aiQueueIds.length} AI + ${selectedQueues.length} Manual = ${aiQueueIds.length + selectedQueues.length} Total`
                    : `${aiQueueIds.length} AI Queues Active`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-[#ff6b35]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isPremium && selectedQueues.length !== 2}
              className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white shadow-md hover:shadow-lg transition-all"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Upgrade Prompt Modal */}
      {showPremiumPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-8 relative shadow-2xl border-2 border-orange-200">
            <button
              onClick={() => setShowPremiumPrompt(false)}
              className="absolute top-4 right-4 p-2 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/30">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Upgrade to Premium</h3>
              <p className="text-gray-600">
                Take full control of your job search with manual queue selection
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">3 AI-Recommended Queues</p>
                  <p className="text-sm text-gray-600">Automatically optimized for your profile</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-[#ff6b35]">
                <Star className="w-5 h-5 text-[#ff6b35] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">+ 2 Manual Queues</p>
                  <p className="text-sm text-gray-600">Choose any roles that match your goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <Zap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Advanced Features</p>
                  <p className="text-sm text-gray-600">Analytics, priority support, and more</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPremiumPrompt(false)}
                className="flex-1 border-orange-200 hover:bg-orange-50"
              >
                Maybe Later
              </Button>
              <Button
                onClick={() => {
                  setShowPremiumPrompt(false);
                  alert('Upgrade flow would open here');
                }}
                className="flex-1 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white shadow-lg"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Queue Preferences Modal */}
      {selectedQueueForPreferences && (
        <QueuePreferencesModal
          isOpen={showPreferencesModal}
          onClose={() => {
            setShowPreferencesModal(false);
            setSelectedQueueForPreferences(null);
          }}
          queueId={selectedQueueForPreferences.id}
          queueTitle={selectedQueueForPreferences.title}
          currentPreferences={queuePreferences[selectedQueueForPreferences.id]}
          onSave={handleSavePreferences}
        />
      )}
    </div>
  );
}
