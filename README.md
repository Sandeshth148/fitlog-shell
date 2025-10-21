# 🏋️ FitLog Shell

**The Host Application for FitLog Micro-Frontend Ecosystem**

[![Angular](https://img.shields.io/badge/Angular-19.2.0-red.svg)](https://angular.io/)
[![Native Federation](https://img.shields.io/badge/Native%20Federation-20.0.1-blue.svg)](https://www.npmjs.com/package/@angular-architects/native-federation)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)

---

## 📖 **Table of Contents**

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Micro-Frontends](#micro-frontends)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 **Overview**

FitLog Shell is the **host application** that orchestrates multiple micro-frontends (MFEs) in the FitLog ecosystem. It provides:

- 🏠 **Unified Entry Point** - Single application that loads all features
- 🔌 **Dynamic Loading** - Micro-frontends loaded on-demand
- 🎨 **Consistent UI** - Shared navigation and theming
- 🚀 **Independent Deployment** - Each MFE can be deployed separately
- 📦 **Modular Architecture** - Features are isolated and maintainable

---

## 🏗️ **Architecture**

### **Micro-Frontend Pattern**

FitLog uses **Native Federation** (Angular's built-in module federation) to implement a micro-frontend architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    FitLog Shell (Port 4200)              │
│                      Host Application                    │
├─────────────────────────────────────────────────────────┤
│  Navigation │ Routing │ Shared Services │ Theme         │
└────────┬────────────────────────────────────────────────┘
         │
         ├──► Weight Tracker MFE (Port 4202)
         ├──► Streaks MFE (Port 4203)
         ├──► Fasting Tracker MFE (Port 4204)
         ├──► AI Chatbot MFE (Port 4205)
         └──► AI Insights MFE (Port 4206)
```

### **Key Benefits**

1. **Independent Development** - Teams can work on different features simultaneously
2. **Technology Flexibility** - Each MFE can use different versions/libraries
3. **Scalability** - Features can be scaled independently
4. **Faster Deployments** - Deploy one feature without affecting others
5. **Better Performance** - Load only what's needed, when needed

---

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18+ and npm
- Angular CLI 19.2+
- Git

### **Installation**

```bash
# Clone the repository
git clone https://github.com/Sandeshth148/fitlog-shell.git
cd fitlog-shell

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200/`

---

## 📁 **Project Structure**

```
fitlog-shell/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── home/              # Landing page
│   │   │   └── demo/              # MFE demo page
│   │   ├── micro-frontend.service.ts  # MFE loader service
│   │   ├── app.component.*        # Root component
│   │   ├── app.routes.ts          # Application routes
│   │   └── app.config.ts          # App configuration
│   ├── main.ts                    # Bootstrap with federation
│   └── bootstrap.ts               # Application bootstrap
├── public/
│   └── federation.manifest.json   # MFE registry
├── federation.config.js           # Federation configuration
├── angular.json                   # Angular CLI config
├── package.json                   # Dependencies
└── README.md                      # This file
```

---

## 🔌 **Micro-Frontends**

### **Current MFEs**

| Name | Port | Status | Description |
|------|------|--------|-------------|
| **fitlog-shell** | 4200 | ✅ Active | Host application |
| **movie-list** | 4201 | ✅ Demo | Example MFE for testing |

### **Planned MFEs**

| Name | Port | Status | Description |
|------|------|--------|-------------|
| **fitlog-weight-tracker** | 4202 | 🔜 Planned | Weight & BMI tracking |
| **fitlog-streaks** | 4203 | 🔜 Planned | Daily habit streaks |
| **fitlog-fasting** | 4204 | 🔜 Planned | Intermittent fasting timer |
| **fitlog-ai-chatbot** | 4205 | 🔜 Planned | AI-powered fitness assistant |
| **fitlog-ai-insights** | 4206 | 🔜 Planned | ML-based insights & predictions |

---

## 💻 **Development**

### **Running Locally**

```bash
# Start the shell application
npm start

# The app runs on http://localhost:4200/
```

### **Testing MFE Integration**

1. Start a micro-frontend (e.g., movie-list on port 4201)
2. Navigate to `/demo` in the shell
3. Click "Load Movie List MFE"
4. The remote component will load dynamically

### **Adding a New MFE**

1. Create the MFE project (separate repository)
2. Configure Native Federation
3. Expose components via `federation.config.js`
4. Load in shell using `MicroFrontendService`

---

## 🚢 **Deployment**

### **Build for Production**

```bash
npm run build
```

Build artifacts will be in `dist/fitlog-shell/`

### **Deployment Options**

- **GitHub Pages** - Free hosting for static sites
- **Vercel/Netlify** - Automatic deployments on push
- **Docker** - Containerized deployment
- **Cloud Providers** - AWS, Azure, GCP

---

## 🤝 **Contributing**

This is a personal project, but suggestions and feedback are welcome!

---

## 📄 **License**

Private project - All rights reserved

---

## 👨‍💻 **Author**

**Sandesh**
- GitHub: [@Sandeshth148](https://github.com/Sandeshth148)

---

## 📚 **Learn More**

- [Angular Native Federation](https://www.npmjs.com/package/@angular-architects/native-federation)
- [Micro-Frontend Architecture](https://micro-frontends.org/)
- [Angular Documentation](https://angular.dev/)

---

**Built with ❤️ and Angular**
