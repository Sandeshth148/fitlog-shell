import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Floating Action Button (FAB) component for mobile-friendly actions
 */
@Component({
  selector: 'app-fab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="fab" 
      [class.fab-primary]="color === 'primary'"
      [class.fab-secondary]="color === 'secondary'"
      [class.fab-danger]="color === 'danger'"
      [class.fab-large]="size === 'large'"
      [class.fab-small]="size === 'small'"
      [attr.aria-label]="ariaLabel"
      (click)="clicked.emit($event)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .fab {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: var(--color-primary);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 1000;
      font-size: 24px;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
      }
      
      &:active {
        transform: translateY(1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
    }
    
    .fab-primary {
      background-color: var(--color-primary);
    }
    
    .fab-secondary {
      background-color: var(--color-secondary, #6366f1);
    }
    
    .fab-danger {
      background-color: var(--color-danger, #ef4444);
    }
    
    .fab-large {
      width: 64px;
      height: 64px;
      font-size: 28px;
    }
    
    .fab-small {
      width: 48px;
      height: 48px;
      font-size: 20px;
    }
    
    @media (min-width: 1024px) {
      .fab {
        display: none; /* Hide on desktop */
      }
    }
  `]
})
export class FabComponent {
  @Input() color: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'small' | 'normal' | 'large' = 'normal';
  @Input() ariaLabel = 'Action button';
  
  @Output() clicked = new EventEmitter<MouseEvent>();
}
