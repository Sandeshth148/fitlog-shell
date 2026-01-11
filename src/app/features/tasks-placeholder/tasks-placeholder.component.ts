import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tasks-placeholder">
      <div class="placeholder-content">
        <div class="icon">✅</div>
        <h1>Task Tracker</h1>
        <p class="subtitle">Coming Soon - Currently in Development</p>
        
        <div class="features">
          <h3>Planned Features:</h3>
          <ul>
            <li>✓ Create and manage tasks</li>
            <li>✓ Set priorities (High, Medium, Low)</li>
            <li>✓ Add due dates and tags</li>
            <li>✓ Filter and sort tasks</li>
            <li>✓ Track completion status</li>
            <li>✓ View task statistics</li>
            <li>✓ Offline support with IndexedDB</li>
          </ul>
        </div>

        <div class="status">
          <p><strong>Status:</strong> Task Tracker MFE is 90% complete</p>
          <p><strong>Tech Stack:</strong> Angular 19 + NGRX + IndexedDB</p>
          <p><strong>Expected:</strong> Available in next update</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tasks-placeholder {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 600px;
      padding: 2rem;
    }

    .placeholder-content {
      max-width: 600px;
      text-align: center;
    }

    .icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      color: var(--color-text-primary, #1f2937);
    }

    .subtitle {
      font-size: 1.25rem;
      color: var(--color-text-secondary, #64748b);
      margin: 0 0 3rem 0;
    }

    .features {
      background: var(--color-bg-offset, #f8fafc);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      text-align: left;
    }

    .features h3 {
      margin: 0 0 1rem 0;
      color: var(--color-text-primary, #1f2937);
    }

    .features ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .features li {
      padding: 0.5rem 0;
      color: var(--color-text-secondary, #64748b);
      font-size: 1.1rem;
    }

    .status {
      background: var(--color-primary-lighter, #eff6ff);
      border: 1px solid var(--color-primary-light, #dbeafe);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: left;
    }

    .status p {
      margin: 0.5rem 0;
      color: var(--color-text-primary, #1f2937);
    }

    .status strong {
      color: var(--color-primary, #3b82f6);
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }

      .icon {
        font-size: 4rem;
      }
    }
  `]
})
export class TasksPlaceholderComponent {}
