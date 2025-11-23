import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaInstallService } from '../../services/pwa-install.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="pwa-install-container" *ngIf="(canInstall$ | async) && !isInstalled && !isDismissed">
      <div class="install-banner">
        <div class="install-content">
          <div class="install-icon">📱</div>
          <div class="install-text">
            <h4>{{ 'pwa.installTitle' | translate }}</h4>
            <p>{{ 'pwa.installSubtitle' | translate }}</p>
          </div>
        </div>
        <div class="install-actions">
          <button class="install-btn" (click)="installApp()">
            {{ 'pwa.installButton' | translate }}
          </button>
          <button class="dismiss-btn" (click)="dismiss()">
            ✕
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pwa-install-container {
      position: fixed;
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
      z-index: 1000;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .install-banner {
      background: linear-gradient(135deg, var(--color-primary), #6366f1);
      color: white;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation: slideUp 0.3s ease-out;
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    .install-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .install-icon {
      font-size: 1.5rem;
    }
    
    .install-text h4 {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
    }
    
    .install-text p {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.9;
    }
    
    .install-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .install-btn {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .install-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .dismiss-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1rem;
      cursor: pointer;
      padding: 0.25rem;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }
    
    .dismiss-btn:hover {
      opacity: 1;
    }
    
    @media (max-width: 640px) {
      .pwa-install-container {
        left: 0.5rem;
        right: 0.5rem;
      }
      
      .install-banner {
        padding: 0.75rem;
      }
      
      .install-text h4 {
        font-size: 0.8rem;
      }
      
      .install-text p {
        font-size: 0.7rem;
      }
    }
  `]
})
export class PwaInstallComponent implements OnInit {
  canInstall$: Observable<boolean>;
  isInstalled = false;
  isDismissed = false;

  constructor(private pwaInstallService: PwaInstallService) {
    this.canInstall$ = this.pwaInstallService.canInstall;
  }

  ngOnInit() {
    this.isInstalled = this.pwaInstallService.isInstalled();
  }

  async installApp() {
    const installed = await this.pwaInstallService.installApp();
    if (installed) {
      console.log('App installed successfully');
    }
  }

  dismiss() {
    this.isDismissed = true;
  }
}
