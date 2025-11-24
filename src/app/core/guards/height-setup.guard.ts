import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class HeightSetupGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}
  
  async canActivate(): Promise<boolean | UrlTree> {
    console.log('🔒 HeightSetupGuard: Checking profile completion...');
    
    try {
      const isProfileComplete = await this.userService.isProfileComplete();
      console.log('🔒 HeightSetupGuard: Profile complete?', isProfileComplete);
      
      if (!isProfileComplete) {
        console.log('🔒 HeightSetupGuard: Redirecting to setup page');
        return this.router.parseUrl('/setup');
      }
      
      console.log('🔒 HeightSetupGuard: Access granted');
      return true;
    } catch (error) {
      console.error('🔒 HeightSetupGuard: Error checking profile:', error);
      return this.router.parseUrl('/setup');
    }
  }
}
