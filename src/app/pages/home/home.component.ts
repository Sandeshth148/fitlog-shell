import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { UserService } from '../../core/services/user.service';
import { StorageService } from '../../core/services/storage.service';
import { BmiService } from '../../core/services/bmi.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  latestWeight = signal<number | null>(null);
  weightUnit = signal<string>('kg');
  bmi = signal<number | null>(null);
  bmiCategory = signal<string | null>(null);
  currentStreak = signal<number>(0);
  
  // Fasting MFE State
  isFasting = signal<boolean>(false);
  fastingRemainingTime = signal<string>('');
  fastingDuration = signal<number>(16);

  // Tasks MFE State
  totalTasks = signal<number>(0);
  completedTasks = signal<number>(0);

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private bmiService: BmiService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadWeightAndBmi();
    this.loadFastingState();
    this.loadTasksState();
  }

  private async loadWeightAndBmi(): Promise<void> {
    try {
      const profile = await this.userService.getUserProfile();
      this.weightUnit.set(profile?.preferredUnits?.height === 'ft' ? 'lbs' : 'kg');

      const entries = await this.storageService.getAllEntries();
      if (entries && entries.length > 0) {
        // Sort entries by date descending to find the latest
        const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latest = sorted[0];
        this.latestWeight.set(latest.weightKg);

        // Calculate BMI if height is set
        if (profile && profile.heightCm) {
          const calculatedBmi = this.bmiService.calculateBmi(latest.weightKg, profile.heightCm);
          this.bmi.set(calculatedBmi);
          this.bmiCategory.set(this.bmiService.getBmiCategory(calculatedBmi));
        }

        // Calculate streak
        const streakCount = this.calculateStreak(sorted);
        this.currentStreak.set(streakCount);
      }
    } catch (error) {
      console.error('Error loading weight data on dashboard:', error);
    }
  }

  private calculateStreak(entries: any[]): number {
    if (!entries || entries.length === 0) return 0;
    
    // Extract unique dates as YYYY-MM-DD
    const entryDates = new Set(entries.map(e => e.date.substring(0, 10)));
    
    let streak = 0;
    const today = new Date();
    
    // Check consecutive days backward from today
    let checkDate = new Date(today);
    const formatDate = (d: Date) => d.toISOString().substring(0, 10);
    
    if (!entryDates.has(formatDate(checkDate))) {
      checkDate.setDate(checkDate.getDate() - 1);
      if (!entryDates.has(formatDate(checkDate))) {
        return 0;
      }
    }
    
    while (entryDates.has(formatDate(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  }

  private loadFastingState(): void {
    try {
      const stateStr = localStorage.getItem('fitlog_fasting_state');
      if (stateStr) {
        const state = JSON.parse(stateStr);
        if (state) {
          this.isFasting.set(state.isFasting || false);
          this.fastingDuration.set(state.duration || 16);

          if (state.isFasting && state.startTime) {
            // Calculate remaining time
            const start = new Date(state.startTime).getTime();
            const durationMs = (state.duration || 16) * 60 * 60 * 1000;
            const now = Date.now();
            const elapsed = now - start;
            const remaining = durationMs - elapsed;

            if (remaining > 0) {
              const hours = Math.floor(remaining / (1000 * 60 * 60));
              const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
              this.fastingRemainingTime.set(`${hours}h ${minutes}m left`);
            } else {
              this.fastingRemainingTime.set('Completed! 🎉');
            }
          }
        }
      }
    } catch (e) {
      console.error('Error parsing fasting state:', e);
    }
  }

  private loadTasksState(): void {
    try {
      const tasksStr = localStorage.getItem('fitlog-tasks');
      if (tasksStr) {
        const tasks = JSON.parse(tasksStr);
        if (Array.isArray(tasks)) {
          this.totalTasks.set(tasks.length);
          this.completedTasks.set(tasks.filter(t => t.completed).length);
        }
      }
    } catch (e) {
      console.error('Error parsing tasks state:', e);
    }
  }
}
