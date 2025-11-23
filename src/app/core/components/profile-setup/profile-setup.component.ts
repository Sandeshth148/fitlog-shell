import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ButtonComponent } from '../../../shared/components/button/button.component';

/**
 * Profile Setup Component
 * Comprehensive form for initial user profile setup with name, age, and height
 * Uses Angular Reactive Forms with proper validation
 */
@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, ButtonComponent],
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileSetupComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  
  profileForm!: FormGroup;
  heightUnit = signal<'cm' | 'ft'>('cm');
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  
  ngOnInit(): void {
    this.initializeForm();
  }
  
  /**
   * Initialize the reactive form with validators
   */
  private initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      age: ['', [
        Validators.min(1),
        Validators.max(150)
      ]],
      heightUnit: ['cm'],
      // Height in centimeters
      heightCm: ['', [
        Validators.required,
        Validators.min(50),
        Validators.max(300)
      ]],
      // Height in feet and inches (for ft unit)
      heightFeet: [''],
      heightInches: ['']
    });
    
    // Subscribe to height unit changes
    this.profileForm.get('heightUnit')?.valueChanges.subscribe((unit: 'cm' | 'ft') => {
      this.heightUnit.set(unit);
      this.updateHeightValidators(unit);
    });
  }
  
  /**
   * Update validators based on selected height unit
   */
  private updateHeightValidators(unit: 'cm' | 'ft'): void {
    const heightCmControl = this.profileForm.get('heightCm');
    const heightFeetControl = this.profileForm.get('heightFeet');
    const heightInchesControl = this.profileForm.get('heightInches');
    
    if (unit === 'cm') {
      // Enable cm validators
      heightCmControl?.setValidators([
        Validators.required,
        Validators.min(50),
        Validators.max(300)
      ]);
      heightFeetControl?.clearValidators();
      heightInchesControl?.clearValidators();
      
      // Clear feet/inches values
      heightFeetControl?.setValue('');
      heightInchesControl?.setValue('');
    } else {
      // Enable feet/inches validators
      heightFeetControl?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(9)
      ]);
      heightInchesControl?.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(11)
      ]);
      heightCmControl?.clearValidators();
      
      // Clear cm value
      heightCmControl?.setValue('');
    }
    
    // Update validity
    heightCmControl?.updateValueAndValidity();
    heightFeetControl?.updateValueAndValidity();
    heightInchesControl?.updateValueAndValidity();
  }
  
  /**
   * Calculate height in cm from feet and inches
   */
  private calculateHeightFromFeetInches(feet: number, inches: number): number {
    const totalInches = (feet * 12) + inches;
    return totalInches * 2.54;
  }
  
  /**
   * Handle form submission
   */
  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    
    try {
      const formValue = this.profileForm.value;
      
      // Calculate height in cm
      let heightCm: number;
      if (this.heightUnit() === 'cm') {
        heightCm = parseFloat(formValue.heightCm);
      } else {
        heightCm = this.calculateHeightFromFeetInches(
          parseFloat(formValue.heightFeet),
          parseFloat(formValue.heightInches)
        );
      }
      
      // Save profile
      await this.userService.saveUserProfile({
        name: formValue.name.trim(),
        age: formValue.age ? parseInt(formValue.age, 10) : undefined,
        heightCm,
        preferredUnits: {
          height: this.heightUnit(),
          weight: 'kg'
        }
      });
      
      // Navigate to home
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error saving profile:', error);
      this.errorMessage.set('Failed to save profile. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
  
  /**
   * Get error message for a form control
   */
  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    if (control.errors['required']) {
      return `${controlName} is required`;
    }
    
    if (control.errors['minlength']) {
      return `${controlName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    
    if (control.errors['maxlength']) {
      return `${controlName} cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
    }
    
    if (control.errors['min']) {
      return `${controlName} must be at least ${control.errors['min'].min}`;
    }
    
    if (control.errors['max']) {
      return `${controlName} cannot exceed ${control.errors['max'].max}`;
    }
    
    return '';
  }
  
  /**
   * Check if a control has errors and is touched
   */
  hasError(controlName: string): boolean {
    const control = this.profileForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }
}
