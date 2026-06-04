import apiClient from './client';
import TestDataService from './testData';

export class DataSyncService {
  // Sync frontend with backend data
  static async syncWithBackend(): Promise<void> {
    try {
      
      // Get backend data
      const backendJobs = await apiClient.getJobs();
      const backendQueues = await apiClient.getQueues();
      await apiClient.getStats();
      
      // If backend is empty, initialize with test data
      if (backendJobs.length === 0 && backendQueues.length === 0) {
        await TestDataService.initializeTestData();
      }
      
    } catch (error) {
      
      // If sync fails, initialize local test data
      await TestDataService.initializeTestData();
    }
  }

  // Verify data consistency
  static async verifyDataConsistency(): Promise<boolean> {
    try {
      const backendJobs = await apiClient.getJobs();
      const backendQueues = await apiClient.getQueues();
      
      // Check if we have data
      const hasJobs = backendJobs.length > 0;
      const hasQueues = backendQueues.length > 0;
      
      
      return hasJobs || hasQueues;
    } catch (error) {
      return false;
    }
  }

  // Reset and reinitialize all data
  static async resetAndReinitialize(): Promise<void> {
    try {
      
      // Clear existing data
      await TestDataService.clearTestData();
      
      // Wait a bit for clearing to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reinitialize test data
      await TestDataService.initializeTestData();
      
    } catch (error) {
    }
  }

  // Get data status for debugging
  static async getDataStatus(): Promise<{
    jobsCount: number;
    queuesCount: number;
    hasData: boolean;
    isAuthenticated: boolean;
  }> {
    try {
      const jobs = await apiClient.getJobs();
      const queues = await apiClient.getQueues();
      const isAuthenticated = !!sessionStorage.getItem('access_token');
      
      return {
        jobsCount: jobs.length,
        queuesCount: queues.length,
        hasData: jobs.length > 0 || queues.length > 0,
        isAuthenticated
      };
    } catch (error) {
      return {
        jobsCount: 0,
        queuesCount: 0,
        hasData: false,
        isAuthenticated: false
      };
    }
  }
}

export default DataSyncService;
