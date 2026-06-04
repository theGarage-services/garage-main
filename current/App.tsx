import { useState, useCallback, useMemo } from 'react';
import './styles/globals.css';

// Essential components for authentication flow
import { LandingPage } from './components/LandingPage';
import { About } from './components/About';
import { RoleSelector } from './components/RoleSelector';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { ForgotPassword } from './components/ForgotPassword';
import { AdminLogin } from './components/AdminLogin';
import { ViewRenderer } from './components/ViewRenderer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ResumeUploadFlow } from './components/ResumeUploadFlow';
import { EnterpriseAdminDashboard } from './components/EnterpriseAdminDashboard';
import { ThemeProvider } from './src/theme/ThemeProvider';

// Enterprise system components
import { CompanySetupWizard } from './components/CompanySetupWizard';
import { UserCreationWizard } from './components/UserCreationWizard';
import { TeamManagementDashboard } from './components/TeamManagementDashboard';
import { ApprovalQueue } from './components/ApprovalQueue';
import { DocumentManagementCenter } from './components/DocumentManagementCenter';
import { RegularRecruiterDashboard } from './components/RegularRecruiterDashboard';
import { UnifiedRecruiterDashboard } from './components/UnifiedRecruiterDashboard';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-orange-200 border-t-[#ff6b35] rounded-full animate-spin mx-auto mb-4"></div>
      <h1 className="text-2xl font-bold mb-2">
        <span className="text-slate-900">the</span>
        <span className="text-[#ff6b35]">Garage</span>
      </h1>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
    <div className="text-center p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">
        <span className="text-slate-900">the</span>
        <span className="text-[#ff6b35]">Garage</span>
      </h1>
      <p className="text-gray-600 mb-4">Something went wrong. Please try again.</p>
      <div className="flex gap-3 justify-center">
        <button 
          onClick={onRetry}
          className="px-6 py-2 bg-[#ff6b35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
        >
          Try Again
        </button>
        <button 
          onClick={() => globalThis.location.reload()}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  </div>
);

