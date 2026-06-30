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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="4"/>
              <circle cx="12" cy="12" r="5"/>
              <path d="m12 12 2-2"/>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="10" y1="2" x2="14" y2="2"/>
              <line x1="12" y1="14" x2="15" y2="11"/>
              <circle cx="12" cy="14" r="8"/>
            </svg>
          </span>
          <span class="nav-text" *ngIf="!isCollapsed">Fasting</span>
        </a>

        <a routerLink="/tasks" 
           routerLinkActive="active"
           (click)="closeMobileMenu()"
           class="nav-item"
           [attr.title]="isCollapsed ? ('nav.tasks' | translate) : null">
          <span class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <path d="M9 9h6"/>
              <path d="M9 13h6"/>
              <path d="M9 17h6"/>
            </svg>
          </span>
          <span class="nav-text" *ngIf="!isCollapsed">{{ 'nav.tasks' | translate }}</span>
        </a>

        <a routerLink="/ai-insights" 
           routerLinkActive="active"
           (click)="closeMobileMenu()"
           class="nav-item"
           [attr.title]="isCollapsed ? 'AI Insights' : null">
          <span class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
              <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z"/>
              <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/>
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
      right: 0;
      margin: 0 auto;
      bottom: 1.5rem;
      top: auto;
      width: max-content;
      max-width: 90vw;
      height: 64px;
      background: var(--color-menu-bg);
      color: var(--color-text-primary);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      border: 1px solid var(--color-menu-border);
      border-radius: 99px;
      box-shadow: var(--menu-shadow);
      padding: 0 0.75rem;
    }

    /* Navigation */
    .sidebar-nav {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.25rem;
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      padding: 0.35rem 0.875rem;
      height: 48px;
      min-width: 48px;
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      border-radius: 99px;
    }

    .nav-item:hover {
      background: rgba(var(--color-primary-rgb), 0.08);
      color: var(--color-text-primary);
      transform: translateY(-4px);
    }

    .nav-item.active {
      background: rgba(var(--color-primary-rgb), 0.15);
      color: var(--color-primary);
    }

    /* Active Glow Dot under active nav-item */
    .nav-item.active::after {
      content: '';
      position: absolute;
      bottom: 4px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--color-primary);
      box-shadow: 0 0 8px var(--color-primary);
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }

    .nav-item:hover .nav-icon {
      transform: scale(1.15);
    }

    .nav-text {
      font-weight: 700;
      font-size: 0.75rem;
      display: none; /* Hide label on desktop bottom bar to save space, rely on hover tooltip */
    }

    /* Hide unused traditional widgets */
    .sidebar-footer,
    .sidebar-overlay {
      display: none !important;
    }

    /* Tablet & Mobile Responsive */
    @media (max-width: 1024px) {
      .sidebar {
        transform: translateX(-50%);
        bottom: 1rem;
        left: 50%;
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .sidebar {
        bottom: 0.75rem;
        height: 58px;
        padding: 0 0.5rem;
        max-width: 95vw;
      }
      
      .nav-item {
        padding: 0.25rem 0.5rem;
        min-width: 40px;
        height: 44px;
      }
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
