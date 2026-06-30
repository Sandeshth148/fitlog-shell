import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { APP_VERSION } from '../../constants/version';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <footer class="app-footer">
      <div class="footer-container">
        <p class="copyright">
          {{ 'footer.copyright' | translate: {year: currentYear} }}
        </p>
        <p class="tagline">
          {{ 'footer.tagline' | translate }}
        </p>
        <p class="version">
          v{{ appVersion }}
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background: transparent;
      border-top: 1px solid var(--glass-border);
      padding: 2.5rem 1rem;
      margin-top: auto;
    }
    
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }
    
    .copyright {
      margin: 0 0 0.5rem 0;
      color: var(--color-text);
      font-size: 0.875rem;
      font-weight: 600;
    }
    
    .tagline {
      margin: 0 0 0.5rem 0;
      color: var(--color-text-secondary);
      font-size: 0.75rem;
      font-style: italic;
      opacity: 0.8;
    }
    
    .version {
      margin: 0;
      color: var(--color-text-muted);
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 0.05em;
    }
    
    @media (max-width: 640px) {
      .app-footer {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  appVersion = APP_VERSION;
}
