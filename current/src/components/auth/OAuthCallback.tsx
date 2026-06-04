import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { oauthService } from '../../api/oauth';

interface OAuthCallbackProps {
  onOAuthSuccess: (userData: any) => void;
  onOAuthError: (error: string) => void;
  role?: string; // Add role parameter
}

export function OAuthCallback({ onOAuthSuccess, onOAuthError, role }: Readonly<OAuthCallbackProps>) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isProcessingRef = useRef(false); // NEW: Use ref for more reliable prevention


  useEffect(() => {
    const handleOAuthCallback = async () => {
      // NEW: Prevent double calls due to React Strict Mode using ref
      if (isProcessingRef.current) {
        return;
      }
      
      isProcessingRef.current = true;
      
      try {
        
        if (!role) {
          throw new Error('No role provided for OAuth authentication');
        }
        
        // Check URL parameters first
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        
        
        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Missing OAuth callback parameters');
        }

        const oauthResponse = await oauthService.handleOAuthRedirect(role);
        
        // Transform OAuth response to match expected user data format
        const userData = {
          id: oauthResponse.user.id,
          username: oauthResponse.user.username,
          email: oauthResponse.user.email,
          first_name: oauthResponse.user.first_name,
          last_name: oauthResponse.user.last_name,
          created: oauthResponse.created, // NEW: Pass created flag from backend
          profileComplete: !oauthResponse.created, // If user was just created, profile is not complete
          provider: 'google',
          role: oauthResponse.user.role // Use backend role
        };

        onOAuthSuccess(userData);
      } catch (error: any) {
        setError(error.message || 'OAuth authentication failed');
        onOAuthError(error.message || 'OAuth authentication failed');
      } finally {
        setIsLoading(false);
        // No need to reset ref since component will unmount anyway
      }
    };

    handleOAuthCallback();
  }, [onOAuthSuccess, onOAuthError, role]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">OAuth Authentication Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Completing Google sign-in...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we authenticate your account</p>
        </div>
      </div>
    );
  }

  return null; // This component will redirect or be unmounted after callback
}
