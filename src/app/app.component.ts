import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NavComponent } from './core/components/nav/nav.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { ToastComponent } from './core/components/toast/toast.component';
import { LoadingComponent } from './core/components/loading/loading.component';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, ToastComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fitlog-shell';

  constructor(
    private router: Router,
    private loadingService: LoadingService
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
        // Hide loading after a short delay to ensure smooth transition
        setTimeout(() => this.loadingService.hide(), 300);
      }
    });
  }
}
