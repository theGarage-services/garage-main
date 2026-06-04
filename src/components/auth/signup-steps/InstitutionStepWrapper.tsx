import { InstitutionSetup } from '@/components/institution/InstitutionSetup';
import { InstitutionStepWrapperProps } from '@/types/auth/signup';

export function InstitutionStepWrapper({
  formData,
  onInstitutionCreated,
  onBack,
}: Readonly<InstitutionStepWrapperProps>) {
  return (
    <InstitutionSetup
      onInstitutionCreated={onInstitutionCreated}
      onBack={onBack}
      recruiterData={{
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        jobTitle: formData.jobTitle,
        company: formData.company,
      }}
    />
  );
}
