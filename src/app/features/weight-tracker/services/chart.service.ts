import { Injectable } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { WeightEntry } from '../models/weight-entry.model';
import { BmiService } from '../../../core/services/bmi.service';
import { UserService } from '../../../core/services/user.service';

/**
 * Service for processing data for charts
 */
@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor(
    private storageService: StorageService,
    private bmiService: BmiService,
    private userService: UserService
  ) {}
  
  /**
   * Get processed data for weight trend chart
   * @param timeRange Number of days to include (default: 365 days)
   */
  async getWeightChartData(timeRange: number = 365): Promise<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  }> {
    // Get all entries
    const entries = await this.storageService.getAllEntries();
    
    // Filter entries by date range (today to X days ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const filteredEntries = entries.filter(entry => 
      entry.date >= cutoffDateStr
    );
    
    // Sort by date
    const sortedEntries = [...filteredEntries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Format data for chart
    return {
      labels: sortedEntries.map(entry => entry.date),
      datasets: [
        {
          label: 'Weight (kg)',
          data: sortedEntries.map(entry => entry.weightKg),
          borderColor: 'rgba(79, 70, 229, 1)',
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          fill: true
        }
      ]
    };
  }
  
  /**
   * Get processed data for BMI chart
   */
  async getBmiChartData(timeRange: number = 365): Promise<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  }> {
    // Get user height
    const profile = await this.userService.getUserProfile();
    const heightCm = profile?.heightCm || 0;
    
    if (!heightCm) {
      return { labels: [], datasets: [] };
    }
    
    // Get all entries
    const entries = await this.storageService.getAllEntries();
    
    // Filter entries by date range (today to X days ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const filteredEntries = entries.filter(entry => 
      entry.date >= cutoffDateStr
    );
    
    // Sort by date
    const sortedEntries = [...filteredEntries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate BMI for each entry if not already present
    const entriesWithBmi = sortedEntries.map(entry => ({
      ...entry,
      bmi: entry.bmi || this.bmiService.calculateBmi(entry.weightKg, heightCm)
    }));
    
    // Format data for chart
    return {
      labels: entriesWithBmi.map(entry => entry.date),
      datasets: [
        {
          label: 'BMI',
          data: entriesWithBmi.map(entry => entry.bmi || 0),
          borderColor: 'rgba(79, 70, 229, 1)',
          backgroundColor: 'transparent',
          fill: false
        }
      ]
    };
  }
  
  /**
   * Get entries within a specific date range
   * @param days Number of days to include
   */
  async getEntriesForLastDays(days: number): Promise<WeightEntry[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const entries = await this.storageService.getAllEntries();
    
    return entries
      .filter(entry => entry.date >= cutoffDateStr)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}
