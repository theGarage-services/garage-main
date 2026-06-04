import apiClient from './client';

export interface PasswordStrengthData {
  strength: {
    level: string;
    score: number;
    color: string;
    percentage: number;
  };
  history_violation: boolean;
  validation_errors: string[];
}

export interface PasswordResetConfirmRequest {
  token: string;
  password: string;
  confirm_password: string;
}

export class PasswordResetService {
  // Check password strength
  async checkPasswordStrength(password: string): Promise<PasswordStrengthData> {
    const response = await apiClient.request('/accounts/password/strength/', {
      method: 'POST',
      body: JSON.stringify({ password }),
      skipAuth: true as any,
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to check password strength');
  }

  // Confirm password reset
  async confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<any> {
    const response = await apiClient.request('/accounts/password/reset/confirm/', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true as any,
    });

    if (response.ok) {
      return await response.json();
    }
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to reset password');
  }

  // Change password (authenticated)
  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<any> {
    const response = await apiClient.request('/accounts/password/change/', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });

    if (response.ok) {
      return await response.json();
    }
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to change password');
  }

  // Validate reset token
  validateToken(token: string): boolean {
    // For now, assume token is valid if it exists and has sufficient length
    // In a real implementation, you'd validate the specific token with the backend
    return !!(token && token.length > 10);
  }
}

// Export singleton instance
export const passwordResetService = new PasswordResetService();
