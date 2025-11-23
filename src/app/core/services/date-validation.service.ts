import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Service for date validation and restrictions
 */
@Injectable({
  providedIn: 'root'
})
export class DateValidationService {
  
  /** Maximum years in the past allowed for date entries */
  private readonly MAX_YEARS_PAST = 5;
  
  constructor() {}
  
  /**
   * Check if a date is within the allowed range (5 years ago to today)
   * @param dateStr Date string in YYYY-MM-DD format
   * @returns Boolean indicating if date is in allowed range
   */
  isDateInAllowedRange(dateStr: string): boolean {
    if (!dateStr) return false;
    
    const inputDate = new Date(dateStr);
    
    // Check if valid date
    if (isNaN(inputDate.getTime())) return false;
    
    // Calculate minimum date (5 years ago)
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - this.MAX_YEARS_PAST);
    minDate.setHours(0, 0, 0, 0); // Start of day
    
    // Get maximum date (today)
    const maxDate = new Date();
    maxDate.setHours(23, 59, 59, 999); // End of today
    
    // Check if date is within range
    return inputDate >= minDate && inputDate <= maxDate;
  }
  
  /**
   * Get the minimum allowed date string (YYYY-MM-DD)
   * @returns Minimum date string
   */
  getMinDateString(): string {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - this.MAX_YEARS_PAST);
    return minDate.toISOString().split('T')[0];
  }
  
  /**
   * Get the maximum allowed date string (YYYY-MM-DD)
   * @returns Maximum date string (today)
   */
  getMaxDateString(): string {
    return new Date().toISOString().split('T')[0];
  }
  
  /**
   * Custom validator for reactive forms to check date range
   * @returns ValidatorFn for date range validation
   */
  dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Empty values are handled by required validator
      }
      
      if (!this.isDateInAllowedRange(control.value)) {
        return { dateRange: true };
      }
      
      return null;
    };
  }
  
  /**
   * Format a date string for display
   * @param dateStr Date string in YYYY-MM-DD format
   * @returns Formatted date string
   */
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
