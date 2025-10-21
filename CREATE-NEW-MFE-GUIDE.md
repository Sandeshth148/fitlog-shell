# 🚀 Create New MFE - Step-by-Step Guide

**The Easiest Way to Add a New Micro-Frontend to FitLog**

---

## 📋 Prerequisites

- ✅ Node.js 18+ installed
- ✅ Angular CLI 19.2+ installed (`npm install -g @angular/cli`)
- ✅ Git installed
- ✅ fitlog-shell running and working

---

## ⚡ Quick Start (5 Minutes)

### **Example: Creating Weight Tracker MFE**

```bash
# 1. Navigate to Phase-1 folder
cd "c:\Users\sande\OneDrive\Documents\Workspace\Personal-Projects\Phase-1-FitLog-MFE"

# 2. Create new Angular app
ng new fitlog-weight-tracker --routing --style=scss --standalone --ssr=false

# 3. Navigate to new project
cd fitlog-weight-tracker

# 4. Add Native Federation
ng add @angular-architects/native-federation --port 4202 --type remote

# 5. Update federation.config.js (see below)

# 6. Install dependencies
npm install

# 7. Start development server
npm start

# 8. Test in fitlog-shell
# Navigate to http://localhost:4200/demo
# Click "Load Movie List MFE" (update to load your MFE)
```

**Done! Your MFE is ready!** ✅

---

## 📝 Detailed Step-by-Step Guide

### **Step 1: Create Angular Application**

```bash
cd "Personal-Projects/Phase-1-FitLog-MFE"
ng new fitlog-weight-tracker --routing --style=scss --standalone --ssr=false
```

**Options Explained:**
- `--routing` - Adds Angular Router
- `--style=scss` - Use SCSS for styling
- `--standalone` - Use standalone components (modern approach)
- `--ssr=false` - No server-side rendering (not needed for MFE)

**When prompted:**
- Server-Side Rendering (SSR)? → **No (N)**

### **Step 2: Navigate to Project**

```bash
cd fitlog-weight-tracker
```

### **Step 3: Add Native Federation**

```bash
ng add @angular-architects/native-federation --port 4202 --type remote
```

**What this does:**
- ✅ Installs `@angular-architects/native-federation`
- ✅ Creates `federation.config.js`
- ✅ Creates `src/bootstrap.ts`
- ✅ Updates `src/main.ts`
- ✅ Updates `angular.json`
- ✅ Configures port 4202

**Port Assignment:**
- fitlog-shell: 4200 (host)
- fitlog-weight-tracker: 4202 (MFE)
- fitlog-streaks: 4203 (MFE)
- fitlog-fasting: 4204 (MFE)
- fitlog-ai-chatbot: 4205 (MFE)
- fitlog-ai-insights: 4206 (MFE)

### **Step 4: Update federation.config.js**

**IMPORTANT:** Change `strictVersion` to `false`!

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'fitlog-weight-tracker',  // ← Your MFE name
  
  exposes: {
    './Component': './src/app/app.component.ts',  // ← What to expose
  },
  
  shared: {
    ...shareAll({ 
      singleton: true,         // ✅ One instance only
      strictVersion: false,    // ✅ IMPORTANT: Allow version flexibility
      requiredVersion: 'auto'  // ✅ Auto-detect from package.json
    }),
  },
  
  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ]
});
```

**Key Changes:**
- Line 4: Set your MFE name
- Line 7: Expose your main component
- Line 13: **strictVersion: false** (CRITICAL!)

### **Step 5: Verify Package.json**

Your `package.json` should have:

```json
{
  "name": "fitlog-weight-tracker",
  "version": "0.0.0",
  "dependencies": {
    "@angular-architects/native-federation": "^20.0.1",
    "@angular/animations": "^19.2.0",
    "@angular/common": "^19.2.0",
    "@angular/compiler": "^19.2.0",
    "@angular/core": "^19.2.0",
    "@angular/forms": "^19.2.0",
    "@angular/platform-browser": "^19.2.0",
    "@angular/platform-browser-dynamic": "^19.2.0",
    "@angular/router": "^19.2.0",
    "@softarc/native-federation-node": "^2.0.10",
    "es-module-shims": "^1.5.12",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  }
}
```

**Note:** Any Angular 19.x.x version is fine! No need to match exactly!

### **Step 6: Install Dependencies**

```bash
npm install
```

This will install all packages. Takes ~30 seconds.

### **Step 7: Start Development Server**

```bash
npm start
```

**Expected Output:**
```
 INFO  Building federation artefacts
