import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft,
  Sparkles,
  Target,
  Users,
  MapPin,
  DollarSign,
  Building2,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  X,
  Search,
  Eye,
  Lightbulb,
  Calendar,
  FileText,
  Save,
  Send,
  Brain,
  Code,
  Database,
  Palette,
  LineChart,
  ShoppingCart,
  Megaphone,
  Settings,
  Upload,
  Trash2,
  Loader2,
  Check
} from 'lucide-react';

interface JobPostingPageProps {
  onBack: () => void;
  user: any;
}

export function JobPostingPage({ onBack, user }: Readonly<JobPostingPageProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsingPDF, setIsParsingPDF] = useState(false);
  const [parsedContent, setParsedContent] = useState<any>(null);
  const [showParsedData, setShowParsedData] = useState(false);
  const [jobData, setJobData] = useState({
    // Basic Info
    title: '',
    department: '',
    location: '',
    workArrangement: 'hybrid',
    employmentType: 'full-time',
    salaryMin: '',
    salaryMax: '',
    currency: 'CAD',
    experienceLevel: '',
    educationLevel: '',
    
    // Description & Requirements
    summary: '',
    description: '',
    responsibilities: '',
    requirements: '',
    niceToHave: '',
    benefits: '',
    
    // Queue Targeting
    selectedQueues: [] as string[],
    targetingMode: 'recommended', // 'recommended' or 'manual'
    
    // Advanced Settings
    applicationDeadline: '',
    startDate: '',
    isUrgent: false,
    requiresCoverLetter: false,
    requiresPortfolio: false,
    portfolioSubmissionType: 'link' as 'link' | 'document',
    portfolioDescription: '',
    numberOfCandidates: '1',
    interviewRounds: {
      'phone-screening': 0,
      'technical-interview': 0,
      'final-interview': 0
    } as Record<string, number>,
    
    // Internal
    hiringManager: '',
    recruiterNotes: '',
    internalJobCode: ''
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Job seeker queues data for recommendations
  const availableQueues = [
    {
      id: 'software-engineer',
      name: 'Software Engineer',
      icon: Code,
      color: 'blue',
      members: 12847,
      avgSalary: '120k',
      matchPercentage: 95,
      description: 'Full-stack and backend developers',
      topSkills: ['React', 'Node.js', 'Python', 'TypeScript'],
      hiringTrends: 'High demand',
      responseRate: '78%'
    },
    {
      id: 'data-scientist',
      name: 'Data Scientist',
      icon: Database,
      color: 'purple',
      members: 8934,
      avgSalary: '130k',
      matchPercentage: 88,
      description: 'Analytics and machine learning experts',
      topSkills: ['Python', 'SQL', 'Machine Learning', 'Statistics'],
      hiringTrends: 'Very High demand',
      responseRate: '71%'
    },
    {
      id: 'product-manager',
      name: 'Product Manager',
      icon: Target,
      color: 'green',
      members: 6421,
      avgSalary: '125k',
      matchPercentage: 82,
      description: 'Product strategy and roadmap leaders',
      topSkills: ['Product Strategy', 'Analytics', 'Agile', 'Leadership'],
      hiringTrends: 'High demand',
      responseRate: '65%'
    },
    {
      id: 'ux-designer',
      name: 'UX Designer',
      icon: Palette,
      color: 'pink',
      members: 4567,
      avgSalary: '95k',
      matchPercentage: 79,
      description: 'User experience and interface designers',
      topSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      hiringTrends: 'Moderate demand',
      responseRate: '69%'
    },
    {
      id: 'business-analyst',
      name: 'Business Analyst',
      icon: LineChart,
      color: 'orange',
      members: 5123,
      avgSalary: '85k',
      matchPercentage: 76,
      description: 'Business process and data analysts',
      topSkills: ['SQL', 'Excel', 'Business Process', 'Requirements'],
      hiringTrends: 'Moderate demand',
      responseRate: '58%'
    },
    {
      id: 'marketing-specialist',
      name: 'Marketing Specialist',
      icon: Megaphone,
      color: 'cyan',
      members: 3891,
      avgSalary: '75k',
      matchPercentage: 42,
      description: 'Digital marketing and growth professionals',
      topSkills: ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
      hiringTrends: 'Moderate demand',
      responseRate: '52%'
    }
  ];

  // AI-powered queue recommendations based on job details
  const getRecommendedQueues = () => {
    const titleLower = jobData.title.toLowerCase();
    const departmentLower = jobData.department.toLowerCase();
    const descriptionLower = (jobData.description + ' ' + jobData.requirements).toLowerCase();
    
    return availableQueues
      .map(queue => {
        let score = 0;
        
        // Title matching
        if (titleLower.includes(queue.name.toLowerCase().split(' ')[0])) score += 40;
        if (titleLower.includes(queue.name.toLowerCase().split(' ')[1] || '')) score += 30;
        
        // Department matching
        if (departmentLower.includes('engineering') && queue.id.includes('engineer')) score += 25;
        if (departmentLower.includes('product') && queue.id.includes('product')) score += 25;
        if (departmentLower.includes('design') && queue.id.includes('designer')) score += 25;
        if (departmentLower.includes('data') && queue.id.includes('data')) score += 25;
        if (departmentLower.includes('marketing') && queue.id.includes('marketing')) score += 25;
        
        // Skills matching
        queue.topSkills.forEach(skill => {
          if (descriptionLower.includes(skill.toLowerCase())) score += 10;
        });
        
        // Salary matching
        const jobSalary = Number.parseInt(jobData.salaryMax || jobData.salaryMin || '0');
        const queueSalary = Number.parseInt(queue.avgSalary.replace('k', '000'));
        if (Math.abs(jobSalary - queueSalary) < 20000) score += 15;
        
        return { ...queue, matchScore: Math.min(score, 100) };
      })
      .filter(queue => queue.matchScore > 30)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);
  };

  const recommendedQueues = getRecommendedQueues();

  const steps = [
    { id: 1, title: 'Basic Information', subtitle: 'Job title, location, and compensation' },
    { id: 2, title: 'Job Details', subtitle: 'Description, requirements, and responsibilities' },
    { id: 3, title: 'Queue Targeting', subtitle: 'Select job seeker queues to target' },
    { id: 4, title: 'Advanced Settings', subtitle: 'Deadlines, requirements, and preferences' },
    { id: 5, title: 'Review & Publish', subtitle: 'Final review before posting' }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!jobData.title.trim()) newErrors.title = 'Job title is required';
        if (!jobData.department) newErrors.department = 'Department is required';
        if (!jobData.location.trim()) newErrors.location = 'Location is required';
        if (!jobData.salaryMin.trim()) newErrors.salaryMin = 'Minimum salary is required';
        if (!jobData.salaryMax.trim()) newErrors.salaryMax = 'Maximum salary is required';
        break;
      case 2:
        if (!jobData.summary.trim()) newErrors.summary = 'Job summary is required';
        if (!jobData.description.trim()) newErrors.description = 'Job description is required';
        if (!jobData.requirements.trim()) newErrors.requirements = 'Requirements are required';
        break;
      case 3:
        if (jobData.selectedQueues.length === 0) newErrors.queues = 'Select at least one queue';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleQueueToggle = (queueId: string) => {
    setJobData(prev => ({
      ...prev,
      selectedQueues: prev.selectedQueues.includes(queueId)
        ? prev.selectedQueues.filter(id => id !== queueId)
        : [...prev.selectedQueues, queueId]
    }));
  };

  const handleSubmit = async (action: 'draft' | 'publish') => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`${action === 'draft' ? 'Saving draft' : 'Publishing'} job:`, jobData);
      
      // Navigate back with success message
      onBack();
    } catch (error) {
      console.error('Error submitting job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // PDF Upload and Parsing Functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.type === 'application/pdf') {
      setUploadedFile(file);
      parseJobDescription(file);
    }
  };

  const parseJobDescription = async (_file: File) => {
    setIsParsingPDF(true);
    try {
      // Simulate AI parsing of PDF - in real app this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock parsed content based on PDF
      const mockParsedData = {
        title: "Senior Software Engineer",
        department: "engineering",
        location: "Toronto, ON",
        workArrangement: "hybrid",
        employmentType: "full-time",
        salaryMin: "120000",
        salaryMax: "160000",
        currency: "CAD",
        experienceLevel: "senior",
        educationLevel: "bachelors",
        summary: "We're looking for a Senior Software Engineer to join our growing engineering team and help build scalable solutions.",
        description: "Join our dynamic engineering team and contribute to building cutting-edge software solutions. You'll work on challenging projects using modern technologies and collaborate with a talented team of developers.",
        responsibilities: "• Lead development of new features and improvements\n• Mentor junior developers and conduct code reviews\n• Collaborate with product managers and designers\n• Ensure code quality and best practices",
        requirements: "• 5+ years of software development experience\n• Strong proficiency in React, Node.js, and TypeScript\n• Experience with cloud platforms (AWS, Azure, or GCP)\n• Excellent problem-solving and communication skills",
        niceToHave: "• Experience with microservices architecture\n• Previous startup experience\n• Open source contributions\n• Knowledge of DevOps practices",
        benefits: "• Competitive salary and equity package\n• Comprehensive health and dental coverage\n• Flexible work arrangements\n• Professional development budget\n• Modern office with free snacks",
        interviewRounds: {
          'phone-screening': 1,
          'technical-interview': 2,
          'final-interview': 1
        }
      };
      
      setParsedContent(mockParsedData);
      setShowParsedData(true);
    } catch (error) {
      console.error('Error parsing PDF:', error);
    } finally {
      setIsParsingPDF(false);
    }
  };

  const applyParsedData = () => {
    if (parsedContent) {
      setJobData(prev => ({
        ...prev,
        ...parsedContent
      }));
      setShowParsedData(false);
      // Trigger queue recommendation update by moving to step 3
      if (currentStep === 2) {
        setCurrentStep(3);
      }
    }
  };

  const discardParsedData = () => {
    setParsedContent(null);
    setShowParsedData(false);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getQueueColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-medium text-gray-900">Create Job Posting</h1>
                  <p className="text-sm text-gray-500">
                    Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <div className="text-sm text-gray-500">
                Auto-saved
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-medium text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                {steps.map((step, _index) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep > step.id
                        ? 'bg-green-100 text-green-800'
                        : currentStep === step.id
                        ? 'bg-[#ff6b35] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{step.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Platform Insights</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Active Job Seekers</span>
                    <span className="font-medium text-gray-900">41,237</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avg. Response Time</span>
                    <span className="font-medium text-gray-900">2.3 days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Match Success Rate</span>
                    <span className="font-medium text-green-600">87%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-medium text-gray-900">Basic Information</h2>
                      <p className="text-gray-600">Let's start with the fundamentals of your job posting</p>
                    </div>
                  </div>

                  {/* PDF Upload Section */}
                  <Card className="p-6 border-2 border-dashed border-[#ff6b35]/30 bg-orange-50/50 mb-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">AI-Powered Job Description Parsing</h3>
                      <p className="text-gray-600 mb-4">Upload a PDF job description and let our AI extract the details for you</p>
                      
                      {!uploadedFile && !isParsingPDF && (
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload PDF Job Description
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">Supports PDF files up to 10MB</p>
                        </div>
                      )}

                      {isParsingPDF && (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-8 h-8 animate-spin text-[#ff6b35]" />
                          <p className="font-medium text-gray-900">AI is analyzing your job description...</p>
                          <p className="text-sm text-gray-600">This may take a few moments</p>
                        </div>
                      )}

                      {uploadedFile && !isParsingPDF && !showParsedData && (
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">{uploadedFile.name}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={discardParsedData}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Parsed Data Preview */}
                  {showParsedData && parsedContent && (
                    <Card className="p-6 border-[#ff6b35] bg-orange-50 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">AI Extraction Complete</h3>
                            <p className="text-sm text-gray-600">Review and edit the extracted information</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={applyParsedData}
                            className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Apply Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={discardParsedData}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Discard
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div><span className="font-medium">Title:</span> {parsedContent.title}</div>
                          <div><span className="font-medium">Department:</span> {parsedContent.department}</div>
                          <div><span className="font-medium">Location:</span> {parsedContent.location}</div>
                          <div><span className="font-medium">Salary:</span> ${parsedContent.salaryMin} - ${parsedContent.salaryMax} {parsedContent.currency}</div>
                        </div>
                        <div className="space-y-2">
                          <div><span className="font-medium">Experience:</span> {parsedContent.experienceLevel}</div>
                          <div><span className="font-medium">Education:</span> {parsedContent.educationLevel}</div>
                          <div><span className="font-medium">Work Type:</span> {parsedContent.employmentType}</div>
                          <div><span className="font-medium">Arrangement:</span> {parsedContent.workArrangement}</div>
                        </div>
                      </div>
                      
                      <Alert className="mt-4 border-blue-200 bg-blue-50">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-700">
                          The AI has also generated queue recommendations based on this job description. 
                          You'll see them in the next step.
                        </AlertDescription>
                      </Alert>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="title" className="text-base">Job Title *</Label>
                      <Input
                        id="title"
                        value={jobData.title}
                        onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Senior Software Engineer"
                        className={`mt-2 h-12 ${errors.title ? 'border-red-300' : ''}`}
                      />
                      {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <Label htmlFor="department" className="text-base">Department *</Label>
                      <Select value={jobData.department} onValueChange={(value: any) => setJobData(prev => ({ ...prev, department: value }))}>
                        <SelectTrigger className={`mt-2 h-12 ${errors.department ? 'border-red-300' : ''}`}>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              Engineering
                            </div>
                          </SelectItem>
                          <SelectItem value="product">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Product
                            </div>
                          </SelectItem>
                          <SelectItem value="design">
                            <div className="flex items-center gap-2">
                              <Palette className="w-4 h-4" />
                              Design
                            </div>
                          </SelectItem>
                          <SelectItem value="data">
                            <div className="flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              Data & Analytics
                            </div>
                          </SelectItem>
                          <SelectItem value="marketing">
                            <div className="flex items-center gap-2">
                              <Megaphone className="w-4 h-4" />
                              Marketing
                            </div>
                          </SelectItem>
                          <SelectItem value="sales">
                            <div className="flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              Sales
                            </div>
                          </SelectItem>
                          <SelectItem value="operations">
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              Operations
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-base">Location *</Label>
                      <Input
                        id="location"
                        value={jobData.location}
                        onChange={(e) => setJobData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Toronto, ON or Remote"
                        className={`mt-2 h-12 ${errors.location ? 'border-red-300' : ''}`}
                      />
                      {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
                    </div>

                    <div>
                      <Label htmlFor="workArrangement" className="text-base">Work Arrangement</Label>
                      <Select value={jobData.workArrangement} onValueChange={(value: any) => setJobData(prev => ({ ...prev, workArrangement: value }))}>
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="remote">🏠 Remote</SelectItem>
                          <SelectItem value="hybrid">🏢 Hybrid</SelectItem>
                          <SelectItem value="onsite">🏢 On-site</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="employmentType" className="text-base">Employment Type</Label>
                      <Select value={jobData.employmentType} onValueChange={(value: any) => setJobData(prev => ({ ...prev, employmentType: value }))}>
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-base">Salary Range *</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        <div>
                          <Input
                            value={jobData.salaryMin}
                            onChange={(e) => setJobData(prev => ({ ...prev, salaryMin: e.target.value }))}
                            placeholder="80,000"
                            className={`h-12 ${errors.salaryMin ? 'border-red-300' : ''}`}
                          />
                          <p className="text-xs text-gray-500 mt-1">Minimum</p>
                        </div>
                        <div>
                          <Input
                            value={jobData.salaryMax}
                            onChange={(e) => setJobData(prev => ({ ...prev, salaryMax: e.target.value }))}
                            placeholder="120,000"
                            className={`h-12 ${errors.salaryMax ? 'border-red-300' : ''}`}
                          />
                          <p className="text-xs text-gray-500 mt-1">Maximum</p>
                        </div>
                        <div>
                          <Select value={jobData.currency} onValueChange={(value: any) => setJobData(prev => ({ ...prev, currency: value }))}>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CAD">CAD</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">Currency</p>
                        </div>
                      </div>
                      {(errors.salaryMin || errors.salaryMax) && (
                        <p className="text-red-600 text-sm mt-1">Both minimum and maximum salary are required</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="experienceLevel" className="text-base">Experience Level</Label>
                      <Select value={jobData.experienceLevel} onValueChange={(value: any) => setJobData(prev => ({ ...prev, experienceLevel: value }))}>
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                          <SelectItem value="senior">Senior Level (5-8 years)</SelectItem>
                          <SelectItem value="lead">Lead Level (8+ years)</SelectItem>
                          <SelectItem value="executive">Executive Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="educationLevel" className="text-base">Education Level</Label>
                      <Select value={jobData.educationLevel} onValueChange={(value: any) => setJobData(prev => ({ ...prev, educationLevel: value }))}>
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue placeholder="Select education requirement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="associates">Associate's Degree</SelectItem>
                          <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="none">No formal requirement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>


                </div>
              )}

              {/* Step 2: Job Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-medium text-gray-900">Job Details</h2>
                      <p className="text-gray-600">Provide a comprehensive description of the role</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="summary" className="text-base">Job Summary *</Label>
                      <Textarea
                        id="summary"
                        value={jobData.summary}
                        onChange={(e) => setJobData(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="A brief 2-3 sentence overview of the role that will appear in search results..."
                        className={`mt-2 min-h-[100px] ${errors.summary ? 'border-red-300' : ''}`}
                        maxLength={300}
                      />
                      <div className="flex justify-between mt-1">
                        {errors.summary && <p className="text-red-600 text-sm">{errors.summary}</p>}
                        <p className="text-xs text-gray-500 ml-auto">{jobData.summary.length}/300</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-base">Job Description *</Label>
                      <Textarea
                        id="description"
                        value={jobData.description}
                        onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide a detailed description of the role, company culture, and what makes this opportunity unique..."
                        className={`mt-2 min-h-[150px] ${errors.description ? 'border-red-300' : ''}`}
                      />
                      {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                      <Label htmlFor="responsibilities" className="text-base">Key Responsibilities</Label>
                      <Textarea
                        id="responsibilities"
                        value={jobData.responsibilities}
                        onChange={(e) => setJobData(prev => ({ ...prev, responsibilities: e.target.value }))}
                        placeholder="• Lead software development projects&#10;• Mentor junior developers&#10;• Design scalable architectures..."
                        className="mt-2 min-h-[120px]"
                      />
                      <p className="text-xs text-gray-500 mt-1">Use bullet points (•) or line breaks for better readability</p>
                    </div>

                    <div>
                      <Label htmlFor="requirements" className="text-base">Requirements *</Label>
                      <Textarea
                        id="requirements"
                        value={jobData.requirements}
                        onChange={(e) => setJobData(prev => ({ ...prev, requirements: e.target.value }))}
                        placeholder="• 5+ years of software development experience&#10;• Proficiency in React and Node.js&#10;• Strong problem-solving skills..."
                        className={`mt-2 min-h-[120px] ${errors.requirements ? 'border-red-300' : ''}`}
                      />
                      {errors.requirements && <p className="text-red-600 text-sm mt-1">{errors.requirements}</p>}
                    </div>

                    <div>
                      <Label htmlFor="niceToHave" className="text-base">Nice to Have</Label>
                      <Textarea
                        id="niceToHave"
                        value={jobData.niceToHave}
                        onChange={(e) => setJobData(prev => ({ ...prev, niceToHave: e.target.value }))}
                        placeholder="• Experience with cloud platforms (AWS, GCP)&#10;• Previous startup experience&#10;• Open source contributions..."
                        className="mt-2 min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="benefits" className="text-base">Benefits & Perks</Label>
                      <Textarea
                        id="benefits"
                        value={jobData.benefits}
                        onChange={(e) => setJobData(prev => ({ ...prev, benefits: e.target.value }))}
                        placeholder="• Comprehensive health coverage&#10;• Flexible work arrangements&#10;• Professional development budget&#10;• Stock options..."
                        className="mt-2 min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Queue Targeting */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-medium text-gray-900">Queue Targeting</h2>
                      <p className="text-gray-600">Choose which job seeker queues to target with this posting</p>
                    </div>
                  </div>

                  <Tabs value={jobData.targetingMode} onValueChange={(value: string) => setJobData(prev => ({ ...prev, targetingMode: value as 'recommended' | 'manual' }))}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="recommended" className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        AI Recommended
                      </TabsTrigger>
                      <TabsTrigger value="manual" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Manual Selection
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="recommended" className="space-y-6">
                      <Alert className="border-blue-200 bg-blue-50">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-700">
                          Our AI analyzed your job posting and found {recommendedQueues.length} highly relevant queues. 
                          These recommendations are based on job title, skills, department, and salary alignment.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendedQueues.map((queue) => {
                          const IconComponent = queue.icon;
                          const isSelected = jobData.selectedQueues.includes(queue.id);
                          
                          return (
                            <Card 
                              key={queue.id}
                              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                isSelected 
                                  ? 'ring-2 ring-[#ff6b35] border-[#ff6b35] bg-orange-50' 
                                  : 'hover:border-gray-300'
                              }`}
                              onClick={() => handleQueueToggle(queue.id)}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getQueueColor(queue.color).replace('text-', 'text-').replace('border-', '')}`}>
                                    <IconComponent className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-900">{queue.name}</h3>
                                    <p className="text-sm text-gray-600">{queue.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={`${getQueueColor(queue.color)} border`}>
                                    {queue.matchScore}% match
                                  </Badge>
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
                        })}
                      </div>

                      {recommendedQueues.length === 0 && (
                        <Card className="p-8 text-center">
                          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Need More Information</h3>
                          <p className="text-gray-600 mb-4">
                            Our AI needs more details about the job to provide accurate queue recommendations.
                            Please fill out the job title, department, and description in previous steps.
                          </p>
                          <Button variant="outline" onClick={() => setCurrentStep(1)}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back to Basic Info
                          </Button>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="manual" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">All Available Queues</h3>
                          <p className="text-sm text-gray-600">Browse and select queues manually</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-gray-400" />
                          <Input placeholder="Search queues..." className="w-64" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableQueues.map((queue) => {
                          const IconComponent = queue.icon;
                          const isSelected = jobData.selectedQueues.includes(queue.id);
                          
                          return (
                            <Card 
                              key={queue.id}
                              className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                                isSelected 
                                  ? 'ring-2 ring-[#ff6b35] border-[#ff6b35] bg-orange-50' 
                                  : 'hover:border-gray-300'
                              }`}
                              onClick={() => handleQueueToggle(queue.id)}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getQueueColor(queue.color).replace('text-', 'text-').replace('border-', '')}`}>
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-900 text-sm">{queue.name}</h3>
                                    <p className="text-xs text-gray-600">{queue.members.toLocaleString()} members</p>
                                  </div>
                                </div>
                                {isSelected && <CheckCircle className="w-4 h-4 text-[#ff6b35]" />}
                              </div>

                              <div className="text-xs text-gray-600 mb-2">
                                {queue.description}
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Avg. ${queue.avgSalary}</span>
                                <span className="text-green-600">{queue.responseRate}</span>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {errors.queues && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        {errors.queues}
                      </AlertDescription>
                    </Alert>
                  )}

                  {jobData.selectedQueues.length > 0 && (
                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <h4 className="font-medium text-green-900">Selected Queues ({jobData.selectedQueues.length})</h4>
                      </div>
                      <p className="text-sm text-green-700">
                        Your job will be visible to approximately{' '}
                        <span className="font-medium">
                          {availableQueues
                            .filter(q => jobData.selectedQueues.includes(q.id))
                            .reduce((sum, q) => sum + q.members, 0)
                            .toLocaleString()}
                        </span>{' '}
                        job seekers across the selected queues.
                      </p>
                    </Card>
                  )}
                </div>
              )}

              {/* Step 4: Advanced Settings */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-medium text-gray-900">Advanced Settings</h2>
                      <p className="text-gray-600">Configure deadlines, requirements, and preferences</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="applicationDeadline" className="text-base">Application Deadline</Label>
                      <Input
                        id="applicationDeadline"
                        type="date"
                        value={jobData.applicationDeadline}
                        onChange={(e) => setJobData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                        className="mt-2 h-12"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty for no deadline</p>
                    </div>

                    <div>
                      <Label htmlFor="startDate" className="text-base">Expected Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={jobData.startDate}
                        onChange={(e) => setJobData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="mt-2 h-12"
                      />
                      <p className="text-xs text-gray-500 mt-1">When should the candidate start?</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Application Requirements</h3>
                    
                    <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Cover Letter Required</h4>
                          <p className="text-sm text-gray-600">Candidates must submit a cover letter with their application</p>
                        </div>
                        <Switch
                          checked={jobData.requiresCoverLetter}
                          onCheckedChange={(checked: any) => setJobData(prev => ({ ...prev, requiresCoverLetter: checked }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Portfolio Required</h4>
                          <p className="text-sm text-gray-600">Candidates must submit a portfolio or work samples</p>
                        </div>
                        <Switch
                          checked={jobData.requiresPortfolio}
                          onCheckedChange={(checked: any) => setJobData(prev => ({ ...prev, requiresPortfolio: checked }))}
                        />
                      </div>

                      {jobData.requiresPortfolio && (
                        <div className="pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <Label htmlFor="portfolioDescription" className="text-base">Portfolio Description</Label>
                            <Textarea
                              id="portfolioDescription"
                              value={jobData.portfolioDescription}
                              onChange={(e) => setJobData(prev => ({ ...prev, portfolioDescription: e.target.value }))}
                              placeholder="Describe what kind of portfolio or work samples you're looking for..."
                              className="mt-2 min-h-[80px]"
                            />
                            <p className="text-xs text-gray-500 mt-1">Let candidates know what you expect in their portfolio</p>
                          </div>

                          <div>
                            <Label className="text-base mb-3 block">Preferred Submission Method</Label>
                            <div className="space-y-2">
                              <div 
                                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                  jobData.portfolioSubmissionType === 'link' 
                                    ? 'border-[#ff6b35] bg-orange-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setJobData(prev => ({ ...prev, portfolioSubmissionType: 'link' }))}
                              >
                                <input
                                  type="radio"
                                  name="portfolioSubmission"
                                  checked={jobData.portfolioSubmissionType === 'link'}
                                  onChange={() => setJobData(prev => ({ ...prev, portfolioSubmissionType: 'link' }))}
                                  className="mt-0.5"
                                />
                                <div>
                                  <h5 className="font-medium text-gray-900">Portfolio Link</h5>
                                  <p className="text-sm text-gray-600">Candidates provide a URL to their online portfolio or website</p>
                                </div>
                              </div>

                              <div 
                                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                  jobData.portfolioSubmissionType === 'document' 
                                    ? 'border-[#ff6b35] bg-orange-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setJobData(prev => ({ ...prev, portfolioSubmissionType: 'document' }))}
                              >
                                <input
                                  type="radio"
                                  name="portfolioSubmission"
                                  checked={jobData.portfolioSubmissionType === 'document'}
                                  onChange={() => setJobData(prev => ({ ...prev, portfolioSubmissionType: 'document' }))}
                                  className="mt-0.5"
                                />
                                <div>
                                  <h5 className="font-medium text-gray-900">Upload Document</h5>
                                  <p className="text-sm text-gray-600">Candidates upload portfolio files (PDF, images, etc.)</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Posting Options</h3>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Urgent Hiring</h4>
                        <p className="text-sm text-gray-600">Mark this as an urgent position to attract faster responses</p>
                      </div>
                      <Switch
                        checked={jobData.isUrgent}
                        onCheckedChange={(checked: any) => setJobData(prev => ({ ...prev, isUrgent: checked }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Interview Process</h3>
                    <p className="text-sm text-gray-600">Configure how many rounds you want for each interview type. Set to 0 to skip that stage.</p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { id: 'phone-screening', label: 'Phone Screening', icon: '📞', description: 'Initial phone/video call to screen candidates' },
                        { id: 'technical-interview', label: 'Technical Interview', icon: '💻', description: 'Technical skills assessment and coding challenges' },
                        { id: 'final-interview', label: 'Final Interview', icon: '🎯', description: 'Final round with hiring manager or team leads' }
                      ].map((stage) => (
                        <div key={stage.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{stage.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-900">{stage.label}</h4>
                                  <p className="text-sm text-gray-600">{stage.description}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Label htmlFor={`rounds-${stage.id}`} className="text-sm font-medium whitespace-nowrap">
                                    Rounds:
                                  </Label>
                                  <Input
                                    id={`rounds-${stage.id}`}
                                    type="number"
                                    min="0"
                                    max="5"
                                    value={jobData.interviewRounds[stage.id] || 0}
                                    onChange={(e) => {
                                      const value = Math.max(0, Math.min(5, Number.parseInt(e.target.value) || 0));
                                      setJobData(prev => ({
                                        ...prev,
                                        interviewRounds: {
                                          ...prev.interviewRounds,
                                          [stage.id]: value
                                        }
                                      }));
                                    }}
                                    className="w-20 h-10 text-center"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {(jobData.interviewRounds['phone-screening'] > 0 || 
                      jobData.interviewRounds['technical-interview'] > 0 || 
                      jobData.interviewRounds['final-interview'] > 0) && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-blue-600" />
                          <h4 className="font-medium text-blue-900">Interview Process Summary</h4>
                        </div>
                        <div className="space-y-1">
                          {jobData.interviewRounds['phone-screening'] > 0 && (
                            <div className="text-sm text-blue-700">
                              📞 Phone Screening: {jobData.interviewRounds['phone-screening']} round{jobData.interviewRounds['phone-screening'] > 1 ? 's' : ''}
                            </div>
                          )}
                          {jobData.interviewRounds['technical-interview'] > 0 && (
                            <div className="text-sm text-blue-700">
                              💻 Technical Interview: {jobData.interviewRounds['technical-interview']} round{jobData.interviewRounds['technical-interview'] > 1 ? 's' : ''}
                            </div>
                          )}
                          {jobData.interviewRounds['final-interview'] > 0 && (
                            <div className="text-sm text-blue-700">
                              🎯 Final Interview: {jobData.interviewRounds['final-interview']} round{jobData.interviewRounds['final-interview'] > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-blue-700 mt-2">
                          Candidates will see this interview process in your job posting, helping them understand what to expect.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Internal Information</h3>
                    
                    <div>
                      <Label htmlFor="numberOfCandidates" className="text-base">Number of Candidates Being Hired</Label>
                      <Input
                        id="numberOfCandidates"
                        type="number"
                        min="1"
                        max="100"
                        value={jobData.numberOfCandidates}
                        onChange={(e) => {
                          const value = Math.max(1, Math.min(100, Number.parseInt(e.target.value) || 1));
                          setJobData(prev => ({ ...prev, numberOfCandidates: value.toString() }));
                        }}
                        placeholder="1"
                        className="mt-2 h-12"
                      />
                      <p className="text-xs text-gray-500 mt-1">How many candidates are you looking to hire for this position?</p>
                    </div>

                    <div>
                      <Label htmlFor="hiringManager" className="text-base">Hiring Manager</Label>
                      <Input
                        id="hiringManager"
                        value={jobData.hiringManager}
                        onChange={(e) => setJobData(prev => ({ ...prev, hiringManager: e.target.value }))}
                        placeholder="John Smith"
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="internalJobCode" className="text-base">Internal Job Code</Label>
                      <Input
                        id="internalJobCode"
                        value={jobData.internalJobCode}
                        onChange={(e) => setJobData(prev => ({ ...prev, internalJobCode: e.target.value }))}
                        placeholder="ENG-2024-001"
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="recruiterNotes" className="text-base">Recruiter Notes</Label>
                      <Textarea
                        id="recruiterNotes"
                        value={jobData.recruiterNotes}
                        onChange={(e) => setJobData(prev => ({ ...prev, recruiterNotes: e.target.value }))}
                        placeholder="Internal notes for the recruiting team..."
                        className="mt-2 min-h-[100px]"
                      />
                      <p className="text-xs text-gray-500 mt-1">These notes are only visible to your recruiting team</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Publish */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-medium text-gray-900">Review & Publish</h2>
                      <p className="text-gray-600">Review your job posting before publishing</p>
                    </div>
                  </div>

                  {/* Job Preview */}
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-1">{jobData.title || 'Job Title'}</h3>
                        <div className="flex items-center gap-4 text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {jobData.department || 'Department'}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {jobData.location || 'Location'}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {jobData.salaryMin && jobData.salaryMax 
                              ? `$${jobData.salaryMin} - $${jobData.salaryMax} ${jobData.currency}`
                              : 'Salary Range'
                            }
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800">{jobData.employmentType}</Badge>
                          <Badge className="bg-green-100 text-green-800">{jobData.workArrangement}</Badge>
                          {jobData.isUrgent && <Badge className="bg-red-100 text-red-800">Urgent</Badge>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none">
                      {jobData.summary && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                          <p className="text-gray-700">{jobData.summary}</p>
                        </div>
                      )}
                      
                      {jobData.description && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                          <p className="text-gray-700 whitespace-pre-line">{jobData.description}</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Queue Summary */}
                  <Card className="p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Targeting Summary</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-[#ff6b35]" />
                      <span className="font-medium">
                        {availableQueues
                          .filter(q => jobData.selectedQueues.includes(q.id))
                          .reduce((sum, q) => sum + q.members, 0)
                          .toLocaleString()}
                      </span>
                      <span className="text-gray-600">job seekers will see this posting</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {jobData.selectedQueues.map(queueId => {
                        const queue = availableQueues.find(q => q.id === queueId);
                        return queue ? (
                          <Badge key={queueId} className={getQueueColor(queue.color)}>
                            {queue.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </Card>

                  {/* Interview Process Summary */}
                  {(jobData.interviewRounds['phone-screening'] > 0 || 
                    jobData.interviewRounds['technical-interview'] > 0 || 
                    jobData.interviewRounds['final-interview'] > 0) && (
                    <Card className="p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Interview Process</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-[#ff6b35]" />
                        <span className="font-medium">
                          {(jobData.interviewRounds['phone-screening'] || 0) + 
                           (jobData.interviewRounds['technical-interview'] || 0) + 
                           (jobData.interviewRounds['final-interview'] || 0)}
                        </span>
                        <span className="text-gray-600">total interview rounds configured</span>
                      </div>
                      <div className="space-y-2">
                        {jobData.interviewRounds['phone-screening'] > 0 && (
                          <Badge className="bg-purple-100 text-purple-800 mr-2">
                            📞 Phone Screening ({jobData.interviewRounds['phone-screening']} round{jobData.interviewRounds['phone-screening'] > 1 ? 's' : ''})
                          </Badge>
                        )}
                        {jobData.interviewRounds['technical-interview'] > 0 && (
                          <Badge className="bg-purple-100 text-purple-800 mr-2">
                            💻 Technical Interview ({jobData.interviewRounds['technical-interview']} round{jobData.interviewRounds['technical-interview'] > 1 ? 's' : ''})
                          </Badge>
                        )}
                        {jobData.interviewRounds['final-interview'] > 0 && (
                          <Badge className="bg-purple-100 text-purple-800 mr-2">
                            🎯 Final Interview ({jobData.interviewRounds['final-interview']} round{jobData.interviewRounds['final-interview'] > 1 ? 's' : ''})
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        Candidates will see this interview process when viewing your job posting, helping them understand your hiring process.
                      </p>
                    </Card>
                  )}

                  {/* Publishing Options */}
                  <Card className="p-6">
                    <h3 className="font-medium text-gray-900 mb-4">
                      {user?.role === 'recruiter' ? 'Submission Options' : 'Publishing Options'}
                    </h3>
                    {user?.role === 'recruiter' && !user?.canPostWithoutApproval ? (
                      // Regular recruiters WITHOUT direct publish permission need approval
                      <div className="space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-700">
                            <strong>Note:</strong> As a regular recruiter, your job posting will be submitted for approval by a manager.
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <Button
                            onClick={() => handleSubmit('draft')}
                            variant="outline"
                            className="flex-1"
                            disabled={isSubmitting}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save as Draft
                          </Button>
                          <Button
                            onClick={() => handleSubmit('publish')}
                            className="flex-1 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                Submitting...
                              </div>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Submit for Approval
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Managers, Leads, Admins, Solo Recruiters, and Trusted Recruiters can publish directly
                      <div className="space-y-3">
                        {user?.role === 'recruiter' && user?.canPostWithoutApproval && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-700">
                              <strong>✅ Direct Publishing Enabled:</strong> You have permission to publish jobs immediately without manager approval.
                            </p>
                          </div>
                        )}
                        <div className="flex gap-4">
                          <Button
                            onClick={() => handleSubmit('draft')}
                            variant="outline"
                            className="flex-1"
                            disabled={isSubmitting}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save as Draft
                          </Button>
                          <Button
                            onClick={() => handleSubmit('publish')}
                            className="flex-1 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                Publishing...
                              </div>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Publish Job
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Step {currentStep} of {steps.length}
                  </span>
                  <Progress value={(currentStep / steps.length) * 100} className="w-24" />
                </div>

                <div className="flex items-center gap-2">
                  {currentStep < steps.length && (
                    <Button onClick={handleNext} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                      Next
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}