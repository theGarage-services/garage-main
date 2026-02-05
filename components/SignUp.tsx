import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Eye, EyeOff, UserPlus, Upload, File, X, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { InstitutionSetup } from './InstitutionSetup';
import { SocialAuthOptions } from './SocialAuthOptions';
import { PreferencesSetup, JobPreferences } from './PreferencesSetup';

interface SignUpProps {
  onSignUp: (userData: any, role: 'job-seeker' | 'recruiter') => void;
  onSwitchToLogin: () => void;
  onBack?: () => void;
  userRole: 'job-seeker' | 'recruiter';
}

export function SignUp({ onSignUp, onSwitchToLogin, onBack, userRole }: Readonly<SignUpProps>) {
  const [step, setStep] = useState<'account' | 'profile' | 'preferences' | 'resume' | 'institution'>('account');
  const [formData, setFormData] = useState({
    // Account Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    
    // Profile Info (Job Seeker)
    jobTitle: '',
    experience: '',
    location: '',
    bio: '',
    skills: '',
    
    // Company Info (Recruiter)
    company: '',
    companySize: '',
    industry: '',
    website: '',
    
    // Job Preferences (Job Seeker)
    preferences: null as JobPreferences | null,
    
    // Resume
    resumeFile: null as File | null,
    resumeText: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signUpError, setSignUpError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  const validateAccountStep = () => {
    const newErrors: {[key: string]: string} = {};

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    const passwordCheck = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordCheck.isValid) {
      newErrors.password = 'Password must meet all requirements';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProfileStep = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = userRole === 'recruiter' ? 'Your job title is required' : 'Current job title is required';
    }
    if (userRole === 'job-seeker' && !formData.experience) {
      newErrors.experience = 'Experience level is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 'account' && validateAccountStep()) {
      setStep('profile');
    } else if (step === 'profile' && validateProfileStep()) {
      if (userRole === 'recruiter') {
        setStep('institution');
      } else {
        setStep('preferences'); // Job seekers go to preferences
      }
    } else if (step === 'preferences' && userRole === 'job-seeker') {
      // Preferences are set via handlePreferencesComplete
      setStep('resume');
    } else if (step === 'resume' && userRole === 'job-seeker') {
      // Handle job seeker completion
    }
  };

  const handleBack = () => {
    if (step === 'profile') {
      setStep('account');
    } else if (step === 'preferences') {
      setStep('profile');
    } else if (step === 'resume') {
      if (userRole === 'recruiter') {
        setStep('institution');
      } else {
        setStep('preferences'); // Job seekers go back to preferences
      }
    } else if (step === 'institution') {
      setStep('profile');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ resumeFile: 'Please upload a PDF or Word document' });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ resumeFile: 'File size must be less than 5MB' });
        return;
      }

      setFormData(prev => ({ ...prev, resumeFile: file }));
      setErrors(prev => ({ ...prev, resumeFile: '' }));

      // Mock file parsing - in real app, this would be sent to backend
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          resumeText: `Parsed resume content from ${file.name}:\n\nJohn Doe\nSoftware Engineer\n\nExperience:\n• 5+ years in full-stack development\n• Proficient in React, Node.js, Python\n• Led team of 3 developers\n\nEducation:\n• Bachelor's in Computer Science\n• Master's in Software Engineering`
        }));
      }, 1000);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setSignUpError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful signup
      const userData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location,
        bio: formData.bio,
        profileComplete: true,
        isNewUser: false, // Regular signup flow is complete
        ...(userRole === 'job-seeker' ? {
          jobTitle: formData.jobTitle,
          experience: formData.experience,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
          resumeFile: formData.resumeFile,
          resumeText: formData.resumeText,
          preferences: formData.preferences,
        } : {
          company: formData.company,
          companySize: formData.companySize,
          industry: formData.industry,
          website: formData.website
        })
      };
      
      onSignUp(userData, userRole);
    } catch (error) {
      setSignUpError('An error occurred during sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesComplete = (preferences: JobPreferences) => {
    setFormData(prev => ({ ...prev, preferences }));
    setStep('resume');
  };

  const handlePreferencesSkip = () => {
    // Set default "No Preference" for all categories
    const defaultPreferences: JobPreferences = {
      locations: ['No Preference'],
      salaryRanges: ['No Preference'],
      jobTypes: ['No Preference'],
      workArrangements: ['No Preference']
    };
    setFormData(prev => ({ ...prev, preferences: defaultPreferences }));
    setStep('resume');
  };

  const handleSocialAuth = async (provider: string, userData: any) => {
    setIsLoading(true);
    try {
      // Simulate social auth API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For social auth, we need to complete profile setup
      // Only job seekers get the resume upload flow
      onSignUp({
        ...userData,
        profileComplete: false,
        isNewUser: userRole === 'job-seeker', // Only job seekers get resume upload flow
      }, userRole);
    } catch (error) {
      setSignUpError(`Failed to sign up with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (signUpError) setSignUpError('');
  };

  const passwordCheck = validatePassword(formData.password);

  // Render preferences as standalone screen
  if (step === 'preferences' && userRole === 'job-seeker') {
    return (
      <PreferencesSetup
        userName={formData.firstName}
        onComplete={handlePreferencesComplete}
        onSkip={handlePreferencesSkip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          {onBack && step === 'account' && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#ff6b35] transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Role Selection
            </button>
          )}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-medium">
              <span className="text-gray-900">the</span>
              <span className="text-[#ff6b35]">Garage</span>
            </h1>
          </div>
          <h2 className="text-xl text-gray-700 mb-2">
            Create your {userRole === 'recruiter' ? 'recruiter' : 'job seeker'} account
          </h2>
          <p className="text-gray-500">
            Join theGarage and {userRole === 'recruiter' ? 'find top talent' : 'accelerate your career'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Step 1: Account */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step === 'account' ? 'bg-[#ff6b35] border-[#ff6b35] text-white' : 
              ['profile', 'preferences', 'resume', 'institution'].includes(step) ? 'bg-green-500 border-green-500 text-white' :
              'border-gray-300 text-gray-300'
            }`}>
              {['profile', 'preferences', 'resume', 'institution'].includes(step) ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <div className={`w-16 h-0.5 ${['profile', 'preferences', 'resume', 'institution'].includes(step) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            
            {/* Step 2: Profile */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step === 'profile' ? 'bg-[#ff6b35] border-[#ff6b35] text-white' : 
              ['preferences', 'resume', 'institution'].includes(step) ? 'bg-green-500 border-green-500 text-white' :
              'border-gray-300 text-gray-300'
            }`}>
              {['preferences', 'resume', 'institution'].includes(step) ? <CheckCircle className="w-4 h-4" /> : '2'}
            </div>
            
            {userRole === 'job-seeker' ? (
              <>
                <div className={`w-16 h-0.5 ${['preferences', 'resume'].includes(step) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                {/* Step 3: Preferences */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step === 'preferences' ? 'bg-[#ff6b35] border-[#ff6b35] text-white' : 
                  step === 'resume' ? 'bg-green-500 border-green-500 text-white' :
                  'border-gray-300 text-gray-300'
                }`}>
                  {step === 'resume' ? <CheckCircle className="w-4 h-4" /> : '3'}
                </div>
                <div className={`w-16 h-0.5 ${step === 'resume' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                {/* Step 4: Resume */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step === 'resume' ? 'bg-[#ff6b35] border-[#ff6b35] text-white' : 'border-gray-300 text-gray-300'
                }`}>
                  4
                </div>
              </>
            ) : (
              <>
                <div className={`w-16 h-0.5 ${step === 'institution' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                {/* Step 3: Institution */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step === 'institution' ? 'bg-[#ff6b35] border-[#ff6b35] text-white' : 'border-gray-300 text-gray-300'
                }`}>
                  3
                </div>
              </>
            )}
          </div>
        </div>

        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          {step === 'account' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Information</h3>
                <p className="text-gray-500">Let's start with the basics</p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`h-12 border-2 ${errors.firstName ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {errors.firstName && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={`h-12 border-2 ${errors.lastName ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {errors.lastName && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`h-12 border-2 ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.email && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={`h-12 border-2 pr-12 ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className={`flex items-center gap-2 ${passwordCheck.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className="w-3 h-3" />
                        8+ characters
                      </div>
                      <div className={`flex items-center gap-2 ${passwordCheck.hasUpper ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className="w-3 h-3" />
                        Uppercase letter
                      </div>
                      <div className={`flex items-center gap-2 ${passwordCheck.hasLower ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className="w-3 h-3" />
                        Lowercase letter
                      </div>
                      <div className={`flex items-center gap-2 ${passwordCheck.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className="w-3 h-3" />
                        Number
                      </div>
                      <div className={`flex items-center gap-2 ${passwordCheck.hasSpecial ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className="w-3 h-3" />
                        Special character
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className={`h-12 border-2 pr-12 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked: any) => handleChange('agreeToTerms', !!checked)}
                  className="mt-1"
                />
                <div className="text-sm">
                  <Label htmlFor="terms" className="text-gray-700 cursor-pointer">
                    I agree to the{' '}
                    <a href="#" className="text-[#ff6b35] hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#ff6b35] hover:underline">Privacy Policy</a>
                  </Label>
                  {errors.agreeToTerms && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.agreeToTerms}
                    </div>
                  )}
                </div>
              </div>

              {/* Social Auth Options */}
              <SocialAuthOptions 
                onSocialAuth={handleSocialAuth}
                isLogin={false}
              />
            </div>
          )}

          {step === 'profile' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Information</h3>
                <p className="text-gray-500">
                  {userRole === 'recruiter' 
                    ? 'Tell us about your recruiting role' 
                    : 'Tell us about your professional background'}
                </p>
              </div>

              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="jobTitle">
                  {userRole === 'recruiter' ? 'Your Job Title' : 'Current Job Title'}
                </Label>
                <Input
                  id="jobTitle"
                  placeholder={userRole === 'recruiter' 
                    ? "e.g. Talent Acquisition Manager, HR Director" 
                    : "e.g. Senior Data Analyst"}
                  value={formData.jobTitle}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  className={`h-12 border-2 ${errors.jobTitle ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.jobTitle && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.jobTitle}
                  </div>
                )}
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company">
                  {userRole === 'recruiter' ? 'Current Organization' : 'Current Company (Optional)'}
                </Label>
                <Input
                  id="company"
                  placeholder="e.g. Google, Microsoft"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="h-12 border-2 border-gray-200"
                />
              </div>

              {/* Experience Level - Only for job seekers */}
              {userRole === 'job-seeker' && (
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select value={formData.experience} onValueChange={(value: string | boolean | File | null) => handleChange('experience', value)}>
                    <SelectTrigger className={`h-12 border-2 ${errors.experience ? 'border-red-300' : 'border-gray-200'}`}>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                      <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.experience && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.experience}
                    </div>
                  )}
                </div>
              )}

              {/* Department - Only for recruiters */}
              {userRole === 'recruiter' && (
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="e.g. Human Resources, Talent Acquisition"
                    value={formData.companySize}
                    onChange={(e) => handleChange('companySize', e.target.value)}
                    className="h-12 border-2 border-gray-200"
                  />
                </div>
              )}

              {/* Industry - Only for recruiters */}
              {userRole === 'recruiter' && (
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select value={formData.industry} onValueChange={(value: string | boolean | File | null) => handleChange('industry', value)}>
                    <SelectTrigger className="h-12 border-2 border-gray-200">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance & Banking</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail & E-commerce</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="media">Media & Entertainment</SelectItem>
                      <SelectItem value="energy">Energy & Utilities</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="nonprofit">Non-profit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className={`h-12 border-2 ${errors.location ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.location && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.location}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">
                  {userRole === 'recruiter' ? 'Professional Bio (Optional)' : 'Professional Bio (Optional)'}
                </Label>
                <Textarea
                  id="bio"
                  placeholder={userRole === 'recruiter' 
                    ? "Brief description of your recruiting experience and approach..."
                    : "Brief description of your professional background and career goals..."}
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="border-2 border-gray-200 min-h-[100px]"
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500">
                  {formData.bio.length}/500 characters
                </div>
              </div>

              {/* Skills - Only for job seekers */}
              {userRole === 'job-seeker' && (
                <div className="space-y-2">
                  <Label htmlFor="skills">Key Skills (Optional)</Label>
                  <Input
                    id="skills"
                    placeholder="e.g. Python, SQL, Tableau, Machine Learning"
                    value={formData.skills}
                    onChange={(e) => handleChange('skills', e.target.value)}
                    className="h-12 border-2 border-gray-200"
                  />
                  <p className="text-sm text-gray-500">Separate skills with commas</p>
                </div>
              )}
            </div>
          )}

          {step === 'resume' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Resume</h3>
                <p className="text-gray-500">Upload your resume to auto-fill your profile and get better job matches</p>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#ff6b35] transition-colors">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Click to upload resume</p>
                        <p className="text-sm text-gray-500">PDF, DOC, or DOCX (max 5MB)</p>
                      </div>
                    </div>
                  </label>
                </div>

                {errors.resumeFile && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.resumeFile}
                  </div>
                )}

                {/* Uploaded File */}
                {formData.resumeFile && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">{formData.resumeFile.name}</p>
                          <p className="text-sm text-green-600">
                            {(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, resumeFile: null, resumeText: '' }));
                          setErrors(prev => ({ ...prev, resumeFile: '' }));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Parsed Resume Preview */}
                {formData.resumeText && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Resume Preview</h4>
                    <div className="text-sm text-blue-700 whitespace-pre-line max-h-40 overflow-y-auto">
                      {formData.resumeText}
                    </div>
                  </div>
                )}

                {/* Skip Option */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Don't have a resume ready?{' '}
                    <button
                      onClick={handleSubmit}
                      className="text-[#ff6b35] hover:underline"
                    >
                      Skip for now
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'institution' && userRole === 'recruiter' && (
            <InstitutionSetup
              onInstitutionCreated={(institutionData) => {
                // Complete the signup with institution data
                const userData = {
                  id: Date.now().toString(),
                  email: formData.email,
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  location: formData.location,
                  bio: formData.bio,
                  profileComplete: true,
                  jobTitle: formData.jobTitle,
                  company: formData.company,
                  companySize: formData.companySize,
                  industry: formData.industry,
                  website: formData.website,
                  institution: institutionData
                };
                onSignUp(userData, userRole);
              }}
              onBack={handleBack}
              recruiterData={{
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                jobTitle: formData.jobTitle,
                company: formData.company
              }}
            />
          )}

          {step !== 'institution' && step !== 'preferences' && (
            <>
                  {/* Error Alert */}
              {signUpError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {signUpError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <div>
                  {step !== 'account' ? (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="px-6"
                    >
                      Back
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={onSwitchToLogin}
                      className="px-6"
                    >
                      Sign In Instead
                    </Button>
                  )}
                </div>

                <div>
                  {(step === 'resume' && userRole === 'job-seeker') ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-8 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Creating Account...
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="px-8 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Demo Credentials - only show on account step */}
          {step === 'account' && userRole === 'recruiter' && (
            <div className="mt-6 space-y-3">
              {/* Recruiter Demo */}
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Try Recruiter Demo Account</span>
                </div>
                <div className="text-sm text-orange-700">
                  <p><strong>Email:</strong> member@thegarage.com</p>
                  <p><strong>Password:</strong> password</p>
                  <p className="text-xs mt-1 opacity-75">Skip signup - use Login to try independent recruiter experience</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}