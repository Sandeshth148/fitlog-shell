import { Component, Input, Output, EventEmitter, HostListener, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Dropdown option interface
 */
export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

/**
 * Reusable dropdown component for navigation controls
 * 
 * Features:
 * - Click outside to close
 * - Theme-aware styling
 * - Keyboard navigation support
 * - Clean, consistent design
 * 
 * @example
 * ```html
 * <app-dropdown 
 *   [options]="themeOptions"
 *   [selectedValue]="currentTheme"
 *   (selectionChanged)="onThemeChange($event)">
 * </app-dropdown>
 * ```
 */
@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown">
      <button 
        class="dropdown-trigger"
        (click)="toggleDropdown()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-label]="ariaLabel">
        
        @if (selectedOption()?.icon) {
          <span class="dropdown-icon">{{ selectedOption()?.icon }}</span>
        }
        
        <span class="dropdown-label">{{ selectedOption()?.label || placeholder }}</span>
        
        <svg class="dropdown-arrow" [class.open]="isOpen()" width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="1 1 5 5 9 1"></polyline>
        </svg>
      </button>
      
      @if (isOpen()) {
        <div class="dropdown-menu">
          @for (option of options; track option.value) {
            <button
              class="dropdown-option"
              [class.active]="option.value === selectedValue"
              (click)="selectOption(option)">
              
              @if (option.icon) {
                <span class="option-icon">{{ option.icon }}</span>
              }
              
              <span class="option-label">{{ option.label }}</span>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .dropdown {
      position: relative;
      display: inline-block;
    }
    
    .dropdown-trigger {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-card-bg, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--color-card-border, var(--glass-border));
      color: var(--color-text-primary);
      cursor: pointer;
      padding: 0.4rem 0.85rem;
      border-radius: 12px;
      transition: all 0.25s ease;
      font-size: 0.875rem;
      font-weight: 600;
      white-space: nowrap;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      
      &:hover {
        background: rgba(var(--color-primary-rgb), 0.1);
        border-color: rgba(var(--color-primary-rgb), 0.25);
      }
    }
    
    .dropdown-icon {
      font-size: 1rem;
    }
    
    .dropdown-label {
      font-weight: 600;
    }
    
    .dropdown-arrow {
      transition: transform 0.25s ease;
      opacity: 0.7;
      width: 10px;
      height: 6px;
    }
    
    .dropdown-arrow.open {
      transform: rotate(180deg);
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: var(--color-card-bg, var(--color-surface));
      backdrop-filter: blur(var(--glass-blur)) saturate(180%);
      -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
      border: 1px solid var(--color-card-border, var(--glass-border));
      border-radius: 14px;
      box-shadow: var(--glass-shadow);
      min-width: 150px;
      z-index: 1000;
      overflow: hidden;
      margin-top: 0.5rem;
      animation: dropdownFadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
 
    @keyframes dropdownFadeIn {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .dropdown-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.65rem 1rem;
      background: none;
      border: none;
      color: var(--color-text);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      text-align: left;
      font-weight: 500;
    }
    
    .dropdown-option:hover {
      background: rgba(var(--color-primary-rgb), 0.08);
      color: var(--color-text-primary);
    }
    
    .dropdown-option.active {
      background: var(--gradient-primary);
      color: white;
    }
    
    .option-icon {
      font-size: 1rem;
      width: 1.25rem;
      text-align: center;
    }
    
    .option-label {
      font-weight: 600;
    }
  `]
})
export class DropdownComponent {
  /**
   * Dropdown options to display
   */
  @Input() options: DropdownOption[] = [];
  
  /**
   * Currently selected value
   */
  @Input() selectedValue: string = '';
  
  /**
   * Placeholder text when no option selected
   */
  @Input() placeholder: string = 'Select...';
  
  /**
   * ARIA label for accessibility
   */
  @Input() ariaLabel: string = 'Select option';
  
  /**
   * Event emitted when selection changes
   */
  @Output() selectionChanged = new EventEmitter<string>();
  
  /**
   * Dropdown open state
   */
  private readonly _isOpen = signal(false);
  readonly isOpen = this._isOpen;
  
  /**
   * Currently selected option computed from selectedValue
   */
  readonly selectedOption = signal<DropdownOption | undefined>(undefined);
  
  constructor(private elementRef: ElementRef) {}
  
  ngOnInit() {
    this.updateSelectedOption();
  }
  
  ngOnChanges() {
    this.updateSelectedOption();
  }
  
  /**
   * Updates the selected option when selectedValue changes
   */
  private updateSelectedOption(): void {
    const option = this.options.find(opt => opt.value === this.selectedValue);
    this.selectedOption.set(option);
  }
  
  /**
   * Toggles dropdown open/closed state
   */
  toggleDropdown(): void {
    this._isOpen.set(!this._isOpen());
  }
  
  /**
   * Selects an option and closes dropdown
   */
  selectOption(option: DropdownOption): void {
    this.selectionChanged.emit(option.value);
    this._isOpen.set(false);
  }
  
  /**
   * Closes dropdown when clicking outside
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this._isOpen.set(false);
    }
  }
  
  /**
   * Keyboard navigation support
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this._isOpen.set(false);
    }
  }
}
