import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Eye, EyeOff, User, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { SocialAuthOptions } from './SocialAuthOptions';
import { authService } from '../../api/auth';

interface LoginProps {
  onLogin: (userData: any, role: 'job-seeker' | 'recruiter' | 'admin') => void;
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
  onBack?: () => void;
  userRole: 'job-seeker' | 'recruiter' | 'admin';
}

export function Login({ onLogin, onSwitchToSignUp, onForgotPassword, onBack, userRole }: Readonly<LoginProps>) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validateEmail = (email: string) => {
    // Safe email regex - prevents ReDoS attacks
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseLoginError = (error: any): string => {
    if (!error.message) {
      return 'Invalid email or password. Please try again.';
    }

    try {
      const errorData = JSON.parse(error.message);

      if (errorData.error === 'Account locked') {
        const remainingMinutes = errorData.remaining_minutes;
        const sessionNumber = errorData.session_number || 1;
        const timeString = remainingMinutes < 60
          ? `${remainingMinutes} minutes`
          : `${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}m`;
        return `Account locked due to too many failed attempts (Session ${sessionNumber}). Please try again in ${timeString}.`;
      }

      if (errorData.error === 'Account not found') {
        return errorData.details || 'Account not found for this role.';
      }

      return errorData.details || 'Invalid email or password. Please try again.';
    } catch {
      return error.message;
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password, userRole);
      const userProfile = await authService.getCurrentUser();
      const determinedRole = userProfile?.role || userRole;

      const userData = {
        ...response.user,
        role: userProfile?.role || response.user?.role || userRole,
        tier: userProfile?.tier || 'basic',
        profileComplete: userProfile?.profile_complete || false
      };
      onLogin(userData, determinedRole);
    } catch (error: any) {
      setLoginError(parseLoginError(error));
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
            userRole={userRole}
          />

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