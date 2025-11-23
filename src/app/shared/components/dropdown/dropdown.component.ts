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
        
        <span class="dropdown-arrow" [class.open]="isOpen()">▼</span>
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
      align-items: baseline;
      gap: 0.5rem;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      transition: background-color 0.2s;
      font-size: 0.875rem;
      white-space: nowrap;
    }
    
    .dropdown-trigger:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .dropdown-icon {
      font-size: 1rem;
    }
    
    .dropdown-label {
      font-weight: 500;
    }
    
    .dropdown-arrow {
      font-size: 0.75rem;
      transition: transform 0.2s;
      opacity: 0.7;
    }
    
    .dropdown-arrow.open {
      transform: rotate(180deg);
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 140px;
      z-index: 1000;
      overflow: hidden;
      margin-top: 0.25rem;
    }
    
    .dropdown-option {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem;
      background: none;
      border: none;
      color: var(--color-text);
      cursor: pointer;
      transition: background-color 0.2s;
      font-size: 0.875rem;
      text-align: left;
    }
    
    .dropdown-option:hover {
      background-color: var(--color-bg-offset);
    }
    
    .dropdown-option.active {
      background-color: var(--color-primary);
      color: white;
    }
    
    .option-icon {
      font-size: 1rem;
      width: 1.25rem;
      text-align: center;
    }
    
    .option-label {
      font-weight: 500;
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
