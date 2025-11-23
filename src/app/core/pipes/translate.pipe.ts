import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Make it impure so it updates when language changes
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription?: Subscription;
  private lastLanguage?: string;
  private lastValue?: string;
  private lastKey?: string;

  constructor(private translationService: TranslationService) {}

  transform(key: string, params?: { [key: string]: any }): string {
    const currentLanguage = this.translationService.getCurrentLanguageCode();
    
    // Only recalculate if key or language changed
    if (this.lastKey !== key || this.lastLanguage !== currentLanguage) {
      this.lastKey = key;
      this.lastLanguage = currentLanguage;
      
      let translation = this.translationService.translate(key);
      
      // Handle parameter substitution (e.g., {{year}})
      if (params) {
        Object.keys(params).forEach(param => {
          translation = translation.replace(`{{${param}}}`, params[param]);
        });
      }
      
      this.lastValue = translation;
    }
    
    return this.lastValue || key;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
