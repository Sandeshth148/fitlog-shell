import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  icon?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  private toastId = 0;

  toasts = this.toasts$.asObservable();

  /**
   * Show a success toast (green)
   */
  success(message: string, icon?: string, duration = 3000): void {
    this.show(message, 'success', icon, duration);
  }

  /**
   * Show an info toast (blue)
   */
  info(message: string, icon?: string, duration = 3000): void {
    this.show(message, 'info', icon, duration);
  }

  /**
   * Show a warning toast (yellow)
   */
  warning(message: string, icon?: string, duration = 3000): void {
    this.show(message, 'warning', icon, duration);
  }

  /**
   * Show an error toast (red)
   */
  error(message: string, icon?: string, duration = 3000): void {
    this.show(message, 'error', icon, duration);
  }

  /**
   * Show a streak toast (special styling)
   */
  streak(currentStreak: number, isNewRecord = false, justEarned = false): void {
    const icon = currentStreak >= 7 ? '🔥' : '⭐';
    let message: string;
    
    if (justEarned) {
      message = `🎉 Streak extended! ${currentStreak} days!`;
    } else if (isNewRecord) {
      message = `🎉 New record! ${currentStreak} day streak!`;
    } else {
      message = `${icon} ${currentStreak} day streak!`;
    }
    
    this.show(message, 'success', icon, 4000);
  }

  /**
   * Show a badge earned toast
   */
  badgeEarned(badgeName: string, icon: string): void {
    this.show(`🏆 Badge Earned: ${badgeName}!`, 'success', icon, 5000);
  }

  /**
   * Internal show method
   */
  private show(message: string, type: Toast['type'], icon?: string, duration = 3000): void {
    const toast: Toast = {
      id: ++this.toastId,
      message,
      type,
      icon,
      duration
    };

    const currentToasts = this.toasts$.value;
    this.toasts$.next([...currentToasts, toast]);

    // Auto-remove after duration
    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  /**
   * Remove a toast by ID
   */
  remove(id: number): void {
    const currentToasts = this.toasts$.value;
    this.toasts$.next(currentToasts.filter(t => t.id !== id));
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this.toasts$.next([]);
  }
}
