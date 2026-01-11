import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { TopbarComponent } from './core/components/topbar/topbar.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { ToastComponent } from './core/components/toast/toast.component';
import { LoadingComponent } from './core/components/loading/loading.component';
import { PwaInstallPromptComponent } from './core/components/pwa-install-prompt/pwa-install-prompt.component';
import { LoadingService } from './core/services/loading.service';
import { SidebarService } from './core/services/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarComponent, FooterComponent, ToastComponent, LoadingComponent, PwaInstallPromptComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fitlog-shell';
  sidebarCollapsed = false;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private sidebarService: SidebarService
  ) {
    // Show loading on route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Show skeleton for 1 second minimum for better UX
        setTimeout(() => this.loadingService.hide(), 1000);
      }
    });

    // Subscribe to sidebar state for dynamic margin
    this.sidebarService.isCollapsed$.subscribe(collapsed => {
      this.sidebarCollapsed = collapsed;
    });
  }
}
