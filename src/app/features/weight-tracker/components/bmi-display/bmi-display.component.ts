import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmiService, BmiCategory } from '../../../../core/services/bmi.service';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-bmi-display',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="bmi-display" [ngClass]="getBmiColorClass()">
      <div class="bmi-header">
        <div class="bmi-value">
          <span class="value">{{ bmi.toFixed(1) }}</span>
          <span class="label">BMI</span>
        </div>
        <!-- <div class="bmi-indicator">
          <div class="indicator-bar">
            <div class="indicator-marker" [style.left]="getMarkerPosition()"></div>
          </div>
          <div class="indicator-labels">
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
          </div>
        </div> -->
      </div>
      
      <div class="bmi-category">{{ 'bmi.' + getBmiCategoryKey() | translate }}</div>
      
      <div class="ideal-weight" *ngIf="showIdealWeight && heightCm > 0">
        <div class="ideal-weight-header">
          <span class="label">{{ 'stats.idealRange' | translate }}</span>
          <span class="height-value">{{ 'form.at' | translate }} {{ heightCm.toFixed(0) }} cm</span>
        </div>
        <span class="value">{{ idealWeightMin.toFixed(1) }} - {{ idealWeightMax.toFixed(1) }} kg</span>
      </div>
    </div>
  `,
  styles: [`
    .bmi-display {
      padding: 1rem;
      border-radius: 12px;
      margin: 0.75rem 0;
      background-color: var(--color-bg);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--color-border);
      transition: all 0.3s ease;
    }
    
    .bmi-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    
    .bmi-value {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      
      .label {
        font-weight: 500;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        opacity: 0.7;
        margin-left: 5px;
      }
      
      .value {
        font-weight: 700;
        font-size: 1.75rem;
        line-height: 1;
      }
    }
    
    .bmi-indicator {
      flex: 1;
      margin-left: 1.5rem;
      
      .indicator-bar {
        height: 8px;
        background: linear-gradient(to right, 
          var(--color-info) 0%, 
          var(--color-info) 33%, 
          var(--color-success) 33%, 
          var(--color-success) 66%, 
          var(--color-warning) 66%, 
          var(--color-warning) 85%,
          var(--color-danger) 85%
        );
        border-radius: 4px;
        position: relative;
        margin-bottom: 4px;
      }
      
      .indicator-marker {
        position: absolute;
        width: 12px;
        height: 12px;
        background-color: white;
        border: 2px solid currentColor;
        border-radius: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }
      
      .indicator-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        color: var(--color-text-secondary);
      }
    }
    
    .bmi-category {
      font-size: 1rem;
      font-weight: 600;
      margin: 0.5rem 0;
      text-align: center;
      padding: 0.5rem;
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.03);
    }
    
    .ideal-weight {
      font-size: 0.875rem;
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--color-border);
      padding-top: 0.75rem;
      margin-top: 0.75rem;
      
      .ideal-weight-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.25rem;
        
        .label {
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        
        .height-value {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
        }
      }
      
      .value {
        font-weight: 600;
        font-size: 1rem;
        color: var(--color-success);
      }
    }
    
    /* BMI Category Colors */
    .bmi-underweight {
      .bmi-category {
        color: var(--color-info, #3b82f6);
        background-color: rgba(59, 130, 246, 0.1);
      }
      .indicator-marker {
        color: var(--color-info, #3b82f6);
        left: 16.5%;
      }
    }
    
    .bmi-normal {
      .bmi-category {
        color: var(--color-success, #10b981);
        background-color: rgba(16, 185, 129, 0.1);
      }
      .indicator-marker {
        color: var(--color-success, #10b981);
        left: 50%;
      }
    }
    
    .bmi-overweight {
      .bmi-category {
        color: var(--color-warning, #f59e0b);
        background-color: rgba(245, 158, 11, 0.1);
      }
      .indicator-marker {
        color: var(--color-warning, #f59e0b);
        left: 75%;
      }
    }
    
    .bmi-obese {
      .bmi-category {
        color: var(--color-danger, #ef4444);
        background-color: rgba(239, 68, 68, 0.1);
      }
      .indicator-marker {
        color: var(--color-danger, #ef4444);
        left: 92.5%;
      }
    }
    
    @media (max-width: 480px) {
      .bmi-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .bmi-indicator {
        margin-left: 0;
        margin-top: 0.75rem;
        width: 100%;
      }
    }
  `]
})
export class BmiDisplayComponent implements OnInit {
  @Input() bmi: number = 0;
  @Input() heightCm: number = 0;
  @Input() showIdealWeight: boolean = false;
  
  idealWeightMin: number = 0;
  idealWeightMax: number = 0;
  
  constructor(private bmiService: BmiService) {}
  
  ngOnInit() {
    if (this.heightCm > 0 && this.showIdealWeight) {
      const idealRange = this.bmiService.getIdealWeightRange(this.heightCm);
      this.idealWeightMin = idealRange.min;
      this.idealWeightMax = idealRange.max;
    }
  }
  
  getBmiCategory(): string {
    return this.bmiService.getBmiCategory(this.bmi);
  }
  
  getBmiCategoryKey(): string {
    const category = this.bmiService.getBmiCategory(this.bmi);
    
    // Map the BMI categories to translation keys
    switch (category) {
      case 'Underweight':
        return 'underweight';
      case 'Normal weight':
        return 'normal';
      case 'Overweight':
        return 'overweight';
      case 'Obesity class I':
      case 'Obesity class II':
      case 'Obesity class III':
        return 'obese';
      default:
        return 'normal';
    }
  }
  
  getBmiColorClass(): string {
    return this.bmiService.getBmiColorClass(this.bmi);
  }
  
  getMarkerPosition(): string {
    // Calculate position based on BMI value
    // This is a simplified calculation for visual representation
    if (this.bmi < 18.5) {
      // Underweight: 0-33% of the bar
      return `${Math.max(5, Math.min(33, (this.bmi / 18.5) * 33))}%`;
    } else if (this.bmi < 25) {
      // Normal: 33-66% of the bar
      return `${33 + ((this.bmi - 18.5) / 6.5) * 33}%`;
    } else if (this.bmi < 30) {
      // Overweight: 66-85% of the bar
      return `${66 + ((this.bmi - 25) / 5) * 19}%`;
    } else {
      // Obese: 85-100% of the bar
      return `${Math.min(95, 85 + ((this.bmi - 30) / 10) * 15)}%`;
    }
  }
}
