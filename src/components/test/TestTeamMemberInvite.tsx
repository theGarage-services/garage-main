import { useState } from 'react';
import { UserPlus, Mail, Shield, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { ROLE_TEMPLATES } from '../../types/team';
import { MOCK_ORGANIZATION, MOCK_JOBS } from '@/utils/testMockData';
import { TestPermissionEditor } from './TestPermissionEditor';

interface TestTeamMemberInviteProps {
  onBack: () => void;
  onInviteComplete: () => void;
}

export function TestTeamMemberInvite({ onBack, onInviteComplete }: Readonly<TestTeamMemberInviteProps>) {
  const [step, setStep] = useState<'basic' | 'permissions'>(  'basic');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleTemplate: '',
    departmentId: '',
    assignedJobs: [] as string[],
    customMessage: '',
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleRoleTemplateChange = (template: string) => {
    setFormData({ ...formData, roleTemplate: template });

    // Auto-populate permissions based on template
    if (template !== 'custom' && template) {
      setSelectedPermissions(ROLE_TEMPLATES[template]?.permissions || []);
    } else {
      setSelectedPermissions([]);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.roleTemplate) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Inviting team member:', {
      ...formData,
      permissions: selectedPermissions,
    });

    alert(`Invitation sent to ${formData.email}!`);
    onInviteComplete();
  };

  if (step === 'permissions') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setStep('basic')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Basic Info
          </Button>

          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl mb-2">Customize Permissions</h2>
              <p className="text-sm text-gray-600">
                Fine-tune what {formData.name || 'this member'} can access
              </p>
            </div>

            <TestPermissionEditor
              selectedPermissions={selectedPermissions}
              onChange={setSelectedPermissions}
              roleTemplate={formData.roleTemplate}
            />

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep('basic')} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Send Invitation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Team
        </Button>

        <Card className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl">Invite Team Member</h2>
              <p className="text-sm text-gray-600">Add a new member to your organization</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="e.g. John Smith"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.smith@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                An invitation link will be sent to this email
              </p>
            </div>

            {/* Role Selection */}
            <div>
              <Label>Role Template *</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {Object.entries(ROLE_TEMPLATES).map(([key, template]) => (
                  key !== 'custom' && (
                    <Card
                      key={key}
                      className={`p-4 cursor-pointer transition-all ${
                        formData.roleTemplate === key
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleRoleTemplateChange(key)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: template.color }}
                        />
                        <h3 className="text-sm font-medium">{template.name}</h3>
                      </div>
                      <p className="text-xs text-gray-600">{template.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {template.permissions.length} permissions
                      </p>
                    </Card>
                  )
                ))}
                
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    formData.roleTemplate === 'custom'
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleRoleTemplateChange('custom')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm font-medium">Custom Role</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    Define custom permissions
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Fully customizable
                  </p>
                </Card>
              </div>
            </div>

            {/* Department */}
            <div>
              <Label htmlFor="department">Department (Optional)</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value: any) => setFormData({ ...formData, departmentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_ORGANIZATION.departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: dept.color }}
                        />
                        {dept.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Job Assignment (Optional) */}
            <div>
              <Label>Restrict to Specific Jobs (Optional)</Label>
              <p className="text-xs text-gray-500 mb-2">
                Leave empty to grant access to all jobs
              </p>
              <Select
                value={formData.assignedJobs[0] || ''}
                onValueChange={(value: string) => {
                  if (value && !formData.assignedJobs.includes(value)) {
                    setFormData({
                      ...formData,
                      assignedJobs: [...formData.assignedJobs, value],
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select jobs..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_JOBS.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} ({job.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {formData.assignedJobs.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.assignedJobs.map((jobId) => {
                    const job = MOCK_JOBS.find(j => j.id === jobId);
                    return (
                      <Badge
                        key={jobId}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            assignedJobs: formData.assignedJobs.filter(id => id !== jobId),
                          });
                        }}
                      >
                        {job?.title} ✕
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Custom Message */}
            <div>
              <Label htmlFor="message">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal note to the invitation email..."
                value={formData.customMessage}
                onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                rows={3}
              />
            </div>

            {/* Permission Preview */}
            {formData.roleTemplate && formData.roleTemplate !== 'custom' && (
              <Card className="p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-medium">Permissions Preview</h3>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  This role includes the following permissions:
                </p>
                <div className="flex flex-wrap gap-1">
                  {ROLE_TEMPLATES[formData.roleTemplate].permissions.slice(0, 6).map((perm) => (
                    <Badge key={perm} variant="outline" className="text-xs">
                      {perm.split('.')[1]}
                    </Badge>
                  ))}
                  {ROLE_TEMPLATES[formData.roleTemplate].permissions.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{ROLE_TEMPLATES[formData.roleTemplate].permissions.length - 6} more
                    </Badge>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Cancel
            </Button>
            
            {formData.roleTemplate === 'custom' ? (
              <Button
                onClick={() => setStep('permissions')}
                disabled={!formData.name || !formData.email}
                className="flex-1"
              >
                Customize Permissions
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.email || !formData.roleTemplate}
                className="flex-1"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
