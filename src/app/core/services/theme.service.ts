import { Injectable, signal, computed, effect } from '@angular/core';

/**
 * Theme types supported by the application
 */
export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

/**
 * Enhanced theme service with system preference support
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'fitlog-theme';
  private readonly darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  private readonly _currentTheme = signal<ThemeMode>('system');
  private readonly _systemTheme = signal<ResolvedTheme>(
    this.darkModeMediaQuery.matches ? 'dark' : 'light'
  );
  
  private readonly _resolvedTheme = computed<ResolvedTheme>(() => {
    const current = this._currentTheme();
    return current === 'system' ? this._systemTheme() : current;
  });
  
  readonly currentTheme = this._currentTheme;
  readonly systemTheme = this._systemTheme;
  readonly resolvedTheme = this._resolvedTheme;
  
  constructor() {
    this.initializeTheme();
    this.setupSystemThemeListener();
    this.setupThemeEffect();
  }
  
  private initializeTheme(): void {
    try {
      const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY) as ThemeMode;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        this._currentTheme.set(savedTheme);
      } else {
        this._currentTheme.set('system');
      }
    } catch (error) {
      this._currentTheme.set('system');
    }
  }
  
  private setupSystemThemeListener(): void {
    this._systemTheme.set(this.darkModeMediaQuery.matches ? 'dark' : 'light');
    
    this.darkModeMediaQuery.addEventListener('change', (event) => {
      const newSystemTheme: ResolvedTheme = event.matches ? 'dark' : 'light';
      this._systemTheme.set(newSystemTheme);
    });
  }
  
  private setupThemeEffect(): void {
    effect(() => {
      const resolvedTheme = this._resolvedTheme();
      this.applyThemeToDOM(resolvedTheme);
    });
  }
  
  setTheme(theme: ThemeMode): void {
    this._currentTheme.set(theme);
    try {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme to storage:', error);
    }
  }
  
  toggleTheme(): void {
    const current = this._currentTheme();
    const resolved = this._resolvedTheme();
    const newTheme: ResolvedTheme = resolved === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  cycleTheme(): void {
    const current = this._currentTheme();
    const themeOrder: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(current);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex];
    this.setTheme(nextTheme);
  }
  
  getTheme(): ThemeMode {
    return this._currentTheme();
  }
  
  getResolvedTheme(): ResolvedTheme {
    return this._resolvedTheme();
  }
  
  isSystemTheme(): boolean {
    return this._currentTheme() === 'system';
  }
  
  getThemeDisplayName(theme: ThemeMode): string {
    const displayNames: Record<ThemeMode, string> = {
      light: 'Light',
      dark: 'Dark', 
      system: 'System'
    };
    return displayNames[theme];
  }
  
  getThemeIcon(theme: ThemeMode): string {
    const icons: Record<ThemeMode, string> = {
      light: '☀️',
      dark: '🌙',
      system: '💻'
    };
    return icons[theme];
  }
  
  private applyThemeToDOM(theme: ResolvedTheme): void {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--current-theme', theme);
    this.updateMetaThemeColor(theme);
  }
  
  private updateMetaThemeColor(theme: ResolvedTheme): void {
    const themeColors = {
      light: '#3b82f6',
      dark: '#1f2937'
    };
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.setAttribute('content', themeColors[theme]);
  }
}
