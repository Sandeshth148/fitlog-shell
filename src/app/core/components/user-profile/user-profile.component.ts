import { Component, OnInit, OnDestroy, signal, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/user-profile.model';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  isModalOpen = signal(false);
  avatarPreview = signal<string | null>(null);
  userProfile = signal<UserProfile | null>(null);
  isSubmitting = signal(false);
  heightUnit = signal<'cm' | 'ft'>('cm');
  
  private langSubscription!: Subscription;
  private profileSubscription!: Subscription;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    this.loadUserProfile();
    
    // Subscribe to language changes to update the UI
    this.langSubscription = this.translationService.currentLanguage$.subscribe(() => {
      // Trigger change detection to update translations
      this.cdr.markForCheck();
    });
    
    // Subscribe to profile changes
    this.profileSubscription = this.userService.userProfile$.subscribe(profile => {
      if (profile) {
        console.log('UserProfileComponent: Profile updated from observable:', profile);
        this.userProfile.set(profile);
        
        // Update form values if modal is not open (to avoid overwriting user edits)
        if (!this.isModalOpen()) {
          const heightUnit = (profile.preferredUnits?.height === 'ft' || profile.preferredUnits?.height === 'cm') 
            ? profile.preferredUnits.height 
            : 'cm';
          this.heightUnit.set(heightUnit);
          
          this.profileForm.patchValue({
            name: profile.name || '',
            age: profile.age || '',
            heightUnit: heightUnit,
            heightCm: heightUnit === 'cm' ? profile.heightCm : '',
            heightFeet: heightUnit === 'ft' ? Math.floor(profile.heightCm / 30.48) : '',
            heightInches: heightUnit === 'ft' ? Math.round((profile.heightCm / 2.54) % 12) : ''
          });
          
          if (profile.avatar) {
            this.avatarPreview.set(profile.avatar);
          }
        }
        
        this.cdr.markForCheck();
      }
    });
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
  
  private initForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      age: ['', [Validators.min(1), Validators.max(150)]],
      avatar: [''],
      heightUnit: ['cm'],
      heightCm: ['', [Validators.required, Validators.min(50), Validators.max(300)]],
      heightFeet: [''],
      heightInches: ['']
    });
    
    // Subscribe to height unit changes
    this.profileForm.get('heightUnit')?.valueChanges.subscribe((unit: 'cm' | 'ft') => {
      this.heightUnit.set(unit);
      this.updateHeightValidators(unit);
    });
  }
  
  private async loadUserProfile(): Promise<void> {
    try {
      console.log('UserProfileComponent: Loading user profile...');
      const profile = await this.userService.getUserProfile();
      console.log('UserProfileComponent: Profile loaded:', profile);
      
      this.userProfile.set(profile);
      
      if (profile) {
        const heightUnit = (profile.preferredUnits?.height === 'ft' || profile.preferredUnits?.height === 'cm') 
          ? profile.preferredUnits.height 
          : 'cm';
        this.heightUnit.set(heightUnit);
        
        this.profileForm.patchValue({
          name: profile.name || '',
          age: profile.age || '',
          heightUnit: heightUnit,
          heightCm: heightUnit === 'cm' ? profile.heightCm : '',
          heightFeet: heightUnit === 'ft' ? Math.floor(profile.heightCm / 30.48) : '',
          heightInches: heightUnit === 'ft' ? Math.round((profile.heightCm / 2.54) % 12) : ''
        });
        
        if (profile.avatar) {
          this.avatarPreview.set(profile.avatar);
          console.log('UserProfileComponent: Avatar preview set');
        }
      }
      
      // Ensure UI updates
      this.cdr.detectChanges();
    } catch (error) {
      console.error('UserProfileComponent: Error loading profile:', error);
    }
  }
  
  openModal(): void {
    this.isModalOpen.set(true);
  }
  
  closeModal(): void {
    this.isModalOpen.set(false);
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.avatarPreview.set(result);
        this.profileForm.patchValue({ avatar: result });
      };
      reader.readAsDataURL(file);
    }
  }
  
  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      return;
    }
    
    this.isSubmitting.set(true);
    
    try {
      const formValues = this.profileForm.value;
      
      // Calculate height in cm
      let heightCm: number;
      if (this.heightUnit() === 'cm') {
        heightCm = parseFloat(formValues.heightCm);
      } else {
        const totalInches = (parseFloat(formValues.heightFeet) * 12) + parseFloat(formValues.heightInches);
        heightCm = totalInches * 2.54;
      }
      
      const updatedProfile = await this.userService.saveUserProfile({
        name: formValues.name,
        age: formValues.age ? parseInt(formValues.age, 10) : undefined,
        heightCm,
        avatar: formValues.avatar || this.userProfile()?.avatar,
        preferredUnits: {
          height: this.heightUnit(),
          weight: this.userProfile()?.preferredUnits?.weight || 'kg'
        }
      });
      
      this.userProfile.set(updatedProfile);
      this.closeModal();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }
  
  get nameControl() {
    return this.profileForm.get('name');
  }
  
  get hasNameError(): boolean {
    return this.nameControl?.invalid && (this.nameControl?.dirty || this.nameControl?.touched) || false;
  }
  
  get nameErrorMessage(): string {
    if (this.nameControl?.errors?.['required']) {
      return 'profile.validation.nameRequired';
    }
    if (this.nameControl?.errors?.['minlength']) {
      return 'profile.validation.nameMinLength';
    }
    if (this.nameControl?.errors?.['maxlength']) {
      return 'profile.validation.nameMaxLength';
    }
    return '';
  }
  
  /**
   * Update validators based on selected height unit
   */
  private updateHeightValidators(unit: 'cm' | 'ft'): void {
    const heightCmControl = this.profileForm.get('heightCm');
    const heightFeetControl = this.profileForm.get('heightFeet');
    const heightInchesControl = this.profileForm.get('heightInches');
    
    if (unit === 'cm') {
      heightCmControl?.setValidators([Validators.required, Validators.min(50), Validators.max(300)]);
      heightFeetControl?.clearValidators();
      heightInchesControl?.clearValidators();
      heightFeetControl?.setValue('');
      heightInchesControl?.setValue('');
    } else {
      heightFeetControl?.setValidators([Validators.required, Validators.min(1), Validators.max(9)]);
      heightInchesControl?.setValidators([Validators.required, Validators.min(0), Validators.max(11)]);
      heightCmControl?.clearValidators();
      heightCmControl?.setValue('');
    }
    
    heightCmControl?.updateValueAndValidity();
    heightFeetControl?.updateValueAndValidity();
    heightInchesControl?.updateValueAndValidity();
  }
}
