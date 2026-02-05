import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  MapPin, Briefcase, Calendar, Edit3, Share2, Mail, Linkedin, Github, 
  Globe, Plus, GraduationCap, Award, Code, FileText, Eye, TrendingUp, 
  Users, ExternalLink, Clock, Activity, 
  Trash2, Save, Search} from 'lucide-react';
import { AppHeader } from './AppHeader';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CareerPathStory } from './CareerPathStory';
import img654553Fedbede7976B97Eaf5Professional5ReminiEnhanced from "figma:asset/5d47026abe4e77aa0174b98e6e5497be2b9b5962.png";

interface ProfileProps {
  onNavigate: (view: string) => void;
  onBack?: () => void;
  user?: any;
  onLogout?: () => void;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  logo?: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  activities?: string;
}

interface Skill {
  id: string;
  name: string;
  category: 'Technical' | 'Soft' | 'Tools';
  proficiency: number;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  tags: string[];
}

export function Profile({ onNavigate, user, onLogout }: Readonly<ProfileProps>) {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<string | null>(null);
  
  // Profile Data
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'Mike',
    lastName: user?.lastName || 'Perry',
    email: user?.email || 'mike.perry@email.com',
    phone: '+1 (416) 555-0123',
    location: 'Toronto, ON',
    title: 'Senior Data Analyst',
    company: 'BMO Financial Group',
    bio: 'Passionate about data-driven risk strategies and fostering collaboration across teams. Currently seeking opportunities to leverage my expertise in analytics and financial modeling to drive business growth.',
    linkedin: 'linkedin.com/in/mikeperry',
    github: 'github.com/mikeperry',
    portfolio: 'mikeperry.dev',
    joinedDate: 'March 2024'
  });

  const [tempProfileData, setTempProfileData] = useState(profileData);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      company: 'BMO Financial Group',
      position: 'Senior Data Analyst',
      location: 'Toronto, ON',
      startDate: '2022-01',
      current: true,
      description: 'Led data-driven initiatives to optimize risk assessment models, resulting in 15% improvement in prediction accuracy. Collaborated with cross-functional teams to develop dashboards and reporting solutions.',
      logo: '🏦'
    },
    {
      id: '2',
      company: 'Deloitte',
      position: 'Data Analyst',
      location: 'Toronto, ON',
      startDate: '2020-03',
      endDate: '2021-12',
      current: false,
      description: 'Developed analytics solutions for financial services clients, focusing on risk management and regulatory compliance. Created automated reporting systems that reduced manual work by 40%.',
      logo: '💼'
    }
  ]);

  const [tempExperience, setTempExperience] = useState<Experience | null>(null);
  const [newExperience, setNewExperience] = useState<Experience>({
    id: '',
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    logo: '🏢'
  });

  const [education, setEducation] = useState<Education[]>([
    {
      id: '1',
      school: 'University of Toronto',
      degree: 'Master of Science',
      field: 'Data Science',
      startDate: '2018-09',
      endDate: '2020-05',
      current: false,
      gpa: '3.8/4.0',
      activities: 'Data Science Club President, Research Assistant'
    },
    {
      id: '2',
      school: 'McMaster University',
      degree: 'Bachelor of Commerce',
      field: 'Finance',
      startDate: '2014-09',
      endDate: '2018-05',
      current: false,
      gpa: '3.6/4.0'
    }
  ]);

  const [tempEducation, setTempEducation] = useState<Education | null>(null);
  const [newEducation, setNewEducation] = useState<Education>({
    id: '',
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    activities: ''
  });

  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'Python', category: 'Technical', proficiency: 90 },
    { id: '2', name: 'SQL', category: 'Technical', proficiency: 95 },
    { id: '3', name: 'Tableau', category: 'Tools', proficiency: 85 },
    { id: '4', name: 'R', category: 'Technical', proficiency: 75 },
    { id: '5', name: 'Machine Learning', category: 'Technical', proficiency: 80 },
    { id: '6', name: 'Leadership', category: 'Soft', proficiency: 85 },
    { id: '7', name: 'Communication', category: 'Soft', proficiency: 90 },
    { id: '8', name: 'Power BI', category: 'Tools', proficiency: 80 }
  ]);

  const [newSkill, setNewSkill] = useState<Skill>({
    id: '',
    name: '',
    category: 'Technical',
    proficiency: 50
  });

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2023-06',
      expiryDate: '2026-06',
      credentialId: 'AWS-12345'
    },
    {
      id: '2',
      name: 'Google Data Analytics Professional Certificate',
      issuer: 'Google',
      issueDate: '2022-03',
      credentialUrl: 'https://coursera.org/verify/professional-cert/...'
    }
  ]);

  const [tempCertification, setTempCertification] = useState<Certification | null>(null);
  const [newCertification, setNewCertification] = useState<Certification>({
    id: '',
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: ''
  });

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Credit Risk Prediction Model',
      description: 'Developed a machine learning model to predict credit default risk with 92% accuracy using Python and scikit-learn.',
      url: 'github.com/mikeperry/credit-risk',
      tags: ['Python', 'ML', 'Finance']
    },
    {
      id: '2',
      name: 'Sales Dashboard Analytics',
      description: 'Built interactive Tableau dashboards for real-time sales tracking and forecasting.',
      tags: ['Tableau', 'Analytics', 'Visualization']
    }
  ]);

  const [tempProject, setTempProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    id: '',
    name: '',
    description: '',
    url: '',
    tags: []
  });

  // Profile insights
  const profileInsights = {
    views: 234,
    searchAppearances: 45,
    recruiterEngagement: 12,
    profileStrength: 85
  };

  // Quick stats
  const quickStats = [
    { label: 'Applications', count: 28, trend: '+12%', icon: FileText, color: 'text-blue-600' },
    { label: 'Interviews', count: 8, trend: '+25%', icon: Users, color: 'text-green-600' },
    { label: 'Response Rate', count: '42%', trend: '+8%', icon: TrendingUp, color: 'text-[#ff6b35]' },
    { label: 'Avg. Response Time', count: '3.5d', trend: '-1d', icon: Clock, color: 'text-purple-600' }
  ];

  const getProfileCompletion = () => {
    let completed = 0;
    let total = 9;
    
    if (profileData.bio) completed++;
    if (experiences.length > 0) completed++;
    if (education.length > 0) completed++;
    if (skills.length >= 5) completed++;
    if (certifications.length > 0) completed++;
    if (projects.length > 0) completed++;
    if (profileData.linkedin) completed++;
    if (profileData.github) completed++;
    if (profileData.portfolio) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Edit handlers
  const handleEditHeader = () => {
    setTempProfileData(profileData);
    setEditingSection('header');
  };

  const handleSaveHeader = () => {
    setProfileData(tempProfileData);
    setEditingSection(null);
  };

  const handleCancelHeader = () => {
    setTempProfileData(profileData);
    setEditingSection(null);
  };

  // Experience handlers
  const handleAddExperience = () => {
    setIsAddingNew('experience');
    setNewExperience({
      id: '',
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      logo: '🏢'
    });
  };

  const handleSaveNewExperience = () => {
    if (newExperience.company && newExperience.position && newExperience.startDate) {
      setExperiences([...experiences, { ...newExperience, id: Date.now().toString() }]);
      setIsAddingNew(null);
    }
  };

  const handleCancelNewExperience = () => {
    setIsAddingNew(null);
  };

  const handleEditExperience = (exp: Experience) => {
    setTempExperience({ ...exp });
    setEditingItemId(exp.id);
  };

  const handleSaveExperience = () => {
    if (tempExperience) {
      setExperiences(experiences.map(exp => 
        exp.id === tempExperience.id ? tempExperience : exp
      ));
      setTempExperience(null);
      setEditingItemId(null);
    }
  };

  const handleCancelExperience = () => {
    setTempExperience(null);
    setEditingItemId(null);
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  // Education handlers
  const handleAddEducation = () => {
    setIsAddingNew('education');
    setNewEducation({
      id: '',
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      activities: ''
    });
  };

  const handleSaveNewEducation = () => {
    if (newEducation.school && newEducation.degree && newEducation.field && newEducation.startDate) {
      setEducation([...education, { ...newEducation, id: Date.now().toString() }]);
      setIsAddingNew(null);
    }
  };

  const handleCancelNewEducation = () => {
    setIsAddingNew(null);
  };

  const handleEditEducation = (edu: Education) => {
    setTempEducation({ ...edu });
    setEditingItemId(edu.id);
  };

  const handleSaveEducation = () => {
    if (tempEducation) {
      setEducation(education.map(edu => 
        edu.id === tempEducation.id ? tempEducation : edu
      ));
      setTempEducation(null);
      setEditingItemId(null);
    }
  };

  const handleCancelEducation = () => {
    setTempEducation(null);
    setEditingItemId(null);
  };

  const handleDeleteEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  // Skill handlers
  const handleAddSkill = () => {
    setIsAddingNew('skill');
    setNewSkill({
      id: '',
      name: '',
      category: 'Technical',
      proficiency: 50
    });
  };

  const handleSaveNewSkill = () => {
    if (newSkill.name) {
      setSkills([...skills, { ...newSkill, id: Date.now().toString() }]);
      setIsAddingNew(null);
    }
  };

  const handleCancelNewSkill = () => {
    setIsAddingNew(null);
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  // Certification handlers
  const handleAddCertification = () => {
    setIsAddingNew('certification');
    setNewCertification({
      id: '',
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: ''
    });
  };

  const handleSaveNewCertification = () => {
    if (newCertification.name && newCertification.issuer && newCertification.issueDate) {
      setCertifications([...certifications, { ...newCertification, id: Date.now().toString() }]);
      setIsAddingNew(null);
    }
  };

  const handleCancelNewCertification = () => {
    setIsAddingNew(null);
  };

  const handleEditCertification = (cert: Certification) => {
    setTempCertification({ ...cert });
    setEditingItemId(cert.id);
  };

  const handleSaveCertification = () => {
    if (tempCertification) {
      setCertifications(certifications.map(cert => 
        cert.id === tempCertification.id ? tempCertification : cert
      ));
      setTempCertification(null);
      setEditingItemId(null);
    }
  };

  const handleCancelCertification = () => {
    setTempCertification(null);
    setEditingItemId(null);
  };

  const handleDeleteCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  // Project handlers
  const handleAddProject = () => {
    setIsAddingNew('project');
    setNewProject({
      id: '',
      name: '',
      description: '',
      url: '',
      tags: []
    });
  };

  const handleSaveNewProject = () => {
    if (newProject.name && newProject.description) {
      setProjects([...projects, { ...newProject, id: Date.now().toString() }]);
      setIsAddingNew(null);
    }
  };

  const handleCancelNewProject = () => {
    setIsAddingNew(null);
  };

  const handleEditProject = (proj: Project) => {
    setTempProject({ ...proj });
    setEditingItemId(proj.id);
  };

  const handleSaveProject = () => {
    if (tempProject) {
      setProjects(projects.map(proj => 
        proj.id === tempProject.id ? tempProject : proj
      ));
      setTempProject(null);
      setEditingItemId(null);
    }
  };

  const handleCancelProject = () => {
    setTempProject(null);
    setEditingItemId(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <AppHeader
        userRole="job-seeker"
        user={user}
        currentView="profile"
        onNavigate={onNavigate}
        onLogout={onLogout || (() => {})}
      />

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Profile Header */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-orange-100 shadow-xl mb-8">
          <div className="flex items-start gap-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-40 h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg ring-4 ring-white">
                <ImageWithFallback
                  src={img654553Fedbede7976B97Eaf5Professional5ReminiEnhanced}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-orange-100">
                <Edit3 className="w-4 h-4 text-[#ff6b35]" />
              </button>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-green-500 rounded-full shadow-lg ring-4 ring-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {editingSection === 'header' ? (
                    <div className="space-y-3 mb-4">
                      <div className="flex gap-3">
                        <Input 
                          value={tempProfileData.firstName}
                          onChange={(e) => setTempProfileData({ ...tempProfileData, firstName: e.target.value })}
                          placeholder="First Name"
                          className="flex-1"
                        />
                        <Input 
                          value={tempProfileData.lastName}
                          onChange={(e) => setTempProfileData({ ...tempProfileData, lastName: e.target.value })}
                          placeholder="Last Name"
                          className="flex-1"
                        />
                      </div>
                      <Input 
                        value={tempProfileData.title}
                        onChange={(e) => setTempProfileData({ ...tempProfileData, title: e.target.value })}
                        placeholder="Job Title"
                      />
                      <Input 
                        value={tempProfileData.company}
                        onChange={(e) => setTempProfileData({ ...tempProfileData, company: e.target.value })}
                        placeholder="Company"
                      />
                      <Input 
                        value={tempProfileData.location}
                        onChange={(e) => setTempProfileData({ ...tempProfileData, location: e.target.value })}
                        placeholder="Location"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveHeader} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelHeader}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl text-gray-900">{profileData.firstName} {profileData.lastName}</h1>
                        <button 
                          onClick={handleEditHeader}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-gray-400 hover:text-[#ff6b35]" />
                        </button>
                      </div>
                      <p className="text-lg text-gray-600 mb-2">
                        {profileData.title} @ <span className="text-[#ff6b35]">{profileData.company}</span>
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {profileData.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {profileData.joinedDate}
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <Activity className="w-4 h-4" />
                          Active now
                        </span>
                      </div>
                    </>
                  )}
                </div>
                
                <Button size="sm" className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Profile Completion */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Profile Strength</span>
                  <span className="text-sm font-medium text-[#ff6b35]">{getProfileCompletion()}%</span>
                </div>
                <Progress value={getProfileCompletion()} className="h-2" />
              </div>

              {/* Contact Links */}
              <div className="flex items-center gap-3 flex-wrap">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                  <Mail className="w-4 h-4" />
                  {profileData.email}
                </button>
                {profileData.linkedin && (
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </button>
                )}
                {profileData.github && (
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors text-sm">
                    <Github className="w-4 h-4" />
                    GitHub
                  </button>
                )}
                {profileData.portfolio && (
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors text-sm">
                    <Globe className="w-4 h-4" />
                    Portfolio
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Insights */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border-orange-100 bg-white/80">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-gray-500">Last 30 days</span>
            </div>
            <div className="text-2xl mb-1">{profileInsights.views}</div>
            <div className="text-sm text-gray-600">Profile Views</div>
          </Card>
          <Card className="p-4 border-orange-100 bg-white/80">
            <div className="flex items-center justify-between mb-2">
              <Search className="w-5 h-5 text-green-500" />
              <span className="text-xs text-gray-500">This month</span>
            </div>
            <div className="text-2xl mb-1">{profileInsights.searchAppearances}</div>
            <div className="text-sm text-gray-600">Search Appearances</div>
          </Card>
          <Card className="p-4 border-orange-100 bg-white/80">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-[#ff6b35]" />
              <span className="text-xs text-gray-500">This week</span>
            </div>
            <div className="text-2xl mb-1">{profileInsights.recruiterEngagement}</div>
            <div className="text-sm text-gray-600">Recruiter Views</div>
          </Card>
          <Card className="p-4 border-orange-100 bg-white/80">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-gray-500">Overall</span>
            </div>
            <div className="text-2xl mb-1">{profileInsights.profileStrength}%</div>
            <div className="text-sm text-gray-600">Profile Strength</div>
          </Card>
        </div>

        {/* Main Content Tabs - Compact Design */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-orange-100 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
              Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
              Education
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
              Skills
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
              Projects
            </TabsTrigger>
            <TabsTrigger value="career" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
              Career Story
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Read-Only Consolidated View */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              {quickStats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={stat.label} className="p-4 bg-white/80 border-orange-100">
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className={`w-5 h-5 ${stat.color}`} />
                      <Badge variant="outline" className="text-xs">
                        {stat.trend}
                      </Badge>
                    </div>
                    <div className="text-2xl mb-1">{stat.count}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </Card>
                );
              })}
            </div>

            {/* Work Experience Overview */}
            <Card className="p-6 bg-white/80 border-orange-100">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-[#ff6b35]" />
                <h3 className="text-lg text-gray-900">Work Experience</h3>
                <Badge variant="outline" className="text-xs">{experiences.length} position{experiences.length === 1 ? '' : 's'}</Badge>
              </div>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-3xl">{exp.logo}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{exp.position}</h4>
                      <p className="text-[#ff6b35]">{exp.company}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span>
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                        </span>
                        {exp.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {exp.location}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Education Overview */}
            <Card className="p-6 bg-white/80 border-orange-100">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-[#ff6b35]" />
                <h3 className="text-lg text-gray-900">Education</h3>
                <Badge variant="outline" className="text-xs">{education.length} degree{education.length === 1 ? '' : 's'}</Badge>
              </div>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h4>
                    <p className="text-[#ff6b35]">{edu.school}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>
                        {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate!)}
                      </span>
                      {edu.gpa && (
                        <>
                          <span>•</span>
                          <span>GPA: {edu.gpa}</span>
                        </>
                      )}
                    </div>
                    {edu.activities && (
                      <p className="text-sm text-gray-700 mt-2">{edu.activities}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills Overview */}
            <Card className="p-6 bg-white/80 border-orange-100">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-[#ff6b35]" />
                <h3 className="text-lg text-gray-900">Skills</h3>
                <Badge variant="outline" className="text-xs">{skills.length} skill{skills.length === 1 ? '' : 's'}</Badge>
              </div>
              <div className="space-y-4">
                {['Technical', 'Tools', 'Soft'].map((category) => {
                  const categorySkills = skills.filter(s => s.category === category);
                  if (categorySkills.length === 0) return null;
                  return (
                    <div key={category}>
                      <h4 className="text-sm text-gray-600 mb-2">{category} Skills</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {categorySkills.map((skill) => (
                          <div key={skill.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-900">{skill.name}</span>
                              <span className="text-xs text-gray-500">{skill.proficiency}%</span>
                            </div>
                            <Progress value={skill.proficiency} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Certifications Overview */}
            {certifications.length > 0 && (
              <Card className="p-6 bg-white/80 border-orange-100">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-[#ff6b35]" />
                  <h3 className="text-lg text-gray-900">Certifications</h3>
                  <Badge variant="outline" className="text-xs">{certifications.length} certification{certifications.length === 1 ? '' : 's'}</Badge>
                </div>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{cert.name}</h4>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>Issued {formatDate(cert.issueDate)}</span>
                          {cert.expiryDate && (
                            <>
                              <span>•</span>
                              <span>Expires {formatDate(cert.expiryDate)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Projects Overview */}
            {projects.length > 0 && (
              <Card className="p-6 bg-white/80 border-orange-100">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#ff6b35]" />
                  <h3 className="text-lg text-gray-900">Projects</h3>
                  <Badge variant="outline" className="text-xs">{projects.length} project{projects.length === 1 ? '' : 's'}</Badge>
                </div>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        {project.url && (
                          <a href={project.url} className="text-[#ff6b35] hover:text-[#e55a2b]">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="p-6 bg-white/80 border-orange-100">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-[#ff6b35]" />
                <h3 className="text-lg text-gray-900">Contact & Links</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-gray-900">{profileData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="text-gray-900">{profileData.phone}</p>
                </div>
                {profileData.linkedin && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">LinkedIn</p>
                    <p className="text-[#ff6b35]">{profileData.linkedin}</p>
                  </div>
                )}
                {profileData.github && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">GitHub</p>
                    <p className="text-[#ff6b35]">{profileData.github}</p>
                  </div>
                )}
                {profileData.portfolio && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Portfolio</p>
                    <p className="text-[#ff6b35]">{profileData.portfolio}</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-gray-900">Work Experience</h3>
              <Button size="sm" onClick={handleAddExperience} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>

            {/* Add New Experience Form */}
            {isAddingNew === 'experience' && (
              <Card className="p-6 bg-white/80 border-orange-200 border-2">
                <h4 className="font-medium text-gray-900 mb-4">Add New Experience</h4>
                <div className="space-y-3">
                  <Input
                    value={newExperience.position}
                    onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                    placeholder="Position"
                  />
                  <Input
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    placeholder="Company"
                  />
                  <Input
                    value={newExperience.location || ''}
                    onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                    placeholder="Location (optional)"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="month"
                      value={newExperience.startDate}
                      onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                      placeholder="Start Date"
                    />
                    <Input
                      type="month"
                      value={newExperience.endDate || ''}
                      onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                      placeholder="End Date"
                      disabled={newExperience.current}
                    />
                  </div>
                  <Textarea
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    placeholder="Description"
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveNewExperience} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelNewExperience}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            
            {experiences.map((exp) => (
              <Card key={exp.id} className="p-6 bg-white/80 border-orange-100">
                {editingItemId === exp.id && tempExperience ? (
                  <div className="space-y-3">
                    <Input
                      value={tempExperience.position}
                      onChange={(e) => setTempExperience({ ...tempExperience, position: e.target.value })}
                      placeholder="Position"
                    />
                    <Input
                      value={tempExperience.company}
                      onChange={(e) => setTempExperience({ ...tempExperience, company: e.target.value })}
                      placeholder="Company"
                    />
                    <Input
                      value={tempExperience.location || ''}
                      onChange={(e) => setTempExperience({ ...tempExperience, location: e.target.value })}
                      placeholder="Location"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="month"
                        value={tempExperience.startDate}
                        onChange={(e) => setTempExperience({ ...tempExperience, startDate: e.target.value })}
                        placeholder="Start Date"
                      />
                      <Input
                        type="month"
                        value={tempExperience.endDate || ''}
                        onChange={(e) => setTempExperience({ ...tempExperience, endDate: e.target.value })}
                        placeholder="End Date"
                        disabled={tempExperience.current}
                      />
                    </div>
                    <Textarea
                      value={tempExperience.description}
                      onChange={(e) => setTempExperience({ ...tempExperience, description: e.target.value })}
                      placeholder="Description"
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveExperience} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelExperience}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="text-4xl">{exp.logo}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{exp.position}</h4>
                        <p className="text-[#ff6b35] mb-1">{exp.company}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                          <span>
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                          </span>
                          {exp.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {exp.location}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditExperience(exp)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-gray-400 hover:text-[#ff6b35]" />
                      </button>
                      <button 
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-gray-900">Education</h3>
              <Button size="sm" onClick={handleAddEducation} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>

            {/* Add New Education Form */}
            {isAddingNew === 'education' && (
              <Card className="p-6 bg-white/80 border-orange-200 border-2">
                <h4 className="font-medium text-gray-900 mb-4">Add New Education</h4>
                <div className="space-y-3">
                  <Input
                    value={newEducation.school}
                    onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                    placeholder="School"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                      placeholder="Degree"
                    />
                    <Input
                      value={newEducation.field}
                      onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                      placeholder="Field of Study"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="month"
                      value={newEducation.startDate}
                      onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                      placeholder="Start Date"
                    />
                    <Input
                      type="month"
                      value={newEducation.endDate || ''}
                      onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                      placeholder="End Date"
                      disabled={newEducation.current}
                    />
                  </div>
                  <Input
                    value={newEducation.gpa || ''}
                    onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
                    placeholder="GPA (optional)"
                  />
                  <Textarea
                    value={newEducation.activities || ''}
                    onChange={(e) => setNewEducation({ ...newEducation, activities: e.target.value })}
                    placeholder="Activities (optional)"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveNewEducation} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelNewEducation}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            
            {education.map((edu) => (
              <Card key={edu.id} className="p-6 bg-white/80 border-orange-100">
                {editingItemId === edu.id && tempEducation ? (
                  <div className="space-y-3">
                    <Input
                      value={tempEducation.school}
                      onChange={(e) => setTempEducation({ ...tempEducation, school: e.target.value })}
                      placeholder="School"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={tempEducation.degree}
                        onChange={(e) => setTempEducation({ ...tempEducation, degree: e.target.value })}
                        placeholder="Degree"
                      />
                      <Input
                        value={tempEducation.field}
                        onChange={(e) => setTempEducation({ ...tempEducation, field: e.target.value })}
                        placeholder="Field of Study"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="month"
                        value={tempEducation.startDate}
                        onChange={(e) => setTempEducation({ ...tempEducation, startDate: e.target.value })}
                        placeholder="Start Date"
                      />
                      <Input
                        type="month"
                        value={tempEducation.endDate || ''}
                        onChange={(e) => setTempEducation({ ...tempEducation, endDate: e.target.value })}
                        placeholder="End Date"
                        disabled={tempEducation.current}
                      />
                    </div>
                    <Input
                      value={tempEducation.gpa || ''}
                      onChange={(e) => setTempEducation({ ...tempEducation, gpa: e.target.value })}
                      placeholder="GPA (optional)"
                    />
                    <Textarea
                      value={tempEducation.activities || ''}
                      onChange={(e) => setTempEducation({ ...tempEducation, activities: e.target.value })}
                      placeholder="Activities (optional)"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEducation} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEducation}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{edu.degree} in {edu.field}</h4>
                        <p className="text-[#ff6b35] mb-1">{edu.school}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                          <span>
                            {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate!)}
                          </span>
                          {edu.gpa && (
                            <>
                              <span>•</span>
                              <span>GPA: {edu.gpa}</span>
                            </>
                          )}
                        </div>
                        {edu.activities && (
                          <p className="text-sm text-gray-600">{edu.activities}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditEducation(edu)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-gray-400 hover:text-[#ff6b35]" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            {/* Skills Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-gray-900">Skills</h3>
                <Button size="sm" onClick={handleAddSkill} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>

              {/* Add New Skill Form */}
              {isAddingNew === 'skill' && (
                <Card className="p-5 bg-white/80 border-orange-200 border-2 mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Add New Skill</h4>
                  <div className="space-y-3">
                    <Input
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="Skill Name"
                    />
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700">Category</label>
                      <select
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as 'Technical' | 'Soft' | 'Tools' })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Tools">Tools</option>
                        <option value="Soft">Soft</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700">Proficiency: {newSkill.proficiency}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={newSkill.proficiency}
                        onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number.parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveNewSkill} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelNewSkill}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
              
              <div className="grid grid-cols-3 gap-6">
                {['Technical', 'Tools', 'Soft'].map((category) => (
                  <Card key={category} className="p-5 bg-white/80 border-orange-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Code className="w-4 h-4 text-[#ff6b35]" />
                      </div>
                      <h4 className="font-medium text-gray-900">{category}</h4>
                    </div>
                    <div className="space-y-3">
                      {skills.filter(s => s.category === category).map((skill) => (
                        <div key={skill.id} className="group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-900">{skill.name}</span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Edit3 className="w-3 h-3 text-gray-400 hover:text-[#ff6b35]" />
                              </button>
                              <button 
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="p-1 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-full transition-all"
                                style={{ width: `${skill.proficiency}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-10 text-right">{skill.proficiency}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-gray-900">Certifications</h3>
                <Button size="sm" onClick={handleAddCertification} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </div>

              {/* Add New Certification Form */}
              {isAddingNew === 'certification' && (
                <Card className="p-5 bg-white/80 border-orange-200 border-2 mb-4">
                  <h4 className="font-medium text-gray-900 mb-4">Add New Certification</h4>
                  <div className="space-y-3">
                    <Input
                      value={newCertification.name}
                      onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                      placeholder="Certification Name"
                    />
                    <Input
                      value={newCertification.issuer}
                      onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                      placeholder="Issuer"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="month"
                        value={newCertification.issueDate}
                        onChange={(e) => setNewCertification({ ...newCertification, issueDate: e.target.value })}
                        placeholder="Issue Date"
                      />
                      <Input
                        type="month"
                        value={newCertification.expiryDate || ''}
                        onChange={(e) => setNewCertification({ ...newCertification, expiryDate: e.target.value })}
                        placeholder="Expiry Date (optional)"
                      />
                    </div>
                    <Input
                      value={newCertification.credentialId || ''}
                      onChange={(e) => setNewCertification({ ...newCertification, credentialId: e.target.value })}
                      placeholder="Credential ID (optional)"
                    />
                    <Input
                      value={newCertification.credentialUrl || ''}
                      onChange={(e) => setNewCertification({ ...newCertification, credentialUrl: e.target.value })}
                      placeholder="Credential URL (optional)"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveNewCertification} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelNewCertification}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <Card key={cert.id} className="p-5 bg-white/80 border-orange-100 hover:border-orange-200 transition-colors group">
                    {editingItemId === cert.id && tempCertification ? (
                      <div className="space-y-3">
                        <Input
                          value={tempCertification.name}
                          onChange={(e) => setTempCertification({ ...tempCertification, name: e.target.value })}
                          placeholder="Certification Name"
                        />
                        <Input
                          value={tempCertification.issuer}
                          onChange={(e) => setTempCertification({ ...tempCertification, issuer: e.target.value })}
                          placeholder="Issuer"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            type="month"
                            value={tempCertification.issueDate}
                            onChange={(e) => setTempCertification({ ...tempCertification, issueDate: e.target.value })}
                            placeholder="Issue Date"
                          />
                          <Input
                            type="month"
                            value={tempCertification.expiryDate || ''}
                            onChange={(e) => setTempCertification({ ...tempCertification, expiryDate: e.target.value })}
                            placeholder="Expiry Date (optional)"
                          />
                        </div>
                        <Input
                          value={tempCertification.credentialId || ''}
                          onChange={(e) => setTempCertification({ ...tempCertification, credentialId: e.target.value })}
                          placeholder="Credential ID (optional)"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveCertification} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelCertification}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Award className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-1 truncate">{cert.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{cert.issuer}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <span>Issued {formatDate(cert.issueDate)}</span>
                              {cert.expiryDate && (
                                <>
                                  <span>•</span>
                                  <span>Expires {formatDate(cert.expiryDate)}</span>
                                </>
                              )}
                            </div>
                            {cert.credentialId && (
                              <Badge variant="outline" className="text-xs">
                                ID: {cert.credentialId}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditCertification(cert)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4 text-gray-400 hover:text-[#ff6b35]" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCertification(cert.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} className="text-xs text-[#ff6b35] hover:underline mt-3 inline-flex items-center gap-1">
                            View Credential <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-gray-900">Portfolio & Projects</h3>
              <Button size="sm" onClick={handleAddProject} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>

            {/* Add New Project Form */}
            {isAddingNew === 'project' && (
              <Card className="p-6 bg-white/80 border-orange-200 border-2">
                <h4 className="font-medium text-gray-900 mb-4">Add New Project</h4>
                <div className="space-y-3">
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Project Name"
                  />
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Description"
                    className="min-h-[80px]"
                  />
                  <Input
                    value={newProject.url || ''}
                    onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                    placeholder="Project URL (optional)"
                  />
                  <Input
                    placeholder="Tags (comma-separated)"
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveNewProject} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelNewProject}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            
            {projects.map((project) => (
              <Card key={project.id} className="p-6 bg-white/80 border-orange-100">
                {editingItemId === project.id && tempProject ? (
                  <div className="space-y-3">
                    <Input
                      value={tempProject.name}
                      onChange={(e) => setTempProject({ ...tempProject, name: e.target.value })}
                      placeholder="Project Name"
                    />
                    <Textarea
                      value={tempProject.description}
                      onChange={(e) => setTempProject({ ...tempProject, description: e.target.value })}
                      placeholder="Description"
                      className="min-h-[80px]"
                    />
                    <Input
                      value={tempProject.url || ''}
                      onChange={(e) => setTempProject({ ...tempProject, url: e.target.value })}
                      placeholder="Project URL (optional)"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveProject} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelProject}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        {project.url && (
                          <a href={project.url} className="text-[#ff6b35] hover:text-[#e55a2b]">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditProject(project)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-gray-400 hover:text-[#ff6b35]" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          {/* Career Path Story Tab */}
          <TabsContent value="career" className="space-y-6">
            <CareerPathStory user={user} onNavigate={onNavigate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
