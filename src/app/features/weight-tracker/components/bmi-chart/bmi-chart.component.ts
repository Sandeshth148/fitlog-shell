import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, TimeScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ChartService } from '../../services/chart.service';
import { UserService } from '../../../../core/services/user.service';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';

// Register Chart.js components
Chart.register(TimeScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend);

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
    
    .bmi-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 1.25rem;
      margin-top: 1.5rem;
      justify-content: center;
      
      .legend-item {
        display: flex;
        align-items: center;
        font-size: 0.875rem;
        font-weight: 600;
        
        .color-box {
          width: 14px;
          height: 14px;
          border-radius: 4px;
          margin-right: 0.5rem;
        }
        
        .underweight {
          background-color: #3b82f6;
        }
        
        .normal {
          background-color: #10b981;
        }
        
        .overweight {
          background-color: #f59e0b;
        }
        
        .obese {
          background-color: #ef4444;
        }
      }
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
    
    .stat-increased {
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
    
    .stat-decreased {
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
