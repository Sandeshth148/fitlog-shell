import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <button 
      [type]="type" 
      [disabled]="disabled" 
      [class]="classes" 
      [attr.aria-label]="ariaLabel ? (ariaLabel | translate) : null"
      (click)="onClick($event)">
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() ariaLabel?: string;
  
  @Output() clicked = new EventEmitter<MouseEvent>();

  get classes(): string {
    return `btn btn-${this.variant} btn-${this.size} ${this.fullWidth ? 'btn-full-width' : ''}`;
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
