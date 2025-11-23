import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Language } from '../../services/translation.service';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';

/**
 * Language switcher using reusable dropdown component
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  template: `
    <app-dropdown
      [options]="languageOptions"
      [selectedValue]="currentLanguageCode"
      [ariaLabel]="'Select language'"
      (selectionChanged)="onLanguageChange($event)">
    </app-dropdown>
  `
})
export class LanguageSwitcherComponent implements OnInit {
  currentLanguageCode: string = 'en';
  languageOptions: DropdownOption[] = [];

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    // Convert Language[] to DropdownOption[]
    this.languageOptions = this.translationService.supportedLanguages.map(lang => ({
      value: lang.code,
      label: lang.name,
      icon: lang.flag
    }));

    // Set current language
    this.currentLanguageCode = this.translationService.getCurrentLanguageCode();
    
    // Subscribe to language changes
    this.translationService.currentLanguage.subscribe(lang => {
      this.currentLanguageCode = lang;
    });
  }

  /**
   * Handles language selection change
   */
  onLanguageChange(languageCode: string): void {
    console.log('🌐 Language selected:', languageCode);
    this.translationService.setLanguage(languageCode);
  }
}
