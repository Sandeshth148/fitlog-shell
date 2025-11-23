import { Injectable } from '@angular/core';

/**
 * BMI category ranges according to WHO standards
 */
export enum BmiCategory {
  UNDERWEIGHT = 'Underweight',
  NORMAL = 'Normal weight',
  OVERWEIGHT = 'Overweight',
  OBESE_CLASS_1 = 'Obesity class I',
  OBESE_CLASS_2 = 'Obesity class II',
  OBESE_CLASS_3 = 'Obesity class III'
}

/**
 * Service for BMI-related calculations
 */
@Injectable({
  providedIn: 'root'
})
export class BmiService {
  
  /**
   * Calculate BMI using weight in kg and height in cm
   * @param weightKg Weight in kilograms
   * @param heightCm Height in centimeters
   * @returns Calculated BMI value rounded to 1 decimal place
   */
  calculateBmi(weightKg: number, heightCm: number): number {
    if (!weightKg || !heightCm || heightCm <= 0) {
      return 0;
    }
    
    // Convert height from cm to meters
    const heightM = heightCm / 100;
    
    // Calculate BMI: weight (kg) / height² (m)
    const bmi = weightKg / (heightM * heightM);
    
    // Round to 1 decimal place
    return Math.round(bmi * 10) / 10;
  }
  
  /**
   * Get BMI category based on BMI value
   * @param bmi BMI value
   * @returns BMI category string
   */
  getBmiCategory(bmi: number): BmiCategory {
    if (bmi < 18.5) {
      return BmiCategory.UNDERWEIGHT;
    } else if (bmi < 25) {
      return BmiCategory.NORMAL;
    } else if (bmi < 30) {
      return BmiCategory.OVERWEIGHT;
    } else if (bmi < 35) {
      return BmiCategory.OBESE_CLASS_1;
    } else if (bmi < 40) {
      return BmiCategory.OBESE_CLASS_2;
    } else {
      return BmiCategory.OBESE_CLASS_3;
    }
  }
  
  /**
   * Get color code for BMI category
   * @param bmi BMI value
   * @returns CSS color class name
   */
  getBmiColorClass(bmi: number): string {
    const category = this.getBmiCategory(bmi);
    
    switch (category) {
      case BmiCategory.UNDERWEIGHT:
        return 'bmi-underweight';
      case BmiCategory.NORMAL:
        return 'bmi-normal';
      case BmiCategory.OVERWEIGHT:
        return 'bmi-overweight';
      case BmiCategory.OBESE_CLASS_1:
      case BmiCategory.OBESE_CLASS_2:
      case BmiCategory.OBESE_CLASS_3:
        return 'bmi-obese';
      default:
        return '';
    }
  }
  
  /**
   * Calculate ideal weight range based on height (normal BMI range: 18.5-24.9)
   * @param heightCm Height in centimeters
   * @returns Object with min and max ideal weight in kg
   */
  getIdealWeightRange(heightCm: number): { min: number, max: number } {
    if (!heightCm || heightCm <= 0) {
      return { min: 0, max: 0 };
    }
    
    const heightM = heightCm / 100;
    const minWeight = 18.5 * (heightM * heightM);
    const maxWeight = 24.9 * (heightM * heightM);
    
    return {
      min: Math.round(minWeight * 10) / 10,
      max: Math.round(maxWeight * 10) / 10
    };
  }
}
