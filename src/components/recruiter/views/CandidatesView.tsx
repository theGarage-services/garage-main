/**
 * Candidates View Component
 */
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { UpdateJobStatusModal } from '../../jobs/UpdateJobStatusModal';
import {
  ArrowLeft,
  Brain,
  Users,
  User,
  Zap,
  Loader2,
  CheckCircle,
  MessageCircle,
  Calendar,
  ExternalLink,
  FileText
} from 'lucide-react';
import type { QueueCandidateLocal, CandidateTab, CandidatesData } from '../types';
import { getStatusColor } from '../utils';

interface CandidatesViewProps {
  selectedJob: any;
  candidatesData: CandidatesData;
  queueCandidates: QueueCandidateLocal[];
  aiRecommendedCandidates: QueueCandidateLocal[];
  isLoadingCandidates: boolean;
  candidateTab: CandidateTab;
  setCandidateTab: (tab: CandidateTab) => void;
  handleBackToList: () => void;
  handleViewProfile: (candidate: any) => void;
  handleSendMessage: (candidate: any) => void;
  handleSendConsiderationRequest: (candidate: any) => Promise<void>;
  handleAcceptConsiderationRequest: (candidate: any) => Promise<void>;
  handleScheduleInterview: (candidate: any) => void;
  showJobStatusUpdate: boolean;
  jobStatusUpdateTarget: any;
  setShowJobStatusUpdate: (show: boolean) => void;
  setJobStatusUpdateTarget: (target: null) => void;
  handleJobStatusUpdate: (status: any) => Promise<void>;
}

