import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell,
  Eye,
  EyeOff,
  Save, 
  X, 
  Edit2,
  CheckCircle,
  Key,
  Smartphone,
  Globe,
  Calendar,
  Crown,
  Settings,
  Lock,
  Building2,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { recruiterProfileService } from '@/api/recruiterProfile';
import { notificationService } from '@/api/notifications';
import { passwordResetService } from '@/api/passwordReset';

interface RecruiterProfileProps {
  user: any;
  onBack: () => void;
  onNavigate: (view: string) => void;
}

// Extracted Role Badge Component
function RoleBadge({ role }: Readonly<{ role: string }>) {
  if (role === 'admin') {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Crown className="w-3 h-3 mr-1" />
        Admin
      </Badge>
    );
  }
  if (role === 'recruiter') {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        <Shield className="w-3 h-3 mr-1" />
        Recruiter
      </Badge>
    );
  }
  return <Badge variant="secondary">Member</Badge>;
}

// Extracted Profile Field Component
interface ProfileFieldProps {
  label: string;
  id: string;
  isEditing: boolean;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  type?: 'text' | 'textarea' | 'select';
  selectOptions?: { value: string; label: string }[];
}

function ProfileField({
  label,
  id,
  isEditing,
  value,
  onChange,
  icon,
  type = 'text',
  selectOptions = []
}: Readonly<ProfileFieldProps>) {
  const renderEditingInput = () => {
    if (type === 'textarea') {
      return (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px]"
          maxLength={500}
        />
      );
    }
    if (type === 'select') {
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    return (
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12"
      />
    );
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {isEditing ? renderEditingInput() : (
        <div className="h-12 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {value || 'Not specified'}
        </div>
      )}
    </div>
  );
}

