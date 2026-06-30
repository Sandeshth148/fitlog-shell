import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      <div 
        *ngFor="let toast of toasts$ | async" 
        class="toast"
        [class.success]="toast.type === 'success'"
        [class.info]="toast.type === 'info'"
        [class.warning]="toast.type === 'warning'"
        [class.error]="toast.type === 'error'"
        role="alert"
        [attr.aria-label]="toast.message"
        tabindex="0"
      >
        <span class="toast-icon" *ngIf="toast.icon" aria-hidden="true">{{ toast.icon }}</span>
        <span class="toast-message">{{ toast.message }}</span>
        <button 
          class="toast-close" 
          (click)="close(toast.id)"
          aria-label="Close notification"
          type="button"
        >×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 14px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      animation: toastSlideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 300px;
      color: white;
      font-weight: 500;
      outline: none;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .toast:focus {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
    }

    @keyframes toastSlideIn {
      from {
        transform: translateX(120px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast.success {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%);
    }

    .toast.info {
      background: linear-gradient(135deg, rgba(79, 172, 254, 0.85) 0%, rgba(0, 242, 254, 0.85) 100%);
    }

    .toast.warning {
      background: linear-gradient(135deg, rgba(240, 147, 251, 0.85) 0%, rgba(245, 87, 108, 0.85) 100%);
    }

    .toast.error {
      background: linear-gradient(135deg, rgba(250, 112, 154, 0.85) 0%, rgba(254, 225, 64, 0.85) 100%);
    }

    .toast-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
      font-size: 15px;
    }

    .toast-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }

    .toast-close:hover {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .toast-container {
        top: 70px;
        right: 10px;
        left: 10px;
        max-width: none;
      }

      .toast {
        min-width: auto;
      }
    }
  `]
})
export class ToastComponent {
  toasts$;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts;
  }

  close(id: number): void {
    this.toastService.remove(id);
  }
}
