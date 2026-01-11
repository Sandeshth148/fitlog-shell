import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-pwa-install-prompt',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="pwa-prompt" *ngIf="showPrompt" [@slideIn]>
      <div class="prompt-content">
        <div class="prompt-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>
        <div class="prompt-text">
          <h3>{{ 'pwa.install.title' | translate }}</h3>
          <p>{{ 'pwa.install.description' | translate }}</p>
        </div>
        <div class="prompt-actions">
          <button class="btn-install" (click)="installPWA()">
            {{ 'pwa.install.button' | translate }}
          </button>
          <button class="btn-dismiss" (click)="dismissPrompt()">
            {{ 'pwa.install.dismiss' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pwa-prompt {
      position: fixed;
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .prompt-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .prompt-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: var(--color-primary);
      border-radius: 12px;
      color: white;
      flex-shrink: 0;
    }

    .prompt-text {
      flex: 1;
      min-width: 0;
    }

    .prompt-text h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text);
    }

    .prompt-text p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    .prompt-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .btn-install,
    .btn-dismiss {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-install {
      background: var(--color-primary);
      color: white;
    }

    .btn-install:hover {
      background: var(--color-primary-dark);
    }

    .btn-dismiss {
      background: transparent;
      color: var(--color-text-secondary);
    }

    .btn-dismiss:hover {
      background: var(--color-bg-offset);
    }

    @media (max-width: 640px) {
      .pwa-prompt {
        left: 0.5rem;
        right: 0.5rem;
        bottom: 0.5rem;
      }

      .prompt-content {
        flex-wrap: wrap;
        padding: 0.875rem;
      }

      .prompt-text {
        flex-basis: 100%;
        order: 2;
      }

      .prompt-actions {
        flex-basis: 100%;
        order: 3;
        margin-top: 0.5rem;
      }

      .btn-install,
      .btn-dismiss {
        flex: 1;
      }
    }
  `]
})
export class PwaInstallPromptComponent implements OnInit {
  showPrompt = false;
  private deferredPrompt: any;

  ngOnInit(): void {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      
      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      const dismissedDate = dismissed ? new Date(dismissed) : null;
      const daysSinceDismissed = dismissedDate 
        ? (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
        : 999;

      // Show prompt if not dismissed or dismissed more than 7 days ago
      if (!dismissed || daysSinceDismissed > 7) {
        // Show prompt after 3 seconds
        setTimeout(() => {
          this.showPrompt = true;
        }, 3000);
      }
    });

    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
      this.showPrompt = false;
      localStorage.removeItem('pwa-prompt-dismissed');
    });
  }

  async installPWA(): Promise<void> {
    if (!this.deferredPrompt) {
      return;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    this.deferredPrompt = null;
    this.showPrompt = false;
  }

  dismissPrompt(): void {
    this.showPrompt = false;
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
  }
}
