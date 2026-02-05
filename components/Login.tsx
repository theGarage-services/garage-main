import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Eye, EyeOff, User, Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { SocialAuthOptions } from './SocialAuthOptions';

interface LoginProps {
  onLogin: (userData: any, role: 'job-seeker' | 'recruiter') => void;
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
  onBack?: () => void;
  userRole: 'job-seeker' | 'recruiter';
}

export function Login({ onLogin, onSwitchToSignUp, onForgotPassword, onBack, userRole }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock authentication - in real app, this would be an API call
      const validCredentials = [
        'demo@thegarage.com',
        'member@thegarage.com',
        'premium@thegarage.com',
        'basic@thegarage.com'
      ];

      if (validCredentials.includes(formData.email) && formData.password === 'password') {
        onLogin({
          email: formData.email,
          profileComplete: true
        }, userRole);
      } else {
        setLoginError('Invalid email or password. Try one of the demo accounts with password "password"');
      }
    } catch (error) {
      setLoginError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: string, userData: any) => {
    setIsLoading(true);
    try {
      // Simulate social auth API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onLogin({
        ...userData,
        profileComplete: true
      }, userRole);
    } catch (error) {
      setLoginError(`Failed to sign in with ${provider}. Please try again.`);
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
          {onBack && (
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
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-medium">
              <span className="text-gray-900">the</span>
              <span className="text-[#ff6b35]">Garage</span>
            </h1>
          </div>
          <h2 className="text-xl text-gray-700 mb-2">
            Welcome back{userRole === 'recruiter' ? ', Recruiter' : ''}!
          </h2>
          <p className="text-gray-500">
            Sign in to your {userRole === 'recruiter' ? 'recruiter' : 'job seeker'} account to continue
          </p>
        </div>



        {/* Login Form */}
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`pl-4 pr-4 h-12 border-2 transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#ff6b35]'
                  }`}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`pl-4 pr-12 h-12 border-2 transition-all ${
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

            {/* Login Error */}
            {loginError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {loginError}
                </AlertDescription>
              </Alert>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-[#ff6b35] hover:text-[#e55a2b] transition-colors"
              >
                Forgot your password?
              </button>
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
                  Signing in...
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Social Auth Options */}
          <SocialAuthOptions 
            onSocialAuth={handleSocialAuth}
            isLogin={true}
          />

          {/* Quick Demo Login Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">Quick Demo Login</p>
            <div className="grid gap-2">
              {userRole === 'job-seeker' ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({ email: 'premium@thegarage.com', password: 'password' });
                      setErrors({});
                      setLoginError('');
                    }}
                    className="text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                  >
                    Fill Premium Demo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({ email: 'basic@thegarage.com', password: 'password' });
                      setErrors({});
                      setLoginError('');
                    }}
                    className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Fill Basic Demo
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({ email: 'member@thegarage.com', password: 'password' });
                      setErrors({});
                      setLoginError('');
                    }}
                    className="text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    Fill Recruiter Demo
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Demo Credentials */}
          {userRole === 'recruiter' && (
            <div className="mt-6 space-y-3">
              {/* Recruiter Demo */}
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Recruiter Demo Account</span>
                </div>
                <div className="text-sm text-orange-700">
                  <p><strong>Email:</strong> member@thegarage.com</p>
                  <p><strong>Password:</strong> password</p>
                  <p className="text-xs mt-1 opacity-75">Access: Independent recruiter with job posting & candidate management</p>
                </div>
              </div>
            </div>
          )}

          {userRole === 'job-seeker' && (
            <div className="mt-6 space-y-3">
              {/* Premium Demo */}
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Premium Job Seeker Demo</span>
                </div>
                <div className="text-sm text-yellow-700">
                  <p><strong>Email:</strong> premium@thegarage.com</p>
                  <p><strong>Password:</strong> password</p>
                  <p className="text-xs mt-1 opacity-75">Access: All premium features, unlimited queues, AI insights</p>
                </div>
              </div>

              {/* Basic Demo */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-800">Basic Job Seeker Demo</span>
                </div>
                <div className="text-sm text-gray-700">
                  <p><strong>Email:</strong> basic@thegarage.com</p>
                  <p><strong>Password:</strong> password</p>
                  <p className="text-xs mt-1 opacity-75">Access: Basic features, up to 3 queues, standard support</p>
                </div>
              </div>
            </div>
          )}

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignUp}
                className="text-[#ff6b35] hover:text-[#e55a2b] font-medium transition-colors"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}