import { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Ban,
  CheckCircle,
  Crown,
  Mail} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { MOCK_ORGANIZATION } from '../utils/testMockData';
import { ROLE_TEMPLATES } from '../types/team';
import type { TeamMember } from '../types/team';

interface TestTeamMemberListProps {
  onInviteMember: () => void;
  onEditMember: (member: TeamMember) => void;
  onEditPermissions: (member: TeamMember) => void;
}

export function TestTeamMemberList({ 
  onInviteMember,
  onEditMember,
  onEditPermissions 
}: Readonly<TestTeamMemberListProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | string>('all');

  // Filter members
  const filteredMembers = MOCK_ORGANIZATION.members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesRole = roleFilter === 'all' || 
                       (member.role === 'master' && roleFilter === 'master') ||
                       (member.roleTemplate === roleFilter);
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status: TeamMember['status']) => {
    const variants = {
      active: { label: 'Active', className: 'bg-green-100 text-green-700' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
      suspended: { label: 'Suspended', className: 'bg-red-100 text-red-700' },
    };
    
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getRoleBadge = (member: TeamMember) => {
    if (member.role === 'master') {
      return (
        <Badge className="bg-gradient-to-r from-yellow-400 to-amber-600 text-white">
          <Crown className="w-3 h-3 mr-1" />
          Master
        </Badge>
      );
    }
    
    if (member.roleTemplate && member.roleTemplate !== 'custom') {
      const template = ROLE_TEMPLATES[member.roleTemplate];
      return (
        <Badge style={{ backgroundColor: template.color + '20', color: template.color }}>
          {template.name}
        </Badge>
      );
    }
    
    return <Badge variant="outline">Custom Role</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl">Team Management</h1>
              <p className="text-sm text-gray-600">
                Manage your team members and their permissions
              </p>
            </div>
          </div>
          
          <Button onClick={onInviteMember}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="master">Master Profile</SelectItem>
              <SelectItem value="full_recruiter">Full Recruiter</SelectItem>
              <SelectItem value="hiring_manager">Hiring Manager</SelectItem>
              <SelectItem value="hr_admin">HR Admin</SelectItem>
              <SelectItem value="interviewer">Interviewer</SelectItem>
              <SelectItem value="custom">Custom Role</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
          <span>Showing {filteredMembers.length} of {MOCK_ORGANIZATION.members.length} members</span>
          <span>•</span>
          <span>{MOCK_ORGANIZATION.members.filter(m => m.status === 'active').length} Active</span>
          <span>•</span>
          <span>{MOCK_ORGANIZATION.members.filter(m => m.status === 'pending').length} Pending</span>
        </div>
      </Card>

      {/* Team Members List */}
      <div className="space-y-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="p-6">
            <div className="flex items-center justify-between">
              {/* Member Info */}
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-14 h-14 rounded-full"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{member.name}</h3>
                    {getRoleBadge(member)}
                    {getStatusBadge(member.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600">{member.email}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    {member.lastActive ? (
                      <span>Last active: {new Date(member.lastActive).toLocaleDateString()}</span>
                    ) : (
                      <span>Never logged in</span>
                    )}
                    
                    <span>•</span>
                    
                    <span>
                      Invited {new Date(member.invitedAt).toLocaleDateString()}
                    </span>
                    
                    {member.departmentId && (
                      <>
                        <span>•</span>
                        <span>
                          {MOCK_ORGANIZATION.departments.find(d => d.id === member.departmentId)?.name}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {member.assignedJobs && member.assignedJobs.length > 0 && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        Limited to {member.assignedJobs.length} specific job{member.assignedJobs.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  )}
                  
                  {member.role === 'member' && (
                    <div className="mt-2 text-xs text-gray-500">
                      {member.permissions.length} permission{member.permissions.length === 1 ? '' : 's'} granted
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {member.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => alert('Resend invitation email')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Invite
                  </Button>
                )}
                
                {member.role !== 'master' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditPermissions(member)}
                    >
                      Edit Permissions
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditMember(member)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        
                        {member.status === 'active' && (
                          <DropdownMenuItem onClick={() => alert('Suspend member')}>
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend Access
                          </DropdownMenuItem>
                        )}
                        
                        {member.status === 'suspended' && (
                          <DropdownMenuItem onClick={() => alert('Reactivate member')}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Reactivate
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={() => confirm('Remove this team member?') && alert('Member removed')}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
                
                {member.role === 'master' && (
                  <Badge variant="outline" className="text-xs">
                    Organization Owner
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No team members found matching your filters</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setRoleFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
