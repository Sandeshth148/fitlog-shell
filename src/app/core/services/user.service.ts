import { Injectable } from '@angular/core';
import { UserProfile, UserProfileUtils } from '../models/user-profile.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

/**
 * Service for managing user profile data
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  
  /** Observable for user profile changes */
  userProfile$ = this.userProfileSubject.asObservable();
  
  constructor(private storageService: StorageService) {
    // Load profile from storage on initialization
    this.loadProfileFromStorage();
  }
  
  /**
   * Load user profile from storage (IndexedDB or localStorage)
   */
  private async loadProfileFromStorage(): Promise<void> {
    console.log('👤 UserService: Loading profile from storage...');
    try {
      // Check if we have a profile in IndexedDB
      const hasProfileInIndexedDB = await this.storageService.hasUserProfile();
      
      if (hasProfileInIndexedDB) {
        // Load from IndexedDB
        console.log('👤 UserService: Profile exists in IndexedDB, loading...');
        const profile = await this.storageService.getUserProfile();
        console.log('👤 UserService: Retrieved profile from IndexedDB:', profile);
        if (profile) {
          this.userProfileSubject.next(profile);
        }
      } else {
        // Try to load from localStorage (for migration)
        console.log('👤 UserService: No profile in IndexedDB, checking localStorage...');
        const profileJson = localStorage.getItem('fitlog-user-profile');
        
        if (profileJson) {
          console.log('👤 UserService: Found profile in localStorage, migrating to IndexedDB...');
          try {
            const profile = JSON.parse(profileJson) as UserProfile;
            console.log('👤 UserService: Parsed profile from localStorage:', profile);
            
            // Save to IndexedDB
            await this.storageService.saveUserProfile(profile);
            console.log('👤 UserService: Profile migrated to IndexedDB');
            
            // Update subject
            this.userProfileSubject.next(profile);
          } catch (parseError) {
            console.error('👤 UserService: Error parsing profile from localStorage:', parseError);
          }
        } else {
          console.log('👤 UserService: No profile found in any storage');
        }
      }
    } catch (error) {
      console.error('👤 UserService: Error loading user profile:', error);
    }
  }
  
  /**
   * Get the current user profile
   * @returns Promise resolving to the user profile or null if not set
   */
  async getUserProfile(): Promise<UserProfile | null> {
    // If we already have a profile in memory, return it
    if (this.userProfileSubject.value) {
      return this.userProfileSubject.value;
    }
    
    // Otherwise, try to load it from IndexedDB
    try {
      const profile = await this.storageService.getUserProfile();
      if (profile) {
        // Update the subject with the profile from storage
        this.userProfileSubject.next(profile);
        return profile;
      }
    } catch (error) {
      console.error('👤 UserService: Error getting user profile from storage:', error);
    }
    
    return null;
  }
  
  /**
   * Save or update user profile
   * @param profile Partial profile data to save
   * @returns Promise resolving to the updated profile
   */
  async saveUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      console.log('👤 UserService: Saving user profile:', profile);
      const currentProfile = this.userProfileSubject.value;
      
      // Create new profile or update existing one
      const updatedProfile = UserProfileUtils.createProfile({
        ...currentProfile,
        ...profile,
        updatedAt: new Date().toISOString()
      });
      
      // Save to IndexedDB (primary storage)
      await this.storageService.saveUserProfile(updatedProfile);
      console.log('👤 UserService: Profile saved to IndexedDB');
      
      // Also save to localStorage for backward compatibility
      try {
        localStorage.setItem('fitlog-user-profile', JSON.stringify(updatedProfile));
        console.log('👤 UserService: Profile also saved to localStorage');
      } catch (localStorageError) {
        console.warn('👤 UserService: Could not save to localStorage:', localStorageError);
        // This is non-critical, so we don't throw
      }
      
      // Update subject
      this.userProfileSubject.next(updatedProfile);
      console.log('👤 UserService: Profile subject updated');
      
      return updatedProfile;
    } catch (error) {
      console.error('👤 UserService: Error saving user profile:', error);
      throw new Error('Failed to save user profile');
    }
  }
  
  /**
   * Update user height
   * @param heightCm Height in centimeters
   * @param preferredUnit Preferred height unit ('cm', 'in', or 'ft')
   * @returns Promise resolving to the updated profile
   */
  async updateUserHeight(heightCm: number, preferredUnit: 'cm' | 'in' | 'ft'): Promise<UserProfile> {
    return this.saveUserProfile({
      heightCm,
      preferredUnits: {
        ...(this.userProfileSubject.value?.preferredUnits || { weight: 'kg' }),
        height: preferredUnit
      }
    });
  }
  
  /**
   * Check if user has completed initial setup (has height set)
   * @returns Promise resolving to boolean indicating if profile is complete
   */
  async isProfileComplete(): Promise<boolean> {
    console.log('👤 UserService: Checking if profile is complete...');
    const profile = await this.getUserProfile();
    console.log('👤 UserService: Current profile:', profile);
    const isComplete = !!profile && profile.heightCm > 0;
    console.log('👤 UserService: Profile complete?', isComplete);
    return isComplete;
  }
  
  /**
   * Update user name
   * @param name User's display name
   * @returns Promise resolving to the updated profile
   */
  async updateUserName(name: string): Promise<UserProfile> {
    return this.saveUserProfile({ name });
  }
  
  /**
   * Update user avatar
   * @param avatar Base64 encoded avatar image
   * @returns Promise resolving to the updated profile
   */
  async updateUserAvatar(avatar: string): Promise<UserProfile> {
    return this.saveUserProfile({ avatar });
  }
  
  /**
   * Clear user profile data (for testing or reset)
   */
  async clearUserProfile(): Promise<void> {
    console.log('👤 UserService: Clearing user profile...');
    
    // Clear from IndexedDB
    await this.storageService.clearUserProfile();
    console.log('👤 UserService: Profile cleared from IndexedDB');
    
    // Clear from localStorage
    try {
      localStorage.removeItem('fitlog-user-profile');
      console.log('👤 UserService: Profile cleared from localStorage');
    } catch (localStorageError) {
      console.warn('👤 UserService: Could not clear from localStorage:', localStorageError);
    }
    
    // Update subject
    this.userProfileSubject.next(null);
    console.log('👤 UserService: Profile subject reset');
  }
}
