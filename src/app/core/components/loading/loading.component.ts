import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="loadingService.loading$ | async">
      <div class="skeleton-container">
        <div class="skeleton-header"></div>
        <div class="skeleton-content">
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.05);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(0.1px);
    }

    .skeleton-container {
      padding: 1rem;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }

    .skeleton-header {
      height: 60px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .skeleton-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .skeleton-card {
      height: 120px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 12px;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (min-width: 768px) {
      .skeleton-content {
        flex-direction: row;
      }
      .skeleton-card {
        flex: 1;
      }
    }
  `]
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
