import { Component } from '@angular/core';
import { ProfileSetupComponent } from '../../../../core/components/profile-setup/profile-setup.component';

/**
 * Setup page wrapper component
 * Delegates to the ProfileSetupComponent for the actual setup form
 */
@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [ProfileSetupComponent],
  template: `<app-profile-setup></app-profile-setup>`
})
export class SetupComponent {}
