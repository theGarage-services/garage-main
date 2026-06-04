import { AlertCircle, Lock, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useTestPermissions } from '../../hooks/useTestPermissions';
import { MOCK_ORGANIZATION } from '@/utils/testMockData';

interface TestAccessDeniedProps {
  feature?: string;
  requiredPermission?: string;
  onRequestAccess?: () => void;
}

export function TestAccessDenied({ 
  feature = 'this feature', 
  requiredPermission,
  onRequestAccess 
}: Readonly<TestAccessDeniedProps>) {
  const { currentUser } = useTestPermissions();
  
  // Find master profile to show contact info
  const masterProfile = MOCK_ORGANIZATION.members.find(m => m.role === 'master');

  return (
    <div className="flex items-center justify-center min-h-[500px] p-8">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <h2 className="text-2xl mb-2">Access Restricted</h2>
        
        <div className="flex items-center justify-center gap-2 mb-4 text-amber-600">
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">You don't have permission to access {feature}</p>
        </div>
        
        {requiredPermission && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Required Permission:</p>
            <p className="text-sm text-gray-900">{requiredPermission}</p>
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-6">
          Contact your organization administrator to request access to this feature.
        </p>
        
        {masterProfile && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <p className="text-sm text-gray-700 mb-2">Organization Administrator:</p>
            <div className="flex items-center justify-center gap-2 mb-1">
              <img 
                src={masterProfile.avatar} 
                alt={masterProfile.name}
                className="w-8 h-8 rounded-full"
              />
              <p className="text-sm">{masterProfile.name}</p>
            </div>
            <p className="text-xs text-gray-500">{masterProfile.email}</p>
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <Button
            onClick={onRequestAccess || (() => alert('Access request sent to administrator'))}
            className="w-full"
          >
            <Mail className="w-4 h-4 mr-2" />
            Request Access
          </Button>
          
          <Button
            variant="outline"
            onClick={() => globalThis.history.back()}
            className="w-full"
          >
            Go Back
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-gray-500">
            Your current role: <span className="font-medium">{currentUser.role === 'master' ? 'Master Profile' : 'Team Member'}</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
