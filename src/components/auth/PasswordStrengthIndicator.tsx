import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

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

interface PasswordStrengthIndicatorProps {
  password: string;
  passwordStrength: PasswordStrength | null;
  passwordValidation: PasswordValidation;
  isCheckingStrength: boolean;
}

export function PasswordStrengthIndicator({
  password,
  passwordStrength,
  passwordValidation,
  isCheckingStrength,
}: Readonly<PasswordStrengthIndicatorProps>) {
  if (!password) return null;

  const getStrengthColor = (color: string): string => {
    switch (color) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-red-500';
    }
  };

  const getStrengthTextColor = (color: string): string => {
    switch (color) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-red-600';
    }
  };

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      {/* Password Strength Meter */}
      {passwordStrength && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Password Strength</p>
            <span className={`text-sm font-medium ${getStrengthTextColor(passwordStrength.strength.color)}`}>
              {passwordStrength.strength.level}
              {isCheckingStrength && <Loader2 className="w-3 h-3 inline ml-1 animate-spin" />}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.strength.color)}`}
              style={{ width: `${passwordStrength.strength.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Basic Requirements */}
      <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
      <div className="space-y-1">
        <RequirementItem met={passwordValidation.requirements.length} label="At least 8 characters" />
        <RequirementItem met={passwordValidation.requirements.uppercase} label="Uppercase letter" />
        <RequirementItem met={passwordValidation.requirements.lowercase} label="Lowercase letter" />
        <RequirementItem met={passwordValidation.requirements.number} label="Number" />
        <RequirementItem met={passwordValidation.requirements.special} label="Special character" />
      </div>

      {/* Advanced Policy Checks */}
      {passwordStrength && (
        <div className="space-y-2 pt-2 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700">Security Checks:</p>

          {/* Strength Requirement */}
          <SecurityCheckItem
            passed={passwordStrength.strength.score >= 3}
            passLabel="Strong enough"
            failLabel="Must be stronger (Good or Strong)"
          />

          {/* History Check */}
          <SecurityCheckItem
            passed={!passwordStrength.history_violation}
            passLabel="Not used before"
            failLabel="Cannot reuse recent password"
          />

          {/* Validation Errors */}
          {passwordStrength.validation_errors && passwordStrength.validation_errors.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-600">Additional requirements:</p>
              {passwordStrength.validation_errors.map((error: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RequirementItem({ met, label }: Readonly<{ met: boolean; label: string }>) {
  return (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />}
      {label}
    </div>
  );
}

function SecurityCheckItem({ passed, passLabel, failLabel }: Readonly<{ passed: boolean; passLabel: string; failLabel: string }>) {
  return (
    <div className={`flex items-center gap-2 text-sm ${passed ? 'text-green-600' : 'text-orange-600'}`}>
      {passed ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {passed ? passLabel : failLabel}
    </div>
  );
}
