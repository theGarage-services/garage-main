import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { 
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Users,
  Calendar,
  Award,
  Target,
  Mail,
  Phone,
  ExternalLink,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
  Briefcase,
  TrendingUp,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  DollarSign,
  Clock,
  Home,
  Sparkles,
  Star,
  Zap
} from 'lucide-react';

interface CompanyProfileProps {
  institution: any;
  user: any;
  onBack: () => void;
  onNavigate?: (view: string) => void;
  onJobApplication?: (job: any, method: string) => void;
  onNavigateToJobDetails?: (job: any) => void;
}

export function CompanyProfile({ institution, onNavigate, onJobApplication, onNavigateToJobDetails }: Readonly<CompanyProfileProps>) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  // Mock company data - in real app this would come from API/institution prop
  const companyInfo = {
    name: institution?.name || 'TechCorp Solutions',
    description: 'Leading technology company focused on innovation and building cutting-edge solutions for businesses worldwide. We specialize in cloud computing, artificial intelligence, and enterprise software development.',
    tagline: 'Innovation at Scale',
    website: 'https://techcorp.com',
    industry: 'Technology',
    size: '201-500 employees',
    founded: '2015',
    headquarters: 'San Francisco, CA',
    type: 'Private Company',
    fundingStage: 'Series B',
    mission: 'To build technology that empowers businesses and transforms industries through innovation and excellence.',
    vision: 'A world where every business has access to cutting-edge technology solutions.',
    values: ['Innovation', 'Integrity', 'Excellence', 'Collaboration', 'Customer Focus'],
    workEnvironment: 'Hybrid',
    diversityStatement: 'We are committed to building a diverse and inclusive workplace where everyone can thrive. We believe that diverse perspectives drive innovation.',
    achievements: [
      { title: 'Best Tech Employer 2023', organization: 'TechReview', year: '2023' },
      { title: 'Inc. 5000 Fastest Growing', organization: 'Inc. Magazine', year: '2023' },
      { title: 'Top Workplace Culture Award', organization: 'Glassdoor', year: '2022' },
      { title: 'Innovation Excellence Award', organization: 'Tech Innovation Summit', year: '2022' }
    ],
    departments: [
      { name: 'Engineering', count: 150 },
      { name: 'Sales & Marketing', count: 75 },
      { name: 'Product', count: 45 },
      { name: 'Operations', count: 35 },
      { name: 'HR & Admin', count: 20 }
    ],
    locations: [
      { 
        name: 'San Francisco HQ', 
        address: '123 Tech Street, San Francisco, CA 94105',
        type: 'Headquarters',
        employees: 200
      },
      { 
        name: 'New York Office', 
        address: '456 Park Ave, New York, NY 10022',
        type: 'Office',
        employees: 100
      },
      { 
        name: 'Austin Office', 
        address: '789 Innovation Blvd, Austin, TX 78701',
        type: 'Office',
        employees: 50
      }
    ],
    benefits: [
      'Health, Dental & Vision Insurance',
      'Flexible Work Arrangements',
      '401(k) with Company Match',
      'Professional Development Budget',
      'Unlimited PTO',
      'Stock Options',
      'Parental Leave',
      'Wellness Programs'
    ],
    perks: [
      'Free Meals & Snacks',
      'Gym Membership',
      'Team Events & Outings',
      'Learning Budget',
      'Home Office Stipend',
      'Commuter Benefits'
    ],
    techStack: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes'],
    socialLinks: {
      linkedIn: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp',
      facebook: 'https://facebook.com/techcorp',
      instagram: 'https://instagram.com/techcorp',
      github: 'https://github.com/techcorp',
      youtube: 'https://youtube.com/@techcorp'
    },
    contactInfo: {
      mainEmail: 'contact@techcorp.com',
      hrEmail: 'careers@techcorp.com',
      mainPhone: '+1 (555) 123-4567'
    },
    videoUrl: 'https://youtube.com/watch?v=example',
    photos: [] // Gallery photos would be here
  };

  // Mock open positions with complete job data
  const openPositions = [
    {
      id: 'job-1',
      title: 'Senior Software Engineer',
      company: companyInfo.name,
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$150k - $200k',
      posted: '2 days ago',
      description: 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing and building scalable systems.',
      skills: ['React', 'Node.js', 'AWS', 'Docker'],
      experienceLevel: 'Senior',
      workModel: 'Hybrid',
      applicationMethod: 'quick-apply' as const
    },
    {
      id: 'job-2',
      title: 'Product Manager',
      company: companyInfo.name,
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      salary: '$130k - $170k',
      posted: '1 week ago',
      description: 'Join our product team to drive innovation and build products that users love. You will work closely with engineering and design teams.',
      skills: ['Product Strategy', 'Roadmapping', 'Analytics', 'Agile'],
      experienceLevel: 'Mid-Senior',
      workModel: 'Remote',
      applicationMethod: 'quick-apply' as const
    },
    {
      id: 'job-3',
      title: 'UX Designer',
      company: companyInfo.name,
      department: 'Design',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$110k - $140k',
      posted: '3 days ago',
      description: 'We are seeking a talented UX Designer to create intuitive and beautiful user experiences for our products.',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      experienceLevel: 'Mid-Level',
      workModel: 'Hybrid',
      applicationMethod: 'quick-apply' as const
    },
    {
      id: 'job-4',
      title: 'Data Scientist',
      company: companyInfo.name,
      department: 'Data & Analytics',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$140k - $180k',
      posted: '5 days ago',
      description: 'Join our data team to extract insights and build machine learning models that drive business decisions.',
      skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
      experienceLevel: 'Senior',
      workModel: 'Hybrid',
      applicationMethod: 'quick-apply' as const
    },
    {
      id: 'job-5',
      title: 'Marketing Manager',
      company: companyInfo.name,
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $130k',
      posted: '1 week ago',
      description: 'Lead our marketing efforts and build strategies to grow our brand and customer base.',
      skills: ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Analytics'],
      experienceLevel: 'Mid-Senior',
      workModel: 'Remote',
      applicationMethod: 'quick-apply' as const
    },
    {
      id: 'job-6',
      title: 'DevOps Engineer',
      company: companyInfo.name,
      department: 'Engineering',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$130k - $160k',
      posted: '4 days ago',
      description: 'Help us build and maintain our infrastructure and CI/CD pipelines for seamless deployments.',
      skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
      experienceLevel: 'Mid-Senior',
      workModel: 'Hybrid',
      applicationMethod: 'quick-apply' as const
    }
  ];

  const stats = [
    {
      label: 'Total Employees',
      value: companyInfo.size.split('-')[0] || '200+',
      icon: Users,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      label: 'Open Positions',
      value: openPositions.length.toString(),
      icon: Briefcase,
      color: 'text-green-600 bg-green-50'
    },
    {
      label: 'Office Locations',
      value: companyInfo.locations.length.toString(),
      icon: MapPin,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      label: 'Founded',
      value: companyInfo.founded,
      icon: Calendar,
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: companyInfo.name,
        text: companyInfo.tagline,
        url: globalThis.location.href
      });
    }
  };

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleQuickApply = (job: any) => {
    if (onJobApplication) {
      onJobApplication(job, 'quick-apply');
      setAppliedJobs(prev => new Set(prev).add(job.id));
    }
  };

  const handleViewJobDetails = (job: any) => {
    if (onNavigateToJobDetails) {
      onNavigateToJobDetails(job);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      {/* Minimal Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate?.('homepage')} 
              className="rounded-full w-10 h-10 p-0 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <button 
              onClick={() => onNavigate?.('homepage')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-xl">
                <span className="text-gray-900">the</span>
                <span className="text-[#ff6b35]">Garage</span>
              </span>
            </button>

            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Company Header Card */}
        <Card className="p-8 mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Company Logo */}
            <div className="w-32 h-32 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Building2 className="w-16 h-16" />
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-3xl text-gray-900 mb-2">{companyInfo.name}</h1>
                  <p className="text-lg text-gray-600">{companyInfo.tagline}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={isFollowing ? "default" : "outline"}
                    onClick={handleFollow}
                    className={isFollowing ? "bg-[#ff6b35] hover:bg-[#e55a2b] text-white" : "border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    className={isSaved ? "border-[#ff6b35] text-[#ff6b35]" : ""}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <Badge className="bg-[#ff6b35] text-white">{companyInfo.type}</Badge>
                <Badge variant="secondary">{companyInfo.fundingStage}</Badge>
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{companyInfo.industry}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{companyInfo.headquarters}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Founded {companyInfo.founded}</span>
                </div>
                <a 
                  href={companyInfo.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-[#ff6b35] hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <p className="text-2xl text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="culture" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
              Culture & Values
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
              Locations
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
              Open Jobs
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* About Section */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#ff6b35]" />
                About {companyInfo.name}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {companyInfo.description}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#ff6b35]" />
                    Our Mission
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {companyInfo.mission}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ff6b35]" />
                    Our Vision
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {companyInfo.vision}
                  </p>
                </div>
              </div>
            </Card>

            {/* Video Section */}
            {companyInfo.videoUrl && (
              <Card className="p-6">
                <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#ff6b35]" />
                  Company Video
                </h2>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Video player would be embedded here</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Departments */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ff6b35]" />
                Our Teams
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companyInfo.departments.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg">
                    <span className="font-medium text-gray-900">{dept.name}</span>
                    <Badge variant="secondary">{dept.count} people</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tech Stack */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {companyInfo.techStack.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ff6b35]" />
                Awards & Recognition
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {companyInfo.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg">
                    <Award className="w-5 h-5 text-[#ff6b35] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.organization} • {achievement.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* CULTURE & VALUES TAB */}
          <TabsContent value="culture" className="space-y-6">
            {/* Core Values */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#ff6b35]" />
                Our Core Values
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companyInfo.values.map((value, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-[#ff6b35] flex-shrink-0" />
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Work Environment */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-[#ff6b35]" />
                Work Environment
              </h2>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg mb-4">
                <Badge className="bg-blue-600 text-white">{companyInfo.workEnvironment}</Badge>
                <p className="text-gray-700">Flexible work arrangements with hybrid options</p>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We believe in providing our team with the flexibility to work where they're most productive. 
                Our hybrid model allows employees to balance in-office collaboration with remote work flexibility.
              </p>
            </Card>

            {/* Diversity & Inclusion */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4">Diversity & Inclusion</h2>
              <p className="text-gray-600 leading-relaxed">
                {companyInfo.diversityStatement}
              </p>
            </Card>

            {/* Benefits & Perks */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Employee Benefits
                </h2>
                <div className="space-y-3">
                  {companyInfo.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#ff6b35]" />
                  Office Perks
                </h2>
                <div className="space-y-3">
                  {companyInfo.perks.map((perk, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#ff6b35]" />
                      <span className="text-gray-700">{perk}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Photo Gallery Placeholder */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#ff6b35]" />
                Life at {companyInfo.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* LOCATIONS TAB */}
          <TabsContent value="locations" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {companyInfo.locations.map((location, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg text-gray-900 mb-1">{location.name}</h3>
                      <Badge variant={location.type === 'Headquarters' ? 'default' : 'secondary'} 
                             className={location.type === 'Headquarters' ? 'bg-[#ff6b35]' : ''}>
                        {location.type}
                      </Badge>
                    </div>
                    <MapPin className="w-5 h-5 text-[#ff6b35]" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>{location.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{location.employees} employees</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Contact Information */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#ff6b35]" />
                    <div>
                      <p className="text-sm text-gray-500">General Inquiries</p>
                      <a href={`mailto:${companyInfo.contactInfo.mainEmail}`} className="text-[#ff6b35] hover:underline">
                        {companyInfo.contactInfo.mainEmail}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#ff6b35]" />
                    <div>
                      <p className="text-sm text-gray-500">Careers</p>
                      <a href={`mailto:${companyInfo.contactInfo.hrEmail}`} className="text-[#ff6b35] hover:underline">
                        {companyInfo.contactInfo.hrEmail}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#ff6b35]" />
                    <div>
                      <p className="text-sm text-gray-500">Main Phone</p>
                      <a href={`tel:${companyInfo.contactInfo.mainPhone}`} className="text-[#ff6b35] hover:underline">
                        {companyInfo.contactInfo.mainPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <Separator className="my-6" />
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Follow Us</h3>
                <div className="flex flex-wrap gap-2">
                  {companyInfo.socialLinks.linkedIn && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={companyInfo.socialLinks.linkedIn} target="_blank" rel="noopener noreferrer">
                        <svg className="w-4 h-4 mr-2 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {companyInfo.socialLinks.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={companyInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <svg className="w-4 h-4 mr-2 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                      </a>
                    </Button>
                  )}
                  {companyInfo.socialLinks.facebook && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={companyInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                        <svg className="w-4 h-4 mr-2 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </a>
                    </Button>
                  )}
                  {companyInfo.socialLinks.instagram && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={companyInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                        <svg className="w-4 h-4 mr-2 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069 3.204 0 3.584.013 4.85.069 3.252.149 4.771 1.699 4.919 4.92.058 1.265.07 1.645.07 4.849zm-7.469 9.846c0 2.094-1.697 3.791-3.791 3.791s-3.791-1.697-3.791-3.791 1.697-3.791 3.791-3.791 3.791 1.697 3.791 3.791zm8.469-8.469c0-.966-.784-1.75-1.75-1.75h-13.5c-.966 0-1.75.784-1.75 1.75v13.5c0 .966.784 1.75 1.75 1.75h13.5c.966 0 1.75-.784 1.75-1.75v-13.5z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Instagram
                      </a>
                    </Button>
                  )}
                  {companyInfo.socialLinks.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={companyInfo.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <svg className="w-4 h-4 mr-2 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    </Button>
                  )}
                  {companyInfo.socialLinks.youtube && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={companyInfo.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                        <svg className="w-4 h-4 mr-2 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        YouTube
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* OPEN JOBS TAB */}
          <TabsContent value="jobs" className="space-y-6">
            {/* Header with Filters */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl text-gray-900">Open Positions at {companyInfo.name}</h2>
                  <p className="text-gray-600 mt-1">{openPositions.length} jobs available</p>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-[#ff6b35] hover:text-white hover:border-[#ff6b35] transition-colors">
                  All ({openPositions.length})
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#ff6b35] hover:text-white hover:border-[#ff6b35] transition-colors">
                  Engineering (3)
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#ff6b35] hover:text-white hover:border-[#ff6b35] transition-colors">
                  Product (1)
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#ff6b35] hover:text-white hover:border-[#ff6b35] transition-colors">
                  Design (1)
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#ff6b35] hover:text-white hover:border-[#ff6b35] transition-colors">
                  Remote (2)
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#ff6b35] hover:text-white hover:border-[#ff6b35] transition-colors">
                  Hybrid (3)
                </Badge>
              </div>
            </Card>

            {/* Job Cards */}
            <div className="space-y-4">
              {openPositions.map((job) => {
                const isSaved = savedJobs.has(job.id);
                const isApplied = appliedJobs.has(job.id);
                
                return (
                  <Card key={job.id} className="p-6 hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-[#ff6b35]">
                    <div className="flex items-start gap-4">
                      {/* Company Logo */}
                      <div className="w-16 h-16 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        <Building2 className="w-8 h-8" />
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <button
                              onClick={() => handleViewJobDetails(job)}
                              className="text-xl text-gray-900 hover:text-[#ff6b35] transition-colors text-left"
                            >
                              {job.title}
                            </button>
                            <p className="text-gray-600 mt-1">{companyInfo.name}</p>
                          </div>
                          
                          {/* Save Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSaveJob(job.id)}
                            className={isSaved ? "text-[#ff6b35]" : "text-gray-400 hover:text-[#ff6b35]"}
                          >
                            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                          </Button>
                        </div>

                        {/* Job Meta */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            <span>{job.workModel}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500">Posted {job.posted}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{job.description}</p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-orange-50 text-[#ff6b35] hover:bg-orange-100">
                              {skill}
                            </Badge>
                          ))}
                          <Badge variant="outline" className="border-gray-300">
                            {job.experienceLevel}
                          </Badge>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          {isApplied ? (
                            <Button 
                              disabled
                              className="bg-green-600 hover:bg-green-600 cursor-not-allowed"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Applied
                            </Button>
                          ) : (
                            <>
                              <Button 
                                onClick={() => handleQuickApply(job)}
                                className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                              >
                                <Zap className="w-4 h-4 mr-2" />
                                Quick Apply
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => handleViewJobDetails(job)}
                                className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"
                              >
                                View Details
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Why Join Us */}
            <Card className="p-6 bg-gradient-to-r from-orange-50 to-white">
              <h2 className="text-xl text-gray-900 mb-4">Why Join {companyInfo.name}?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Growth Opportunities</h3>
                  <p className="text-sm text-gray-600">Continuous learning and career development</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Collaborative Culture</h3>
                  <p className="text-sm text-gray-600">Work with talented and passionate people</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Great Benefits</h3>
                  <p className="text-sm text-gray-600">Comprehensive benefits and perks package</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
