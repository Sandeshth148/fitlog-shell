# FitLog Shell - Changelog

All notable changes to the FitLog Shell application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-01-11

### Added
- **Task Tracker MFE Integration** - Full-featured task management system
- Recurring tasks support (Hourly, Daily, Weekly, Monthly, Yearly)
- Browser notifications for task creation and resets
- Task archiving functionality
- Pagination for large task lists (10 per page)
- Advanced filtering by status, priority, and recurrence type
- Real-time search functionality
- Task completion tracking with counts
- Web Workers for background task checking
- Professional Inter font family
- Mobile-responsive task management interface

### Changed
- Updated federation.manifest.json with Task Tracker production URL
- Removed disabled notification bell icon from topbar (commented code cleanup)
- Improved mobile UX - language and theme selectors now visible on all devices

### Fixed
- Mobile view now shows language switcher and theme selector
- Removed confusing disabled notification features from Shell header
- Cleaned up commented notification code

### Technical
- Deployed Task Tracker to: https://fitlog-task-tracker.netlify.app
- Native Federation integration with Task Tracker MFE
- localStorage persistence for tasks
- Web Worker implementation for performance
- Notification API integration (browser-native)

---

## [1.1.3] - 2026-01-11

### Fixed
- **CRITICAL:** Fasting Tracker not loading in production
- Added fileReplacements configuration for production builds
- Production now correctly uses environment.prod.ts with Netlify URLs
- Fixed ERR_CONNECTION_REFUSED errors for Fasting Tracker MFE

### Technical
- Added fileReplacements to angular.json production configuration
- Environment files now properly replaced during production builds

---

## [1.1.2] - 2026-01-11

### Fixed
- Service worker now enabled in development mode for PWA testing
- PWA install prompt can now be tested on localhost

### Technical
- Added serviceWorker configuration to angular.json development build
- Changed app.config.ts to enable service worker in dev mode

---

## [1.1.1] - 2026-01-11

### Added
- PWA install prompt component with automatic detection
- Install prompt appears 3 seconds after page load
- Dismissal state management (7-day cooldown)
- PWA translations in English and Hindi

### Fixed
- Mobile topbar overcrowding - hidden language/theme selectors on mobile
- Improved mobile spacing and touch targets
- Better responsive design for screens < 768px
- Logo size optimization for mobile (28px)

### Changed
- Mobile topbar now shows only notifications and profile
- Language/theme accessible via sidebar settings on mobile
- Reduced button padding and gaps on small screens

---

## [1.1.0] - 2026-01-11

### Added
- Responsive sidebar navigation with collapse/expand functionality
- New top bar with logo, notifications, language selector, theme selector, and user profile
- SidebarService for centralized sidebar state management
- Logo integration with custom favicon (rounded corners)
- State persistence in localStorage for sidebar collapsed state
- Mobile drawer support with overlay backdrop
- "Coming Soon" badge for Tasks navigation link

### Changed
- Redesigned entire Shell navigation from horizontal to sidebar layout
- Logo now in top bar (clickable to home) instead of sidebar
- Updated navigation structure with icon-only mode when collapsed
- Improved responsive design with mobile/desktop breakpoints
- Enhanced active route highlighting

### Fixed
- Removed duplicate FitLog logos
- Fixed excessive padding in sidebar navigation
- Corrected logo positioning and styling
- Fixed empty space issues in sidebar

### Technical
- Created TopbarComponent with utility controls
- Refactored SidebarComponent with responsive design
- Added RouterModule imports for navigation
- Improved component structure and separation of concerns

---

## [1.0.0] - 2026-01-10

### Added
- Initial Shell application with Module Federation
- Multi-language support (English/Hindi)
- Theme switching (Light/Dark/System)
- Basic navigation and routing
- Footer with copyright and version display
- Integration with Weight Tracker, Trends, Streaks, and Fasting MFEs

### Technical
- Angular 19 standalone components
- Native Federation for micro-frontend architecture
- Service Worker for PWA support
- NGRX store integration (basic setup)

---

## Version History

- **v1.1.0** (2026-01-11) - Shell UI Redesign
- **v1.0.0** (2026-01-10) - Initial Release

---

For detailed release notes, see individual changelog files in the `changelog/` directory.
