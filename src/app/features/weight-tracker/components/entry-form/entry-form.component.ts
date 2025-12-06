import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WeightEntry, WeightEntryUtils } from '../../models/weight-entry.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { DateValidationService } from '../../../../core/services/date-validation.service';
import { StorageService } from '../../../../core/services/storage.service';
import { ToastService } from '../../../../core/services/toast.service';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, TranslatePipe],
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EntryFormComponent implements OnInit {
  @Input() entry?: WeightEntry;
  @Output() entrySaved = new EventEmitter<WeightEntry>();
  @Output() formCancelled = new EventEmitter<void>();

  entryForm!: FormGroup;
  today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  minDate: string;
  
  constructor(
    private fb: FormBuilder,
    public dateValidationService: DateValidationService,
    private storageService: StorageService,
    private toastService: ToastService
  ) {
    this.minDate = this.dateValidationService.getMinDateString();
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.entryForm = this.fb.group({
      date: [
        this.entry?.date || this.today, 
        [
          Validators.required,
          this.dateValidationService.dateRangeValidator()
        ]
      ],
      weight: [
        this.entry ? 
          (this.entry.units === 'lb' ? 
            WeightEntryUtils.kgToLb(this.entry.weightKg).toFixed(1) : 
            this.entry.weightKg.toFixed(1)) : 
          '', 
        [Validators.required, Validators.min(0.1)]
      ],
      units: [this.entry?.units || 'kg'],
      time: [this.entry?.time || ''],
      notes: [this.entry?.notes || '']
    });
  }

  async onSubmit(): Promise<void> {
    if (this.entryForm.invalid) {
      this.markFormGroupTouched(this.entryForm);
      console.log('EntryFormComponent: Form is invalid', this.entryForm.errors);
      return;
    }

    try {
      console.log('EntryFormComponent: Form submitted', this.entryForm.value);
      const formValue = this.entryForm.value;
      
      // Validate date range
      if (!this.dateValidationService.isDateInAllowedRange(formValue.date)) {
        console.error('EntryFormComponent: Date out of allowed range', formValue.date);
        this.entryForm.get('date')?.setErrors({ dateRange: true });
        return;
      }
      
      // Ensure weight is a valid number
      const weightValue = typeof formValue.weight === 'string' ? 
        parseFloat(formValue.weight) : formValue.weight;
      
      if (isNaN(weightValue)) {
        console.error('EntryFormComponent: Invalid weight value', formValue.weight);
        return;
      }
      
      console.log('EntryFormComponent: Parsed weight', weightValue, formValue.units);
      const weightKg = WeightEntryUtils.normalizeToKg(weightValue, formValue.units);
      console.log('EntryFormComponent: Normalized weight to kg', weightKg);

      // Preserve the existing ID if editing
      const entryId = this.entry?.id;
      console.log('EntryFormComponent: Using ID', entryId || 'new entry (will generate ID)');
      
      try {
        // Use the StorageService to add entry with BMI calculation
        const savedEntry = await this.storageService.addEntryWithBmi({
          id: entryId,
          date: formValue.date,
          weightKg,
          time: formValue.time,
          notes: formValue.notes,
          units: formValue.units,
          createdAt: this.entry?.createdAt
        });
        
        console.log('EntryFormComponent: Entry saved with BMI', savedEntry);
        this.entrySaved.emit(savedEntry);
        
        // Calculate and show streak toast
        await this.showStreakToast();
        
        this.resetForm();
      } catch (error) {
        console.error('EntryFormComponent: Error saving entry', error);
      }
    } catch (error) {
      console.error('EntryFormComponent: Error submitting form', error);
    }
  }

  onCancel(): void {
    this.formCancelled.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.entryForm.reset({
      date: this.today,
      units: 'kg'
    });
  }

  /**
   * Show streak toast after logging weight
   */
  private async showStreakToast(): Promise<void> {
    // Streak calculation will be handled by streaks MFE in the future
    this.toastService.success('Weight logged successfully!', '✅');
  }

  // Helper method to mark all controls as touched for validation display
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
