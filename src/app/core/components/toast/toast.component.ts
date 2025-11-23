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
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      animation: slideIn 0.3s ease-out;
      min-width: 300px;
      color: white;
      font-weight: 500;
      outline: none;
    }

    .toast:focus {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast.success {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .toast.info {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .toast.warning {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .toast.error {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
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
