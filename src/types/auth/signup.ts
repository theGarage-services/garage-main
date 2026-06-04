export type UserRole = 'job-seeker' | 'recruiter' | 'admin';
export type SignupStep = 'account' | 'profile' | 'preferences' | 'resume' | 'institution';

export interface SignUpProps {
  onSignUp: (userData: any, role: UserRole) => void;
  onSwitchToLogin: () => void;
  onBack?: () => void;
  userRole: UserRole;
  isOAuthUser?: boolean;
  oauthUserData?: any;
  isEmailVerified?: boolean;
}

export interface SignupFormData {
  // Account Info
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;

  // Profile Info (Job Seeker)
  jobTitle: string;
  experience: string;
  location: string;
  phone: string;
  bio: string;
  skills: string;
  
  // Optional social links and professional info
  linkedin: string;
  github: string;
  portfolio: string;
  currentCompany: string;
  
  // Optional JSON fields
  projects: any[];
  certifications: any[];
  education: any[];
  work_history: any[];

  // Company Info (Recruiter)
  company: string;
  companySize: string;
  department: string;
  industry: string;
  website: string;
  institution: any;

  // Profile Image (Recruiter & Job Seeker)
  profileImage: string;

  // Job Preferences (Job Seeker) - Individual fields replacing single preferences object
  preferredLocations: string[];
  preferredSalaryRanges: string[];
  preferredJobTypes: string[];
  preferredWorkArrangements: string[];

  // Resume
  resumeFile: File | null;
  resumeText: string;
}

export interface FormErrors {
  [key: string]: string;
}

export type FormFieldValue = string | boolean | File | null | string[];

export interface PasswordValidation {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}

export interface AccountStepProps {
  formData: SignupFormData;
  errors: FormErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  passwordCheck: PasswordValidation;
  onChange: (field: string, value: FormFieldValue) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onSocialAuth: (provider: string, userData: any) => void;
  onSwitchToLogin: () => void;
  onContinue?: () => void;
  userRole: UserRole;
}

export interface ProfileStepProps {
  formData: SignupFormData;
  errors: FormErrors;
  userRole: UserRole;
  onChange: (field: string, value: FormFieldValue) => void;
  onBack?: () => void;
  onContinue?: () => void;
}

export interface ResumeStepProps {
  formData: SignupFormData;
  errors: FormErrors;
  userRole?: UserRole;
  onChange: (field: string, value: FormFieldValue) => void;
  onError: (message: string) => void;
  onComplete?: (userData: any, role: UserRole) => void;
  onNext: (parsedData?: Record<string, string>) => void;
  onBack?: () => void;
  isMandatory?: boolean;
}

export interface InstitutionStepWrapperProps {
  formData: SignupFormData;
  onInstitutionCreated: (institutionData: any) => void;
  onBack: () => void;
}
