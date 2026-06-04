import { CheckCircle } from 'lucide-react';

type Step = 'basic' | 'details' | 'verification';

interface StepIndicatorProps {
  step: Step;
}

interface StepConfig {
  isActive: boolean;
  isComplete: boolean;
  label: string;
}

const getStepConfig = (currentStep: Step, stepIndex: number): StepConfig => {
  const stepOrder: Step[] = ['basic', 'details', 'verification'];
  const stepName = stepOrder[stepIndex];
  const currentIndex = stepOrder.indexOf(currentStep);
  const index = stepOrder.indexOf(stepName);

  return {
    isActive: currentStep === stepName,
    isComplete: currentIndex > index,
    label: String(stepIndex + 1)
  };
};

function StepCircle({ config }: Readonly<{ config: StepConfig }>) {
  const baseClasses = 'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors';

  if (config.isActive) {
    return (
      <div className={`${baseClasses} bg-[#ff6b35] border-[#ff6b35] text-white`}>
        {config.label}
      </div>
    );
  }

  if (config.isComplete) {
    return (
      <div className={`${baseClasses} bg-green-500 border-green-500 text-white`}>
        <CheckCircle className="w-4 h-4" />
      </div>
    );
  }

  return (
    <div className={`${baseClasses} border-gray-300 text-gray-300`}>
      {config.label}
    </div>
  );
}

function StepLine({ isComplete }: Readonly<{ isComplete: boolean }>) {
  return (
    <div className={`w-16 h-0.5 transition-colors ${isComplete ? 'bg-green-500' : 'bg-gray-300'}`} />
  );
}

export function StepIndicator({ step }: Readonly<StepIndicatorProps>) {
  const step1 = getStepConfig(step, 0);
  const step2 = getStepConfig(step, 1);
  const step3 = getStepConfig(step, 2);

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <StepCircle config={step1} />
        <StepLine isComplete={step1.isComplete} />
        <StepCircle config={step2} />
        <StepLine isComplete={step2.isComplete} />
        <StepCircle config={step3} />
      </div>
    </div>
  );
}
