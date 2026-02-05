import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Eye, EyeOff, Shield, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface AdminLoginProps {
  onLogin: (userData: any) => void;
  onBack: () => void;
}

export function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // Registration fields
    firstName: '',
    lastName: '',
    companyName: '',
    companyWebsite: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }

      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }

      if (!formData.companyName) {
        newErrors.companyName = 'Company name is required';
      }

      if (!formData.companyWebsite) {
        newErrors.companyWebsite = 'Company website is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (mode === 'register') {
        // New organization registration
        onLogin({
          id: `org-${Date.now()}`,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: 'master',
          company: formData.companyName,
          title: 'Enterprise Administrator',
          organizationId: `org-${Date.now()}`,
          permissions: [], // Master has all permissions
          profileComplete: false, // New users need to complete profile
          isNewOrganization: true,
          companyWebsite: formData.companyWebsite
        });
      } else {
        // Existing enterprise login - Support 5 demo accounts
        const demoAccounts = {
          'admin@thegarage.com': {
            id: 'admin-001',
            firstName: 'Enterprise',
            lastName: 'Admin',
            role: 'admin',
            title: 'Enterprise Administrator',
            permissions: []
          },
          'lead@thegarage.com': {
            id: 'lead-001',
            firstName: 'Lead',
            lastName: 'Recruiter',
            role: 'lead',
            title: 'Lead Recruiter',
            permissions: ['view_all_teams', 'strategic_reports', 'set_quotas', 'analytics']
          },
          'manager@thegarage.com': {
            id: 'manager-001',
            firstName: 'Manager',
            lastName: 'Recruiter',
            role: 'manager',
            title: 'Manager Recruiter',
            permissions: ['create_users', 'approve_jobs', 'assign_jobs', 'team_reports']
          },
          'recruiter@thegarage.com': {
            id: 'recruiter-001',
            firstName: 'David',
            lastName: 'Martinez',
            role: 'recruiter',
            title: 'Technical Recruiter',
            permissions: ['create_job_drafts', 'search_candidates', 'schedule_interviews'],
            canPostWithoutApproval: false
          },
          'recruiter-trusted@thegarage.com': {
            id: 'recruiter-002',
            firstName: 'Lisa',
            lastName: 'Anderson',
            role: 'recruiter',
            title: 'Senior Technical Recruiter',
            permissions: ['create_job_drafts', 'search_candidates', 'schedule_interviews', 'publish_directly'],
            canPostWithoutApproval: true
          },
          'hiring@thegarage.com': {
            id: 'hiring-001',
            firstName: 'Hiring',
            lastName: 'Manager',
            role: 'hiring-manager',
            title: 'Hiring Manager',
            permissions: ['review_candidates', 'schedule_interviews', 'make_decisions']
          }
        };

        if (formData.password === 'password' && formData.email in demoAccounts) {
          const accountData = demoAccounts[formData.email as keyof typeof demoAccounts];
          onLogin({
            ...accountData,
            email: formData.email,
            company: 'TechCorp Inc.',
            organizationId: 'org-001',
            profileComplete: true,
            canPostWithoutApproval: (accountData as any).canPostWithoutApproval ?? false
          });
        } else {
          setLoginError('Invalid credentials. Use one of the demo accounts with password "password"');
        }
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (loginError) setLoginError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#ff6b35] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Role Selection
          </button>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-medium">
              <span className="text-gray-900">the</span>
              <span className="text-[#ff6b35]">Garage</span>
            </h1>
          </div>
          <h2 className="text-xl text-gray-700 mb-2">
            {mode === 'login' ? 'Welcome back, Enterprise!' : 'Register Your Organization'}
          </h2>
          <p className="text-gray-500">
            {mode === 'login' 
              ? 'Sign in to your enterprise account to continue' 
              : 'Create your enterprise organization account'}
          </p>
        </div>

        {/* Login/Register Card */}
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError('');
                setErrors({});
              }}
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-[#ff6b35] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setLoginError('');
                setErrors({});
              }}
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-[#ff6b35] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          {/* Demo Login Buttons - Only show in login mode */}
          {mode === 'login' && (
            <div className="mb-6 space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick Demo Login (6 User Types):</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({ ...formData, email: 'admin@thegarage.com', password: 'password' });
                  }}
                  className="h-auto py-2 flex flex-col items-center gap-1 hover:border-red-600 hover:text-red-600"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-medium">Admin</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({ ...formData, email: 'lead@thegarage.com', password: 'password' });
                  }}
                  className="h-auto py-2 flex flex-col items-center gap-1 hover:border-orange-600 hover:text-orange-600"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-medium">Lead</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({ ...formData, email: 'manager@thegarage.com', password: 'password' });
                  }}
                  className="h-auto py-2 flex flex-col items-center gap-1 hover:border-purple-600 hover:text-purple-600"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-medium">Manager</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({ ...formData, email: 'recruiter@thegarage.com', password: 'password' });
                  }}
                  className="h-auto py-2 flex flex-col items-center gap-1 hover:border-blue-600 hover:text-blue-600"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-medium">Recruiter</span>
                  <span className="text-[10px] text-gray-500">Needs Approval</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({ ...formData, email: 'recruiter-trusted@thegarage.com', password: 'password' });
                  }}
                  className="h-auto py-2 flex flex-col items-center gap-1 hover:border-green-600 hover:text-green-600"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-medium">Trusted Recruiter</span>
                  <span className="text-[10px] text-green-600">✓ Direct Publish</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({ ...formData, email: 'hiring@thegarage.com', password: 'password' });
                  }}
                  className="h-auto py-2 flex flex-col items-center gap-1 hover:border-yellow-600 hover:text-yellow-600"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-medium">Hiring Manager</span>
                </Button>
              </div>
            </div>
          )}

          {/* Login Error */}
          {loginError && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {loginError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Registration Fields - Only show in register mode */}
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className={`h-12 border-2 transition-all ${
                        errors.firstName 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-[#ff6b35]'
                      }`}
                    />
                    {errors.firstName && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.firstName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className={`h-12 border-2 transition-all ${
                        errors.lastName 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-[#ff6b35]'
                      }`}
                    />
                    {errors.lastName && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-700">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Acme Corporation"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className={`h-12 border-2 transition-all ${
                      errors.companyName 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-[#ff6b35]'
                    }`}
                  />
                  {errors.companyName && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.companyName}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite" className="text-gray-700">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    type="url"
                    placeholder="https://acmecorp.com"
                    value={formData.companyWebsite}
                    onChange={(e) => handleChange('companyWebsite', e.target.value)}
                    className={`h-12 border-2 transition-all ${
                      errors.companyWebsite 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-[#ff6b35]'
                    }`}
                  />
                  {errors.companyWebsite && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.companyWebsite}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder={mode === 'login' ? 'master@thegarage.com' : 'admin@acmecorp.com'}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`h-12 border-2 transition-all ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-[#ff6b35]'
                }`}
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
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`h-12 border-2 pr-12 transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#ff6b35]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white font-medium transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  {mode === 'register' ? 'Creating Organization...' : 'Signing In...'}
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  {mode === 'register' ? 'Create Organization' : 'Sign In to Enterprise'}
                </>
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700 text-center">
              🔒 Enterprise portal with complete organizational access
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
