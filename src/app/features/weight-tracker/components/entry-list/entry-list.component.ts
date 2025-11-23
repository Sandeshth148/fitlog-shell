import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WeightEntry } from '../../models/weight-entry.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { BmiDisplayComponent } from '../bmi-display/bmi-display.component';
import { UserService } from '../../../../core/services/user.service';
import { BmiService } from '../../../../core/services/bmi.service';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { Subscription } from 'rxjs';
import { SwipeDirective } from '../../../../shared/directives/swipe.directive';

@Component({
  selector: 'app-entry-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule, ButtonComponent, BmiDisplayComponent, TranslatePipe, SwipeDirective],
  template: `
    <div class="entry-list-container">
      @if (entries.length > 0) {
        <h3>{{ 'home.recentEntries' | translate }} ({{ entries.length }})</h3>
        
        <!-- Virtual scroll viewport -->
        <cdk-virtual-scroll-viewport 
          [itemSize]="itemHeight" 
          class="entry-list-viewport"
          [minBufferPx]="300"
          [maxBufferPx]="600">
          
          <div *cdkVirtualFor="let entry of entries; trackBy: trackById" 
               class="entry-item" 
               appSwipe
               (swipeLeft)="onSwipeLeft(entry)"
               (swipeRight)="onSwipeRight(entry)"
               [class.swiping-left]="swipingStates[entry.id] && swipingStates[entry.id].direction === 'left'"
               [class.swiping-right]="swipingStates[entry.id] && swipingStates[entry.id].direction === 'right'">
            <div class="entry-details" (click)="onEntryClick(entry)">
              <div class="entry-date-time">
                <span class="entry-date">{{ entry.date | date: 'mediumDate' }}</span>
                @if (entry.time) {
                  <span class="entry-time">{{ entry.time }}</span>
                }
              </div>
              <span class="entry-weight" [attr.data-unit]="entry.units || 'kg'">
                {{ entry.weightKg.toFixed(1) }}
              </span>
              
              @if (hasHeight && entry.bmi && showBmi) {
                <div class="entry-bmi">
                  <app-bmi-display 
                    [bmi]="entry.bmi" 
                    [heightCm]="userHeight"
                    [showIdealWeight]="false">
                  </app-bmi-display>
                </div>
              }
              
              @if (entry.notes) {
                <span class="entry-notes">{{ entry.notes }}</span>
              }
            </div>
            <div class="entry-actions">
              <app-button (clicked)="entryEdited.emit(entry)" variant="ghost" size="sm">
                {{ 'form.edit' | translate }}
              </app-button>
              <app-button (clicked)="entryDeleted.emit(entry.id)" variant="ghost" size="sm" class="delete-btn">
                {{ 'form.delete' | translate }}
              </app-button>
            </div>
            <!-- Swipe action indicators -->
            <div class="swipe-action swipe-action-left">
              <span class="swipe-icon">🗑️</span>
              <span class="swipe-text">{{ 'form.delete' | translate }}</span>
            </div>
            <div class="swipe-action swipe-action-right">
              <span class="swipe-icon">✏️</span>
              <span class="swipe-text">{{ 'form.edit' | translate }}</span>
            </div>
          </div>
        </cdk-virtual-scroll-viewport>
      } @else {
        <div class="no-entries-placeholder">
          <p>{{ 'home.noEntries' | translate }}</p>
          <p>{{ 'home.getStarted' | translate }}</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./entry-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryListComponent implements OnInit, OnDestroy {
  @Input() entries: WeightEntry[] = [];
  @Output() entryEdited = new EventEmitter<WeightEntry>();
  @Output() entryDeleted = new EventEmitter<string>();
  
  userHeight: number = 0;
  hasHeight: boolean = false;
  showBmi: boolean = true; // Can be made configurable later
  private langSubscription: Subscription = new Subscription();
  
  // Virtual scroll configuration
  itemHeight: number = 120; // Approximate height of each entry item in pixels
  
  // Track swipe states for each entry
  swipingStates: { [id: string]: { direction: 'left' | 'right' | null, progress: number } } = {};

  constructor(
    private userService: UserService,
    private bmiService: BmiService,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {}
  
  async ngOnInit() {
    // Load user height for BMI display
    const profile = await this.userService.getUserProfile();
    this.userHeight = profile?.heightCm || 0;
    this.hasHeight = this.userHeight > 0;
    
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
  
  // TrackBy function for ngFor to improve performance
  trackById(index: number, entry: WeightEntry): string {
    return entry.id;
  }
  
  // Get BMI class for styling
  getBmiClass(bmi: number): string {
    return this.bmiService.getBmiColorClass(bmi);
  }
  
  // Handle swipe left (delete)
  onSwipeLeft(entry: WeightEntry): void {
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Set swiping state
    this.swipingStates[entry.id] = { direction: 'left', progress: 100 };
    this.cdr.markForCheck();
    
    // Reset state after animation and emit delete event
    setTimeout(() => {
      this.entryDeleted.emit(entry.id);
      delete this.swipingStates[entry.id];
      this.cdr.markForCheck();
    }, 300);
  }
  
  // Handle swipe right (edit)
  onSwipeRight(entry: WeightEntry): void {
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Set swiping state
    this.swipingStates[entry.id] = { direction: 'right', progress: 100 };
    this.cdr.markForCheck();
    
    // Reset state after animation and emit edit event
    setTimeout(() => {
      this.entryEdited.emit(entry);
      delete this.swipingStates[entry.id];
      this.cdr.markForCheck();
    }, 300);
  }
  
  // Handle entry click
  onEntryClick(entry: WeightEntry): void {
    // On mobile, tapping the entry will edit it
    if (window.innerWidth <= 768) {
      this.entryEdited.emit(entry);
    }
  }
}
