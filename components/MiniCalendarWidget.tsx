import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  Phone,
  MapPin
} from 'lucide-react';

interface Interview {
  id: string;
  candidateName: string;
  candidateAvatar: string;
  position: string;
  type: 'video' | 'phone' | 'in-person';
  date: Date;
  duration: number;
  status: string;
}

interface MiniCalendarWidgetProps {
  onScheduleInterview?: () => void;
}

export function MiniCalendarWidget({ onScheduleInterview }: Readonly<MiniCalendarWidgetProps>) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock interview data
  const interviews: Interview[] = [
    {
      id: '1',
      candidateName: 'Sarah Chen',
      candidateAvatar: 'SC',
      position: 'Senior Software Engineer',
      type: 'video',
      date: new Date(2024, 0, 22, 10, 0),
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '2',
      candidateName: 'Marcus Rodriguez',
      candidateAvatar: 'MR',
      position: 'Product Manager',
      type: 'phone',
      date: new Date(2024, 0, 22, 14, 30),
      duration: 45,
      status: 'pending'
    },
    {
      id: '3',
      candidateName: 'Emily Watson',
      candidateAvatar: 'EW',
      position: 'UX Designer',
      type: 'in-person',
      date: new Date(2024, 0, 23, 11, 0),
      duration: 90,
      status: 'confirmed'
    }
  ];

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

  const getInterviewsForDate = (date: Date) => {
    return interviews.filter(
      (interview) => interview.date.toDateString() === date.toDateString()
    );
  };

  const getTodaysInterviews = () => {
    return getInterviewsForDate(selectedDate);
  };

  const previousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-3 h-3" />;
      case 'phone':
        return <Phone className="w-3 h-3" />;
      case 'in-person':
        return <MapPin className="w-3 h-3" />;
      default:
        return <CalendarIcon className="w-3 h-3" />;
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const todaysInterviews = getTodaysInterviews();

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg text-gray-900 mb-1">Interview Calendar</h3>
          <p className="text-sm text-gray-600">
            {interviews.length} interviews scheduled
          </p>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={previousMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h4 className="font-medium text-gray-900">
          {currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })}
        </h4>
        <Button variant="ghost" size="sm" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div
              key={index}
              className="text-center text-xs font-medium text-gray-500 p-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {getMonthDays().map((day, index) => {
            if (!day) {
              return <div key={index} className="p-2" />;
            }

            const dayInterviews = getInterviewsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = day.toDateString() === selectedDate.toDateString();

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative p-2 text-sm rounded-lg transition-all
                  ${isToday ? 'bg-[#ff6b35] text-white font-semibold' : ''}
                  ${isSelected && !isToday ? 'bg-orange-100 text-[#ff6b35] font-medium' : ''}
                  ${!isToday && !isSelected ? 'hover:bg-gray-100 text-gray-700' : ''}
                `}
              >
                <div className="flex flex-col items-center">
                  <span>{day.getDate()}</span>
                  {dayInterviews.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayInterviews.slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${
                            isToday ? 'bg-white' : 'bg-[#ff6b35]'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">
            {selectedDate.toDateString() === new Date().toDateString()
              ? "Today's Schedule"
              : selectedDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
          </h4>
          {todaysInterviews.length > 0 && (
            <Badge className="bg-[#ff6b35] text-white">
              {todaysInterviews.length}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          {todaysInterviews.length > 0 ? (
            todaysInterviews.map((interview) => (
              <div
                key={interview.id}
                className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[#ff6b35] text-white text-xs">
                      {interview.candidateAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {interview.candidateName}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      {getTypeIcon(interview.type)}
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(interview.date)}</span>
                      <span>•</span>
                      <span>{interview.duration}m</span>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(interview.status)} text-xs`}>
                    {interview.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No interviews scheduled</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200">
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <div className="text-sm font-semibold text-green-700">
            {interviews.filter((i) => i.status === 'confirmed').length}
          </div>
          <div className="text-xs text-green-600">Confirmed</div>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded-lg">
          <div className="text-sm font-semibold text-yellow-700">
            {interviews.filter((i) => i.status === 'pending').length}
          </div>
          <div className="text-xs text-yellow-600">Pending</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <div className="text-sm font-semibold text-blue-700">
            {interviews.filter((i) => i.type === 'video').length}
          </div>
          <div className="text-xs text-blue-600">Video</div>
        </div>
      </div>

      {/* Schedule Interview Button */}
      {onScheduleInterview && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button 
            onClick={onScheduleInterview}
            className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
            size="sm"
          >
            Schedule Interview
          </Button>
        </div>
      )}
    </Card>
  );
}