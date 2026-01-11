import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed" [class.mobile-open]="mobileMenuOpen">
      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <a routerLink="/" 
           routerLinkActive="active" 
           [routerLinkActiveOptions]="{exact: true}"
           (click)="closeMobileMenu()"
           class="nav-item"
           [attr.title]="isCollapsed ? ('nav.home' | translate) : null">
          <span class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </span>
          <span class="nav-text" *ngIf="!isCollapsed">{{ 'nav.home' | translate }}</span>
        </a>

        <a routerLink="/weight-tracker" 
           routerLinkActive="active"
           (click)="closeMobileMenu()"
           class="nav-item"
           [attr.title]="isCollapsed ? ('nav.weight' | translate) : null">
          <span class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </span>
          <span class="nav-text" *ngIf="!isCollapsed">{{ 'nav.weight' | translate }}</span>
        </a>

        <a routerLink="/trends" 
           routerLinkActive="active"
           (click)="closeMobileMenu()"
           class="nav-item"
           [attr.title]="isCollapsed ? ('nav.trends' | translate) : null">
          <span class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </span>
          <span class="nav-text" *ngIf="!isCollapsed">{{ 'nav.trends' | translate }}</span>
        </a>

        <a routerLink="/streaks" 
           routerLinkActive="active"
           (click)="closeMobileMenu()"
           class="nav-item"
           [attr.title]="isCollapsed ? 'Streaks' : null">
          <span class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </span>
          <span class="nav-text" *ngIf="!isCollapsed">{{ 'nav.streaks' | translate }}</span>
        </a>

        <a routerLink="/fasting" 
           routerLinkActive="active"
           (click)="closeMobileMenu()"
           class="nav-item"
           [attr.title]="isCollapsed ? 'Fasting' : null">
          <span class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </span>
          <span class="nav-text" *ngIf="!isCollapsed">Fasting</span>
        </a>

        <a routerLink="/tasks" 
           routerLinkActive="active"
           (click)="closeMobileMenu()"
           class="nav-item"
           [attr.title]="isCollapsed ? 'Tasks' : null">
          <span class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </span>
          <span class="nav-text" *ngIf="!isCollapsed">Tasks</span>
        </a>

        <a routerLink="/ai-insights" 
           routerLinkActive="active"
           (click)="closeMobileMenu()"
           class="nav-item"
           [attr.title]="isCollapsed ? 'AI Insights' : null">
          <span class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path>
              <circle cx="9" cy="14" r="1"></circle>
              <circle cx="15" cy="14" r="1"></circle>
            </svg>
          </span>
          <span class="nav-text" *ngIf="!isCollapsed">AI Insights</span>
        </a>
      </nav>

      <!-- Sidebar Footer - Toggle Button (Desktop only) -->
      <div class="sidebar-footer" *ngIf="!isMobile">
        <button class="toggle-btn" (click)="toggleCollapse()" [attr.title]="isCollapsed ? 'Expand' : 'Collapse'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline [attr.points]="isCollapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'"></polyline>
          </svg>
        </button>
      </div>
    </aside>

    <!-- Mobile Overlay -->
    <div class="sidebar-overlay" *ngIf="mobileMenuOpen" (click)="closeMobileMenu()"></div>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 60px; /* Below top bar */
      bottom: 0;
      width: 250px;
      background: var(--color-primary);
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease, transform 0.3s ease;
      z-index: 90;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .sidebar.collapsed {
      width: 70px;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      padding-top: 1rem; /* Minimal top padding */
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.25rem;
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      transition: all 0.2s ease;
      position: relative;
      white-space: nowrap;
    }

    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 0.875rem 0;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border-left: 3px solid white;
    }

    .sidebar.collapsed .nav-item.active {
      border-left: none;
      border-bottom: 3px solid white;
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
    }

    .nav-text {
      font-weight: 500;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Future item styling */
    .nav-item-future {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    .coming-soon {
      font-size: 0.7rem;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-weight: 600;
    }

    /* Sidebar Footer */
    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .toggle-btn {
      width: 100%;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      transition: background 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Mobile Overlay */
    .sidebar-overlay {
      display: none;
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 85;
    }

    /* Tablet & Mobile Responsive */
    @media (max-width: 1024px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }

      .sidebar-overlay {
        display: block;
      }

      .sidebar.collapsed {
        width: 250px; /* Full width on mobile */
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .sidebar {
        width: 80%;
        max-width: 280px;
      }
    }

    /* Scrollbar styling */
    .sidebar-nav::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `]
})
export class SidebarComponent {
  isCollapsed = false;
  mobileMenuOpen = false;
  isMobile = window.innerWidth <= 1024;

  constructor(private sidebarService: SidebarService) {
    // Subscribe to sidebar state
    this.sidebarService.isCollapsed$.subscribe(collapsed => {
      this.isCollapsed = collapsed;
    });

    this.sidebarService.isMobileOpen$.subscribe(open => {
      this.mobileMenuOpen = open;
    });
  }

  toggleCollapse(): void {
    this.sidebarService.toggleCollapse();
  }

  toggleMobileMenu(): void {
    this.sidebarService.toggleMobile();
  }

  closeMobileMenu(): void {
    this.sidebarService.closeMobile();
  }

  @HostListener('window:resize')
  onResize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 1024;
    
    // Close mobile menu on resize to desktop
    if (wasMobile && !this.isMobile && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}
