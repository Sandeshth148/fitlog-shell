import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isCollapsedSubject = new BehaviorSubject<boolean>(false);
  private isMobileOpenSubject = new BehaviorSubject<boolean>(false);

  isCollapsed$: Observable<boolean> = this.isCollapsedSubject.asObservable();
  isMobileOpen$: Observable<boolean> = this.isMobileOpenSubject.asObservable();

  constructor() {
    // Restore collapsed state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      this.isCollapsedSubject.next(savedState === 'true');
    }
  }

  toggleCollapse(): void {
    const newState = !this.isCollapsedSubject.value;
    this.isCollapsedSubject.next(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  }

  toggleMobile(): void {
    const newState = !this.isMobileOpenSubject.value;
    this.isMobileOpenSubject.next(newState);
    
    // Prevent body scroll when mobile menu is open
    if (newState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobile(): void {
    this.isMobileOpenSubject.next(false);
    document.body.style.overflow = '';
  }

  get isCollapsed(): boolean {
    return this.isCollapsedSubject.value;
  }

  get isMobileOpen(): boolean {
    return this.isMobileOpenSubject.value;
  }
}
