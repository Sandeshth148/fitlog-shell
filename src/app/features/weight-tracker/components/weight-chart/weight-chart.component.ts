import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, TimeScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ChartService } from '../../services/chart.service';
import { DateValidationService } from '../../../../core/services/date-validation.service';
import { UserService } from '../../../../core/services/user.service';
import { BmiService } from '../../../../core/services/bmi.service';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

// Register Chart.js components
Chart.register(TimeScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend);

@Component({
  selector: 'app-weight-chart',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="chart-container">
      <h3>{{ 'trends.weightTrend' | translate }}</h3>
      
      <!-- Statistics -->
      @if (hasData) {
        <div class="stats-container">
          <div class="stat-card">
            <span class="stat-label">{{ 'stats.average' | translate }}</span>
            <span class="stat-value">{{ averageWeight.toFixed(1) }} kg</span>
          </div>
          <div class="stat-card" [ngClass]="weightChange >= 0 ? 'stat-gained' : 'stat-lost'">
            <span class="stat-label">{{ weightChange >= 0 ? ('stats.gained' | translate) : ('stats.lost' | translate) }}</span>
            <span class="stat-value">{{ Math.abs(weightChange).toFixed(1) }} kg</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">{{ 'stats.current' | translate }}</span>
            <span class="stat-value">{{ currentWeight.toFixed(1) }} kg</span>
          </div>
          @if (idealWeightMin > 0) {
            <div class="stat-card">
              <span class="stat-label">{{ 'stats.idealRange' | translate }}</span>
              <span class="stat-value">{{ idealWeightMin.toFixed(0) }}-{{ idealWeightMax.toFixed(0) }} kg</span>
            </div>
          }
        </div>
      }
      
      <div class="chart-controls">
        @for (range of timeRanges; track range.days) {
          <button 
            [class.active]="selectedRange === range.days"
            (click)="setTimeRange(range.days)">
            {{ range.label }}
          </button>
        }
      </div>
      
      <div class="chart-wrapper">
        <canvas #chartCanvas></canvas>
      </div>
      
      @if (!hasData) {
        <div class="chart-empty">
          <p>{{ 'trends.noData' | translate }}</p>
          <p>{{ 'trends.addEntries' | translate }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .chart-container {
      background-color: var(--color-bg);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--color-border);
    }
    
    h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: var(--color-text);
      font-size: 1.25rem;
    }
    
    .chart-controls {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
      
      button {
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg);
        color: var(--color-text);
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          background-color: var(--color-bg-offset);
        }
        
        &.active {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }
      }
    }
    
    .chart-wrapper {
      height: 300px;
      position: relative;
    }
    
    .chart-empty {
      text-align: center;
      padding: 2rem 0;
      color: var(--color-text-secondary);
      
      p {
        margin: 0.5rem 0;
      }
    }
    
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .stat-card {
      background-color: var(--color-bg-offset);
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 2px solid var(--color-border);
      
      .stat-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-secondary);
        margin-bottom: 0.5rem;
      }
      
      .stat-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-primary);
      }
    }
    
    .stat-gained {
      border-color: var(--color-danger, #ef4444);
      
      .stat-value {
        color: var(--color-danger, #ef4444);
      }
    }
    
    .stat-lost {
      border-color: var(--color-success, #10b981);
      
      .stat-value {
        color: var(--color-success, #10b981);
      }
    }
  `]
})
export class WeightChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;
  
  timeRanges = [
    { label: '1M', days: 30 },
    { label: '3M', days: 90 },
    { label: '6M', days: 180 },
    { label: '1Y', days: 365 },
    { label: 'All', days: 5 * 365 } // 5 years max
  ];
  
  selectedRange = 30; // Default to 1 month
  hasData = false;
  
  // Statistics
  averageWeight = 0;
  currentWeight = 0;
  weightChange = 0;
  idealWeightMin = 0;
  idealWeightMax = 0;
  
  // For template
  Math = Math;
  
  chartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };
  
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM d'
          }
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    }
  };
  
  constructor(
    private chartService: ChartService,
    private dateValidationService: DateValidationService,
    private userService: UserService,
    private bmiService: BmiService
  ) {}
  
  async ngOnInit() {
    // We'll load data after view init
  }
  
  async ngAfterViewInit() {
    await this.loadChartData();
  }
  
  async setTimeRange(days: number) {
    this.selectedRange = days;
    await this.loadChartData();
  }
  
  private async loadChartData() {
    try {
      const chartData = await this.chartService.getWeightChartData(this.selectedRange);
      this.hasData = chartData.labels.length > 0;
      
      if (!this.hasData) {
        return;
      }
      
      // Calculate statistics
      const weights = chartData.datasets[0].data as number[];
      if (weights.length > 0) {
        this.averageWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
        this.currentWeight = weights[weights.length - 1];
        const firstWeight = weights[0];
        this.weightChange = this.currentWeight - firstWeight;
      }
      
      // Get ideal weight range
      const profile = await this.userService.getUserProfile();
      if (profile && profile.heightCm > 0) {
        const idealRange = this.bmiService.getIdealWeightRange(profile.heightCm);
        this.idealWeightMin = idealRange.min;
        this.idealWeightMax = idealRange.max;
        
        // Add ideal weight lines to chart
        const idealMinLine = {
          label: 'Ideal Min',
          data: chartData.labels.map(() => idealRange.min),
          borderColor: 'rgba(16, 185, 129, 0.5)',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        };
        
        const idealMaxLine = {
          label: 'Ideal Max',
          data: chartData.labels.map(() => idealRange.max),
          borderColor: 'rgba(16, 185, 129, 0.5)',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        };
        
        chartData.datasets.push(idealMinLine, idealMaxLine);
      }
      
      // Destroy existing chart if it exists
      if (this.chart) {
        this.chart.destroy();
      }
      
      // Update chart options to show legend
      const updatedOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MMM d'
              }
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Weight (kg)'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top' as const
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      };
      
      // Create new chart
      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: 'line',
        data: chartData,
        options: updatedOptions
      });
    } catch (error) {
      console.error('Error loading chart data:', error);
      this.hasData = false;
    }
  }
}
