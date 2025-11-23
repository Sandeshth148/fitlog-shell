import { Component, EventEmitter, OnInit, OnDestroy, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { UserProfileUtils } from '../../../../core/models/user-profile.model';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-height-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="height-input-container">
      <h2>{{ (isUpdate ? 'form.updateHeight' : 'form.enterHeight') | translate }}</h2>
      <p>{{ 'form.heightDescription' | translate }}</p>
      
      <form [formGroup]="heightForm" (ngSubmit)="onSubmit()">
        <div class="unit-selector-tabs">
          <button 
            type="button" 
            [class.active]="selectedUnit === 'cm'"
            (click)="setUnit('cm')"
          >{{ 'form.centimeters' | translate }}</button>
          <button 
            type="button" 
            [class.active]="selectedUnit === 'ft'"
            (click)="setUnit('ft')"
          >{{ 'form.feetInches' | translate }}</button>
        </div>
        
        <!-- Centimeters input -->
        <div class="form-field" *ngIf="selectedUnit === 'cm'">
          <label for="height-cm">{{ 'form.heightCm' | translate }}</label>
          <div class="input-group">
            <input 
              id="height-cm" 
              type="number" 
              formControlName="heightCm" 
              placeholder="175"
              step="0.1"
              min="0"
              [attr.aria-invalid]="heightForm.get('heightCm')?.invalid && heightForm.get('heightCm')?.touched"
            >
            <span class="unit-label">cm</span>
          </div>
          <div class="validation-error" *ngIf="heightForm.get('heightCm')?.invalid && heightForm.get('heightCm')?.touched">
            <span *ngIf="heightForm.get('heightCm')?.errors?.['required']">
              {{ 'form.heightRequired' | translate }}
            </span>
            <span *ngIf="heightForm.get('heightCm')?.errors?.['min']">
              {{ 'form.heightPositive' | translate }}
            </span>
          </div>
        </div>
        
        <!-- Feet and inches input -->
        <div *ngIf="selectedUnit === 'ft'">
          <div class="form-field-group">
            <div class="form-field">
              <label for="height-ft">{{ 'form.feet' | translate }}</label>
              <input 
                id="height-ft" 
                type="number" 
                formControlName="feet" 
                placeholder="5"
                min="0"
                step="1"
                [attr.aria-invalid]="heightForm.get('feet')?.invalid && heightForm.get('feet')?.touched"
              >
            </div>
            <div class="form-field">
              <label for="height-in">{{ 'form.inches' | translate }}</label>
              <input 
                id="height-in" 
                type="number" 
                formControlName="inches" 
                placeholder="9"
                min="0"
                max="11"
                step="1"
                [attr.aria-invalid]="heightForm.get('inches')?.invalid && heightForm.get('inches')?.touched"
              >
            </div>
          </div>
          <div class="validation-error" *ngIf="(heightForm.get('feet')?.invalid && heightForm.get('feet')?.touched) || (heightForm.get('inches')?.invalid && heightForm.get('inches')?.touched)">
            <span *ngIf="heightForm.get('feet')?.errors?.['required'] || heightForm.get('inches')?.errors?.['required']">
              {{ 'form.bothRequired' | translate }}
            </span>
            <span *ngIf="heightForm.get('feet')?.errors?.['min'] || heightForm.get('inches')?.errors?.['min']">
              {{ 'form.valuesPositive' | translate }}
            </span>
            <span *ngIf="heightForm.get('inches')?.errors?.['max']">
              {{ 'form.inchesLessThan12' | translate }}
            </span>
          </div>
        </div>
        
        <div class="height-preview" *ngIf="heightCm > 0">
          <span>{{ 'form.yourHeight' | translate }}: {{ heightCm.toFixed(1) }} cm</span>
          <span *ngIf="selectedUnit === 'ft'">({{ feetInchesDisplay }})</span>
          <span *ngIf="selectedUnit === 'cm'">({{ feetInchesFromCm }})</span>
        </div>
        
        <button type="submit" [disabled]="!isFormValid()" class="primary-button">
          {{ (isUpdate ? 'form.updateHeight' : 'form.saveHeight') | translate }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .height-input-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 1.5rem;
      background-color: var(--color-bg-offset);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      margin-top: 0;
      color: var(--color-text);
    }
    
    p {
      color: var(--color-text-secondary);
      margin-bottom: 1.5rem;
    }
    
    .unit-selector-tabs {
      display: flex;
      margin-bottom: 1.5rem;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .unit-selector-tabs button {
      flex: 1;
      padding: 0.75rem;
      background-color: var(--color-bg);
      border: 1px solid var(--color-border);
      color: var(--color-text);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .unit-selector-tabs button.active {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
    }
    
    .form-field {
      margin-bottom: 1.5rem;
    }
    
    .form-field-group {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .form-field-group .form-field {
      flex: 1;
      margin-bottom: 0;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--color-text);
    }
    
    .input-group {
      display: flex;
      align-items: center;
    }
    
    input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-size: 1rem;
      background-color: var(--color-bg);
      color: var(--color-text);
    }
    
    input:focus {
      outline: 2px solid var(--color-primary);
      border-color: var(--color-primary);
    }
    
    input[aria-invalid="true"] {
      border-color: var(--color-danger);
    }
    
    .unit-label {
      margin-left: 0.5rem;
      font-weight: 500;
      color: var(--color-text-secondary);
    }
    
    .validation-error {
      color: var(--color-danger);
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
    
    .height-preview {
      background-color: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      padding: 0.75rem;
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: 500;
      color: var(--color-primary);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .primary-button {
      width: 100%;
      padding: 0.75rem;
      background-color: var(--color-primary);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .primary-button:hover:not(:disabled) {
      background-color: var(--color-primary-dark);
    }
    
    .primary-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    @media (max-width: 480px) {
      .height-input-container {
        padding: 1rem;
      }
      
      .form-field-group {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class HeightInputComponent implements OnInit, OnDestroy {
  heightForm: FormGroup;
  selectedUnit: 'cm' | 'ft' = 'cm';
  isUpdate = false;
  heightCm: number = 0;
  
  @Output() heightSaved = new EventEmitter<number>(); // Height in cm
  
  private langSubscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    this.heightForm = this.fb.group({
      heightCm: ['', [Validators.required, Validators.min(0.1)]],
      feet: [5, [Validators.required, Validators.min(0)]],
      inches: [0, [Validators.required, Validators.min(0), Validators.max(11)]]
    });
  }
  
  async ngOnInit() {
    this.initForm();
    
    // Subscribe to language changes
    this.langSubscription = this.translationService.currentLanguage$.subscribe(() => {
      // Trigger change detection when language changes
      this.cdr.markForCheck();
    });
  }
  
  ngOnDestroy() {
    // Clean up subscription
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
  
  async initForm() {
    try {
      const profile = await this.userService.getUserProfile();
      
      if (profile) {
        // Set preferred unit
        if (profile.preferredUnits?.height) {
          // Convert 'in' to 'ft' for backward compatibility
          this.selectedUnit = profile.preferredUnits.height === 'in' ? 'ft' : profile.preferredUnits.height;
        }
        
        // Check if updating existing height
        if (profile.heightCm > 0) {
          this.isUpdate = true;
          this.heightCm = profile.heightCm;
          
          if (this.selectedUnit === 'cm') {
            this.heightForm.get('heightCm')?.setValue(profile.heightCm);
          } else {
            // Convert cm to feet and inches
            const totalInches = UserProfileUtils.cmToIn(profile.heightCm);
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            
            this.heightForm.get('feet')?.setValue(feet);
            this.heightForm.get('inches')?.setValue(inches);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
    
    // Update height preview when form values change
    this.heightForm.valueChanges.subscribe(() => {
      this.updateHeightPreview();
    });
    
    // Initialize height preview
    this.updateHeightPreview();
  }
  
  setUnit(unit: 'cm' | 'ft') {
    if (this.selectedUnit === unit) return;
    
    // Save current height in cm before switching units
    this.updateHeightPreview();
    const currentHeightCm = this.heightCm;
    
    this.selectedUnit = unit;
    
    // Update form with converted values
    if (unit === 'cm') {
      this.heightForm.get('heightCm')?.setValue(currentHeightCm);
    } else {
      // Convert cm to feet and inches
      const totalInches = UserProfileUtils.cmToIn(currentHeightCm);
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      
      this.heightForm.get('feet')?.setValue(feet);
      this.heightForm.get('inches')?.setValue(inches);
    }
  }
  
  updateHeightPreview() {
    if (this.selectedUnit === 'cm') {
      const cmValue = this.heightForm.get('heightCm')?.value;
      if (cmValue && !isNaN(cmValue)) {
        this.heightCm = parseFloat(cmValue);
      }
    } else {
      const feet = this.heightForm.get('feet')?.value || 0;
      const inches = this.heightForm.get('inches')?.value || 0;
      
      if (!isNaN(feet) && !isNaN(inches)) {
        const totalInches = (feet * 12) + inches;
        this.heightCm = UserProfileUtils.inToCm(totalInches);
      }
    }
  }
  
  isFormValid(): boolean {
    if (this.selectedUnit === 'cm') {
      return this.heightForm.get('heightCm')?.valid || false;
    } else {
      return this.heightForm.get('feet')?.valid && this.heightForm.get('inches')?.valid || false;
    }
  }
  
  get feetInchesDisplay(): string {
    const feet = this.heightForm.get('feet')?.value || 0;
    const inches = this.heightForm.get('inches')?.value || 0;
    return `${feet}' ${inches}"`;
  }
  
  get feetInchesFromCm(): string {
    const totalInches = UserProfileUtils.cmToIn(this.heightCm);
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  }
  
  async onSubmit() {
    if (!this.isFormValid()) return;
    
    this.updateHeightPreview();
    
    try {
      // Save to user profile with the correct unit preference
      await this.userService.updateUserHeight(this.heightCm, this.selectedUnit);
      
      // Emit event
      this.heightSaved.emit(this.heightCm);
    } catch (error) {
      console.error('Error saving height:', error);
    }
  }
}
