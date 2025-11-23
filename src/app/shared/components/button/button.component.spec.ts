import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have primary variant by default', () => {
    const buttonEl = fixture.debugElement.query(By.css('button'));
    expect(buttonEl.nativeElement.classList).toContain('btn-primary');
  });

  it('should apply the correct variant class', () => {
    component.variant = 'secondary';
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('button'));
    expect(buttonEl.nativeElement.classList).toContain('btn-secondary');
  });

  it('should apply the correct size class', () => {
    component.size = 'lg';
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('button'));
    expect(buttonEl.nativeElement.classList).toContain('btn-lg');
  });

  it('should emit clicked event when clicked', () => {
    spyOn(component.clicked, 'emit');
    const buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.nativeElement.click();
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should not emit clicked event when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    spyOn(component.clicked, 'emit');
    const buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.nativeElement.click();
    expect(component.clicked.emit).not.toHaveBeenCalled();
  });

  it('should apply aria-label when provided', () => {
    component.ariaLabel = 'Test Button';
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('button'));
    expect(buttonEl.nativeElement.getAttribute('aria-label')).toBe('Test Button');
  });

  it('should apply full width class when fullWidth is true', () => {
    component.fullWidth = true;
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('button'));
    expect(buttonEl.nativeElement.classList).toContain('btn-full-width');
  });
});
