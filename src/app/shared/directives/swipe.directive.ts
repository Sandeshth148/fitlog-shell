import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

/**
 * Swipe directive for mobile touch interactions
 * Detects swipe gestures and emits events accordingly
 */
@Directive({
  selector: '[appSwipe]',
  standalone: true
})
export class SwipeDirective {
  @Output() swipeLeft = new EventEmitter<TouchEvent>();
  @Output() swipeRight = new EventEmitter<TouchEvent>();
  @Output() swipeUp = new EventEmitter<TouchEvent>();
  @Output() swipeDown = new EventEmitter<TouchEvent>();
  @Output() tap = new EventEmitter<TouchEvent>();
  
  @Input() swipeThreshold = 50; // Minimum distance required for a swipe
  
  private startX = 0;
  private startY = 0;
  private startTime = 0;
  private readonly MAX_SWIPE_TIME = 300; // Maximum time in ms for a swipe
  
  constructor(private el: ElementRef) {}
  
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    // Store the initial touch position and time
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
    this.startTime = Date.now();
  }
  
  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    // Calculate touch duration
    const touchDuration = Date.now() - this.startTime;
    
    // If touch duration is too long, it's not a swipe
    if (touchDuration > this.MAX_SWIPE_TIME) {
      return;
    }
    
    // Get the final touch position
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    
    // Calculate the distance moved
    const deltaX = endX - this.startX;
    const deltaY = endY - this.startY;
    
    // Determine if it's a tap (minimal movement)
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      this.tap.emit(event);
      return;
    }
    
    // Determine the direction of the swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > this.swipeThreshold) {
        if (deltaX > 0) {
          this.swipeRight.emit(event);
        } else {
          this.swipeLeft.emit(event);
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > this.swipeThreshold) {
        if (deltaY > 0) {
          this.swipeDown.emit(event);
        } else {
          this.swipeUp.emit(event);
        }
      }
    }
  }
  
  // Prevent default behavior for touchmove to avoid scrolling while swiping
  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    // Only prevent default if it's a significant horizontal swipe
    const deltaX = event.touches[0].clientX - this.startX;
    const deltaY = event.touches[0].clientY - this.startY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      event.preventDefault();
    }
  }
}
