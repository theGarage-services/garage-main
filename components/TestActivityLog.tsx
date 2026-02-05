import { useState } from 'react';
import { Activity, Download, Search, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { MOCK_ACTIVITY_LOG } from '../utils/testMockData';
import type { ActivityLogEntry } from '../types/team';

export function TestActivityLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | ActivityLogEntry['targetType']>('all');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Filter activities
  const filteredActivities = MOCK_ACTIVITY_LOG.filter(activity => {
    const matchesSearch = 
      activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.targetName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || activity.targetType === filterType;
    
    let matchesTime = true;
    if (timeRange !== 'all') {
      const now = new Date();
      const activityDate = new Date(activity.timestamp);
      const diffDays = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (timeRange === 'today' && diffDays > 0) matchesTime = false;
      if (timeRange === 'week' && diffDays > 7) matchesTime = false;
      if (timeRange === 'month' && diffDays > 30) matchesTime = false;
    }
    
    return matchesSearch && matchesType && matchesTime;
  });

  const getActivityIcon = (type: ActivityLogEntry['targetType']) => {
    const icons = {
      job: '💼',
      candidate: '👤',
      team: '👥',
      settings: '⚙️',
      department: '🏢',
    };
    return icons[type] || '📝';
  };

  const getActivityColor = (type: ActivityLogEntry['targetType']) => {
    const colors = {
      job: 'bg-blue-100 text-blue-700',
      candidate: 'bg-green-100 text-green-700',
      team: 'bg-purple-100 text-purple-700',
      settings: 'bg-gray-100 text-gray-700',
      department: 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const exportToCSV = () => {
    const csv = [
      ['Date', 'User', 'Action', 'Type', 'Target', 'Details'].join(','),
      ...filteredActivities.map(activity => [
        new Date(activity.timestamp).toISOString(),
        activity.userName,
        activity.action,
        activity.targetType,
        activity.targetName || '',
        activity.details || '',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl">Activity Log</h1>
              <p className="text-sm text-gray-600">
                Complete audit trail of all actions in your organization
              </p>
            </div>
          </div>
          
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
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
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="job">Jobs</SelectItem>
              <SelectItem value="candidate">Candidates</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="department">Departments</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
            </SelectContent>
          </Select>

          {/* Time Range */}
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
          <span>Showing {filteredActivities.length} of {MOCK_ACTIVITY_LOG.length} activities</span>
        </div>
      </Card>

      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.targetType)}`}>
                <span className="text-lg">{getActivityIcon(activity.targetType)}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.userName}</span>
                      {' '}
                      {activity.action.toLowerCase()}
                      {activity.targetName && (
                        <>
                          {' '}"<span className="font-medium">{activity.targetName}</span>"
                        </>
                      )}
                    </p>
                  </div>
                  
                  <Badge variant="outline" className="flex-shrink-0">
                    {activity.targetType}
                  </Badge>
                </div>

                {activity.details && (
                  <p className="text-sm text-gray-600 mb-2">{activity.details}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>

                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex gap-1">
                        {Object.entries(activity.metadata).slice(0, 2).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}: {String(value)}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <Card className="p-12 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No activities found</p>
          <p className="text-sm text-gray-500">
            Try adjusting your filters or search query
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              setTimeRange('all');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