Initial chunk files | Names     |  Raw size
polyfills.js        | polyfills | 188.46 kB
main.js             | main      | 277 bytes

Application bundle generation complete.
  ➜  Local:   http://localhost:4202/
```

**Your MFE is now running on port 4202!** ✅

### **Step 8: Test in Shell**

#### **Option A: Update Demo Component**

Edit `fitlog-shell/src/app/pages/demo/demo.component.ts`:

```typescript
async loadMFE() {
  this.loading.set(true);
  this.error.set(null);

  try {
    if (!this.mfeContainer) {
      throw new Error('MFE container not ready');
    }

    // Change port and name to your MFE
    const module = await this.microfrontendService.loadRemoteComponent(
      4202,                        // ← Your MFE port
      'fitlog-weight-tracker'      // ← Your MFE name
    );
    
    this.mfeContainer.clear();
    this.componentRef = this.mfeContainer.createComponent(module.AppComponent);
    this.componentRef.changeDetectorRef.detectChanges();
    
    this.mfeLoaded.set(true);
    console.log('✅ MFE loaded successfully');
  } catch (err: any) {
    console.error('❌ Failed to load MFE:', err);
    this.error.set('Failed to load MFE. Is it running on port 4202?');
  } finally {
    this.loading.set(false);
  }
}
```

#### **Option B: Create New Route**

Create a dedicated route for your MFE in `fitlog-shell/src/app/app.routes.ts`:

```typescript
{
  path: 'weight-tracker',
  loadComponent: () => import('./pages/weight-tracker/weight-tracker.component')
    .then(m => m.WeightTrackerComponent)
}
```

Then create the component that loads your MFE.

### **Step 9: Verify It Works**

1. ✅ fitlog-shell running on http://localhost:4200/
2. ✅ fitlog-weight-tracker running on http://localhost:4202/
3. ✅ Navigate to http://localhost:4200/demo
4. ✅ Click "Load MFE" button
5. ✅ See your MFE loaded!

**Success!** 🎉

---

## 🔧 Customization

### **Adding Your Feature Code**

Now that the MFE is set up, add your actual feature:

```bash
# Generate components
ng generate component components/weight-form
ng generate component components/weight-chart
ng generate component components/bmi-calculator

# Generate services
ng generate service services/weight-tracker

