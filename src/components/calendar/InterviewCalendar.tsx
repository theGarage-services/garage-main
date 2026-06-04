import { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AppHeader } from '../layout/AppHeader';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Phone,
  Lightbulb,
  Sparkles,
  FileText,
  Save,
  X,
  Loader2,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getInterviews,
  createInterview,
  type Interview,
  type CreateInterviewRequest
} from '@/api/interviews';
import { jobPostsApi, type JobPost } from '@/api/jobPosts';
import { recruiterCandidatesApi, type Candidate } from '@/api/recruiterCandidates';


interface InterviewCalendarProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  user: any;
  prefilledData?: {
    candidateId?: string;
    candidateName?: string;
    candidateEmail?: string;
    position?: string;
    type?: string;
    stage?: string;
    date?: string;
    time?: string;
    duration?: string;
    interviewer?: string;
    location?: string;
    meetingLink?: string;
    notes?: string;
  };
}

export function InterviewCalendar({ 
  onNavigate,
  onLogout,
  user,
  prefilledData
}: Readonly<InterviewCalendarProps>) {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ date: Date; hour: number } | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(!!prefilledData);

  // Form state - initialize with prefilled data
  const [formData, setFormData] = useState({
    candidateName: prefilledData?.candidateName || '',
    candidateEmail: prefilledData?.candidateEmail || '',
    candidateId: prefilledData?.candidateId || '',
    jobId: '', // Will be set when selecting from dropdown
    position: prefilledData?.position || '',
    type: prefilledData?.type || '',
    stage: prefilledData?.stage || '',
    date: prefilledData?.date || '',
    time: prefilledData?.time || '',
    duration: prefilledData?.duration || '60',
    interviewer: prefilledData?.interviewer || '',
    location: prefilledData?.location || '',
    meetingLink: prefilledData?.meetingLink || '',
    notes: prefilledData?.notes || ''
  });

  // Update form when prefilled data changes
  useEffect(() => {
    if (prefilledData) {
      setFormData(prev => ({
        ...prev,
        candidateName: prefilledData.candidateName || prev.candidateName,
        candidateEmail: prefilledData.candidateEmail || prev.candidateEmail,
        candidateId: prefilledData.candidateId || prev.candidateId,
        position: prefilledData.position || prev.position,
        type: prefilledData.type || prev.type,
        stage: prefilledData.stage || prev.stage,
        date: prefilledData.date || prev.date,
        time: prefilledData.time || prev.time,
        duration: prefilledData.duration || prev.duration || '60',
        interviewer: prefilledData.interviewer || prev.interviewer,
        location: prefilledData.location || prev.location,
        meetingLink: prefilledData.meetingLink || prev.meetingLink,
        notes: prefilledData.notes || prev.notes
      }));
      setShowScheduleForm(true);
    }
  }, [prefilledData]);

  // Fetch jobs and candidates when schedule form opens
  useEffect(() => {
    if (showScheduleForm) {
      fetchJobsAndCandidates();
    }
  }, [showScheduleForm]);

  const fetchJobsAndCandidates = async () => {
    try {
      setIsLoadingJobs(true);
      setIsLoadingCandidates(true);

      // Fetch jobs
      const jobsResponse = await jobPostsApi.getJobPosts();
      if (jobsResponse.success) {
        setJobs(jobsResponse.data);
      }

      // Fetch candidates
      const candidatesResponse = await recruiterCandidatesApi.fetchAllCandidates();
      setCandidates(candidatesResponse.candidates);
    } catch (error) {
      console.error('Error fetching jobs/candidates:', error);
      toast.error('Failed to load jobs and candidates');
    } finally {
      setIsLoadingJobs(false);
      setIsLoadingCandidates(false);
    }
  };

  // Real interview data from API
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Jobs and candidates for selectors
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  // Fetch interviews from API
  const fetchInterviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getInterviews();
      setInterviews(data);
    } catch (error) {
      toast.error('Failed to fetch interviews');
      console.error('Error fetching interviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const getInterviewsForDate = (date: Date) => {
    return interviews.filter((interview) => {
      const interviewDate = new Date(interview.scheduled_date);
      return interviewDate.toDateString() === date.toDateString();
    });
  };

  const getInterviewsForHour = (date: Date, hour: number) => {
    return interviews.filter((interview) => {
      const interviewDate = new Date(interview.scheduled_date);
      const interviewTime = interview.scheduled_time.split(':');
      const interviewHour = Number.parseInt(interviewTime[0], 10);
      return (
        interviewDate.toDateString() === date.toDateString() &&
        interviewHour === hour
      );
    });
  };

  const previousPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleMouseDown = (date: Date, hour: number) => {
    setIsDragging(true);
    setDragStart({ date, hour });
  };

  const handleMouseUp = (date: Date, hour: number) => {
    if (isDragging && dragStart) {
      const startTime = `${dragStart.hour.toString().padStart(2, '0')}:00`;
      const endHour = Math.max(dragStart.hour, hour) + 1;
      const duration = (endHour - Math.min(dragStart.hour, hour)) * 60;

      setFormData(prev => ({
        ...prev,
        date: date.toISOString().split('T')[0],
        time: startTime,
        duration: duration.toString()
      }));
      setShowScheduleForm(true);
    }
    setIsDragging(false);
    setDragStart(null);
  };

  const handleSchedule = async () => {
    if (!formData.candidateName || !formData.type || !formData.stage || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.jobId) {
      toast.error('Please select a job');
      return;
    }

    if (!formData.candidateId) {
      toast.error('Please select a candidate');
      return;
    }

    try {
      const interviewData: CreateInterviewRequest = {
        job: Number.parseInt(formData.jobId, 10),
        candidate_id: Number.parseInt(formData.candidateId, 10),
        interview_type: formData.type as Interview['interview_type'],
        stage: formData.stage as Interview['stage'],
        scheduled_date: formData.date,
        scheduled_time: formData.time,
        duration_minutes: Number.parseInt(formData.duration, 10),
        title: `${formData.position} - ${formData.candidateName}`,
        location: formData.location,
        meeting_link: formData.meetingLink,
        interviewer_name: formData.interviewer,
        notes: formData.notes,
      };

      await createInterview(interviewData);
      toast.success('Interview scheduled successfully!');
      setShowScheduleForm(false);
      setFormData({
        candidateName: '',
        candidateEmail: '',
        candidateId: '',
        jobId: '',
        position: '',
        type: '',
        stage: '',
        date: '',
        time: '',
        duration: '60',
        interviewer: '',
        location: '',
        meetingLink: '',
        notes: ''
      });
      fetchInterviews(); // Refresh the list
    } catch (error) {
      toast.error('Failed to schedule interview');
      console.error('Error scheduling interview:', error);
    }
  };

  const getSuggestions = () => {
    const suggestions = [];

    suggestions.push({
      icon: Clock,
      title: 'Optimal Time Slots',
      description: 'Schedule between 10 AM - 12 PM or 2 PM - 4 PM for best response rates',
      type: 'time'
    });

    if (formData.stage === 'phone-screening') {
      suggestions.push({
        icon: Sparkles,
        title: 'Duration Suggestion',
        description: 'Phone screenings typically work best at 30-45 minutes',
        type: 'duration'
      });
    } else if (formData.stage === 'technical' || formData.stage === 'panel') {
      suggestions.push({
        icon: Sparkles,
        title: 'Duration Suggestion',
        description: 'Technical/Panel interviews typically need 60-90 minutes',
        type: 'duration'
      });
    }

    const busyHours = interviews.filter(i => {
      const interviewDate = new Date(i.scheduled_date);
      return interviewDate.toDateString() === new Date(formData.date || Date.now()).toDateString();
    }).length;

    if (busyHours > 3) {
      suggestions.push({
        icon: Lightbulb,
        title: 'Schedule Consideration',
        description: 'This day has multiple interviews scheduled. Consider spreading out interviews.',
        type: 'availability'
      });
    }

    return suggestions;
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = Number.parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTypeIcon = (type: Interview['interview_type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'in-person':
        return <MapPin className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rescheduled':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      {/* Header */}
      <AppHeader
        userRole="recruiter"
        user={user}
        currentView="interview-calendar"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Page Title & Controls Section */}
      <div className="pt-20 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white pb-8 shadow-lg">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Interview Calendar</h1>
              <p className="text-white/90">Manage and schedule interviews</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={previousPeriod}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextPeriod}
                className="text-white hover:bg-white/20"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-medium min-w-[200px]">
                {currentDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1.5 backdrop-blur-sm">
                <Button
                  variant={viewMode === 'day' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className={`h-9 px-4 ${viewMode === 'day' ? 'bg-white text-[#ff6b35]' : 'text-white hover:bg-white/20'}`}
                >
                  Day
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className={`h-9 px-4 ${viewMode === 'week' ? 'bg-white text-[#ff6b35]' : 'text-white hover:bg-white/20'}`}
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === 'month' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                  className={`h-9 px-4 ${viewMode === 'month' ? 'bg-white text-[#ff6b35]' : 'text-white hover:bg-white/20'}`}
                >
                  Month
                </Button>
              </div>

              {!showScheduleForm && (
                <Button
                  size="sm"
                  onClick={() => setShowScheduleForm(true)}
                  className="bg-white text-[#ff6b35] hover:bg-white/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Interview
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex max-w-[1800px] mx-auto">
        {/* Calendar View */}
        <div className={`${showScheduleForm ? 'w-2/3' : 'w-full'} p-8`}>
          {/* Week View */}
          {viewMode === 'week' && (
            <Card className="bg-white shadow-xl border-0">
              {/* Days Header */}
              <div className="grid grid-cols-8 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="p-4 text-center text-sm font-medium text-gray-500">Time</div>
                {getWeekDays().map((day) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <div
                      key={day.toISOString()}
                      className={`p-4 text-center border-l border-gray-200 ${
                        isToday ? 'bg-[#ff6b35] text-white' : 'bg-gray-50'
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">
                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-xl font-semibold">{day.getDate()}</div>
                    </div>
                  );
                })}
              </div>

              {/* Time Slots */}
              <div className="divide-y divide-gray-200">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8">
                    <div className="p-4 text-center text-sm text-gray-500 border-r border-gray-200">
                      {hour % 12 || 12} {hour < 12 ? 'AM' : 'PM'}
                    </div>
                    {getWeekDays().map((day) => {
                      const dayInterviews = getInterviewsForHour(day, hour);
                      return (
                        <button
                          key={day.toISOString()}
                          type="button"
                          className="p-3 border-l border-gray-200 min-h-[100px] hover:bg-blue-50 cursor-pointer transition-colors relative text-left w-full"
                          onMouseDown={() => handleMouseDown(day, hour)}
                          onMouseUp={() => handleMouseUp(day, hour)}
                        >
                          {isLoading ? (
                            <div className="flex justify-center py-4">
                              <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                          ) : (
                            dayInterviews.map((interview) => (
                              <div
                                key={interview.id}
                                className="mb-2 p-3 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white rounded-lg text-xs shadow-md hover:shadow-lg transition-all"
                              >
                                <div className="font-medium truncate mb-1">
                                  {interview.candidate_name}
                                </div>
                                <div className="flex items-center gap-1.5 opacity-90">
                                  {getTypeIcon(interview.interview_type)}
                                  <span>{formatTime(interview.scheduled_time)}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Day View */}
          {viewMode === 'day' && (
            <Card className="bg-white shadow-xl border-0">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xl font-semibold">
                  {currentDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {hours.map((hour) => {
                  const hourInterviews = getInterviewsForHour(currentDate, hour);
                  return (
                    <button
                      key={hour}
                      type="button"
                      className="grid grid-cols-12 hover:bg-blue-50 cursor-pointer transition-colors text-left w-full"
                      onMouseDown={() => handleMouseDown(currentDate, hour)}
                      onMouseUp={() => handleMouseUp(currentDate, hour)}
                    >
                      <div className="col-span-2 p-6 text-sm text-gray-500 border-r border-gray-200 font-medium">
                        {hour % 12 || 12} {hour < 12 ? 'AM' : 'PM'}
                      </div>
                      <div className="col-span-10 p-6 min-h-[120px]">
                        {isLoading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin" />
                          </div>
                        ) : (
                          hourInterviews.map((interview) => (
                            <Card
                              key={interview.id}
                              className="mb-3 p-4 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white border-0 shadow-lg hover:shadow-xl transition-all"
                            >
                              <div className="flex items-start gap-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarFallback className="bg-white text-[#ff6b35] font-semibold">
                                    {interview.candidate_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="font-semibold text-lg mb-1">{interview.candidate_name}</div>
                                  <div className="text-sm opacity-90 mb-3">{interview.job_title}</div>
                                  <div className="flex items-center gap-3 text-sm">
                                    {getTypeIcon(interview.interview_type)}
                                    <span>{formatTime(interview.scheduled_time)}</span>
                                    <span>•</span>
                                    <span>{interview.duration_minutes}m</span>
                                  </div>
                                </div>
                                <Badge className={getStatusColor(interview.status)}>
                                  {interview.status}
                                </Badge>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Month View */}
          {viewMode === 'month' && (
            <Card className="bg-white shadow-xl border-0">
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 border-b border-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-4 text-center text-sm font-medium text-gray-500 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {(() => {
                  let emptyCount = 0;
                  return getMonthDays().map((day) => {
                    if (!day) {
                      emptyCount += 1;
                      return <div key={`empty-${emptyCount}`} className="p-4 border border-gray-200 bg-gray-50/50 min-h-[140px]" />;
                    }

                    const dayInterviews = getInterviewsForDate(day);
                    const isToday = day.toDateString() === new Date().toDateString();

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        className="p-4 border border-gray-200 min-h-[140px] hover:bg-blue-50 cursor-pointer transition-colors text-left w-full"
                        onClick={() => {
                          setCurrentDate(day);
                          setViewMode('day');
                        }}
                      >
                        <div
                          className={`text-sm font-medium mb-3 ${
                            isToday
                              ? 'w-9 h-9 flex items-center justify-center rounded-full bg-[#ff6b35] text-white'
                              : 'text-gray-700'
                          }`}
                        >
                          {day.getDate()}
                        </div>
                        <div className="space-y-1.5">
                          {dayInterviews.slice(0, 3).map((interview) => (
                            <div
                              key={interview.id}
                              className="text-xs p-2 bg-[#ff6b35] text-white rounded truncate shadow-sm"
                            >
                              {formatTime(interview.scheduled_time)} - {interview.candidate_name}
                            </div>
                          ))}
                          {dayInterviews.length > 3 && (
                            <div className="text-xs text-gray-500 font-medium">
                              +{dayInterviews.length - 3} more
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  });
                })()}
              </div>
            </Card>
          )}
        </div>

        {/* Schedule Form Sidebar */}
        {showScheduleForm && (
          <div className="w-1/3 border-l border-gray-200 bg-white overflow-y-auto max-h-screen">
            <div className="p-8 sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Schedule Interview</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScheduleForm(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Smart Suggestions */}
              {formData.date && (
                <div className="space-y-3 mb-6">
                  {getSuggestions().map((suggestion) => {
                    const Icon = suggestion.icon;
                    return (
                      <div
                        key={suggestion.title}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-blue-900 mb-1">
                              {suggestion.title}
                            </div>
                            <div className="text-xs text-blue-700">
                              {suggestion.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-8 space-y-6">
              {/* Job Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base">
                  <Briefcase className="w-4 h-4 text-[#ff6b35]" />
                  Job *
                </Label>
                <Select
                  value={formData.jobId}
                  onValueChange={(value: string) => {
                    const selectedJob = jobs.find(j => String(j.id) === value);
                    setFormData(prev => ({
                      ...prev,
                      jobId: value,
                      position: selectedJob?.title || prev.position
                    }));
                  }}
                  disabled={isLoadingJobs}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={isLoadingJobs ? 'Loading jobs...' : 'Select a job'} />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={String(job.id)}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Candidate Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base">
                  <User className="w-4 h-4 text-[#ff6b35]" />
                  Candidate *
                </Label>
                <Select
                  value={formData.candidateId}
                  onValueChange={(value: string) => {
                    const selectedCandidate = candidates.find(c => c.id === value);
                    setFormData(prev => ({
                      ...prev,
                      candidateId: value,
                      candidateName: selectedCandidate?.name || prev.candidateName,
                      candidateEmail: selectedCandidate?.email || prev.candidateEmail
                    }));
                  }}
                  disabled={isLoadingCandidates}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={isLoadingCandidates ? 'Loading candidates...' : 'Select a candidate'} />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.name} ({candidate.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Position (auto-filled from job, but editable) */}
              <div className="space-y-2">
                <Label className="text-base">Position</Label>
                <Input
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="h-11"
                />
              </div>

              {/* Type & Stage */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-base">Interview Type *</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">📞 Phone</SelectItem>
                      <SelectItem value="video">🎥 Video</SelectItem>
                      <SelectItem value="in-person">🏢 In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Stage *</Label>
                  <Select value={formData.stage} onValueChange={(value: any) => setFormData(prev => ({ ...prev, stage: value }))}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone-screening">Phone Screening</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="panel">Panel</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-base">
                    <CalendarIcon className="w-4 h-4 text-[#ff6b35]" />
                    Date *
                  </Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-base">
                    <Clock className="w-4 h-4 text-[#ff6b35]" />
                    Time *
                  </Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="h-11"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label className="text-base">Duration</Label>
                <Select value={formData.duration} onValueChange={(value: any) => setFormData(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interviewer */}
              <div className="space-y-2">
                <Label className="text-base">Interviewer Name</Label>
                <Input
                  placeholder="e.g., John Smith"
                  value={formData.interviewer}
                  onChange={(e) => setFormData(prev => ({ ...prev, interviewer: e.target.value }))}
                  className="h-11"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base">
                  <MapPin className="w-4 h-4 text-[#ff6b35]" />
                  Location
                </Label>
                <Input
                  placeholder="Office address"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="h-11"
                />
              </div>

              {/* Meeting Link */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base">
                  <Video className="w-4 h-4 text-[#ff6b35]" />
                  Meeting Link
                </Label>
                <Input
                  placeholder="Zoom/Teams/Meet link"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                  className="h-11"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base">
                  <FileText className="w-4 h-4 text-[#ff6b35]" />
                  Notes
                </Label>
                <Textarea
                  placeholder="Add interview notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={5}
                  className="resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleForm(false)}
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSchedule}
                  disabled={!formData.candidateName || !formData.type || !formData.stage || !formData.date || !formData.time}
                  className="flex-1 h-11 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}