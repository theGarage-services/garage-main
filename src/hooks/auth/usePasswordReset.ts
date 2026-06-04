import { useState, useEffect, useCallback } from 'react';

interface PasswordValidation {
  isValid: boolean;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

interface PasswordStrength {
  strength: {
    score: number;
    level: string;
    color: string;
    percentage: number;
  };
  history_violation?: boolean;
  validation_errors?: string[];
}

interface UsePasswordResetOptions {
  token?: string | null;
}

interface UsePasswordResetReturn {
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  isSuccess: boolean;
  error: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  tokenValid: boolean | null;
  passwordStrength: PasswordStrength | null;
  isCheckingStrength: boolean;
  passwordValidation: PasswordValidation;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  canSubmit: () => boolean;
  handleSubmit: () => Promise<void>;
}

export function usePasswordReset({ token }: UsePasswordResetOptions): UsePasswordResetReturn {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [isCheckingStrength, setIsCheckingStrength] = useState(false);

  const validatePassword = useCallback((pwd: string): PasswordValidation => {
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*()_+\-=[\]{};:"\\|,.<>/?]/.test(pwd),
    };

    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements,
    };
  }, []);

  const passwordValidation = validatePassword(password);

  const checkPasswordStrength = useCallback(async (pwd: string) => {
    setIsCheckingStrength(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/accounts/password/strength/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });

      if (response.ok) {
        const data = await response.json();
        setPasswordStrength(data);
      }
    } catch (err) {
      console.error('Error checking password strength:', err);
    } finally {
      setIsCheckingStrength(false);
    }
  }, []);

  const validateToken = useCallback(async () => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      setTokenValid(false);
      return;
    }

    try {
      if (token.length > 10) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
      }
    } catch {
      setTokenValid(false);
      setError('Unable to validate reset link. Please request a new password reset.');
    }
  }, [token]);

  useEffect(() => {
    void validateToken();
  }, [validateToken]);

  useEffect(() => {
    if (password && password.length >= 3) {
      void checkPasswordStrength(password);
    } else {
      setPasswordStrength(null);
    }
  }, [password, checkPasswordStrength]);

  const canSubmit = useCallback((): boolean => {
    const basicValid = passwordValidation.isValid;
    const passwordsMatch = password === confirmPassword;
    const strengthValid = (passwordStrength?.strength?.score ?? 0) >= 3;
    const notReused = !passwordStrength?.history_violation;
    const noValidationErrors = !passwordStrength?.validation_errors?.length;

    return basicValid && passwordsMatch && strengthValid && notReused && noValidationErrors;
  }, [password, confirmPassword, passwordValidation.isValid, passwordStrength]);

  const handleSubmit = async (): Promise<void> => {
    setError('');

    if (!canSubmit()) {
      setError('Please address all validation requirements before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/accounts/password/reset/confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirm_password: confirmPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset password');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    confirmPassword,
    isLoading,
    isSuccess,
    error,
    showPassword,
    showConfirmPassword,
    tokenValid,
    passwordStrength,
    isCheckingStrength,
    passwordValidation,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    canSubmit,
    handleSubmit,
  };
}
