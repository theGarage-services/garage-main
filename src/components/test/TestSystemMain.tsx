import { useState } from 'react';
import { 
  Home, 
  Users, 
  Briefcase, 
  Calendar, 
  Activity, 
  Building2, 
  Settings,
  LogOut,
  Crown,
  ChevronLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TestPermissionsProvider, useTestPermissions } from '../../hooks/useTestPermissions';
import { TestMasterDashboard } from './TestMasterDashboard';
import { TestTeamMemberDashboard } from './TestTeamMemberDashboard';
import { TestTeamMemberList } from './TestTeamMemberList';
import { TestTeamMemberInvite } from './TestTeamMemberInvite';
import { TestPermissionEditor } from './TestPermissionEditor';
import { TestActivityLog } from './TestActivityLog';
import { TestDepartmentManagement } from './TestDepartmentManagement';
import { PermissionGate } from '../common/PermissionGate';
import { MOCK_ORGANIZATION } from '@/utils/testMockData';
import type { TeamMember } from '@/types/team';

// Main navigation
function TestNavigation({ currentPage, onNavigate, onExitTest }: Readonly<{
  currentPage: string;
  onNavigate: (page: string) => void;
  onExitTest: () => void;
}>) {
  const { currentUser, hasPermission } = useTestPermissions();
  const isMaster = currentUser.role === 'master';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, show: true },
    { id: 'team', label: 'Team', icon: Users, show: isMaster || hasPermission('team.invite') },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, show: hasPermission('jobs.create') || hasPermission('candidates.view') },
    { id: 'calendar', label: 'Calendar', icon: Calendar, show: hasPermission('calendar.view') },
    { id: 'departments', label: 'Departments', icon: Building2, show: isMaster || hasPermission('departments.create') },
    { id: 'activity-log', label: 'Activity Log', icon: Activity, show: isMaster },
    { id: 'settings', label: 'Settings', icon: Settings, show: isMaster },
  ];

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Top Row - Branding & User */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={MOCK_ORGANIZATION.logo} 
              alt={MOCK_ORGANIZATION.name}
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-black text-lg">the</span>
                <span className="text-lg font-semibold text-[#ff6b35]">
                  Garage
                </span>
                <Badge variant="secondary" className="text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Enterprise Portal
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Enterprise Administrator</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onExitTest}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 border-b -mb-4">
          {navItems.map((item) => 
            item.show && (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  px-4 py-2 flex items-center gap-2 border-b-2 transition-all
                  ${currentPage === item.id 
                    ? 'border-[#ff6b35] text-[#ff6b35]' 
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          )}
        </nav>
      </div>
    </div>
  );
}

// Content router
function TestContent({ currentPage, onNavigate }: Readonly<{
  currentPage: string;
  onNavigate: (page: string) => void;
}>) {
  const { currentUser } = useTestPermissions();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const isMaster = currentUser.role === 'master';

  switch (currentPage) {
    case 'dashboard':
      return isMaster ? (
        <TestMasterDashboard onNavigate={onNavigate} />
      ) : (
        <TestTeamMemberDashboard onNavigate={onNavigate} />
      );

    case 'team':
      return (
        <PermissionGate permission="team.invite" feature="team management">
          <TestTeamMemberList
            onInviteMember={() => onNavigate('invite-member')}
            onEditMember={(member) => {
              setEditingMember(member);
              onNavigate('edit-member');
            }}
            onEditPermissions={(member) => {
              setEditingMember(member);
              onNavigate('edit-permissions');
            }}
          />
        </PermissionGate>
      );

    case 'invite-member':
      return (
        <PermissionGate permission="team.invite" feature="inviting team members">
          <TestTeamMemberInvite
            onBack={() => onNavigate('team')}
            onInviteComplete={() => onNavigate('team')}
          />
        </PermissionGate>
      );

    case 'edit-permissions':
      return editingMember ? (
        <PermissionGate permission="team.edit" feature="editing team permissions">
          <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => onNavigate('team')}
                className="mb-4"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Team
              </Button>
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl mb-6">
                  Edit Permissions: {editingMember.name}
                </h2>
                <TestPermissionEditor
                  selectedPermissions={editingMember.permissions}
                  onChange={(permissions) => {
                    console.log('Updated permissions:', permissions);
                  }}
                  roleTemplate={editingMember.roleTemplate}
                />
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => onNavigate('team')} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      alert('Permissions updated!');
                      onNavigate('team');
                    }}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PermissionGate>
      ) : null;

    case 'activity-log':
      return (
        <PermissionGate permission="team.invite" feature="activity log">
          <TestActivityLog />
        </PermissionGate>
      );

    case 'departments':
      return (
        <PermissionGate permission={['departments.create', 'departments.manage']} feature="department management">
          <TestDepartmentManagement />
        </PermissionGate>
      );

    case 'jobs':
    case 'calendar':
    case 'settings':
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl mb-2">Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              This page will contain a permission-aware version of the {currentPage} feature.
            </p>
            <Button onClick={() => onNavigate('dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      );

    default:
      return (
        <TestMasterDashboard onNavigate={onNavigate} />
      );
  }
}

// Main component (with provider)
function TestSystemContent({ onExitTest }: Readonly<{ onExitTest: () => void }>) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-white">
      <TestNavigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onExitTest={onExitTest}
      />
      <TestContent
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
    </div>
  );
}

// Export with provider wrapper
export function TestSystemMain({ onExitTest }: Readonly<{ onExitTest: () => void }>) {
  return (
    <TestPermissionsProvider>
      <TestSystemContent onExitTest={onExitTest} />
    </TestPermissionsProvider>
  );
}