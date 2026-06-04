import apiClient from './client';

// Queue represents a job queue based on (Industry, Job_Level) bucket
export interface Queue {
  id: string;
  title: string;
  description: string;
  industry: string;
  level: string;
  current: number;
  total: number;
  trend: 'up' | 'down' | 'stable';
  match: number;
  change: number;
  isAuto: boolean;
  userSelected: boolean;
  category: string;
  icon?: any;
  color?: string;
  // UI-specific fields for enhanced display
  estimatedRank?: number;
  totalInQueue?: number;
  avgSalary?: string;
  demandLevel?: 'High' | 'Medium' | 'Low';
  growthRate?: string;
  topCompanies?: string[];
  requiredSkills?: string[];
  timeToHire?: string;
  // Upgrade preview data (used for live profile upgrade simulation)
  upgradedCurrent?: number;
  upgradedMatch?: number;
  upgradedChange?: number;
  // Reason for queue suggestion
  reason?: string;
}

export interface BucketPrediction {
  industry: string;
  industry_probability: number;
  predicted_level: string;
  level_probability: number;
  isSelected: boolean;
}



export interface QueueCandidate {
  id: string;
  rank: number;
  name: string;
  score: number;
  change: number;
  location: string;
  avatar: string;
  trending: 'up' | 'down' | 'stable';
  isUser?: boolean;
  // Optional fields for enhanced display
  title?: string;
  company?: string;
  experience?: string;
  skills?: string[];
  strengths?: string[];
  certifications?: string[];
}



class QueueService {
  /**
   * Get my bucket (industry/level) prediction from candidate sort service
   * A "bucket" is the (Industry, Job_Level) classification that determines your queue
   */
  async getMyBucketPrediction(): Promise<{
    predicted_industry: string;
    predicted_level: string;
    industry_predictions: BucketPrediction[];
    total_experience_years: number;
  } | null> {
    try {
      console.log('[QueueService] Calling /candidates/candidate-sort/my-profile/');
      const response = await apiClient.request('/candidates/candidate-sort/my-profile/', {
        method: 'GET',
      });
      
      if (!response.ok) {
        console.error(`[QueueService] API returned status ${response.status}`);
        return null;
      }
      
      // Parse the JSON response
      const data = await response.json();
      
      if (!data) {
        console.warn('[QueueService] API returned null data');
        return null;
      }

      // Check if we have prediction data from saved CandidateSortPrediction
      const detailedResults = data.detailed_results;
      
      if (!detailedResults?.industry_predictions || detailedResults.industry_predictions.length === 0) {
        console.warn('[QueueService] No industry_predictions in detailed_results, cannot proceed');
        console.log('[QueueService] Falling back - checking if profile has industry/level set');
        
        // If no predictions, we can still return the profile's current industry/level
        if (data.predicted_industry && data.predicted_level) {
          console.log('[QueueService] Using profile industry/level as fallback');
          return {
            predicted_industry: data.predicted_industry,
            predicted_level: data.predicted_level,
            industry_predictions: [{
              industry: data.predicted_industry,
              industry_probability: 1,
              predicted_level: data.predicted_level,
              level_probability: 1,
              isSelected: true
            }],
            total_experience_years: data.total_experience_years || 0
          };
        }
        
        console.error('[QueueService] No predictions and no profile industry/level');
        return null;
      }

      // Map level predictions by industry for quick lookup
      const levelPredictionsByIndustry = new Map();
      if (detailedResults.level_predictions_by_industry) {
        detailedResults.level_predictions_by_industry.forEach((lp: any) => {
          levelPredictionsByIndustry.set(lp.industry, lp);
        });
        console.log('[QueueService] Mapped level predictions for', levelPredictionsByIndustry.size, 'industries');
      }

      // Transform backend response to BucketPrediction format
      const predictions: BucketPrediction[] = detailedResults.industry_predictions.map(
        (p: any) => {
          const levelPred = levelPredictionsByIndustry.get(p.industry);
          const predictedLevel = levelPred?.predicted_level || data.predicted_level || 'L3';
          const levelProbability = levelPred?.level_predictions?.[0]?.probability || 0.7;

          return {
            industry: p.industry,
            industry_probability: p.probability,
            predicted_level: predictedLevel,
            level_probability: levelProbability,
            isSelected: p.industry === data.predicted_industry
          };
        }
      ) || [];

      const result = {
        predicted_industry: data.predicted_industry,
        predicted_level: data.predicted_level,
        industry_predictions: predictions,
        total_experience_years: data.total_experience_years || 0
      };
      return result;
    } catch (error) {
      console.error('[QueueService] Failed to fetch bucket prediction:', error);
      return null;
    }
  }

  /**
   * Get ranked candidates for a bucket (industry/level group)
   * Uses candidate-rank service to rank profiles in the same bucket
   */
  async getBucketLeaderboard(industry: string, level: string): Promise<QueueCandidate[]> {
    try {
      const response = await apiClient.request('/candidates/candidate-rank/rank-profiles/', {
        method: 'POST',
        body: JSON.stringify({
          job_industry: industry,
          job_level: level,
          top_k: 50
        }),
      });
      const result = (response as any)?.result;
      if (!result?.candidates) return [];

      // Transform to QueueCandidate format
      return result.candidates.map((c: any, index: number) => ({
        id: c.profile_id?.toString() || `c-${index}`,
        rank: index + 1,
        name: c.candidate_info?.full_name || 'Candidate',
        score: Math.round(c.score * 100),
        change: 0,
        location: 'Unknown',
        avatar: '',
        trending: 'stable'
      }));
    } catch (error) {
      console.error('Failed to fetch bucket leaderboard:', error);
      return [];
    }
  }

  /**
   * Get all available buckets (industry/level groups)
   * These are the available (Industry, Job_Level) combinations
   */
  async getAvailableBuckets(): Promise<Array<{
    industry: string;
    level: string;
    candidate_count: number;
  }>> {
    try {
      const response = await apiClient.request('/candidates/candidate-rank/groups/', {
        method: 'GET',
      });
      return (response as any)?.data?.groups || [];
    } catch (error) {
      console.error('Failed to fetch available buckets:', error);
      return [];
    }
  }

  /**
   * Update bucket (industry/level) for premium user
   * Uses candidate-sort update endpoint to change the user's bucket
   */
  async updateBucket(profileId: number, newIndustry: string, newLevel: string): Promise<boolean> {
    try {
      await apiClient.request(`/candidates/candidate-sort/profile/${profileId}/update/`, {
        method: 'POST',
        body: JSON.stringify({
          industry: newIndustry,
          exp_level: newLevel,
          apply_predictions: true
        }),
      });
      return true;
    } catch (error) {
      console.error('Failed to update bucket:', error);
      return false;
    }
  }

  /**
   * Re-run prediction on my profile (for bucket refresh)
   */
  async refreshMyBucketPrediction(): Promise<boolean> {
    try {
      await apiClient.request('/candidates/candidate-sort/predict-my-profile/', {
        method: 'POST',
      });
      return true;
    } catch (error) {
      console.error('Failed to refresh bucket prediction:', error);
      return false;
    }
  }

  /**
   * Alias for getAvailableBuckets - used by QueueSelector.tsx
   * Returns available queues (buckets) for selection
   */
  async getAvailableQueues(): Promise<Array<{
    industry: string;
    level: string;
    candidate_count: number;
  }>> {
    return this.getAvailableBuckets();
  }
}

export const queueService = new QueueService();
