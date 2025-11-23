import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaInstallService {
  private deferredPrompt: any = null;
  private canInstall$ = new BehaviorSubject<boolean>(false);
  
  constructor() {
    this.initializeInstallPrompt();
  }

  get canInstall() {
    return this.canInstall$.asObservable();
  }

  private initializeInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      this.deferredPrompt = e;
      this.canInstall$.next(true);
    });

    window.addEventListener('appinstalled', () => {
      // App was installed
      this.deferredPrompt = null;
      this.canInstall$.next(false);
      console.log('PWA was installed');
    });
  }

  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    
    // Clear the deferredPrompt
    this.deferredPrompt = null;
    this.canInstall$.next(false);
    
    return outcome === 'accepted';
  }

  isInstalled(): boolean {
    // Check if app is running in standalone mode
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }
}
