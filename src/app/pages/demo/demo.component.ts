import { Component, ViewChild, ViewContainerRef, ComponentRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MicroFrontendService } from '../../micro-frontend.service';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent {
  loading = signal(false);
  mfeLoaded = signal(false);
  error = signal<string | null>(null);

  @ViewChild('mfeContainer', { read: ViewContainerRef, static: false }) mfeContainer!: ViewContainerRef;
  private componentRef: ComponentRef<any> | null = null;

  constructor(private microfrontendService: MicroFrontendService) {}

  async loadMFE() {
    this.loading.set(true);
    this.error.set(null);

    try {
      if (!this.mfeContainer) {
        throw new Error('MFE container not ready');
      }

      const module = await this.microfrontendService.loadRemoteComponent(4202, 'fitlog-weight-tracker');
      this.mfeContainer.clear();
      this.componentRef = this.mfeContainer.createComponent(module.AppComponent);
      this.componentRef.changeDetectorRef.detectChanges();
      
      this.mfeLoaded.set(true);
      console.log('✅ MFE loaded successfully from fitlog-weight-tracker');
    } catch (err: any) {
      console.error('❌ Failed to load MFE:', err);
      this.error.set('Failed to load MFE. Is fitlog-weight-tracker running on port 4202?');
    } finally {
      this.loading.set(false);
    }
  }
}