export function RecruiterProfile({ user, onBack, onNavigate }: Readonly<RecruiterProfileProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState('profile');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Profile form data - matches backend RecruiterProfile fields
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '', // Maps to RecruiterProfile.phone
    title: '', // Alias for company (UI uses 'Job Title' label)
    company: '', // Maps to RecruiterProfile.company
    companySize: '', // Maps to RecruiterProfile.company_size
    industry: '', // Maps to RecruiterProfile.industry
    department: '', // Maps to RecruiterProfile.department
    bio: '', // Maps to RecruiterProfile.bio
    location: '', // Maps to RecruiterProfile.location
    timezone: 'America/Los_Angeles', // Client-side only
    linkedin: '', // Maps to RecruiterProfile.linkedin
    website: '', // Maps to RecruiterProfile.website
    profileImage: '', // Maps to RecruiterProfile.profile_image
    institution: {
      institutionName: undefined,
      institutionType: undefined,
      industry: undefined,
      description: undefined,
      website: undefined,
      city: undefined,
      country: undefined,
      verificationStatus: undefined,
    }, // Maps to RecruiterProfile.institution
  });

  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await recruiterProfileService.getProfile();
        if (profile) {
          const transformed = recruiterProfileService.transformProfileForFrontend(profile);
          setProfileData(prev => ({
            ...prev,
            ...transformed,
          }));
        }

        const preferences = await notificationService.getPreferences();
        if (preferences) {
          const transformedPrefs = notificationService.transformDataForFrontend(preferences);
          setNotificationData(prev => ({
            ...prev,
            ...transformedPrefs,
          }));
        }
      } catch (error) {
        console.error('Failed to load recruiter profile:', error);
        setFetchError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, []);

  // Security settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    loginNotifications: true,
    securityUpdates: true,
  });

  // Notification preferences
  const [notificationData, setNotificationData] = useState({
    emailNewApplications: true,
    emailStatusUpdates: true,
    emailWeeklyReport: true,
    pushNewApplications: true,
    pushInterviewReminders: true,
    pushMessages: false,
    smsImportantUpdates: false,
    smsInterviewReminders: false,
  });

  // User role and permissions info
  const userRole = user?.role || 'recruiter';
  // Institution data comes from profileData.institution (via API)
  const institution = profileData.institution?.institutionName ? profileData.institution : null;

  const handleProfileSave = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      // Transform and send to backend
      const backendData = recruiterProfileService.transformDataForBackend(profileData);
      await recruiterProfileService.updateProfile(backendData);
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setFetchError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySave = async () => {
    setIsLoading(true);
    try {
      // Only call password change API if user filled in password fields
      if (securityData.currentPassword && securityData.newPassword && securityData.confirmPassword) {
        await passwordResetService.changePassword(
          securityData.currentPassword,
          securityData.newPassword,
          securityData.confirmPassword
        );
      }

      setSecurityData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error updating security settings:', error);
      setFetchError(error.message || 'Failed to update security settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    setIsLoading(true);
    try {
      const payload = notificationService.transformDataForBackend(notificationData);
      await notificationService.updatePreferences(payload);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    // Reload original data from API to discard changes
    setIsLoading(true);
    try {
      const profile = await recruiterProfileService.getProfile();
      if (profile) {
        const transformed = recruiterProfileService.transformProfileForFrontend(profile);
        setProfileData(prev => ({
          ...prev,
          ...transformed,
        }));
      }
    } catch (error) {
      console.error('Failed to reload profile:', error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
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
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white">
                    {(profileData.firstName?.[0] || '')}{(profileData.lastName?.[0] || '')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-medium text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <div className="flex items-center gap-2">
                    {<RoleBadge role={userRole} />}
                    {institution && (
                      <span className="text-sm text-gray-500">
                        at {institution.institutionName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Verified Account</span>
              </div>
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
              Settings updated successfully!
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Error Alert */}
      {fetchError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {fetchError}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button onClick={handleProfileSave} disabled={isLoading} size="sm" className="bg-[#ff6b35] hover:bg-[#e55a2b]">
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
                <ProfileField
                  label="First Name"
                  id="firstName"
                  isEditing={isEditing}
                  value={profileData.firstName}
                  onChange={(v) => setProfileData((prev) => ({ ...prev, firstName: v }))}
                />
                <ProfileField
                  label="Last Name"
                  id="lastName"
                  isEditing={isEditing}
                  value={profileData.lastName}
                  onChange={(v) => setProfileData((prev) => ({ ...prev, lastName: v }))}
                />
                <ProfileField
                  label="Email Address"
                  id="email"
                  isEditing={isEditing}
                  value={profileData.email}
                  onChange={(v) => setProfileData((prev) => ({ ...prev, email: v }))}
                  icon={<Mail className="w-4 h-4 text-gray-500" />}
                />
                <ProfileField
                  label="Phone Number"
                  id="phone"
                  isEditing={isEditing}
                  value={profileData.phone}
                  onChange={(v) => setProfileData((prev) => ({ ...prev, phone: v }))}
                  icon={<Phone className="w-4 h-4 text-gray-500" />}
                />
                <ProfileField
                  label="Job Title"
                  id="title"
                  isEditing={isEditing}
                  value={profileData.title || profileData.company}
                  onChange={(v) => setProfileData((prev) => ({ ...prev, title: v, company: v }))}
                />
                <ProfileField
                  label="Department"
                  id="department"
                  isEditing={isEditing}
                  value={profileData.department}
                  onChange={(v) => setProfileData((prev) => ({ ...prev, department: v }))}
                />
                <ProfileField
                  label="Location"
                  id="location"
                  isEditing={isEditing}
                  value={profileData.location}
                  onChange={(v) => setProfileData((prev) => ({ ...prev, location: v }))}
                  icon={<MapPin className="w-4 h-4 text-gray-500" />}
                />
                <ProfileField
                  label="Timezone"
                  id="timezone"
                  isEditing={isEditing}
                  value={profileData.timezone}
                  onChange={(v) => setProfileData((prev) => ({ ...prev, timezone: v }))}
                  type="select"
                  selectOptions={[
                    { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)' },
                    { value: 'America/Denver', label: 'Mountain Time (MST/MDT)' },
                    { value: 'America/Chicago', label: 'Central Time (CST/CDT)' },
                    { value: 'America/New_York', label: 'Eastern Time (EST/EDT)' },
                    { value: 'Europe/London', label: 'London (GMT/BST)' },
                    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
                    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' }
                  ]}
                  icon={<Calendar className="w-4 h-4 text-gray-500" />}
                />

                <ProfileField
                  label="LinkedIn Profile"
                  id="linkedin"
                  isEditing={isEditing}
                  value={profileData.linkedin}
                  onChange={(v) => setProfileData((prev) => ({ ...prev, linkedin: v }))}
                  icon={profileData.linkedin ? <Globe className="w-4 h-4 text-gray-500" /> : undefined}
                />
                <ProfileField
                  label="Personal Website"
                  id="website"
                  isEditing={isEditing}
                  value={profileData.website}
                  onChange={(v) => setProfileData((prev) => ({ ...prev, website: v }))}
                  icon={profileData.website ? <Globe className="w-4 h-4 text-gray-500" /> : undefined}
                />
              </div>

              <div className="mt-6">
                <ProfileField
                  label="Professional Bio"
                  id="bio"
                  isEditing={isEditing}
                  value={profileData.bio}
                  onChange={(v) => setProfileData((prev) => ({ ...prev, bio: v }))}
                  type="textarea"
                />
              </div>
            </Card>

            {/* Institution Info Card */}
            {institution && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Institution Information</h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{institution.institutionName}</h4>
                      {institution.verificationStatus === 'verified' && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{institution.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{institution.industry}</span>
                      <span>•</span>
                      <span>{institution.city}, {institution.country}</span>
                      <span>•</span>
                      <span>Joined {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => onNavigate('institution-profile')}
                    variant="outline"
                    size="sm"
                  >
                    View Institution
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Password & Security</h2>
              
              <div className="space-y-6">
                {/* Change Password */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Change Password</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={securityData.currentPassword}
                          onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="h-12 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-12 px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={securityData.newPassword}
                          onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={securityData.confirmPassword}
                          onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleSecuritySave} disabled={isLoading} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Updating...
                      </div>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={securityData.twoFactorEnabled}
                      onCheckedChange={(checked: any) => setSecurityData(prev => ({ ...prev, twoFactorEnabled: checked }))}
                    />
                  </div>
                  {securityData.twoFactorEnabled && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Two-factor authentication is enabled</p>
                          <p className="text-sm text-blue-700">Use your authenticator app to generate verification codes</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Notifications */}
                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Security Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Login Notifications</p>
                        <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                      </div>
                      <Switch
                        checked={securityData.loginNotifications}
                        onCheckedChange={(checked: any) => setSecurityData(prev => ({ ...prev, loginNotifications: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Security Updates</p>
                        <p className="text-sm text-gray-500">Receive important security updates and alerts</p>
                      </div>
                      <Switch
                        checked={securityData.securityUpdates}
                        onCheckedChange={(checked: any) => setSecurityData(prev => ({ ...prev, securityUpdates: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">New Applications</p>
                        <p className="text-sm text-gray-500">Get notified when candidates apply to your jobs</p>
                      </div>
                      <Switch
                        checked={notificationData.emailNewApplications}
                        onCheckedChange={(checked: any) => setNotificationData(prev => ({ ...prev, emailNewApplications: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Status Updates</p>
                        <p className="text-sm text-gray-500">Updates on candidate status changes and decisions</p>
                      </div>
                      <Switch
                        checked={notificationData.emailStatusUpdates}
                        onCheckedChange={(checked: any) => setNotificationData(prev => ({ ...prev, emailStatusUpdates: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Weekly Report</p>
                        <p className="text-sm text-gray-500">Weekly summary of your hiring activities</p>
                      </div>
                      <Switch
                        checked={notificationData.emailWeeklyReport}
                        onCheckedChange={(checked: any) => setNotificationData(prev => ({ ...prev, emailWeeklyReport: checked }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Push Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">New Applications</p>
                        <p className="text-sm text-gray-500">Instant notifications for new candidate applications</p>
                      </div>
                      <Switch
                        checked={notificationData.pushNewApplications}
                        onCheckedChange={(checked: any) => setNotificationData(prev => ({ ...prev, pushNewApplications: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Interview Reminders</p>
                        <p className="text-sm text-gray-500">Reminders for upcoming interviews</p>
                      </div>
                      <Switch
                        checked={notificationData.pushInterviewReminders}
                        onCheckedChange={(checked: any) => setNotificationData(prev => ({ ...prev, pushInterviewReminders: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Messages</p>
                        <p className="text-sm text-gray-500">New messages from candidates and team members</p>
                      </div>
                      <Switch
                        checked={notificationData.pushMessages}
                        onCheckedChange={(checked: any) => setNotificationData(prev => ({ ...prev, pushMessages: checked }))}
                      />
                    </div>
                  </div>
                </div>

                {/* SMS Notifications */}
                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    SMS Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Important Updates</p>
                        <p className="text-sm text-gray-500">Critical notifications about your account and jobs</p>
                      </div>
                      <Switch
                        checked={notificationData.smsImportantUpdates}
                        onCheckedChange={(checked: any) => setNotificationData(prev => ({ ...prev, smsImportantUpdates: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Interview Reminders</p>
                        <p className="text-sm text-gray-500">SMS reminders for scheduled interviews</p>
                      </div>
                      <Switch
                        checked={notificationData.smsInterviewReminders}
                        onCheckedChange={(checked: any) => setNotificationData(prev => ({ ...prev, smsInterviewReminders: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Button onClick={handleNotificationSave} disabled={isLoading} className="bg-[#ff6b35] hover:bg-[#e55a2b]">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Account Information</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Account Status</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-medium">Verified Account</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your account has been verified and you have full access to all recruiter features.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Account Created</h3>
                    <p className="text-sm text-gray-600">January 15, 2024</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Last Login</h3>
                    <p className="text-sm text-gray-600">Today at 2:45 PM</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Account Type</h3>
                    <p className="text-sm text-gray-600">Professional Recruiter</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Data Region</h3>
                    <p className="text-sm text-gray-600">United States</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4 text-red-600">Danger Zone</h3>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h4 className="font-medium text-red-900">Deactivate Account</h4>
                        <p className="text-sm text-red-700">
                          Temporarily disable your account. You can reactivate it anytime.
                        </p>
                      </div>
                      <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                        Deactivate
                      </Button>
                    </div>
                    <div className="flex items-start justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h4 className="font-medium text-red-900">Delete Account</h4>
                        <p className="text-sm text-red-700">
                          Permanently delete your account and all associated data. This cannot be undone.
                        </p>
                      </div>
                      <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}