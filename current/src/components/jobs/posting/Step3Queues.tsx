import { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { QueueCard } from './QueueCard';
import {
  Target,
  Sparkles,
  Settings,
  Lightbulb,
  Brain,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { JobData } from '../../../api/jobPosts';
import { jobPostsApi } from '../../../api/jobPosts';
import { invokeMLServicesForJob, type MLSortPredictions } from '../../../api/jobMlServices';

interface Queue {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  members: number;
  avgSalary: string;
  matchScore?: number;
  description: string;
  topSkills: string[];
  hiringTrends: string;
  responseRate: string;
}

interface Step3QueuesProps {
  jobData: JobData;
  setJobData: React.Dispatch<React.SetStateAction<JobData>>;
  errors: Record<string, string>;
  availableQueues: Queue[];
  recommendedQueues: Queue[];
  isLoadingQueues: boolean;
  getQueueColor: (color: string) => string;
  onBackToBasicInfo: () => void;
  savedJobId: number | null;
}

export function Step3Queues({
  jobData,
  setJobData,
  errors,
  recommendedQueues,
  isLoadingQueues,
  getQueueColor,
  onBackToBasicInfo,
  savedJobId
}: Readonly<Step3QueuesProps>) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mlPredictions, setMlPredictions] = useState<MLSortPredictions | null>(null);
  const [predictedIndustry, setPredictedIndustry] = useState<string>('');
  const [predictedLevel, setPredictedLevel] = useState<string>('');
  const [manualIndustry, setManualIndustry] = useState<string>('');
  const [manualLevel, setManualLevel] = useState<string>('');
  const [predictionsFetched, setPredictionsFetched] = useState(false);

  // Invoke ML services when component mounts and job is saved
  useEffect(() => {
    const invokeMLServices = async () => {
      if (!savedJobId) return;

      setIsAnalyzing(true);
      try {
        // Invoke ML service to predict industry and level
        const result = await invokeMLServicesForJob(savedJobId, jobData);

        if (result.success && result.sortResult) {
          setMlPredictions(result.sortResult.predictions);
          console.log('ML services completed:', result);

          // Fetch the JobPost to get the saved predictions from the database
          const jobPostResponse = await jobPostsApi.getJobPostById(savedJobId);
          if (jobPostResponse.success && jobPostResponse.data) {
            const industry = jobPostResponse.data.predicted_industry || '';
            const level = jobPostResponse.data.predicted_level || '';
            setPredictedIndustry(industry);
            setPredictedLevel(level);
            setManualIndustry(industry);
            setManualLevel(level);
            setPredictionsFetched(true);
            console.log('Predictions fetched from database:', { industry, level });
          }
        } else {
          console.error('ML services failed:', result.error);
        }
      } catch (error) {
        console.error('Error invoking ML services:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    invokeMLServices();
  }, [savedJobId, jobData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleQueueToggle = (queueId: string) => {
    setJobData((prev) => ({
      ...prev,
      selectedQueues: prev.selectedQueues.includes(queueId)
        ? prev.selectedQueues.filter((id) => id !== queueId)
        : [...prev.selectedQueues, queueId]
    }));
  };


  // Early return with loading state if queues are being fetched
  if (isLoadingQueues) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-gray-900">Queue Targeting</h2>
            <p className="text-gray-600">Choose which job seeker queues to target with this posting</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-purple-600">Loading recommended queues...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Target className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-medium text-gray-900">Queue Targeting</h2>
          <p className="text-gray-600">Choose which job seeker queues to target with this posting</p>
        </div>
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-4 py-2 rounded-lg">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">AI Analyzing...</span>
          </div>
        )}
        {mlPredictions && !isAnalyzing && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">AI Analysis Complete</span>
          </div>
        )}

        {predictionsFetched && !isAnalyzing && (predictedIndustry || predictedLevel) && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Predictions Saved to Job Post</span>
          </div>
        )}
      </div>

      <Tabs
        value={jobData.targetingMode}
        onValueChange={(value: string) =>
          setJobData((prev) => ({ ...prev, targetingMode: value as 'recommended' | 'manual' }))
        }
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommended" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Recommended
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Manual Selection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-6">
          {predictionsFetched ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                AI predictions successfully saved! Predicted Industry: <span className="font-medium">{predictedIndustry}</span>, Level: <span className="font-medium">{predictedLevel}</span>. Found {recommendedQueues.length} highly relevant queues based on these predictions.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Our AI analyzed your job posting and found {recommendedQueues.length} highly relevant queues. These
                recommendations are based on job title, skills, department, and salary alignment.
              </AlertDescription>
            </Alert>
          )}

          {(predictedIndustry || predictedLevel) && (
            <Card className="p-4 bg-purple-50 border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">AI Predictions</h4>
              <div className="space-y-1 text-sm text-purple-700">
                {predictedIndustry && <div>Predicted Industry: <span className="font-medium">{predictedIndustry}</span></div>}
                {predictedLevel && <div>Predicted Level: <span className="font-medium">{predictedLevel}</span></div>}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedQueues.map((queue) => (
              <QueueCard
                key={queue.id}
                queue={queue}
                isSelected={jobData.selectedQueues.includes(queue.id)}
                onToggle={() => handleQueueToggle(queue.id)}
                getQueueColor={getQueueColor}
              />
            ))}
          </div>

          {recommendedQueues.length === 0 && (
            <Card className="p-8 text-center">
              <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Need More Information</h3>
              <p className="text-gray-600 mb-4">
                Our AI needs more details about the job to provide accurate queue recommendations. Please fill out the
                job title, department, and description in previous steps.
              </p>
              <Button variant="outline" onClick={onBackToBasicInfo}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back to Basic Info
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Adjust AI Predictions</h4>
            <p className="text-sm text-blue-700 mb-4">Fine-tune the industry and level predictions if needed:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manualIndustry" className="text-sm font-medium text-gray-900">Industry</Label>
                <select
                  id="manualIndustry"
                  value={manualIndustry}
                  onChange={(e) => setManualIndustry(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select industry...</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Business Development">Business Development</option>
                  <option value="Sales">Sales</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Education">Education</option>
                  <option value="Construction">Construction</option>
                  <option value="Arts">Arts</option>
                  <option value="Consultant">Consultant</option>
                </select>
              </div>

              <div>
                <Label htmlFor="manualLevel" className="text-sm font-medium text-gray-900">Job Level</Label>
                <select
                  id="manualLevel"
                  value={manualLevel}
                  onChange={(e) => setManualLevel(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select level...</option>
                  <option value="L1">L1 - Entry Level</option>
                  <option value="L2">L2 - Mid Level</option>
                  <option value="L3">L3 - Senior</option>
                  <option value="L4">L4 - Manager/Director</option>
                  <option value="L5">L5 - Executive</option>
                </select>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {errors.queues && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{errors.queues}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
