import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Users, 
  Phone, 
  Edit2, 
  Save, 
  X, 
  Plus,
  UserCheck,
  Briefcase,
  Settings,
  Eye,
  CheckCircle,
  AlertCircle} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { TeamManagement } from './TeamManagement';

interface InstitutionProfileProps {
  institution: any;
  user: any;
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export function InstitutionProfile({ institution, user, onBack, onNavigate }: Readonly<InstitutionProfileProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    institutionName: institution?.institutionName || '',
    description: institution?.description || '',
    website: institution?.website || '',
    phone: institution?.phone || '',
    address: institution?.address || '',
    city: institution?.city || '',
    state: institution?.state || '',
    country: institution?.country || '',
    zipCode: institution?.zipCode || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Sample data - in real app this would come from API
  const [teamMembers, setTeamMembers] = useState(institution?.teamMembers || [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      title: 'Talent Acquisition Manager',
      department: 'Human Resources',
      role: 'admin',
      accessLevel: 'full',
      joinedAt: '2024-01-15',
      status: 'active',
      permissions: {
        canPostJobs: true,
        canViewCandidates: true,
        canManageTeam: true,
        canAccessAnalytics: true,
        canManageInstitution: true
      },
      lastLoginAt: '2024-01-20',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@company.com',
      title: 'Senior Recruiter',
      department: 'Human Resources',
      role: 'recruiter',
      accessLevel: 'limited',
      joinedAt: '2024-02-20',
      status: 'active',
      permissions: {
        canPostJobs: true,
        canViewCandidates: true,
        canManageTeam: false,
        canAccessAnalytics: true,
        canManageInstitution: false
      },
      lastLoginAt: '2024-01-19',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Chen',
      email: 'mike.chen@company.com',
      title: 'HR Coordinator',
      department: 'Human Resources',
      role: 'recruiter',
      accessLevel: 'view-only',
      joinedAt: '2024-03-10',
      status: 'pending',
      permissions: {
        canPostJobs: false,
        canViewCandidates: true,
        canManageTeam: false,
        canAccessAnalytics: false,
        canManageInstitution: false
      },
      phone: '+1 (555) 345-6789',
      location: 'Toronto, ON'
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@company.com',
      title: 'Recruiting Specialist',
      department: 'Human Resources',
      role: 'recruiter',
      accessLevel: 'limited',
      joinedAt: '2024-01-05',
      status: 'active',
      permissions: {
        canPostJobs: true,
        canViewCandidates: true,
        canManageTeam: false,
        canAccessAnalytics: false,
        canManageInstitution: false
      },
      lastLoginAt: '2024-01-18',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX'
    }
  ]);

  const openPositions = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      type: 'Full-time',
      location: 'San Francisco, CA',
      postedBy: 'John Smith',
      postedDate: '2024-01-20',
      applications: 45,
      status: 'active'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      type: 'Full-time',
      location: 'Remote',
      postedBy: 'Sarah Johnson',
      postedDate: '2024-01-18',
      applications: 32,
      status: 'active'
    },
    {
      id: '3',
      title: 'Data Scientist',
      department: 'Data & Analytics',
      type: 'Full-time',
      location: 'New York, NY',
      postedBy: 'John Smith',
      postedDate: '2024-01-15',
      applications: 28,
      status: 'draft'
    }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsEditing(false);
      setUpdateSuccess(true);
      
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating institution:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      institutionName: institution?.institutionName || '',
      description: institution?.description || '',
      website: institution?.website || '',
      phone: institution?.phone || '',
      address: institution?.address || '',
      city: institution?.city || '',
      state: institution?.state || '',
      country: institution?.country || '',
      zipCode: institution?.zipCode || '',
    });
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <X className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-medium text-gray-900">
                    {institution?.institutionName || 'Institution Profile'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {institution?.institutionType} • {institution?.industry}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {institution?.verificationStatus === 'verified' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
              {institution?.verificationStatus === 'pending' && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Verification Pending</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {updateSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Institution profile updated successfully!
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team ({teamMembers.length})
            </TabsTrigger>
            <TabsTrigger value="positions" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Positions ({openPositions.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Institution Details</h2>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading} size="sm" className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Saving...
                        </div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Institution Name */}
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Institution Name</Label>
                  {isEditing ? (
                    <Input
                      id="institutionName"
                      value={formData.institutionName}
                      onChange={(e) => handleChange('institutionName', e.target.value)}
                      className="h-12"
                    />
                  ) : (
                    <div className="h-12 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                      {formData.institutionName || 'Not specified'}
                    </div>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  {isEditing ? (
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="h-12"
                      placeholder="https://company.com"
                    />
                  ) : (
                    <div className="h-12 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                      {formData.website ? (
                        <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-[#ff6b35] hover:underline flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {formData.website}
                        </a>
                      ) : (
                        'Not specified'
                      )}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="h-12"
                    />
                  ) : (
                    <div className="h-12 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                      {formData.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          {formData.phone}
                        </div>
                      ) : (
                        'Not specified'
                      )}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="h-12"
                    />
                  ) : (
                    <div className="h-12 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                      {formData.address ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {formData.address}
                        </div>
                      ) : (
                        'Not specified'
                      )}
                    </div>
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="h-12"
                    />
                  ) : (
                    <div className="h-12 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                      {formData.city || 'Not specified'}
                    </div>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  {isEditing ? (
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="h-12"
                    />
                  ) : (
                    <div className="h-12 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                      {formData.country || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 space-y-2">
                <Label htmlFor="description">Description</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="min-h-[100px]"
                    maxLength={500}
                  />
                ) : (
                  <div className="min-h-[100px] p-3 border border-gray-200 rounded-md bg-gray-50">
                    {formData.description || 'No description provided'}
                  </div>
                )}
              </div>
            </Card>

            {/* Institution Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">{teamMembers.length}</p>
                    <p className="text-sm text-gray-500">Team Members</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">{openPositions.length}</p>
                    <p className="text-sm text-gray-500">Open Positions</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {openPositions.reduce((sum, pos) => sum + pos.applications, 0)}
                    </p>
                    <p className="text-sm text-gray-500">Total Applications</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <TeamManagement 
              user={user}
              institution={institution}
              teamMembers={teamMembers}
              onUpdateTeamMembers={setTeamMembers}
              onNavigate={onNavigate}
            />
          </TabsContent>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Open Positions</h2>
                <Button 
                  onClick={() => onNavigate('job-management')}
                  className="bg-[#ff6b35] hover:bg-[#e55a2b] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Post New Job
                </Button>
              </div>

              <div className="space-y-4">
                {openPositions.map((position) => (
                  <div key={position.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{position.title}</h3>
                        {getStatusBadge(position.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{position.department}</span>
                        <span>•</span>
                        <span>{position.type}</span>
                        <span>•</span>
                        <span>{position.location}</span>
                        <span>•</span>
                        <span>Posted {new Date(position.postedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900">{position.applications}</p>
                        <p className="text-sm text-gray-500">Applications</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Institution Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Team Invitations</h3>
                    <p className="text-sm text-gray-500">Allow team members to invite new recruiters</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {institution?.settings?.allowTeamInvites ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Approval Required</h3>
                    <p className="text-sm text-gray-500">Require admin approval for new team members</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {institution?.settings?.requireApproval ? 'Required' : 'Not Required'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Job Posting Limit</h3>
                    <p className="text-sm text-gray-500">Maximum number of active job postings</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {institution?.settings?.jobPostingLimit || 50} Jobs
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}