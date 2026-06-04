import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Building2, AlertCircle, CheckCircle, Upload, File, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface InstitutionSetupProps {
  onInstitutionCreated: (institutionData: any) => void;
  onBack: () => void;
  recruiterData: any;
}

export function InstitutionSetup({ onInstitutionCreated, onBack, recruiterData }: Readonly<InstitutionSetupProps>) {
  const [step, setStep] = useState<'basic' | 'details' | 'verification'>('basic');
  const [formData, setFormData] = useState({
    // Basic Information
    institutionName: '',
    institutionType: '',
    industry: '',
    size: '',
    
    // Contact Information
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phone: '',
    website: '',
    
    // Details
    description: '',
    foundedYear: '',
    headquarters: '',
    
    // Verification
    verificationDocument: null as File | null,
    taxId: '',
    registrationNumber: '',
    
    // Recruiter Role
    recruiterTitle: '',
    department: '',
    isAuthorized: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [setupError, setSetupError] = useState('');

  const validateBasicStep = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.institutionName.trim()) {
      newErrors.institutionName = 'Institution name is required';
    }
    if (!formData.institutionType) {
      newErrors.institutionType = 'Institution type is required';
    }
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    if (!formData.size) {
      newErrors.size = 'Company size is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetailsStep = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVerificationStep = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.recruiterTitle.trim()) {
      newErrors.recruiterTitle = 'Your job title is required';
    }
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    if (!formData.isAuthorized) {
      newErrors.isAuthorized = 'You must confirm you are authorized to register this institution';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleNext = () => {
    if (step === 'basic' && validateBasicStep()) {
      setStep('details');
    } else if (step === 'details' && validateDetailsStep()) {
      setStep('verification');
    }
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('basic');
    } else if (step === 'verification') {
      setStep('details');
    } else {
      onBack();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ verificationDocument: 'Please upload a PDF, JPG, or PNG file' });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ verificationDocument: 'File size must be less than 10MB' });
        return;
      }

      setFormData(prev => ({ ...prev, verificationDocument: file }));
      setErrors(prev => ({ ...prev, verificationDocument: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateVerificationStep()) return;

    setIsLoading(true);
    setSetupError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      const institutionData = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        verificationStatus: 'pending',
        adminRecruiter: {
          ...recruiterData,
          role: 'admin',
          title: formData.recruiterTitle,
          department: formData.department
        },
        teamMembers: [{
          ...recruiterData,
          role: 'admin',
          title: formData.recruiterTitle,
          department: formData.department,
          joinedAt: new Date().toISOString()
        }],
        settings: {
          allowTeamInvites: true,
          requireApproval: true,
          jobPostingLimit: 50
        }
      };

      onInstitutionCreated(institutionData);
    } catch (error) {
      setSetupError('An error occurred while setting up your institution. Please try again.');
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
    if (setupError) setSetupError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-medium">
              <span className="text-gray-900">the</span>
              <span className="text-[#ff6b35]">Garage</span>
            </h1>
          </div>
          <h2 className="text-xl text-gray-700 mb-2">
            Set up your institution
          </h2>
          <p className="text-gray-500">
            Register your organization to start hiring top talent
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step === 'basic' ? 'bg-[#ff6b35] border-[#ff6b35] text-white' : 
              step === 'details' || step === 'verification' ? 'bg-green-500 border-green-500 text-white' :
              'border-gray-300 text-gray-300'
            }`}>
              {step === 'details' || step === 'verification' ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <div className={`w-16 h-0.5 ${step === 'details' || step === 'verification' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step === 'details' ? 'bg-[#ff6b35] border-[#ff6b35] text-white' : 
              step === 'verification' ? 'bg-green-500 border-green-500 text-white' :
              'border-gray-300 text-gray-300'
            }`}>
              {step === 'verification' ? <CheckCircle className="w-4 h-4" /> : '2'}
            </div>
            <div className={`w-16 h-0.5 ${step === 'verification' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step === 'verification' ? 'bg-[#ff6b35] border-[#ff6b35] text-white' : 'border-gray-300 text-gray-300'
            }`}>
              3
            </div>
          </div>
        </div>

        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          {step === 'basic' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Basic Information</h3>
                <p className="text-gray-500">Tell us about your organization</p>
              </div>

              {/* Institution Name */}
              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution/Company Name</Label>
                <Input
                  id="institutionName"
                  placeholder="e.g. Tech Solutions Inc."
                  value={formData.institutionName}
                  onChange={(e) => handleChange('institutionName', e.target.value)}
                  className={`h-12 border-2 ${errors.institutionName ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.institutionName && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.institutionName}
                  </div>
                )}
              </div>

              {/* Institution Type */}
              <div className="space-y-2">
                <Label>Institution Type</Label>
                <Select value={formData.institutionType} onValueChange={(value: string | boolean | File | null) => handleChange('institutionType', value)}>
                  <SelectTrigger className={`h-12 border-2 ${errors.institutionType ? 'border-red-300' : 'border-gray-200'}`}>
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="nonprofit">Non-profit</SelectItem>
                    <SelectItem value="government">Government Agency</SelectItem>
                    <SelectItem value="university">University/Education</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="consulting">Consulting Firm</SelectItem>
                    <SelectItem value="agency">Recruiting Agency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.institutionType && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.institutionType}
                  </div>
                )}
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={formData.industry} onValueChange={(value: string | boolean | File | null) => handleChange('industry', value)}>
                  <SelectTrigger className={`h-12 border-2 ${errors.industry ? 'border-red-300' : 'border-gray-200'}`}>
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
                {errors.industry && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.industry}
                  </div>
                )}
              </div>

              {/* Company Size */}
              <div className="space-y-2">
                <Label>Company Size</Label>
                <Select value={formData.size} onValueChange={(value: string | boolean | File | null) => handleChange('size', value)}>
                  <SelectTrigger className={`h-12 border-2 ${errors.size ? 'border-red-300' : 'border-gray-200'}`}>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1,000 employees</SelectItem>
                    <SelectItem value="1001-5000">1,001-5,000 employees</SelectItem>
                    <SelectItem value="5000+">5,000+ employees</SelectItem>
                  </SelectContent>
                </Select>
                {errors.size && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.size}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Company Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your company and what you do..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="border-2 border-gray-200 min-h-[100px]"
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500">
                  {formData.description.length}/500 characters
                </div>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Information</h3>
                <p className="text-gray-500">Where is your organization located?</p>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className={`h-12 border-2 ${errors.address ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.address && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.address}
                  </div>
                )}
              </div>

              {/* City, State, Zip */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={`h-12 border-2 ${errors.city ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {errors.city && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.city}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    placeholder="State or Province"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="h-12 border-2 border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className={`h-12 border-2 ${errors.country ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {errors.country && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.country}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="ZIP or Postal Code"
                    value={formData.zipCode}
                    onChange={(e) => handleChange('zipCode', e.target.value)}
                    className="h-12 border-2 border-gray-200"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Main company phone number"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`h-12 border-2 ${errors.phone ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.phone && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </div>
                )}
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  placeholder="https://yourcompany.com"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className={`h-12 border-2 ${errors.website ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.website && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.website}
                  </div>
                )}
              </div>

              {/* Founded Year */}
              <div className="space-y-2">
                <Label htmlFor="foundedYear">Founded Year (Optional)</Label>
                <Input
                  id="foundedYear"
                  placeholder="2010"
                  value={formData.foundedYear}
                  onChange={(e) => handleChange('foundedYear', e.target.value)}
                  className="h-12 border-2 border-gray-200"
                />
              </div>
            </div>
          )}

          {step === 'verification' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Verification & Role</h3>
                <p className="text-gray-500">Confirm your authority and role within the organization</p>
              </div>

              {/* Recruiter Title */}
              <div className="space-y-2">
                <Label htmlFor="recruiterTitle">Your Job Title</Label>
                <Input
                  id="recruiterTitle"
                  placeholder="e.g. HR Manager, Talent Acquisition Specialist"
                  value={formData.recruiterTitle}
                  onChange={(e) => handleChange('recruiterTitle', e.target.value)}
                  className={`h-12 border-2 ${errors.recruiterTitle ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.recruiterTitle && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.recruiterTitle}
                  </div>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g. Human Resources, Talent Acquisition"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className={`h-12 border-2 ${errors.department ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.department && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.department}
                  </div>
                )}
              </div>

              {/* Verification Document Upload */}
              <div className="space-y-4">
                <Label>Verification Document (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#ff6b35] transition-colors">
                  <input
                    type="file"
                    id="verification"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="verification" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Upload business license or registration</p>
                        <p className="text-sm text-gray-500">PDF, JPG, or PNG (max 10MB)</p>
                      </div>
                    </div>
                  </label>
                </div>

                {errors.verificationDocument && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.verificationDocument}
                  </div>
                )}

                {formData.verificationDocument && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">{formData.verificationDocument.name}</p>
                          <p className="text-sm text-green-600">
                            {(formData.verificationDocument.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, verificationDocument: null }));
                          setErrors(prev => ({ ...prev, verificationDocument: '' }));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tax ID */}
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / EIN (Optional)</Label>
                <Input
                  id="taxId"
                  placeholder="e.g. 12-3456789"
                  value={formData.taxId}
                  onChange={(e) => handleChange('taxId', e.target.value)}
                  className="h-12 border-2 border-gray-200"
                />
                <p className="text-sm text-gray-500">This helps verify your organization's legitimacy</p>
              </div>

              {/* Authorization Confirmation */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="authorized"
                    checked={formData.isAuthorized}
                    onChange={(e) => handleChange('isAuthorized', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="authorized" className="text-amber-800 cursor-pointer">
                      I confirm that I am authorized to register this organization on theGarage and create recruiting accounts on behalf of this institution.
                    </Label>
                    {errors.isAuthorized && (
                      <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.isAuthorized}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {setupError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {setupError}
              </AlertDescription>
            </Alert>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="px-6"
            >
              Back
            </Button>

            <div className="flex gap-3">
              {step !== 'verification' ? (
                <Button
                  onClick={handleNext}
                  className="px-8 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f]"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f]"
                >
                  {isLoading ? 'Setting up...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </div>

          {/* Already have an institution? */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Already part of an institution?{' '}
              <button 
                onClick={() => {
                  // Navigate to join institution component - this will be handled in the parent
                  if (globalThis.confirm('This will redirect you to join an existing institution. Continue?')) {
                    // This will be implemented when we integrate with the app routing
                    alert('Join institution feature coming soon!');
                  }
                }}
                className="text-[#ff6b35] hover:underline"
              >
                Join existing institution
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}