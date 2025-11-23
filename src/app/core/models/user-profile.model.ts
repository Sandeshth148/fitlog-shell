/**
 * Represents a user profile in the FitLog application
 */
export interface UserProfile {
  /** Unique identifier for the profile */
  id: string;
  
  /** User's display name */
  name?: string;
  
  /** User's age (optional) */
  age?: number;
  
  /** User's avatar image (base64 encoded) */
  avatar?: string;
  
  /** User's height in centimeters (canonical storage unit) */
  heightCm: number;
  
  /** User's preferred units for display */
  preferredUnits: {
    /** Preferred height unit ('cm', 'in', or 'ft') */
    height: 'cm' | 'in' | 'ft';
    
    /** Preferred weight unit ('kg' or 'lb') */
    weight: 'kg' | 'lb';
  };
  
  /** Timestamp when the profile was created */
  createdAt: string;
  
  /** Timestamp when the profile was last updated */
  updatedAt: string;
}

/**
 * Utility functions for UserProfile
 */
export class UserProfileUtils {
  /**
   * Converts centimeters to inches
   * @param cm Height in centimeters
   * @returns Height in inches
   */
  static cmToIn(cm: number): number {
    return cm / 2.54;
  }
  
  /**
   * Converts inches to centimeters
   * @param inches Height in inches
   * @returns Height in centimeters
   */
  static inToCm(inches: number): number {
    return inches * 2.54;
  }
  
  /**
   * Creates a new UserProfile with default values
   * @param partialProfile Partial profile data
   * @returns Complete UserProfile with generated id and timestamps
   */
  static createProfile(partialProfile: Partial<UserProfile> = {}): UserProfile {
    const now = new Date().toISOString();
    const id = partialProfile.id || (crypto.randomUUID ? crypto.randomUUID() : `profile-${Date.now()}`);
    
    return {
      id,
      name: partialProfile.name,
      age: partialProfile.age,
      avatar: partialProfile.avatar,
      heightCm: partialProfile.heightCm || 0,
      preferredUnits: {
        height: partialProfile.preferredUnits?.height || 'cm',
        weight: partialProfile.preferredUnits?.weight || 'kg'
      },
      createdAt: partialProfile.createdAt || now,
      updatedAt: now
    };
  }
}
