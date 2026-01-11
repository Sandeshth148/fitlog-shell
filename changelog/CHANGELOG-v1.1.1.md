# Changelog v1.1.1 - Mobile Fixes & PWA Install Prompt

**Release Date:** January 11, 2026

## 🐛 Bug Fixes

### Mobile Responsive Issues
- **Fixed topbar overcrowding on mobile devices**
  - Hidden language and theme selectors on screens < 768px
  - Kept only notifications and profile buttons visible on mobile
  - Reduced spacing and padding for better mobile layout
  - Adjusted logo size for smaller screens (28px on mobile)

### Layout Improvements
- Improved button spacing on mobile (0.25rem gap)
- Better padding for topbar container on small screens
- Optimized touch targets for mobile interaction

## ✨ New Features

### PWA Install Prompt
- **Added install prompt component**
  - Automatic prompt appears 3 seconds after page load
  - Beautiful slide-in animation from bottom
  - Shows only if app is not already installed
  - Respects user dismissal (won't show again for 7 days)
  - Fully responsive design for mobile and desktop

### PWA Features
- Install button with native browser prompt
- "Not now" dismiss option
- Persistent state management (localStorage)
- Multi-language support (English & Hindi)
- Accessible design with proper ARIA labels

## 🌐 Translations

### Added PWA Translations
- **English:**
  - "Install FitLog App"
  - "Add FitLog to your home screen for quick access and offline use"
  - "Install" / "Not now"

- **Hindi:**
  - "FitLog ऐप इंस्टॉल करें"
  - "त्वरित पहुंच और ऑफ़लाइन उपयोग के लिए FitLog को अपनी होम स्क्रीन पर जोड़ें"
  - "इंस्टॉल करें" / "अभी नहीं"

## 🔧 Technical Changes

### New Components
- `PwaInstallPromptComponent` - Handles PWA installation flow
- Integrated with `beforeinstallprompt` browser event
- State management for prompt visibility and dismissal

### Code Improvements
- Better mobile responsive breakpoints
- Improved CSS media queries
- Enhanced translation service with PWA keys
- Fixed duplicate translation keys in Hindi

## 📱 Mobile Improvements

**Before:**
- Topbar cluttered with 4+ buttons
- Language/theme selectors taking too much space
- Poor touch targets on mobile

**After:**
- Clean topbar with only essential buttons (notifications, profile)
- Language/theme accessible via sidebar on mobile
- Better spacing and larger touch targets

## 🎯 Breaking Changes
- None - backward compatible

## 📝 Notes
- Version updated from 1.1.0 to 1.1.1
- PWA manifest already configured (from v1.0.0)
- Service worker already registered
- Install prompt will only show on HTTPS or localhost

---

**Previous Version:** v1.1.0  
**Current Version:** v1.1.1  
**Next Planned Version:** v1.2.0 (Task Tracker MFE Integration)