// Candidate card component for queue candidates
const CandidateQueueCard = ({ candidate, onViewProfile, onSendMessage, onSendConsideration, onAcceptConsideration, onScheduleInterview }: any) => {
  const getStatusBadgeClass = () => {
    switch (candidate.applicationStatus) {
      case 'consideration-accepted': return 'bg-green-100 text-green-800';
      case 'consideration-sent': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (candidate.applicationStatus) {
      case 'consideration-sent': return 'Request Sent';
      case 'consideration-accepted': return 'Request Accepted';
      default: return 'Available';
    }
  };

  const renderActionButtons = () => {
    switch (candidate.applicationStatus) {
      case 'consideration-accepted':
        return (
          <>
            <Button variant="outline" size="sm" onClick={() => onSendMessage(candidate)}>
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </Button>
            <Button variant="outline" size="sm" onClick={() => onScheduleInterview(candidate)}>
              <Calendar className="w-4 h-4 mr-1" />
              Schedule Interview
            </Button>
          </>
        );
      case 'consideration-sent':
        return (
          <Button variant="outline" size="sm" onClick={() => onAcceptConsideration(candidate)}>
            <CheckCircle className="w-4 h-4 mr-1" />
            Mark as Accepted (Demo)
          </Button>
        );
      default:
        return (
          <Button size="sm" onClick={() => onSendConsideration(candidate)}>
            Send Consideration
          </Button>
        );
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback>{candidate.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl text-gray-900">{candidate.name}</h3>
              <Badge className="bg-green-100 text-green-800">#{candidate.queuePosition} in Queue</Badge>
              {candidate.isAIRecommended && (
                <Badge className="bg-blue-100 text-blue-800">{candidate.matchScore}% Match</Badge>
              )}
            </div>
            <p className="text-gray-600 mb-2">{candidate.title} at {candidate.currentCompany}</p>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill: string) => (
                <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
        <Badge className={getStatusBadgeClass()}>
          {getStatusLabel()}
        </Badge>
      </div>

      {candidate.aiRecommendation && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-900">AI Recommendation</span>
          </div>
          <p className="text-sm text-gray-700">{candidate.aiRecommendation.reason}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Last activity: {new Date(candidate.lastActivity).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onViewProfile(candidate)}>
            <ExternalLink className="w-4 h-4 mr-1" />
            View Profile
          </Button>
          {renderActionButtons()}
        </div>
      </div>
    </Card>
  );
};

export const CandidatesView = ({
  selectedJob,
  candidatesData,
  queueCandidates,
  aiRecommendedCandidates,
  isLoadingCandidates,
  candidateTab,
  setCandidateTab,
  handleBackToList,
  handleViewProfile,
  handleSendMessage,
  handleSendConsiderationRequest,
  handleAcceptConsiderationRequest,
  handleScheduleInterview,
  showJobStatusUpdate,
  jobStatusUpdateTarget,
  setShowJobStatusUpdate,
  setJobStatusUpdateTarget,
  handleJobStatusUpdate
}: CandidatesViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="mb-4 text-gray-900 hover:text-[#ff6b35] hover:border-[#ff6b35] border-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Job List</span>
          </Button>
          <h1 className="text-3xl text-gray-900 mb-2">{selectedJob.title}</h1>
          <p className="text-gray-600 mb-3">Candidates for this position</p>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="text-[#ff6b35] border-[#ff6b35]">
              Queue: {selectedJob.queue}
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              {queueCandidates.length} total candidates
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-300">
              {aiRecommendedCandidates.length} AI recommended
            </Badge>
            <Badge variant="outline" className="text-yellow-600 border-yellow-300">
              {queueCandidates.filter(c => c.applicationStatus === 'consideration-sent').length} requests sent
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-300">
              {queueCandidates.filter(c => c.applicationStatus === 'consideration-accepted').length} requests accepted
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              {candidatesData['manually-applied'].length} direct applications
            </Badge>
          </div>
        </div>
        <Badge className={getStatusColor(selectedJob.status)}>
          {selectedJob.status}
        </Badge>
      </div>

      <Tabs value={candidateTab} onValueChange={(value: any) => setCandidateTab(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
          <TabsTrigger value="ai-recommended" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Recommended Candidates ({candidatesData['ai-recommended'].length})
          </TabsTrigger>
          <TabsTrigger value="all-queue" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            All Candidates ({candidatesData['all-queue'].length})
          </TabsTrigger>
          <TabsTrigger value="manually-applied" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Manually Applied Candidates ({candidatesData['manually-applied'].length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-recommended">
          <div className="space-y-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg text-blue-900">AI-Powered Candidate Recommendations</h3>
              </div>
              <p className="text-blue-700 text-sm">
                Our AI has analyzed your job requirements and identified the top candidates from the queue who best match your criteria.
              </p>
            </Card>

            {isLoadingCandidates && (
              <Card className="p-12 text-center">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
                <h3 className="text-lg text-gray-900 mb-2">Loading candidates...</h3>
              </Card>
            )}

            {!isLoadingCandidates && candidatesData['ai-recommended'].map((candidate) => (
              <CandidateQueueCard
                key={candidate.id}
                candidate={candidate}
                onViewProfile={handleViewProfile}
                onSendMessage={handleSendMessage}
                onSendConsideration={handleSendConsiderationRequest}
                onAcceptConsideration={handleAcceptConsiderationRequest}
                onScheduleInterview={handleScheduleInterview}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all-queue">
          <div className="space-y-4">
            {isLoadingCandidates && (
              <Card className="p-12 text-center">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
                <h3 className="text-lg text-gray-900 mb-2">Loading candidates...</h3>
              </Card>
            )}

            {!isLoadingCandidates && candidatesData['all-queue'].map((candidate) => (
              <CandidateQueueCard
                key={candidate.id}
                candidate={candidate}
                onViewProfile={handleViewProfile}
                onSendMessage={handleSendMessage}
                onSendConsideration={handleSendConsiderationRequest}
                onAcceptConsideration={handleAcceptConsiderationRequest}
                onScheduleInterview={handleScheduleInterview}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manually-applied">
          <div className="space-y-4">
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg text-orange-900">Direct Applications</h3>
              </div>
              <p className="text-orange-700 text-sm">
                Candidates who have directly applied to this position through the platform.
              </p>
            </Card>

            {candidatesData['manually-applied'].map((candidate: any) => (
              <Card key={candidate.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{candidate.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl text-gray-900 mb-1">{candidate.name}</h3>
                      <p className="text-gray-600 mb-2">{candidate.title} at {candidate.currentCompany}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(candidate.applicationStatus)}>
                    {candidate.applicationStatus}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewProfile(candidate)}>
                    <FileText className="w-4 h-4 mr-1" />
                    View Application
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
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
};

export default CandidatesView;
