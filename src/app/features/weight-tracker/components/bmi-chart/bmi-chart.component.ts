import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ChartService } from '../../services/chart.service';
import { UserService } from '../../../../core/services/user.service';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';

// Register Chart.js components
Chart.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

@Component({
  selector: 'app-bmi-chart',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="chart-container">
      <h3>{{ 'trends.bmiTrend' | translate }}</h3>
      
      <!-- BMI Statistics -->
      @if (hasData) {
        <div class="stats-container">
          <div class="stat-card">
            <span class="stat-label">{{ 'stats.averageBmi' | translate }}</span>
            <span class="stat-value">{{ averageBmi.toFixed(1) }}</span>
          </div>
          <div class="stat-card" [ngClass]="getBmiChangeClass()">
            <span class="stat-label">{{ bmiChange >= 0 ? ('stats.increased' | translate) : ('stats.decreased' | translate) }}</span>
            <span class="stat-value">{{ Math.abs(bmiChange).toFixed(1) }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">{{ 'stats.currentBmi' | translate }}</span>
            <span class="stat-value">{{ currentBmi.toFixed(1) }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">{{ 'stats.status' | translate }}</span>
            <span class="stat-value" [style.color]="getBmiStatusColor()">{{ getBmiStatusTranslated() }}</span>
          </div>
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
      
      <div class="bmi-legend">
        <div class="legend-item">
          <span class="color-box underweight"></span>
          <span>{{ 'bmi.underweight' | translate }} (&lt;18.5)</span>
        </div>
        <div class="legend-item">
          <span class="color-box normal"></span>
          <span>{{ 'bmi.normal' | translate }} (18.5-24.9)</span>
        </div>
        <div class="legend-item">
          <span class="color-box overweight"></span>
          <span>{{ 'bmi.overweight' | translate }} (25-29.9)</span>
        </div>
        <div class="legend-item">
          <span class="color-box obese"></span>
          <span>{{ 'bmi.obese' | translate }} (≥30)</span>
        </div>
      </div>
      
      @if (!hasData) {
        <div class="chart-empty">
          @if (hasHeight) {
            <p>{{ 'trends.noData' | translate }}</p>
          } @else {
            <p>Please set your height in the profile to see BMI data.</p>
          }
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
    
    .bmi-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
      justify-content: center;
      
      .legend-item {
        display: flex;
        align-items: center;
        font-size: 0.875rem;
        
        .color-box {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          margin-right: 0.5rem;
        }
        
        .underweight {
          background-color: var(--color-info, #3b82f6);
        }
        
        .normal {
          background-color: var(--color-success, #10b981);
        }
        
        .overweight {
          background-color: var(--color-warning, #f59e0b);
        }
        
        .obese {
          background-color: var(--color-danger, #ef4444);
        }
      }
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
    
    .stat-increased {
      border-color: var(--color-danger, #ef4444);
      
      .stat-value {
        color: var(--color-danger, #ef4444);
      }
    }
    
    .stat-decreased {
      border-color: var(--color-success, #10b981);
      
      .stat-value {
        color: var(--color-success, #10b981);
      }
    }
  `]
})
export class BmiChartComponent implements OnInit, AfterViewInit {
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
  hasHeight = false;
  
  // BMI Statistics
  averageBmi = 0;
  currentBmi = 0;
  bmiChange = 0;
  
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
          text: 'BMI'
        },
        suggestedMin: 15,
        suggestedMax: 35
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const bmi = context.parsed.y;
            if (bmi === null || bmi === undefined) {
              return 'BMI: N/A';
            }
            let category = '';
            
            if (bmi < 18.5) {
              category = 'Underweight';
            } else if (bmi < 25) {
              category = 'Normal weight';
            } else if (bmi < 30) {
              category = 'Overweight';
            } else {
              category = 'Obese';
            }
            
            return `BMI: ${bmi.toFixed(1)} (${category})`;
          }
        }
      }
    }
  };
  
  constructor(
    private chartService: ChartService,
    private userService: UserService,
    private translationService: TranslationService
  ) {}
  
  ngOnInit() {
    // We'll check height and load data in ngAfterViewInit
  }
  
  async ngAfterViewInit() {
    // Check if user has height set
    const profile = await this.userService.getUserProfile();
    this.hasHeight = !!profile && profile.heightCm > 0;
    
    if (this.hasHeight) {
      await this.loadChartData();
    }
  }
  
  async setTimeRange(days: number) {
    this.selectedRange = days;
    await this.loadChartData();
  }
  
  private async loadChartData() {
    if (!this.hasHeight) return;
    
    try {
      const chartData = await this.chartService.getBmiChartData(this.selectedRange);
      this.hasData = chartData.labels.length > 0;
      
      if (!this.hasData) {
        return;
      }
      
      // Calculate BMI statistics
      const bmiValues = chartData.datasets[0].data as number[];
      if (bmiValues.length > 0) {
        this.averageBmi = bmiValues.reduce((a, b) => a + b, 0) / bmiValues.length;
        this.currentBmi = bmiValues[bmiValues.length - 1];
        const firstBmi = bmiValues[0];
        this.bmiChange = this.currentBmi - firstBmi;
      }
      
      // Destroy existing chart if it exists
      if (this.chart) {
        this.chart.destroy();
      }
      
      // Create new chart
      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: 'line',
        data: chartData,
        options: this.chartOptions
      });
    } catch (error) {
      console.error('Error loading BMI chart data:', error);
      this.hasData = false;
    }
  }
  
  getBmiChangeClass(): string {
    return this.bmiChange >= 0 ? 'stat-increased' : 'stat-decreased';
  }
  
  getBmiStatus(): string {
    if (this.currentBmi < 18.5) return 'Underweight';
    if (this.currentBmi < 25) return 'Normal';
    if (this.currentBmi < 30) return 'Overweight';
    return 'Obese';
  }
  
  getBmiStatusColor(): string {
    if (this.currentBmi < 18.5) return 'var(--color-info, #3b82f6)';
    if (this.currentBmi < 25) return 'var(--color-success, #10b981)';
    if (this.currentBmi < 30) return 'var(--color-warning, #f59e0b)';
    return 'var(--color-danger, #ef4444)';
  }
  
  getBmiStatusTranslated(): string {
    if (this.currentBmi < 18.5) return this.translationService.translate('bmi.underweight');
    if (this.currentBmi < 25) return this.translationService.translate('bmi.normal');
    if (this.currentBmi < 30) return this.translationService.translate('bmi.overweight');
    return this.translationService.translate('bmi.obese');
  }
}
