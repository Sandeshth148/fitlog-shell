# 📦 Version Management Strategy

**Ensuring Compatibility Across All MFEs**

---

## 🎯 Philosophy

**"Lock what matters, flex what doesn't"**

- ✅ **Lock:** Angular, Native Federation (must match across MFEs)
- ✅ **Flex:** Utilities, UI libraries (can vary per MFE)

---

## 🔒 Locked Versions (Must Match Across All MFEs)

These versions **MUST** be identical in shell and all MFEs:

```json
{
  "@angular/animations": "^19.2.0",
  "@angular/common": "^19.2.0",
  "@angular/compiler": "^19.2.0",
  "@angular/core": "^19.2.0",
  "@angular/forms": "^19.2.0",
  "@angular/platform-browser": "^19.2.0",
  "@angular/platform-browser-dynamic": "^19.2.0",
  "@angular/router": "^19.2.0",
  "@angular-architects/native-federation": "^20.0.1",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0",
  "zone.js": "~0.15.0",
  "typescript": "~5.7.2"
}
```

**Why?**
- Native Federation shares these libraries at runtime
- Version mismatch = runtime errors
- Angular requires all packages to be same version

---

## 🔓 Flexible Versions (Can Vary Per MFE)

These can be different across MFEs:

```json
{
  "@angular/cdk": "any version",
  "@angular/material": "any version",
  "chart.js": "any version",
  "date-fns": "any version",
  "lodash": "any version",
  // Any non-Angular library
}
```

**Why?**
- Not shared via federation
- Each MFE bundles its own copy
- No runtime conflicts

---

## 📋 Version Update Strategy

### **When to Update:**

1. **Security Patches** - Update immediately
2. **Bug Fixes** - Update within 1 week
3. **Minor Versions** - Update quarterly
4. **Major Versions** - Plan carefully, test thoroughly

### **How to Update:**

#### **Option 1: Manual Sync (Current)**
```bash
# Update shell
cd fitlog-shell
npm update @angular/core

# Update each MFE
cd ../fitlog-weight-tracker
npm update @angular/core
# Repeat for all MFEs
```

#### **Option 2: Shared Package.json Template (Recommended)**

Create a `shared-versions.json`:

```json
{
  "angular": "^19.2.0",
  "nativeFederation": "^20.0.1",
  "typescript": "~5.7.2",
  "rxjs": "~7.8.0"
}
```

Then use a script to sync:

```bash
node sync-versions.js
```

#### **Option 3: Workspace (Future - If Needed)**

If managing versions becomes painful, we can use:
- **npm workspaces** (simple)
- **pnpm workspaces** (faster)
- **NX** (only if we have 10+ MFEs)

---

## 🛡️ Version Compatibility Matrix

| Shell Version | Compatible MFE Versions | Notes |
|---------------|------------------------|-------|
| Angular 19.2.0 | Angular 19.2.x | Patch versions OK |
| Angular 19.3.0 | Angular 19.3.x | Must upgrade all together |
| Angular 20.0.0 | Angular 20.0.x | Major upgrade - test thoroughly |

---

## 🔧 Troubleshooting Version Issues

### **Error: "Version mismatch detected"**

**Cause:** Shell and MFE have different Angular versions

**Solution:**
```bash
# Check versions
cd fitlog-shell
npm list @angular/core

cd ../fitlog-weight-tracker
npm list @angular/core

# If different, sync them
npm install @angular/core@19.2.0 --save-exact
```

### **Error: "Shared module not found"**

**Cause:** MFE expects a library that shell doesn't provide

**Solution:**
Update `federation.config.js` in shell:

```javascript
shared: {
  ...shareAll({
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto'
  }),
}
```

---

## 📊 Current Version Snapshot

**Last Updated:** October 22, 2025

| Package | Version | Reason |
|---------|---------|--------|
| Angular | 19.2.0 | Latest stable, great performance |
| Native Federation | 20.0.1 | Matches Angular 19 |
| TypeScript | 5.7.2 | Required by Angular 19 |
| RxJS | 7.8.0 | Stable, widely used |
| Zone.js | 0.15.0 | Required by Angular |

---

## 🚀 Upgrade Path

### **To Angular 19.3 (Minor Update)**

```bash
# 1. Update shell
cd fitlog-shell
ng update @angular/core @angular/cli

# 2. Test shell
npm start

# 3. Update each MFE
cd ../fitlog-weight-tracker
ng update @angular/core @angular/cli

# 4. Test integration
# Start shell + MFE, verify loading works
```

### **To Angular 20 (Major Update)**

```bash
# 1. Read migration guide
# https://angular.dev/update-guide

# 2. Create test branch
git checkout -b upgrade/angular-20

# 3. Update shell first
ng update @angular/core@20 @angular/cli@20

# 4. Fix breaking changes

# 5. Update MFEs one by one

# 6. Test thoroughly

# 7. Merge when stable
```

---

## 💡 Best Practices

### **DO:**
- ✅ Keep all Angular packages at same version
- ✅ Use `package-lock.json` for reproducible builds
- ✅ Test after every update
- ✅ Update all MFEs together
- ✅ Document version changes in git commits

### **DON'T:**
- ❌ Mix Angular versions across MFEs
- ❌ Update only one MFE
- ❌ Skip testing after updates
- ❌ Use `npm update` without checking
- ❌ Delete `package-lock.json`

---

## 🔮 Future Improvements

### **Phase 1: Manual (Current)**
- Copy package.json manually
- Update versions manually
- Works for 2-5 MFEs

### **Phase 2: Scripted (When we have 5+ MFEs)**
```bash
# sync-versions.sh
for dir in fitlog-*/; do
  cd "$dir"
  npm install @angular/core@$ANGULAR_VERSION
  cd ..
done
```

### **Phase 3: Automated (If we scale to 10+ MFEs)**
- CI/CD checks version compatibility
- Automated dependency updates (Dependabot)
- Version compatibility tests

---

## 📝 Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2025-10-22 | Initial setup with Angular 19.2.0 | Latest stable version |

---

**Remember:** Consistency is key! All MFEs must use the same core Angular versions.
