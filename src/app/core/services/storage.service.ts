import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { WeightEntry, WeightEntryUtils } from '../../features/weight-tracker/models/weight-entry.model';
import { BmiService } from './bmi.service';
import { DateValidationService } from './date-validation.service';
import { UserProfile } from '../models/user-profile.model';

const DB_NAME = 'fitlog-db';
const DB_VERSION = 3; // Increased version for user profile store
const WEIGHT_STORE = 'weight-entries';
const USER_STORE = 'user-profile';

interface FitLogDb extends DBSchema {
  [WEIGHT_STORE]: {
    key: string;
    value: WeightEntry;
    indexes: { 
      'createdAt': string;
      'date': string;
    };
  };
  [USER_STORE]: {
    key: string;
    value: UserProfile;
  };
}

/**
 * Service for persisting weight entries to IndexedDB.
 * Uses the 'idb' library for a more convenient API.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbPromise: Promise<IDBPDatabase<FitLogDb>>;

  constructor(
    private bmiService: BmiService,
    private dateValidationService: DateValidationService
  ) {
    this.dbPromise = this.initDb();
  }

  private initDb(): Promise<IDBPDatabase<FitLogDb>> {
    return openDB<FitLogDb>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        console.log(`Upgrading IndexedDB from version ${oldVersion} to ${newVersion}`);
        
        // Create weight entries store if it doesn't exist
        if (!db.objectStoreNames.contains(WEIGHT_STORE)) {
          console.log('Creating object store:', WEIGHT_STORE);
          const store = db.createObjectStore(WEIGHT_STORE, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt');
          store.createIndex('date', 'date');
        }
        
        // Create user profile store if it doesn't exist
        if (!db.objectStoreNames.contains(USER_STORE)) {
          console.log('Creating object store:', USER_STORE);
          db.createObjectStore(USER_STORE, { keyPath: 'id' });
        }
        
        console.log('Database upgrade complete');
      },
    });
  }

  /**
   * Saves or updates a user profile in the database
   * @param profile The UserProfile to save
   * @returns A promise that resolves with the saved profile's id
   */
  async saveUserProfile(profile: UserProfile): Promise<string> {
    try {
      console.log('StorageService: Saving user profile', JSON.stringify(profile));
      
      const db = await this.dbPromise;
      const result = await db.put(USER_STORE, profile);
      console.log('StorageService: User profile saved successfully', result);
      return result;
    } catch (error) {
      console.error('StorageService: Error saving user profile', error);
      throw error;
    }
  }
  
  /**
   * Retrieves the user profile from the database
   * @returns A promise that resolves with the UserProfile or undefined if not found
   */
  async getUserProfile(): Promise<UserProfile | undefined> {
    try {
      console.log('StorageService: Getting user profile from IndexedDB...');
      const db = await this.dbPromise;
      const allProfiles = await db.getAll(USER_STORE);
      
      console.log(`StorageService: Found ${allProfiles.length} profiles in IndexedDB`);
      if (allProfiles.length > 0) {
        console.log('StorageService: Retrieved profile:', allProfiles[0]);
        return allProfiles[0];
      } else {
        console.log('StorageService: No profiles found in IndexedDB');
        return undefined;
      }
    } catch (error) {
      console.error('StorageService: Error getting user profile', error);
      return undefined;
    }
  }
  
  /**
   * Adds or updates a weight entry in the database.
   * @param entry The WeightEntry to save.
   * @returns A promise that resolves with the saved entry's id.
   */
  async addEntry(entry: WeightEntry): Promise<string> {
    try {
      console.log('StorageService: Adding entry', JSON.stringify(entry));
      
      // Validate date range
      if (entry.date && !this.dateValidationService.isDateInAllowedRange(entry.date)) {
        throw new Error('Date is outside the allowed range (5 years ago to today)');
      }
      
      // Ensure the entry has a valid ID
      if (!entry.id) {
        console.error('StorageService: Entry is missing an ID');
        entry.id = crypto.randomUUID ? crypto.randomUUID() : `entry-${Date.now()}`;
        console.log('StorageService: Generated new ID', entry.id);
      }
      
      // Add updatedAt timestamp
      const updatedEntry = {
        ...entry,
        updatedAt: new Date().toISOString()
      };
      
      const db = await this.dbPromise;
      const result = await db.put(WEIGHT_STORE, updatedEntry);
      console.log('StorageService: Entry saved successfully', result);
      return result;
    } catch (error) {
      console.error('StorageService: Error saving entry', error);
      console.error('StorageService: Problem entry data:', JSON.stringify(entry));
      throw error;
    }
  }

  /**
   * Retrieves all weight entries, sorted by creation date descending.
   * @returns A promise that resolves with an array of all WeightEntry objects.
   */
  async getAllEntries(): Promise<WeightEntry[]> {
    try {
      console.log('StorageService: Getting all entries');
      const db = await this.dbPromise;
      const entries = await db.getAll(WEIGHT_STORE);
      console.log(`StorageService: Retrieved ${entries.length} entries`);
      return entries;
    } catch (error) {
      console.error('StorageService: Error getting entries', error);
      return [];
    }
  }

  /**
   * Retrieves a single weight entry by its ID.
   * @param id The ID of the entry to retrieve.
   * @returns A promise that resolves with the WeightEntry or undefined if not found.
   */
  async getEntryById(id: string): Promise<WeightEntry | undefined> {
    const db = await this.dbPromise;
    return db.get(WEIGHT_STORE, id);
  }

  /**
   * Deletes a weight entry by its ID.
   * @param id The ID of the entry to delete.
   * @returns A promise that resolves when the entry is deleted.
   */
  async deleteEntry(id: string): Promise<void> {
    const db = await this.dbPromise;
    return db.delete(WEIGHT_STORE, id);
  }

  /**
   * Clears all entries from the store.
   * @returns A promise that resolves when the store is cleared.
   */
  async clearAll(): Promise<void> {
    const db = await this.dbPromise;
    return db.clear(WEIGHT_STORE);
  }
  
  /**
   * Clears the user profile from the database
   * @returns A promise that resolves when the profile is cleared
   */
  async clearUserProfile(): Promise<void> {
    const db = await this.dbPromise;
    return db.clear(USER_STORE);
  }
  
  /**
   * Checks if a user profile exists in the database
   * @returns A promise that resolves to true if a profile exists, false otherwise
   */
  async hasUserProfile(): Promise<boolean> {
    try {
      const db = await this.dbPromise;
      const count = await db.count(USER_STORE);
      console.log(`StorageService: Profile count in IndexedDB: ${count}`);
      return count > 0;
    } catch (error) {
      console.error('StorageService: Error checking for user profile', error);
      return false;
    }
  }
  
  /**
   * Adds a weight entry with BMI calculation
   * @param entry Partial weight entry
   * @param heightCm User's height in centimeters (optional, will be fetched from profile if not provided)
   * @returns Promise resolving to the saved entry
   */
  async addEntryWithBmi(entry: Partial<WeightEntry>, heightCm?: number): Promise<WeightEntry> {
    try {
      // Get user height from parameter or fetch from profile
      if (heightCm === undefined) {
        const profile = await this.getUserProfile();
        heightCm = profile?.heightCm || 0;
      }
      
      // Calculate BMI if height is available
      let bmi: number | undefined;
      if (heightCm > 0 && entry.weightKg) {
        bmi = this.bmiService.calculateBmi(entry.weightKg, heightCm);
        console.log(`StorageService: Calculated BMI ${bmi} for weight ${entry.weightKg}kg and height ${heightCm}cm`);
      }
      
      // Create complete entry with BMI
      const completeEntry = WeightEntryUtils.createEntry({
        ...entry,
        bmi
      });
      
      // Save to storage
      await this.addEntry(completeEntry);
      return completeEntry;
    } catch (error) {
      console.error('StorageService: Error adding entry with BMI', error);
      throw error;
    }
  }
  
  /**
   * Updates an existing entry
   * @param entry Entry to update
   * @returns Promise resolving to the updated entry ID
   */
  async updateEntry(entry: WeightEntry): Promise<string> {
    return this.addEntry(entry);
  }
  
  /**
   * Recalculates BMI for all entries when height changes
   * @param heightCm New height in centimeters
   * @returns Promise resolving when all entries are updated
   */
  async recalculateAllBmi(heightCm: number): Promise<void> {
    if (!heightCm || heightCm <= 0) return;
    
    try {
      console.log(`StorageService: Recalculating BMI for all entries with height ${heightCm}cm`);
      const entries = await this.getAllEntries();
      
      for (const entry of entries) {
        if (entry.weightKg) {
          entry.bmi = this.bmiService.calculateBmi(entry.weightKg, heightCm);
          entry.updatedAt = new Date().toISOString();
          await this.updateEntry(entry);
        }
      }
      
      console.log(`StorageService: Recalculated BMI for ${entries.length} entries`);
    } catch (error) {
      console.error('StorageService: Error recalculating BMI', error);
      throw error;
    }
  }
  
  /**
   * Gets entries within a specific date range
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   * @returns Promise resolving to filtered entries
   */
  async getEntriesInDateRange(startDate: string, endDate: string): Promise<WeightEntry[]> {
    try {
      const allEntries = await this.getAllEntries();
      
      return allEntries.filter(entry => {
        return entry.date >= startDate && entry.date <= endDate;
      });
    } catch (error) {
      console.error('StorageService: Error getting entries in date range', error);
      return [];
    }
  }
}
