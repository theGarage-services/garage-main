import { useState } from 'react';
import { JobApplication } from '../types/job';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar, Clock, Video, Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  jobs: JobApplication[];
  onEditJob: (job: JobApplication) => void;
}

interface InterviewEvent {
  id: string;
  jobId: string;
  job: JobApplication;
  type: 'phone' | 'video' | 'onsite';
  date: Date;
  time: string;
  duration: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
}

export function CalendarView({ jobs, onEditJob }: Readonly<CalendarViewProps>) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate mock interview events for jobs in interview stage
  const generateMockInterviews = (): InterviewEvent[] => {
    const interviewJobs = jobs.filter(job => job.status === 'interview-stage');
    const events: InterviewEvent[] = [];
    
    interviewJobs.forEach((job, _index) => {
      // Generate 1-2 interviews per job in interview stage
      const numInterviews = Math.random() > 0.5 ? 2 : 1;
      
      for (let i = 0; i < numInterviews; i++) {
        const baseDate = new Date();
        const daysFromNow = Math.floor(Math.random() * 14) + 1; // Next 2 weeks
        const eventDate = new Date(baseDate.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
        
        const types: InterviewEvent['type'][] = ['phone', 'video', 'onsite'];
        const times = ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM', '4:00 PM'];
        
        events.push({
          id: `${job.id}-${i}`,
          jobId: job.id,
          job,
          type: types[Math.floor(Math.random() * types.length)],
          date: eventDate,
          time: times[Math.floor(Math.random() * times.length)],
          duration: i === 0 ? '30 min' : '1 hour',
          location: job.location,
          meetingLink: 'https://meet.company.com/interview-123',
          notes: i === 0 ? 'Initial phone screening' : 'Technical interview with team'
        });
      }
    });
    
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const [interviews] = useState<InterviewEvent[]>(generateMockInterviews());

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return interviews.filter(interview => 
      interview.date.toDateString() === date.toDateString()
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getEventIcon = (type: InterviewEvent['type']) => {
    switch (type) {
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'onsite': return <MapPin className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: InterviewEvent['type']) => {
    switch (type) {
      case 'phone': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'video': return 'bg-green-100 text-green-800 border-green-200';
      case 'onsite': return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const weekDays = getWeekDays();
  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Interview Schedule</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium min-w-[140px] text-center">
              {getMonthName(currentDate)}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-600" />
          <span>Phone Interview</span>
        </div>
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-green-600" />
          <span>Video Interview</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-600" />
          <span>Onsite Interview</span>
        </div>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const eventsForDay = getEventsForDate(day);
          const isToday = day.toDateString() === today.toDateString();
          const isPast = day < today && !isToday;
          
          return (
            <Card key={index} className={`p-3 min-h-[200px] ${isToday ? 'border-blue-500 bg-blue-50' : ''} ${isPast ? 'opacity-60' : ''}`}>
              <div className="space-y-2">
                <div className={`text-center ${isToday ? 'font-medium text-blue-700' : ''}`}>
                  <div className="text-xs text-muted-foreground">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg ${isToday ? 'bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
                    {day.getDate()}
                  </div>
                </div>
                
                <div className="space-y-1">
                  {eventsForDay.map((event) => (
                    <div
                      key={event.id}
                      className={`p-2 rounded-lg border text-xs cursor-pointer hover:shadow-sm transition-shadow ${getEventColor(event.type)}`}
                      onClick={() => onEditJob(event.job)}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {getEventIcon(event.type)}
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <div className="font-medium truncate">{event.job.title}</div>
                      <div className="text-xs opacity-80 truncate">{event.job.company}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Interviews List */}
      <div className="space-y-4">
        <h4 className="font-medium">Upcoming Interviews</h4>
        
        {interviews.length > 0 ? (
          <div className="space-y-3">
            {interviews.slice(0, 5).map((event) => (
              <Card key={event.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <div className="font-medium">{event.job.title} - {event.job.company}</div>
                      <div className="text-sm text-muted-foreground">{event.notes}</div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{event.date.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{event.time} ({event.duration})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.meetingLink && (
                      <Button variant="outline" size="sm" onClick={() => window.open(event.meetingLink, '_blank')}>
                        Join
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => onEditJob(event.job)}>
                      View Job
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No upcoming interviews scheduled.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Interviews will appear here when jobs reach the interview stage.
            </p>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-medium">{interviews.length}</div>
          <div className="text-sm text-muted-foreground">Total Interviews</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-medium">
            {interviews.filter(i => i.date >= today).length}
          </div>
          <div className="text-sm text-muted-foreground">Upcoming</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-medium">
            {jobs.filter(job => job.status === 'interview-stage').length}
          </div>
          <div className="text-sm text-muted-foreground">Jobs in Interview</div>
        </Card>
      </div>
    </div>
  );
}