// Demo user profiles
const demoProfiles = {
  'member@thegarage.com': {
    id: 'member-1',
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'member@thegarage.com',
    role: 'recruiter',
    company: 'Independent Recruiter',
    department: '',
    title: 'Recruiter',
    avatar: null
  },
  'premium@thegarage.com': {
    id: 'premium-1',
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'premium@thegarage.com',
    role: 'job-seeker',
    title: 'Senior Data Scientist',
    location: 'San Francisco, CA',
    isPremium: true,
    avatar: null,
    preferences: {
      locations: ['San Francisco, CA, USA', 'New York City, NY, USA', 'Remote'],
      salaryRanges: ['$150k - $200k', 'Over $200k'],
      jobTypes: ['Full-time', 'Contract'],
      workArrangements: ['Remote', 'Hybrid']
    },
    premiumFeatures: {
      queueIntelligence: true,
      profileComparison: true,
      smartRecommendations: true,
      prioritySupport: true,
      advancedAnalytics: true,
      unlimitedQueues: true,
      profileBoost: true,
      expertReviews: true
    },
    subscription: {
      plan: 'Premium',
      status: 'active',
      renewsAt: '2025-01-30',
      features: ['All Premium Features', 'Priority Support', 'Advanced Analytics']
    }
  },
  'basic@thegarage.com': {
    id: 'basic-1',
    firstName: 'Jordan',
    lastName: 'Smith',
    email: 'basic@thegarage.com',
    role: 'job-seeker',
    title: 'Software Engineer',
    location: 'Austin, TX',
    isPremium: false,
    avatar: null,
    preferences: {
      locations: ['Austin, TX, USA', 'Remote'],
      salaryRanges: ['$80k - $100k', '$100k - $150k'],
      jobTypes: ['Full-time'],
      workArrangements: ['Remote', 'Hybrid']
    },
    premiumFeatures: {
      queueIntelligence: false,
      profileComparison: false,
      smartRecommendations: false,
      prioritySupport: false,
      advancedAnalytics: false,
      unlimitedQueues: false,
      profileBoost: false,
      expertReviews: false
    },
    subscription: {
      plan: 'Free',
      status: 'active',
      renewsAt: null,
      features: ['Basic Job Tracking', 'Up to 3 Queues', 'Standard Support']
    }
  },
  // Enterprise Users
  'admin@thegarage.com': {
    id: 'admin-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'admin@thegarage.com',
    role: 'admin',
    company: 'TechCorp Inc.',
    department: 'Human Resources',
    title: 'VP of Talent Acquisition',
    avatar: null
  },
  'lead@thegarage.com': {
    id: 'lead-1',
    firstName: 'Marcus',
    lastName: 'Williams',
    email: 'lead@thegarage.com',
    role: 'lead',
    company: 'TechCorp Inc.',
    department: 'Recruiting',
    title: 'Lead Recruiter',
    avatar: null
  },
  'manager@thegarage.com': {
    id: 'manager-1',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'manager@thegarage.com',
    role: 'manager',
    company: 'TechCorp Inc.',
    department: 'Engineering Recruiting',
    title: 'Recruiting Manager',
    avatar: null
  },
  'recruiter@thegarage.com': {
    id: 'recruiter-1',
    firstName: 'David',
    lastName: 'Martinez',
    email: 'recruiter@thegarage.com',
    role: 'recruiter',
    company: 'TechCorp Inc.',
    department: 'Engineering Recruiting',
    title: 'Technical Recruiter',
    avatar: null,
    canPostWithoutApproval: false // Requires approval (default)
  },
  'recruiter-trusted@thegarage.com': {
    id: 'recruiter-2',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'recruiter-trusted@thegarage.com',
    role: 'recruiter',
    company: 'TechCorp Inc.',
    department: 'Engineering Recruiting',
    title: 'Senior Technical Recruiter',
    avatar: null,
    canPostWithoutApproval: true // Can publish directly
  },
  'hiring@thegarage.com': {
    id: 'hiring-1',
    firstName: 'Robert',
    lastName: 'Thompson',
    email: 'hiring@thegarage.com',
    role: 'hiring-manager',
    company: 'TechCorp Inc.',
    department: 'Engineering',
    title: 'Engineering Manager',
    avatar: null
  }
};

