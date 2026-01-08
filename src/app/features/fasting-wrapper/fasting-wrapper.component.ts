import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-fasting-wrapper',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="fasting-wrapper">
      <fitlog-fasting-tracker-element 
        *ngIf="loaded"
        [attr.user]="userName">
      </fitlog-fasting-tracker-element>
      
      <div *ngIf="!loaded && !error" class="loading">
        <div class="spinner"></div>
        <p>Loading Fasting Tracker...</p>
      </div>
      
      <div *ngIf="error" class="error">
        <h3>Connection Error</h3>
        <p>{{ error }}</p>
        <button (click)="retryLoad()">Retry</button>
      </div>
    </div>
  `,
  styles: [`
    .fasting-wrapper {
      padding: 1rem;
      min-height: 400px;
    }
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      color: #666;
    }
    .error {
      background: #fee2e2;
      color: #b91c1c;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
    }
    button {
      background: #ef4444;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }
  `]
})
export class FastingWrapperComponent implements OnInit {
  loaded = false;
  error = '';
  userName = '';

  constructor(
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadUserProfile();
    this.loadScript();
  }

  async loadUserProfile() {
    try {
      const profile = await this.storageService.getUserProfile();
      console.log('👤 FastingWrapper: Loaded profile:', profile);
      if (profile && profile.name) {
        this.userName = profile.name;
        console.log('👤 FastingWrapper: Set userName to:', this.userName);
        this.cdr.detectChanges(); // Force update to ensure attribute is set
      } else {
        console.warn('👤 FastingWrapper: No name found in profile');
      }
    } catch (e) {
      console.error('Error loading profile', e);
    }
  }

  retryLoad() {
    this.error = '';
    this.loaded = false;
    this.loadScript();
  }

  private loadScript() {
    // Remove old script and CSS if they exist
    const oldScript = document.getElementById('fasting-tracker-script');
    const oldCss = document.getElementById('fasting-tracker-css');
    if (oldScript) oldScript.remove();
    if (oldCss) oldCss.remove();

    const timestamp = new Date().getTime();
    const baseUrl = environment.production 
      ? environment.mfeUrls.fastingTracker 
      : 'http://localhost:4206';

    // Load CSS first
    const link = document.createElement('link');
    link.id = 'fasting-tracker-css';
    link.rel = 'stylesheet';
    link.href = `${baseUrl}/fasting-tracker.css?t=${timestamp}`;
    link.onload = () => {
      console.log('✅ CSS loaded successfully from:', link.href);
    };
    link.onerror = () => {
      console.error('❌ Failed to load CSS from:', link.href);
    };
    console.log('📝 Loading CSS from:', link.href);
    document.head.appendChild(link);

    // Then load JS
    const script = document.createElement('script');
    script.id = 'fasting-tracker-script';
    script.src = `${baseUrl}/fasting-tracker.js?t=${timestamp}`;
    script.type = 'module';
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      console.log('✅ React Fasting Tracker loaded at', new Date().toLocaleTimeString());
      this.loaded = true;
    };

    script.onerror = () => {
      console.error('❌ Failed to load React Fasting Tracker');
      this.error = 'Failed to load Fasting Tracker. Ensure server is running.';
    };

    document.body.appendChild(script);
  }
}
