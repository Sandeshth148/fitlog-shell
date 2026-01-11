# Changelog v1.1.2 - Service Worker Configuration Fix

**Release Date:** January 11, 2026

## 🔧 Technical Fixes

### Service Worker Configuration
- **Enabled service worker in development mode**
  - Added `serviceWorker: "src/ngsw-config.json"` to development configuration in angular.json
  - Changed `enabled: !isDevMode()` to `enabled: true` in app.config.ts
  - Allows PWA install prompt testing on localhost

### Why This Was Needed
- Service worker was only configured for production builds
- PWA install prompt requires active service worker
- `beforeinstallprompt` event only fires when service worker is registered
- Development testing was not possible without this change

## 📝 Notes
- Service worker now works in both development and production
- PWA install prompt will function on localhost
- Browser install button will appear when all PWA criteria are met
- No changes to production behavior - already working correctly

## 🎯 Breaking Changes
- None - backward compatible

---

**Previous Version:** v1.1.1  
**Current Version:** v1.1.2  
**Next Planned Version:** v1.2.0 (Task Tracker MFE Integration)
