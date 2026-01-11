# Changelog v1.1.3 - Production Environment Fix

**Release Date:** January 11, 2026

## 🐛 Critical Bug Fix

### Fasting Tracker Not Loading in Production
- **Fixed production build using wrong environment file**
  - Added `fileReplacements` configuration to angular.json
  - Production builds now correctly use `environment.prod.ts`
  - Fasting Tracker now loads from Netlify URL instead of localhost

### Root Cause
- Angular build was not replacing environment files for production
- `environment.ts` (dev) was being used in production builds
- Caused Fasting Tracker to try loading from `localhost:4206` instead of `https://fitlog-fasting-tracker.netlify.app`

### What Was Fixed
```json
"production": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ],
  ...
}
```

## 🔧 Technical Details

### Before Fix
- Production build: `environment.production = false`
- MFE URL: `http://localhost:4206` (dev URL)
- Result: ERR_CONNECTION_REFUSED

### After Fix
- Production build: `environment.production = true`
- MFE URL: `https://fitlog-fasting-tracker.netlify.app` (prod URL)
- Result: ✅ Fasting Tracker loads correctly

## 📝 Impact

### Fixed
- Fasting Tracker now loads in production
- All MFEs now use correct production URLs
- No more localhost connection errors

### Verified Working
- ✅ Streaks MFE
- ✅ AI Insights MFE
- ✅ Fasting Tracker MFE
- ✅ Weight Tracker (integrated)

## 🎯 Breaking Changes
- None - backward compatible

---

**Previous Version:** v1.1.2  
**Current Version:** v1.1.3  
**Next Planned Version:** v1.2.0 (Task Tracker MFE Integration)
