/**
 * Edit Job View Component
 */
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { UpdateJobStatusModal } from '../../jobs/UpdateJobStatusModal';
import { ArrowLeft, X, Save } from 'lucide-react';
import type { ViewType } from '../types';

interface EditJobViewProps {
  editingJob: any;
  setEditingJob: (job: any) => void;
  setCurrentView: (view: ViewType) => void;
  handleSaveJob: () => Promise<void>;
  showJobStatusUpdate: boolean;
  jobStatusUpdateTarget: any;
  setShowJobStatusUpdate: (show: boolean) => void;
  setJobStatusUpdateTarget: (target: null) => void;
  handleJobStatusUpdate: (status: any) => Promise<void>;
}

export const EditJobView = ({
  editingJob,
  setEditingJob,
  setCurrentView,
  handleSaveJob,
  showJobStatusUpdate,
  jobStatusUpdateTarget,
  setShowJobStatusUpdate,
  setJobStatusUpdateTarget,
  handleJobStatusUpdate
}: EditJobViewProps) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 p-6">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          onClick={() => setCurrentView('job-detail')}
          className="text-gray-900 hover:text-[#ff6b35] hover:border-[#ff6b35] border-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back to Job Details</span>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentView('job-detail')}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSaveJob}
            className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Card className="p-8">
        <h1 className="text-3xl text-gray-900 mb-6">Edit Job Posting</h1>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-title">Job Title</Label>
                <Input
                  id="edit-title"
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={editingJob.department}
                  onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editingJob.location}
                  onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-industry">Industry</Label>
                <Input
                  id="edit-industry"
                  value={editingJob.industry}
                  onChange={(e) => setEditingJob({ ...editingJob, industry: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-employment-type">Employment Type</Label>
                <Select value={editingJob.employment_type} onValueChange={(value) => setEditingJob({ ...editingJob, employment_type: value })}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-work-arrangement">Work Arrangement</Label>
                <Select value={editingJob.work_arrangement} onValueChange={(value) => setEditingJob({ ...editingJob, work_arrangement: value })}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="onsite">On Site</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="edit-salary-min">Minimum Salary</Label>
                <Input
                  id="edit-salary-min"
                  type="number"
                  value={editingJob.salary_min || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, salary_min: e.target.value ? Number.parseFloat(e.target.value) : null })}
                />
              </div>
              <div>
                <Label htmlFor="edit-salary-max">Maximum Salary</Label>
                <Input
                  id="edit-salary-max"
                  type="number"
                  value={editingJob.salary_max || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, salary_max: e.target.value ? Number.parseFloat(e.target.value) : null })}
                />
              </div>
              <div>
                <Label htmlFor="edit-currency">Currency</Label>
                <Select value={editingJob.currency} onValueChange={(value) => setEditingJob({ ...editingJob, currency: value })}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-experience-level">Experience Level</Label>
                <Select value={editingJob.experience_level} onValueChange={(value) => setEditingJob({ ...editingJob, experience_level: value })}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="L1">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="L2">Junior (2-4 years)</SelectItem>
                    <SelectItem value="L3">Mid-Level (4-6 years)</SelectItem>
                    <SelectItem value="L4">Senior (6-10 years)</SelectItem>
                    <SelectItem value="L5">Expert (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-education-level">Education Level</Label>
                <Select value={editingJob.education_level} onValueChange={(value) => setEditingJob({ ...editingJob, education_level: value })}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Job Description</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-summary">Summary</Label>
                <Textarea
                  id="edit-summary"
                  value={editingJob.summary || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, summary: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Full Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="edit-requirements">Requirements (one per line)</Label>
                <Textarea
                  id="edit-requirements"
                  value={editingJob.requirements?.join('\n') || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, requirements: e.target.value.split('\n').filter(Boolean) })}
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="edit-responsibilities">Responsibilities (one per line)</Label>
                <Textarea
                  id="edit-responsibilities"
                  value={editingJob.responsibilities?.join('\n') || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, responsibilities: e.target.value.split('\n').filter(Boolean) })}
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="edit-nice-to-have">Nice to Have (one per line)</Label>
                <Textarea
                  id="edit-nice-to-have"
                  value={editingJob.nice_to_have?.join('\n') || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, nice_to_have: e.target.value.split('\n').filter(Boolean) })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="edit-benefits">Benefits</Label>
                <Textarea
                  id="edit-benefits"
                  value={editingJob.benefits || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, benefits: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Status and Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingJob.status}
                  onValueChange={(value) => setEditingJob({ ...editingJob, status: value })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-is-urgent">Urgent Position</Label>
                <Select value={editingJob.is_urgent ? 'true' : 'false'} onValueChange={(value) => setEditingJob({ ...editingJob, is_urgent: value === 'true' })}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-hiring-manager">Hiring Manager</Label>
                <Input
                  id="edit-hiring-manager"
                  value={editingJob.hiring_manager || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, hiring_manager: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-internal-job-code">Internal Job Code</Label>
                <Input
                  id="edit-internal-job-code"
                  value={editingJob.internal_job_code || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, internal_job_code: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="edit-recruiter-notes">Recruiter Notes (Internal)</Label>
              <Textarea
                id="edit-recruiter-notes"
                value={editingJob.recruiter_notes || ''}
                onChange={(e) => setEditingJob({ ...editingJob, recruiter_notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Read-only Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Information (Read-only)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Views Count</Label>
                <Input value={editingJob.views_count || 0} disabled />
              </div>
              <div>
                <Label>Applications Count</Label>
                <Input value={editingJob.applications_count || 0} disabled />
              </div>
              <div>
                <Label>Created At</Label>
                <Input value={new Date(editingJob.created_at).toLocaleString()} disabled />
              </div>
              <div>
                <Label>Updated At</Label>
                <Input value={new Date(editingJob.updated_at).toLocaleString()} disabled />
              </div>
              <div>
                <Label>Published At</Label>
                <Input value={editingJob.published_at ? new Date(editingJob.published_at).toLocaleString() : 'Not published'} disabled />
              </div>
              <div>
                <Label>Predicted Industry</Label>
                <Input value={editingJob.predicted_industry || 'N/A'} disabled />
              </div>
              <div>
                <Label>Predicted Level</Label>
                <Input value={editingJob.predicted_level || 'N/A'} disabled />
              </div>
              <div>
                <Label>Prediction Confidence</Label>
                <Input value={editingJob.prediction_confidence || 'N/A'} disabled />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    {/* Job Status Update Modal */}
    {showJobStatusUpdate && jobStatusUpdateTarget && (
      <UpdateJobStatusModal
        job={jobStatusUpdateTarget}
        onClose={() => {
          setShowJobStatusUpdate(false);
          setJobStatusUpdateTarget(null);
        }}
        onUpdate={handleJobStatusUpdate}
      />
    )}
  </div>
);

export default EditJobView;