# Generate models
ng generate interface models/weight-entry
```

### **Example: Weight Tracker Component**

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weight-tracker">
      <h1>📊 Weight Tracker</h1>
      <p>Track your weight and BMI over time</p>
      
      <!-- Add your components here -->
      <app-weight-form></app-weight-form>
      <app-weight-chart></app-weight-chart>
    </div>
  `,
  styles: [`
    .weight-tracker {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  title = 'Weight Tracker';
}
```

---

## 📦 Creating GitHub Repository

### **Step 1: Initialize Git**

```bash
cd fitlog-weight-tracker
git init
git add .
git commit -m "Initial commit: Weight Tracker MFE"
```

### **Step 2: Create GitHub Repo**

1. Go to https://github.com/new
2. Repository name: `fitlog-weight-tracker`
3. Description: `Weight & BMI tracking micro-frontend for FitLog`
4. Public or Private
5. **Don't** initialize with README
6. Create repository

### **Step 3: Push to GitHub**

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fitlog-weight-tracker.git
git push -u origin main
```

### **Step 4: Add Documentation**

Copy these files from fitlog-shell:
- README.md (customize for your MFE)
- ARCHITECTURE.md (if needed)
- .gitignore (already created)

---

## 🎨 Styling Your MFE

### **Option 1: Use Shell's Theme**

Your MFE will inherit CSS variables from the shell:

```scss
// src/styles.scss
.my-component {
  background: var(--color-primary);
  color: var(--color-text);
}
```

### **Option 2: Independent Styling**

Create your own theme:

```scss
// src/styles.scss
:root {
  --mfe-primary: #667eea;
  --mfe-secondary: #764ba2;
}

.weight-tracker {
  background: var(--mfe-primary);
}
```

---

## 🧪 Testing Your MFE

### **Unit Tests**

```bash
ng test
```

### **E2E Tests**

```bash
# Install Playwright
npm install -D @playwright/test

# Run tests
npx playwright test
```

### **Integration Test with Shell**

1. Start shell: `cd fitlog-shell && npm start`
2. Start MFE: `cd fitlog-weight-tracker && npm start`
3. Navigate to http://localhost:4200/demo
4. Verify MFE loads correctly

---

## 🚀 Deployment

### **Build for Production**

```bash
npm run build
```

Output will be in `dist/fitlog-weight-tracker/`

### **Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### **Deploy to GitHub Pages**

```bash
# Build with base href
ng build --base-href=/fitlog-weight-tracker/

# Deploy
npx angular-cli-ghpages --dir=dist/fitlog-weight-tracker
```

---

## 📋 Checklist

Use this checklist when creating a new MFE:

### **Setup:**
- [ ] Created Angular app with correct options
- [ ] Added Native Federation
- [ ] Updated `federation.config.js` with `strictVersion: false`
- [ ] Set unique port number
- [ ] Set unique MFE name
- [ ] Installed dependencies

### **Configuration:**
- [ ] Verified `package.json` has Angular 19.x.x
- [ ] Checked `federation.config.js` exposes component
- [ ] Confirmed `strictVersion: false`
- [ ] Verified `singleton: true`

### **Development:**
- [ ] MFE starts on correct port
- [ ] No console errors
- [ ] Component renders correctly
- [ ] Can be loaded in shell

### **Documentation:**
- [ ] Created README.md
- [ ] Documented features
- [ ] Added usage examples
- [ ] Listed dependencies

### **Version Control:**
- [ ] Initialized Git
- [ ] Created GitHub repository
- [ ] Pushed initial commit
- [ ] Added .gitignore

### **Testing:**
- [ ] Unit tests pass
- [ ] Integration with shell works
- [ ] No console errors
- [ ] Performance is acceptable

---

## ⚠️ Common Issues

### **Issue 1: Port Already in Use**

**Error:**
```
Port 4202 is already in use
```

**Solution:**
```bash
# Kill process on port 4202
npx kill-port 4202

# Or use different port
ng serve --port 4203
```

### **Issue 2: MFE Not Loading**

**Error:**
```
Failed to load remote entry
```

**Solution:**
1. Verify MFE is running: http://localhost:4202/
2. Check federation.config.js has correct name
3. Verify shell is using correct port and name
4. Check browser console for errors

### **Issue 3: Version Mismatch**

**Error:**
```
Shared module version mismatch
```

**Solution:**
1. Check `strictVersion: false` in federation.config.js
2. Verify both use Angular 19.x.x (any minor/patch)
3. Restart both shell and MFE

### **Issue 4: Component Not Found**

**Error:**
```
Cannot find module './Component'
```

**Solution:**
```javascript
// federation.config.js
exposes: {
  './Component': './src/app/app.component.ts',  // ← Check path is correct
}
```

---

## 🎓 Best Practices

### **DO:**
- ✅ Use `strictVersion: false` for flexibility
- ✅ Keep MFE focused on one feature
- ✅ Use semantic versioning
- ✅ Document your MFE
- ✅ Write tests
- ✅ Use TypeScript strictly
- ✅ Follow Angular style guide

### **DON'T:**
- ❌ Use `strictVersion: true` (too rigid)
- ❌ Mix multiple features in one MFE
- ❌ Share components between MFEs
- ❌ Hardcode URLs
- ❌ Skip documentation
- ❌ Forget to test
- ❌ Use `any` type everywhere

---

## 📚 Next Steps

After creating your MFE:

1. **Add Features** - Build your actual functionality
2. **Add Tests** - Write unit and integration tests
3. **Add Documentation** - Document API and usage
4. **Integrate with Shell** - Create dedicated route
5. **Deploy** - Push to production
6. **Monitor** - Track performance and errors

---

## 🆘 Need Help?

### **Resources:**
- [fitlog-shell README](../fitlog-shell/README.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [MFE-COMPARISON-GUIDE.md](./MFE-COMPARISON-GUIDE.md)
- [FEDERATION-CONFIG-EXPLAINED.md](./FEDERATION-CONFIG-EXPLAINED.md)

### **Common Questions:**

**Q: Can I use different Angular version?**  
A: Yes! Any Angular 19.x.x version works. Just keep same major version.

**Q: Do I need to copy package-lock.json?**  
A: No! With `strictVersion: false`, you don't need exact versions.

**Q: Can I use different libraries?**  
A: Yes! Each MFE can have its own dependencies (Chart.js, etc.)

**Q: How do I share data between MFEs?**  
A: Use shared services, events, or state management (see ARCHITECTURE.md)

---

## 🎉 Success!

You now know how to create new MFEs for FitLog!

**Remember:**
- Keep it simple
- Use `strictVersion: false`
- Document everything
- Test thoroughly
- Have fun! 🚀

---

**Last Updated:** October 22, 2025  
**Author:** Sandesh  
**Version:** 1.0.0  
**Status:** Production Ready
