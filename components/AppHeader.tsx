import { Home, User, Bell, Briefcase, Users, Calendar, BarChart3, MessageSquare, Building2} from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';
import { RecruiterProfileDropdown } from './RecruiterProfileDropdown';
import { EnterpriseProfileDropdown } from './EnterpriseProfileDropdown';
import { Badge } from './ui/badge';

interface AppHeaderProps {
  userRole: 'job-seeker' | 'recruiter' | 'admin';
  user: any;
  currentView?: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  // New props for page-specific features
  title?: string;
  subtitle?: string;
  viewMode?: 'day' | 'week' | 'month';
  onViewModeChange?: (mode: 'day' | 'week' | 'month') => void;
  currentDate?: Date;
  onPreviousPeriod?: () => void;
  onNextPeriod?: () => void;
  onNewAction?: () => void;
  newActionLabel?: string;
  hideNavigation?: boolean;
}

export function AppHeader({ 
  userRole, 
  user, 
  currentView, 
  onNavigate, 
  onLogout,
  hideNavigation = false
}: Readonly<AppHeaderProps>) {
  // Mock unread counts - would come from actual state in production
  const unreadNotifications = 5;
  const unreadMessages = 3;
  
  // Check if user is admin/enterprise (master role or admin role)
  const isAdmin = userRole === 'admin' || user?.role === 'admin' || user?.role === 'master' || user?.isInstitutionCreator || user?.isInstitutionAdmin;
  
  // Check if user is enterprise recruiter (any enterprise role except admin)
  const isEnterpriseRecruiter = ['lead', 'manager', 'recruiter', 'hiring-manager'].includes(user?.role);
  
  // STRICT: Only Regular Recruiter can create jobs
  const canCreateJobs = user?.role === 'recruiter';

  // Safety wrapper for navigation
  const handleNavigate = (view: string) => {
    if (typeof onNavigate === 'function') {
      onNavigate(view);
    } else {
      console.error('onNavigate is not a function', view);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 fixed top-0 left-0 right-0 z-[100] shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo - Left Side */}
            <button 
              onClick={() => handleNavigate('homepage')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-lg font-medium">
                <span className="text-gray-900">the</span>
                <span className="text-[#ff6b35]">Garage</span>
              </span>
            </button>

            {/* Center Navigation */}
            {!hideNavigation && (
              <nav className="flex items-center gap-6">
                {userRole === 'job-seeker' ? (
                  <>
                    <button
                      onClick={() => handleNavigate('homepage')}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        currentView === 'homepage' ? 'text-[#ff6b35] font-medium' : 'text-gray-600 hover:text-[#ff6b35]'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      Home
                    </button>
                    <button
                      onClick={() => handleNavigate('profile')}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        currentView === 'profile' ? 'text-[#ff6b35] font-medium' : 'text-gray-600 hover:text-[#ff6b35]'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => handleNavigate('job-tracker')}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        currentView === 'job-tracker' ? 'text-[#ff6b35] font-medium' : 'text-gray-600 hover:text-[#ff6b35]'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Tracker
                    </button>
                  </>
                ) : isAdmin ? (
                  // Admin Navigation: Dashboard | Team | Company
                  <>
                    <button
                      onClick={() => handleNavigate('homepage')}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        currentView === 'homepage' ? 'text-[#ff6b35] font-medium' : 'text-gray-600 hover:text-[#ff6b35]'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleNavigate('team-management')}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        currentView === 'team-management' ? 'text-[#ff6b35] font-medium' : 'text-gray-600 hover:text-[#ff6b35]'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Team
                    </button>
                    <button
                      onClick={() => handleNavigate('institution-management')}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        currentView === 'institution-management' ? 'text-[#ff6b35] font-medium' : 'text-gray-600 hover:text-[#ff6b35]'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Company
                    </button>
                  </>
                ) : (
                  // Recruiter Navigation: Dashboard | Jobs | Candidates | Calendar
                  <>
                    <button
                      onClick={() => handleNavigate('homepage')}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        currentView === 'homepage' ? 'text-[#ff6b35] font-medium' : 'text-gray-600 hover:text-[#ff6b35]'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleNavigate('job-management')}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        currentView === 'job-management' ? 'text-[#ff6b35] font-medium' : 'text-gray-600 hover:text-[#ff6b35]'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      Jobs
                    </button>
                    <button
                      onClick={() => handleNavigate('candidate-management')}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        currentView === 'candidate-management' ? 'text-[#ff6b35] font-medium' : 'text-gray-600 hover:text-[#ff6b35]'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Candidates
                    </button>
                    <button
                      onClick={() => handleNavigate('interview-calendar')}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        currentView === 'interview-calendar' ? 'text-[#ff6b35] font-medium' : 'text-gray-600 hover:text-[#ff6b35]'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      Calendar
                    </button>
                  </>
                )}
              </nav>
            )}

            {/* Right Side - Post Job (Recruiters only, NOT admins), Messages, Notifications, Profile */}
            <div className="flex items-center gap-4">
              {/* Post Job Button - ONLY for Regular Recruiter (strict enforcement) */}
              {canCreateJobs && (
                <button
                  onClick={() => handleNavigate('job-posting')}
                  className="px-4 py-2 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium"
                >
                  <Briefcase className="w-4 h-4" />
                  Post Job
                </button>
              )}

              {/* Messages Icon - Hidden for admin users, shown for enterprise recruiters */}
              {!isAdmin || isEnterpriseRecruiter ? (
                <button 
                  onClick={() => handleNavigate(userRole === 'job-seeker' ? 'job-seeker-messages' : 'recruiter-messages')}
                  className="relative text-gray-600 hover:text-[#ff6b35] transition-colors"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-[#ff6b35] text-white text-[10px] flex items-center justify-center">
                      {unreadMessages}
                    </Badge>
                  )}
                </button>
              ) : null}

              {/* Notifications Icon */}
              <button 
                onClick={() => handleNavigate('notifications')}
                className="relative text-gray-600 hover:text-[#ff6b35] transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-[#ff6b35] text-white text-[10px] flex items-center justify-center">
                    {unreadNotifications}
                  </Badge>
                )}
              </button>

              {/* Profile Dropdown */}
              {userRole === 'job-seeker' ? (
                <ProfileDropdown 
                  onNavigate={handleNavigate}
                  onLogout={onLogout}
                  isPremium={user?.isPremium || false}
                  userName={user ? `${user.firstName} ${user.lastName}` : "User"}
                  userEmail={user?.email || "user@example.com"}
                  userAvatar={user?.avatar}
                />
              ) : userRole === 'recruiter' ? (
                <RecruiterProfileDropdown 
                  onNavigate={handleNavigate}
                  onLogout={onLogout}
                  user={user}
                />
              ) : (
                <EnterpriseProfileDropdown 
                  onNavigate={handleNavigate}
                  onLogout={onLogout}
                  user={user}
                />
              )}
            </div>
          </div>
        </div>
      </header>
  );
}