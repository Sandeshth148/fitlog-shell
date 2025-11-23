import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSpy: jasmine.SpyObj<Storage>;
  let documentElementSpy: jasmine.SpyObj<HTMLElement>;

  beforeEach(() => {
    // Create spies for localStorage and document.documentElement
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);
    documentElementSpy = jasmine.createSpyObj('documentElement', ['setAttribute']);

    // Mock localStorage
    spyOn(window.localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(window.localStorage, 'setItem').and.callFake(localStorageSpy.setItem);

    // Mock document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: documentElementSpy,
      writable: true
    });

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with saved theme from localStorage', () => {
    // Arrange
    localStorageSpy.getItem.and.returnValue('dark');
    
    // Act
    service.init();
    
    // Assert
    expect(service.getTheme()).toBe('dark');
    expect(documentElementSpy.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });

  it('should toggle theme from light to dark', () => {
    // Arrange
    localStorageSpy.getItem.and.returnValue('light');
    service.init();
    
    // Act
    service.toggleTheme();
    
    // Assert
    expect(service.getTheme()).toBe('dark');
    expect(localStorageSpy.setItem).toHaveBeenCalledWith('fitlog.theme', 'dark');
    expect(documentElementSpy.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });

  it('should toggle theme from dark to light', () => {
    // Arrange
    localStorageSpy.getItem.and.returnValue('dark');
    service.init();
    
    // Act
    service.toggleTheme();
    
    // Assert
    expect(service.getTheme()).toBe('light');
    expect(localStorageSpy.setItem).toHaveBeenCalledWith('fitlog.theme', 'light');
    expect(documentElementSpy.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
  });

  it('should use system preference if no theme in localStorage', () => {
    // Arrange
    localStorageSpy.getItem.and.returnValue(null);
    const mediaQueryListMock = { matches: true, addEventListener: jasmine.createSpy() };
    spyOn(window, 'matchMedia').and.returnValue(mediaQueryListMock as any);
    
    // Act
    service.init();
    
    // Assert
    expect(service.getTheme()).toBe('dark');
    expect(documentElementSpy.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });
});
