import { useState, useEffect } from 'react';
import { JobApplication } from '../types/job';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ExternalLink } from 'lucide-react';

interface JobDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (job: Partial<JobApplication>) => void;
  job?: JobApplication | null;
  initialStatus?: JobApplication['status'];
  onNavigateToJobDetails?: (job: any) => void;
  onNavigate?: (view: string) => void;
}

export function JobDialog({ open, onClose, onSave, job, initialStatus, onNavigateToJobDetails, onNavigate }: JobDialogProps) {
  const [formData, setFormData] = useState<Partial<JobApplication>>({
    title: '',
    company: '',
    status: initialStatus || 'application-received',
    notes: '',
    salary: '',
    location: '',
    jobUrl: '',
    recruiterNotes: '',
    interviewDate: '',
    interviewType: undefined,
    interviewNotes: '',
  });

  useEffect(() => {
    if (job) {
      setFormData(job);
    } else if (initialStatus) {
      setFormData(prev => ({ ...prev, status: initialStatus }));
    }
  }, [job, initialStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return;
    
    onSave(formData);
    onClose();
    
    // Reset form if creating new job
    if (!job) {
      setFormData({
        title: '',
        company: '',
        status: initialStatus || 'application-received',
        notes: '',
        salary: '',
        location: '',
        jobUrl: '',
        recruiterNotes: '',
        interviewDate: '',
        interviewType: undefined,
        interviewNotes: '',
      });
    }
  };

  const statusOptions = [
    { value: 'application-received', label: 'Application Received' },
    { value: 'not-considered', label: 'Not Considered' },
    { value: 'under-consideration', label: 'Under Consideration' },
    { value: 'interview-stage', label: 'Interview Stage' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'offer', label: 'Offer' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{job ? 'Edit Job Application' : 'Add New Job Application'}</DialogTitle>
          <DialogDescription>
            {job ? 'Update the details of your job application.' : 'Add a new job application to track your progress.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title*</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. UX Designer"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company*</Label>
              <Input
                id="company"
                value={formData.company || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="e.g. Google"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. San Francisco, CA"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                value={formData.salary || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                placeholder="e.g. $80k - $120k"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, status: value as JobApplication['status'] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input
              id="jobUrl"
              type="url"
              value={formData.jobUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, jobUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Your Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add your personal notes about this application..."
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recruiterNotes">Recruiter Notes</Label>
            <Textarea
              id="recruiterNotes"
              value={formData.recruiterNotes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, recruiterNotes: e.target.value }))}
              placeholder="Notes from recruiter (read-only in real app)..."
              rows={2}
              className="bg-muted"
            />
          </div>
          
          {formData.status === 'interview-stage' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interviewDate">Interview Date</Label>
                  <Input
                    id="interviewDate"
                    type="datetime-local"
                    value={formData.interviewDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, interviewDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interviewType">Interview Type</Label>
                  <Select 
                    value={formData.interviewType || ''} 
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, interviewType: value as 'phone' | 'video' | 'onsite' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone Interview</SelectItem>
                      <SelectItem value="video">Video Interview</SelectItem>
                      <SelectItem value="onsite">Onsite Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interviewNotes">Interview Notes</Label>
                <Textarea
                  id="interviewNotes"
                  value={formData.interviewNotes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, interviewNotes: e.target.value }))}
                  placeholder="Notes about the interview..."
                  rows={2}
                />
              </div>
            </>
          )}
          
          <div className="flex justify-between gap-2">
            <div className="flex gap-2">
              {job && onNavigateToJobDetails && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    onNavigateToJobDetails(job);
                    onClose();
                  }}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Full JD
                </Button>
              )}
              {job && formData.company && onNavigate && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    onNavigate('company-profile');
                    onClose();
                  }}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Company
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {job ? 'Update' : 'Add'} Application
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
