import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSwitcherComponent, ThemeSelectorComponent, UserProfileComponent],
  template: `
    <header class="topbar">
      <div class="topbar-container">
        <!-- Left: Menu Toggle (Mobile) + Logo -->
        <div class="topbar-left">
          <button class="menu-toggle" (click)="onMenuToggle()" aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <a routerLink="/" class="topbar-logo">
            <img src="/favicon.ico" alt="FitLog" class="logo-image">
            <span class="logo-text">FitLog</span>
          </a>
        </div>

        <!-- Right: Utilities -->
        <div class="topbar-right">
          <!-- Notifications - Disabled for now -->
          <!-- <button class="topbar-btn" (click)="onNotificationsClick()" aria-label="Notifications" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span class="notification-badge" *ngIf="notificationCount > 0">{{ notificationCount }}</span>
          </button> -->

          <!-- Language Switcher -->
          <app-language-switcher></app-language-switcher>

          <!-- Theme Selector -->
          <app-theme-selector></app-theme-selector>

          <!-- User Profile -->
          <app-user-profile></app-user-profile>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      position: fixed;
      top: 1rem;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: calc(100% - 2rem);
      max-width: 1200px;
      height: 68px;
      background: var(--color-menu-bg);
      color: var(--color-text-primary);
      border: 1px solid var(--color-menu-border);
      border-radius: 20px;
      z-index: 2000;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--menu-shadow);
    }

    .topbar-container {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1.5rem;
      max-width: 100%;
    }

    /* Left Section */
    .topbar-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .menu-toggle {
      display: none; /* Hidden on desktop */
      background: none;
      border: none;
      color: var(--color-text-primary);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 10px;
      transition: background 0.2s ease;
    }

    .menu-toggle:hover {
      background: rgba(var(--color-primary-rgb), 0.1);
    }

    .topbar-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-text-primary);
      text-decoration: none;
      transition: opacity 0.2s ease;
    }

    .topbar-logo:hover {
      opacity: 0.9;
    }

    .logo-image {
      width: 32px;
      height: 32px;
      object-fit: contain;
      border-radius: 6px;
    }

    .logo-text {
      display: none; /* Hidden on mobile, shown on desktop */
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Outfit', sans-serif;
      letter-spacing: -0.02em;
    }

    /* Right Section */
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .topbar-btn {
      position: relative;
      background: none;
      border: none;
      color: var(--color-text-primary);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 10px;
      transition: background 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .topbar-btn:hover {
      background: rgba(var(--color-primary-rgb), 0.1);
    }

    .notification-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background: #ef4444;
      color: white;
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.15rem 0.35rem;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
      line-height: 1;
    }

    /* Tablet & Mobile */
    @media (max-width: 1024px) {
      .menu-toggle {
        display: flex; /* Show on tablet/mobile if needed */
      }
    }

    /* Hide menu-toggle since we are using a bottom dock layout */
    .menu-toggle {
      display: none !important;
    }

    /* Desktop & Mobile */
    .logo-text {
      display: none;
    }

    @media (min-width: 640px) {
      .logo-text {
        display: inline;
      }
    }

    .topbar-right {
      gap: 0.5rem;
    }

    @media (min-width: 768px) {
      .topbar-right {
        gap: 0.75rem;
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .topbar {
        top: 0.5rem;
        width: calc(100% - 1rem);
        height: 60px;
        border-radius: 14px;
      }

      .topbar-container {
        padding: 0 0.5rem;
      }

      .topbar-logo {
        font-size: 1rem;
      }

      .logo-image {
        width: 28px;
        height: 28px;
      }

      .topbar-right {
        gap: 0.25rem;
      }
    }
  `]
})
export class TopbarComponent {
  constructor(private sidebarService: SidebarService) {}

  onMenuToggle(): void {
    this.sidebarService.toggleMobile();
  }
}
