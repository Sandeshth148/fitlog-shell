# 🏗️ FitLog Architecture Documentation

**Comprehensive Guide to FitLog's Micro-Frontend Architecture**

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Why Micro-Frontends?](#why-micro-frontends)
3. [Technology Stack](#technology-stack)
4. [System Design](#system-design)
5. [Communication Patterns](#communication-patterns)
6. [Deployment Strategy](#deployment-strategy)
7. [Development Workflow](#development-workflow)
8. [Best Practices](#best-practices)
9. [Future Roadmap](#future-roadmap)

---

## 🎯 Architecture Overview

### **What is a Micro-Frontend?**

A micro-frontend is an architectural pattern where a web application is broken down into smaller, independent applications that work together as a cohesive whole.

**Traditional Monolith:**
```
┌─────────────────────────────────────┐
│         Single Application          │
│  ┌──────────────────────────────┐  │
│  │  Weight Tracker              │  │
│  │  Streaks                     │  │
│  │  Fasting                     │  │
│  │  AI Chatbot                  │  │
│  │  AI Insights                 │  │
│  └──────────────────────────────┘  │
│  All features tightly coupled       │
└─────────────────────────────────────┘
```

**Micro-Frontend Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│                    FitLog Shell                          │
│              (Orchestrator/Host App)                     │
└────────┬────────────────────────────────────────────────┘
         │
         ├──► ┌─────────────────────┐
         │    │ Weight Tracker MFE  │ (Independent App)
         │    └─────────────────────┘
         │
         ├──► ┌─────────────────────┐
         │    │   Streaks MFE       │ (Independent App)
         │    └─────────────────────┘
         │
         ├──► ┌─────────────────────┐
         │    │  Fasting MFE        │ (Independent App)
         │    └─────────────────────┘
         │
         ├──► ┌─────────────────────┐
         │    │ AI Chatbot MFE      │ (Independent App)
         │    └─────────────────────┘
         │
         └──► ┌─────────────────────┐
              │ AI Insights MFE     │ (Independent App)
              └─────────────────────┘
```

---

## 💡 Why Micro-Frontends?

### **Problems with Monolithic Frontend:**

1. ❌ **Slow Development** - All developers work in same codebase
2. ❌ **Risky Deployments** - One bug can break entire app
3. ❌ **Technology Lock-in** - Stuck with one framework/version
4. ❌ **Difficult Scaling** - Can't scale features independently
5. ❌ **Long Build Times** - Entire app must rebuild for small changes

### **Benefits of Micro-Frontends:**

1. ✅ **Independent Development** - Teams work on separate codebases
2. ✅ **Safe Deployments** - Deploy one feature without affecting others
3. ✅ **Technology Freedom** - Each MFE can use different tech
4. ✅ **Easy Scaling** - Scale popular features independently
5. ✅ **Fast Builds** - Only rebuild what changed
6. ✅ **Better Organization** - Clear boundaries between features
7. ✅ **Easier Testing** - Test features in isolation

### **Real-World Example:**

Imagine you want to add AI Chatbot:

**Monolith Approach:**
- Add code to existing app
- Risk breaking weight tracker, streaks, etc.
- Must redeploy entire app
- Users download larger bundle

**Micro-Frontend Approach:**
- Create separate AI Chatbot app
- Develop and test independently
- Deploy only chatbot
- Users load chatbot only when needed

---

## 🛠️ Technology Stack

### **Core Technologies**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 19.2.0 | Frontend framework |
| **TypeScript** | 5.7.2 | Type-safe JavaScript |
| **Native Federation** | 20.0.1 | Micro-frontend orchestration |
| **RxJS** | 7.8.0 | Reactive programming |
| **SCSS** | - | Styling |

### **Why These Technologies?**

#### **Angular 19.2.0**
- **Standalone Components** - No NgModules needed, simpler architecture
- **Signals** - Better performance, reactive state management
- **Built-in Federation** - Native support for micro-frontends
- **TypeScript** - Type safety prevents bugs

#### **Native Federation**
- **No Webpack** - Uses esbuild (10x faster builds)
- **Runtime Loading** - Load MFEs dynamically at runtime
- **Version Independence** - Different MFEs can use different Angular versions
- **Simple Configuration** - Minimal setup required

---

## 🏛️ System Design

### **Component Hierarchy**

```
FitLog Shell (Host)
│
├── App Component (Root)
│   ├── Navigation (Shared)
│   ├── Router Outlet (Dynamic)
│   └── Footer (Shared)
│
├── Home Page
│   └── Feature Cards
│
├── Demo Page
│   └── MFE Loader (Dynamic Component)
│
└── Future Pages
    ├── Weight Tracker (Loads MFE)
    ├── Streaks (Loads MFE)
    ├── Fasting (Loads MFE)
    ├── AI Chatbot (Loads MFE)
    └── AI Insights (Loads MFE)
```

### **Data Flow**

```
User Action
    ↓
Shell Router
    ↓
MicroFrontendService.loadRemoteComponent()
    ↓
Native Federation Runtime
    ↓
Fetch Remote Entry (http://localhost:4202/remoteEntry.json)
    ↓
Load Remote Module
    ↓
Create Component Dynamically
    ↓
Render in ViewContainerRef
    ↓
User Sees MFE
```

---

## 🔄 Communication Patterns

### **1. Shell-to-MFE Communication**

**Method: Input Properties**

```typescript
// Shell passes data to MFE
this.componentRef = this.container.createComponent(RemoteComponent);
this.componentRef.instance.userId = '123';
this.componentRef.instance.theme = 'dark';
```

### **2. MFE-to-Shell Communication**

**Method: Output Events**

```typescript
// MFE emits events to shell
this.componentRef.instance.onSave.subscribe((data) => {
  console.log('MFE saved:', data);
});
```

### **3. MFE-to-MFE Communication**

**Method: Shared Service (Future)**

```typescript
// Shared state service
@Injectable({ providedIn: 'root' })
export class SharedStateService {
  private userState = new BehaviorSubject(null);
  user$ = this.userState.asObservable();
  
  setUser(user: any) {
    this.userState.next(user);
  }
}
```

### **4. Event Bus Pattern (Future)**

```typescript
// Global event bus for cross-MFE communication
export class EventBusService {
  private events = new Subject<AppEvent>();
  
  emit(event: AppEvent) {
    this.events.next(event);
  }
  
  on(eventType: string) {
    return this.events.pipe(
      filter(e => e.type === eventType)
    );
  }
}
```

---

## 🚀 Deployment Strategy

### **Development Environment**

```
Local Machine:
├── fitlog-shell:4200      (Shell)
├── fitlog-weight:4202     (Weight Tracker MFE)
├── fitlog-streaks:4203    (Streaks MFE)
├── fitlog-fasting:4204    (Fasting MFE)
├── fitlog-chatbot:4205    (AI Chatbot MFE)
└── fitlog-insights:4206   (AI Insights MFE)
```

### **Production Deployment**

**Option 1: GitHub Pages (Free)**
```
https://sandeshth148.github.io/fitlog-shell/
https://sandeshth148.github.io/fitlog-weight-tracker/
https://sandeshth148.github.io/fitlog-streaks/
...
```

**Option 2: Vercel/Netlify (Recommended)**
```
https://fitlog-shell.vercel.app/
https://fitlog-weight.vercel.app/
https://fitlog-streaks.vercel.app/
...
```

**Option 3: Docker + Cloud**
```
Docker Containers:
├── fitlog-shell:80
├── fitlog-weight:81
├── fitlog-streaks:82
...

Deployed to:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
```

### **Deployment Workflow**

```
Developer Push
    ↓
GitHub Actions Trigger
    ↓
Run Tests
    ↓
Build Production Bundle
    ↓
Deploy to Vercel/Netlify
    ↓
Update DNS/CDN
    ↓
Users Get New Version
```

---

## 👨‍💻 Development Workflow

### **Adding a New Feature (MFE)**

#### **Step 1: Create New Repository**
```bash
# Create new Angular app
ng new fitlog-fasting --routing --style=scss --standalone

# Add Native Federation
cd fitlog-fasting
ng add @angular-architects/native-federation --project fitlog-fasting --port 4204 --type remote
```

#### **Step 2: Configure Federation**

**federation.config.js:**
```javascript
module.exports = withNativeFederation({
  name: 'fitlog-fasting',
  exposes: {
    './Component': './src/app/app.component.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

#### **Step 3: Develop Feature**
```bash
# Run locally
npm start  # Runs on port 4204
```

#### **Step 4: Integrate with Shell**

**In fitlog-shell:**
```typescript
// Load the new MFE
const module = await this.mfeService.loadRemoteComponent(4204, 'fitlog-fasting');
this.container.createComponent(module.AppComponent);
```

#### **Step 5: Deploy**
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

---

## ✨ Best Practices

### **1. Keep MFEs Independent**
- ❌ Don't share components between MFEs
- ✅ Each MFE should be self-contained
- ✅ Use shared services for communication

### **2. Version Management**
- ✅ Use exact versions in package.json
- ✅ Test MFE compatibility before deploying
- ❌ Don't mix Angular versions (can cause issues)

### **3. Performance**
- ✅ Lazy load MFEs (load on demand)
- ✅ Use code splitting
- ✅ Minimize shared dependencies
- ❌ Don't load all MFEs at startup

### **4. Error Handling**
- ✅ Graceful fallbacks if MFE fails to load
- ✅ Show error messages to users
- ✅ Log errors for debugging

### **5. Testing**
- ✅ Test each MFE independently
- ✅ Test integration in shell
- ✅ E2E tests for critical flows

---

## 🔮 Future Roadmap

### **Phase 1: Core Features (Current)**
- ✅ Shell application with routing
- ✅ MFE loading mechanism
- ✅ Demo integration working

### **Phase 2: Feature Migration (Next 2-3 weeks)**
- 🔜 Weight Tracker MFE
- 🔜 Streaks MFE
- 🔜 Fasting Tracker MFE

### **Phase 3: AI Features (3-4 weeks)**
- 🔜 AI Chatbot MFE + Backend
- 🔜 AI Insights MFE + ML Service

### **Phase 4: Cross-Platform (2-3 weeks)**
- 🔜 Electron Desktop App
- 🔜 Capacitor Mobile App (iOS/Android)

### **Phase 5: Backend Services**
- 🔜 User Authentication Service
- 🔜 Data Sync Service
- 🔜 Analytics Service
- 🔜 Notification Service

---

## 📊 Architecture Decisions

### **Why Separate Repos Instead of Monorepo?**

**Considered:**
- NX Monorepo
- Lerna
- Turborepo

**Chose Separate Repos Because:**
1. ✅ Simpler - No monorepo tooling overhead
2. ✅ Independent CI/CD - Each repo has own pipeline
3. ✅ Clear ownership - One repo = one feature
4. ✅ Easier deployment - Deploy one without touching others
5. ✅ Better for learning - Understand each piece independently

### **Why Native Federation Over Module Federation?**

**Module Federation (Webpack):**
- ❌ Requires Webpack configuration
- ❌ Slower builds
- ❌ More complex setup

**Native Federation (esbuild):**
- ✅ Built into Angular
- ✅ 10x faster builds
- ✅ Simpler configuration
- ✅ Better developer experience

---

## 🎓 Learning Resources

### **Micro-Frontends**
- [Micro-Frontends.org](https://micro-frontends.org/)
- [Martin Fowler's Article](https://martinfowler.com/articles/micro-frontends.html)

### **Native Federation**
- [Official Docs](https://www.npmjs.com/package/@angular-architects/native-federation)
- [Manfred Steyer's Blog](https://www.angulararchitects.io/en/blog/)

### **Angular**
- [Angular.dev](https://angular.dev/)
- [Angular University](https://angular-university.io/)

---

## 📝 Glossary

| Term | Definition |
|------|------------|
| **MFE** | Micro-Frontend - Independent frontend application |
| **Shell** | Host application that loads MFEs |
| **Remote** | An MFE that can be loaded remotely |
| **Federation** | Technology to load remote modules at runtime |
| **Native Federation** | Angular's built-in federation using esbuild |
| **Remote Entry** | JSON file that describes what an MFE exposes |
| **Shared Dependencies** | Libraries shared between shell and MFEs |

---

**Last Updated:** October 22, 2025  
**Version:** 1.0.0  
**Author:** Sandesh
