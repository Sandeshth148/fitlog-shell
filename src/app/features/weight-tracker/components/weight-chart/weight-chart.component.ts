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
      background: var(--color-surface);
      backdrop-filter: blur(var(--glass-blur)) saturate(180%);
      -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
      border: 1px solid var(--glass-border);
      border-radius: 18px;
      box-shadow: var(--glass-shadow);
      padding: 2rem;
      margin-bottom: 2.5rem;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      }
    }
    
    h3 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      font-weight: 700;
      font-family: 'Outfit', sans-serif;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 1.35rem;
      letter-spacing: -0.01em;
    }
    
    .chart-controls {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
      
      button {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: 1px solid var(--glass-border);
        background: rgba(var(--color-primary-rgb), 0.05);
        color: var(--color-text);
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s ease;
        
        &:hover {
          background: rgba(var(--color-primary-rgb), 0.1);
          border-color: rgba(var(--color-primary-rgb), 0.25);
        }
        
        &.active {
          background: var(--gradient-primary);
          border-color: transparent;
          color: white;
          box-shadow: 0 4px 10px rgba(var(--color-primary-rgb), 0.25);
        }
      }
    }
    
    .chart-wrapper {
      height: 320px;
      position: relative;
      background: rgba(255, 255, 255, 0.01);
      border-radius: 12px;
      padding: 0.5rem;
    }
    
    .chart-empty {
      text-align: center;
      padding: 3rem 0;
      color: var(--color-text-secondary);
      border: 1px dashed var(--glass-border);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.02);
      
      p {
        margin: 0.5rem 0;
        
        &:first-child {
          font-weight: 600;
          color: var(--color-text);
        }
      }
    }
    
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: rgba(255, 255, 255, 0.03);
      padding: 1.25rem 1rem;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid var(--glass-border);
      transition: all 0.25s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(var(--color-primary-rgb), 0.2);
      }
      
      .stat-label {
        font-size: 0.725rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-text-secondary);
        margin-bottom: 0.5rem;
      }
      
      .stat-value {
        font-size: 1.35rem;
        font-weight: 800;
        font-family: 'Outfit', sans-serif;
        color: var(--color-primary);
      }
    }
    
    .stat-gained {
      background: rgba(239, 68, 68, 0.02);
      border-color: rgba(239, 68, 68, 0.15);
      
      &:hover {
        background: rgba(239, 68, 68, 0.04);
        border-color: rgba(239, 68, 68, 0.3);
      }
      
      .stat-value {
        color: var(--color-danger);
      }
    }
    
    .stat-lost {
      background: rgba(16, 185, 129, 0.02);
      border-color: rgba(16, 185, 129, 0.15);
      
      &:hover {
        background: rgba(16, 185, 129, 0.04);
        border-color: rgba(16, 185, 129, 0.3);
      }
      
      .stat-value {
        color: #10b981;
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