function App() {
  // App State
  const [showLanding, setShowLanding] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'job-seeker' | 'recruiter' | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot-password' | 'role-select'>('role-select');
  const [authIntent, setAuthIntent] = useState<'login' | 'signup'>('signup');
  
  // Resume Upload Flow State
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [newUserData, setNewUserData] = useState<any>(null);
  
  // Application Navigation State
  const [currentView, setCurrentView] = useState<string>('homepage');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['homepage']);
  const [trackedJobs, setTrackedJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedQueue, setSelectedQueue] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [userQueues, setUserQueues] = useState<string[]>(['data-engineer', 'senior-analyst', 'machine-learning']);
  const [queueStatuses, setQueueStatuses] = useState<Record<string, boolean>>({});
  const [autoApplyEnabled, setAutoApplyEnabled] = useState<boolean>(true);

  const createDefaultUser = useCallback((userData: any, role: 'job-seeker' | 'recruiter') => {
    return {
      ...userData,
      id: '1',
      firstName: userData.firstName || userData.name?.split(' ')[0] || 'Test',
      lastName: userData.lastName || userData.name?.split(' ')[1] || 'User',
      email: userData.email || 'test@example.com',
      role: role,
      avatar: null,
      isPremium: false,
      ...(role === 'job-seeker' && {
        preferences: userData.preferences || {
          locations: ['No Preference'],
          salaryRanges: ['No Preference'],
          jobTypes: ['No Preference'],
          workArrangements: ['No Preference']
        }
      }),
      ...(role === 'recruiter' && {
        company: userData.company || 'Independent Recruiter',
        department: userData.department || '',
        title: userData.title || 'Recruiter'
      })
    };
  }, []);

  // Authentication handlers
  const handleLogin = useCallback((userData: any, role: 'job-seeker' | 'recruiter') => {
    let mockUser;

    if (userData.email && demoProfiles[userData.email as keyof typeof demoProfiles]) {
      const demoProfile = demoProfiles[userData.email as keyof typeof demoProfiles];
      if (demoProfile.role === role) {
        mockUser = { ...demoProfile, role: role };
      } else {
        mockUser = createDefaultUser(userData, role);
      }
    } else {
      mockUser = createDefaultUser(userData, role);
    }
    
    setUser(mockUser);
    setUserRole(role);
    setIsAuthenticated(true);
    setError(null);
  }, [createDefaultUser]);

  const handleSignUp = useCallback((userData: any, role: 'job-seeker' | 'recruiter') => {
    // Check if this is a new job seeker who needs resume upload flow
    if (role === 'job-seeker' && userData.isNewUser && !userData.profileComplete) {
      setNewUserData({ ...userData, role });
      setShowResumeUpload(true);
      return;
    }

    let mockUser;

    if (userData.email && demoProfiles[userData.email as keyof typeof demoProfiles]) {
      const demoProfile = demoProfiles[userData.email as keyof typeof demoProfiles];
      if (demoProfile.role === role) {
        mockUser = { ...demoProfile, role: role };
      } else {
        mockUser = createDefaultUser(userData, role);
      }
    } else {
      // For social auth users, we might have incomplete profile data
      if (userData.isNewUser && role === 'recruiter') {
        // Recruiters from social auth get basic profile setup
        mockUser = createDefaultUser({
          ...userData,
          company: userData.company || 'Independent Recruiter',
          title: userData.title || 'Recruiter',
          profileComplete: false, // They can complete it later in settings
        }, role);
      } else {
        mockUser = createDefaultUser(userData, role);
      }
    }
    
    setUser(mockUser);
    setUserRole(role);
    setIsAuthenticated(true);
    setError(null);
  }, [createDefaultUser]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    setShowLanding(true);
    setCurrentView('homepage');
    setNavigationHistory(['homepage']);
    setTrackedJobs([]);
    setSelectedJob(null);
    setSelectedQueue(null);
    setSelectedCandidate(null);
    setUserQueues(['data-engineer', 'senior-analyst', 'machine-learning']);
    setQueueStatuses({});
    setAutoApplyEnabled(true);
    setShowResumeUpload(false);
    setNewUserData(null);
    setError(null);
  }, []);

  // Resume Upload Flow handlers
  const handleResumeUploadComplete = useCallback((resumeData: any) => {
    if (!newUserData) return;
    
    const completeUserData = {
      ...newUserData,
      ...resumeData.profileData,
      resumeFile: resumeData.resumeFile,
      extractedData: resumeData.extractedData,
      profileComplete: true,
      isNewUser: false
    };

    const mockUser = createDefaultUser(completeUserData, newUserData.role);
    setUser(mockUser);
    setUserRole(newUserData.role);
    setIsAuthenticated(true);
    setShowResumeUpload(false);
    setNewUserData(null);
    setError(null);
  }, [newUserData, createDefaultUser]);

  const handleResumeUploadSkip = useCallback(() => {
    if (!newUserData) return;
    
    const mockUser = createDefaultUser({
      ...newUserData,
      profileComplete: false, // Profile is not complete if resume was skipped
      isNewUser: false
    }, newUserData.role);
    
    setUser(mockUser);
    setUserRole(newUserData.role);
    setIsAuthenticated(true);
    setShowResumeUpload(false);
    setNewUserData(null);
    setError(null);
  }, [newUserData, createDefaultUser]);

  // Navigation handlers
  const handleNavigate = useCallback((view: string) => {
    setCurrentView(view);
    setNavigationHistory(prev => {
      const newHistory = [...prev, view];
      return newHistory.slice(-10);
    });
    
    if (view !== 'job-details') setSelectedJob(null);
    if (view !== 'queue-detail') setSelectedQueue(null);
    if (view !== 'candidate-profile') setSelectedCandidate(null);
    if (error) setError(null);
  }, [error]);

  // Landing page navigation handlers (memoized to prevent re-renders)
  const handleBackToApp = useCallback(() => {
    handleNavigate('homepage');
  }, [handleNavigate]);

  const handleViewAbout = useCallback(() => {
    handleNavigate('about');
  }, [handleNavigate]);

  const handleBack = useCallback(() => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const previousView = newHistory.at(-1) || 'homepage';
      setNavigationHistory(newHistory);
      setCurrentView(previousView);
    } else {
      handleNavigate('homepage');
    }
  }, [navigationHistory, handleNavigate]);

  const handleJobApplication = useCallback((job: any, method: string) => {
    const isAlreadyTracked = trackedJobs.some(trackedJob => trackedJob.id === job.id);
    if (!isAlreadyTracked) {
      setTrackedJobs(prev => [...prev, {
        ...job,
        status: 'Applied',
        dateApplied: new Date().toISOString(),
        method: method
      }]);
    }
  }, [trackedJobs]);

  const handleNavigateToJobDetails = useCallback((job: any) => {
    setSelectedJob(job);
    handleNavigate('job-details');
  }, [handleNavigate]);

  const handleNavigateToQueueDetail = useCallback((queue: any) => {
    setSelectedQueue(queue);
    handleNavigate('queue-detail');
  }, [handleNavigate]);

  const handleRetry = useCallback(() => {
    setError(null);
    setCurrentView('homepage');
  }, []);

  // Memoized props for ViewRenderer
  const viewRendererProps = useMemo(() => ({
    currentView,
    userRole: (['lead', 'manager', 'recruiter', 'hiring-manager'].includes(user?.role)) ? 'recruiter' : (userRole as 'job-seeker' | 'recruiter'),
    user,
    selectedJob,
    selectedQueue,
    selectedCandidate,
    trackedJobs,
    userQueues,
    queueStatuses,
    autoApplyEnabled,
    navigationHistory,
    onNavigate: handleNavigate,
    onBack: handleBack,
    onLogout: handleLogout,
    onJobApplication: handleJobApplication,
    onNavigateToJobDetails: handleNavigateToJobDetails,
    onNavigateToQueueDetail: handleNavigateToQueueDetail,
    onUpdateTrackedJobs: setTrackedJobs,
    onUpdateQueues: setUserQueues,
    onUpdateQueueStatuses: setQueueStatuses,
    onToggleAutoApply: setAutoApplyEnabled,
    setSelectedJob,
    setSelectedCandidate
  }), [
    currentView,
    userRole,
    user,
    selectedJob,
    selectedQueue,
    selectedCandidate,
    trackedJobs,
    userQueues,
    queueStatuses,
    autoApplyEnabled,
    navigationHistory,
    handleNavigate,
    handleBack,
    handleLogout,
    handleJobApplication,
    handleNavigateToJobDetails,
    handleNavigateToQueueDetail
  ]);

  // Render current view
  if (error) {
    return <ErrorFallback onRetry={handleRetry} />;
  }

  // Special case: Allow about page view without authentication
  if (currentView === 'about') {
    return (
      <About
        onGetStarted={isAuthenticated ? handleBackToApp : () => {
          setShowLanding(false);
          setAuthIntent('signup');
          setAuthView('role-select');
          setCurrentView('homepage');
        }}
        onLogin={isAuthenticated ? handleBackToApp : () => {
          setShowLanding(false);
          setAuthIntent('login');
          setAuthView('role-select');
          setCurrentView('homepage');
        }}
        onClose={() => {
          setShowLanding(true);
          setCurrentView('homepage');
        }}
        onNavigateToLanding={() => {
          setShowLanding(true);
          setCurrentView('homepage');
        }}
        onViewBlog={() => {}}
        isAuthenticated={isAuthenticated}
        onBackToApp={isAuthenticated ? handleBackToApp : undefined}
      />
    );
  }

  // Handle landing page view - can be accessed both when logged out and logged in
  if (showLanding || (isAuthenticated && currentView === 'landing')) {
    return <LandingPage 
      key={isAuthenticated ? "authenticated-landing" : "public-landing"}
      onGetStarted={isAuthenticated ? handleBackToApp : () => {
        setShowLanding(false);
        setAuthIntent('signup');
        setAuthView('role-select');
      }}
      onLogin={isAuthenticated ? handleBackToApp : () => {
        setShowLanding(false);
        setAuthIntent('login');
        setAuthView('role-select');
      }}
      onViewBlog={() => {}}
      onViewAbout={handleViewAbout}
      isAuthenticated={isAuthenticated}
      onBackToApp={isAuthenticated ? handleBackToApp : () => {
        setShowLanding(false);
        setCurrentView('homepage');
      }}
    />;
  }

  if (!isAuthenticated) {
    if (authView === 'role-select') {
      return <RoleSelector 
        onRoleSelect={(role) => {
          if (role === 'admin') {
            setAuthView('admin-login' as any);
          } else {
            setUserRole(role);
            setAuthView(authIntent);
          }
        }}
        onBack={() => setShowLanding(true)}
      />;
    }

    if (authView === ('admin-login' as any)) {
      return <AdminLogin 
        onLogin={(userData) => {
          setUser(userData);
          setUserRole('admin' as any);
          setIsAuthenticated(true);
          setError(null);
        }}
        onBack={() => setAuthView('role-select')}
      />;
    }

    if (authView === 'login' && userRole) {
      return <Login 
        userRole={userRole}
        onLogin={handleLogin}
        onSwitchToSignUp={() => setAuthView('signup')}
        onForgotPassword={() => setAuthView('forgot-password')}
        onBack={() => setAuthView('role-select')}
      />;
    }

    if (authView === 'signup' && userRole) {
      return <SignUp 
        userRole={userRole}
        onSignUp={handleSignUp}
        onSwitchToLogin={() => setAuthView('login')}
        onBack={() => setAuthView('role-select')}
      />;
    }

    if (authView === 'forgot-password') {
      return <ForgotPassword 
        onBack={() => setAuthView('login')}
      />;
    }
  }

  // Resume Upload Flow for new job seekers
  if (showResumeUpload && newUserData) {
    return <ResumeUploadFlow 
      onComplete={handleResumeUploadComplete}
      onSkip={handleResumeUploadSkip}
      userEmail={newUserData.email}
      userName={`${newUserData.firstName} ${newUserData.lastName}`}
    />;
  }

  if (isAuthenticated && userRole && user) {
    // Show Enterprise Portal (formerly Test System) for enterprise users
    if (userRole === 'admin' as any || ['lead', 'manager', 'recruiter', 'hiring-manager'].includes(user?.role)) {
      // Enterprise-specific views
      if (currentView === 'company-profile-setup') {
        return (
          <CompanySetupWizard
            onComplete={(data) => {
              console.log('Company setup complete:', data);
              handleNavigate('homepage');
            }}
            onSkip={() => handleNavigate('homepage')}
          />
        );
      }

      if (currentView === 'create-user') {
        return (
          <UserCreationWizard
            onComplete={(userData) => {
              console.log('User created:', userData);
              handleNavigate('user-management');
            }}
            onCancel={() => handleNavigate('homepage')}
            organizationId="org-1"
            availableTeams={[
              { id: 'team-1', name: 'Engineering Recruiting', memberCount: 3 },
              { id: 'team-2', name: 'Sales Recruiting', memberCount: 2 }
            ]}
          />
        );
      }

      if (currentView === 'team-management') {
        return (
          <TeamManagementDashboard
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onCreateTeam={() => console.log('Create team')}
            onEditTeam={(team) => console.log('Edit team:', team)}
            onDeleteTeam={(teamId) => console.log('Delete team:', teamId)}
          />
        );
      }

      if (currentView === 'approval-queue') {
        return (
          <ApprovalQueue
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      }

      if (currentView === 'documents' || currentView === 'document-management') {
        return (
          <DocumentManagementCenter
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      }

      if (currentView === 'recruiter-dashboard') {
        return (
          <RegularRecruiterDashboard
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      }

      // Check if view is a standard recruiter view (from Solo Recruiter system)
      const standardRecruiterViews = [
        'job-posting', 
        'job-management', 
        'candidate-management', 
        'candidate-profile',
        'interview-calendar', 
        'recruiter-messages', 
        'recruiter-chat',
        'recruiter-stats', 
        'recruiter-profile',
        'queue-sourcing',
        'account-settings',
        'notifications',
        'support'
      ];
      
      // Map role-specific views to existing views
      const viewMappings: Record<string, string> = {
        // Regular Recruiter
        'candidate-search': 'candidate-management',
        'candidate-tracking': 'candidate-management',
        'status-updates': 'candidate-management',
        
        // Manager
        'job-assignment': 'job-management',
        'team-performance': 'recruiter-stats',
        'candidate-shortlists': 'candidate-management',
        'team-reports': 'recruiter-stats',
        'escalations': 'notifications',
        
        // Lead
        'all-teams': 'team-management',
        'team-analytics': 'recruiter-stats',
        'team-quotas': 'recruiter-stats',
        'hiring-metrics': 'recruiter-stats',
        'executive-reports': 'recruiter-stats',
        'team-structure': 'team-management',
        'market-trends': 'recruiter-stats',
        'strategic-decisions': 'recruiter-stats',
        
        // Hiring Manager
        'assigned-jobs': 'job-management',
        'candidate-review': 'candidate-management',
        'candidate-shortlist': 'candidate-management',
        'candidate-rejection': 'candidate-management',
        'interview-feedback': 'interview-calendar',
        'hiring-decisions': 'candidate-management'
      };
      
      // Check if current view should be mapped to an existing view
      const mappedView = viewMappings[currentView] || currentView;

      if (standardRecruiterViews.includes(mappedView)) {
        // Use ViewRenderer for standard recruiter views (including mapped views)
        const mappedProps = { ...viewRendererProps, currentView: mappedView };
        return (
          <ThemeProvider>
            <div className="min-h-screen bg-background">
              <ErrorBoundary>
                <ViewRenderer {...mappedProps} />
              </ErrorBoundary>
            </div>
          </ThemeProvider>
        );
      }

      // Default: Show role-appropriate dashboard
      // Show UnifiedRecruiterDashboard for all recruiter roles
      if (['lead', 'manager', 'recruiter', 'hiring-manager'].includes(user?.role)) {
        return (
          <ThemeProvider>
            <div className="min-h-screen bg-background">
              <ErrorBoundary>
                <UnifiedRecruiterDashboard
                  user={user}
                  onNavigate={handleNavigate}
                  onLogout={handleLogout}
                />
              </ErrorBoundary>
            </div>
          </ThemeProvider>
        );
      }

      // Show Enterprise Admin Dashboard for admin role
      return (
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <ErrorBoundary>
              <EnterpriseAdminDashboard
                user={user}
                institution={{
                  id: 'inst-1',
                  name: user?.company || 'Your Organization',
                  logo: null,
                  description: 'Enterprise organization with full administrative capabilities',
                  profileComplete: false,
                  billingSetup: false,
                  securitySetup: false,
                  brandingSetup: false,
                  teamMembers: [],
                  registered: true,
                  settingsConfigured: false,
                  activeJobs: 0,
                  totalHires: 0,
                  growthRate: '+0'
                }}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            </ErrorBoundary>
          </div>
        </ThemeProvider>
      );
    }

    // Show regular app for job seekers and recruiters
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background">
          <ErrorBoundary>
            <ViewRenderer {...viewRendererProps} />
          </ErrorBoundary>
        </div>
      </ThemeProvider>
    );
  }

  return <ThemeProvider><LoadingSpinner /></ThemeProvider>;
}

export default App;