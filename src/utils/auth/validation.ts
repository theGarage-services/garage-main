import { FormErrors, PasswordValidation, SignupFormData, UserRole } from '@/types/auth/signup';

export function validateEmail(email: string): boolean {
  // Safe email regex - prevents ReDoS attacks
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): PasswordValidation {
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
    isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
  };
}

export function validateAccountStep(formData: SignupFormData): FormErrors {
  const newErrors: FormErrors = {};

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

  return newErrors;
}

export function validateProfileStep(formData: SignupFormData, userRole: UserRole): FormErrors {
  const newErrors: FormErrors = {};

  if (!formData.jobTitle.trim()) {
    newErrors.jobTitle = userRole === 'recruiter' ? 'Your job title is required' : 'Current job title is required';
  }
  if (userRole === 'job-seeker' && !formData.experience) {
    newErrors.experience = 'Experience level is required';
  }
  if (!formData.location.trim()) {
    newErrors.location = 'Location is required';
  }

  return newErrors;
}

export function isStepValid(errors: FormErrors): boolean {
  return Object.keys(errors).length === 0;
}
