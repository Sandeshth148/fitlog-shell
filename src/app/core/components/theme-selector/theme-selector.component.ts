import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, ThemeMode } from '../../services/theme.service';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';

/**
 * Theme selector component using reusable dropdown
 * 
 * Provides clean interface for switching between:
 * - Light theme
 * - Dark theme  
 * - System preference
 */
@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  template: `
    <app-dropdown
      [options]="themeOptions"
      [selectedValue]="themeService.currentTheme()"
      [ariaLabel]="'Select theme'"
      (selectionChanged)="onThemeChange($event)">
    </app-dropdown>
  `
})
export class ThemeSelectorComponent {
  
  /**
   * Theme options for dropdown
   */
  readonly themeOptions: DropdownOption[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' }
  ];
  
  constructor(public themeService: ThemeService) {}
  
  /**
   * Handles theme selection change
   */
  onThemeChange(theme: string): void {
    this.themeService.setTheme(theme as ThemeMode);
  }
}
