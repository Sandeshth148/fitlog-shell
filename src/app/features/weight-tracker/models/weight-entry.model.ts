/**
 * Represents a weight entry in the FitLog application
 */
export interface WeightEntry {
  /** Unique identifier for the entry */
  id: string;
  
  /** Date of the weight measurement in ISO format (YYYY-MM-DD) */
  date: string;
  
  /** Weight in kilograms (canonical storage unit) */
  weightKg: number;
  
  /** Body Mass Index (calculated from weight and user's height) */
  bmi?: number;
  
  /** Optional time of the measurement (HH:MM) */
  time?: string;
  
  /** Optional notes about the entry */
  notes?: string;
  
  /** Display unit preference (defaults to kg) */
  units?: 'kg' | 'lb';
  
  /** Timestamp when the entry was created */
  createdAt: string;
  
  /** Timestamp when the entry was last updated */
  updatedAt?: string;
}

/**
 * Utility functions for WeightEntry
 */
export class WeightEntryUtils {
  /**
   * Converts pounds to kilograms
   * @param pounds Weight in pounds
   * @returns Weight in kilograms
   */
  static lbToKg(pounds: number): number {
    return pounds * 0.45359237;
  }
  
  /**
   * Converts kilograms to pounds
   * @param kg Weight in kilograms
   * @returns Weight in pounds
   */
  static kgToLb(kg: number): number {
    return kg / 0.45359237;
  }
  
  /**
   * Generates a new WeightEntry with default values
   * @param partialEntry Partial entry data
   * @returns Complete WeightEntry with generated id and timestamp
   */
  static createEntry(partialEntry: Partial<WeightEntry>): WeightEntry {
    const now = new Date();
    
    // Generate an ID only if one wasn't provided
    const entryId = partialEntry.id || (crypto.randomUUID ? crypto.randomUUID() : `entry-${Date.now()}`);
    
    // Create the entry with the correct order of properties
    // to ensure partialEntry doesn't override critical fields
    return {
      ...partialEntry,
      id: entryId,
      date: partialEntry.date || now.toISOString().split('T')[0],
      weightKg: partialEntry.weightKg || 0,
      createdAt: partialEntry.createdAt || now.toISOString()
    };
  }
  
  /**
   * Normalizes weight to kilograms based on the provided unit
   * @param weight Weight value
   * @param unit Unit ('kg' or 'lb')
   * @returns Weight in kilograms
   */
  static normalizeToKg(weight: number, unit: 'kg' | 'lb'): number {
    return unit === 'lb' ? this.lbToKg(weight) : weight;
  }
}
