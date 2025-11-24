# 🏋️ FitLog MFE - Micro-Frontend Fitness Tracking App

**Your AI-Powered Fitness Companion**

[![Angular](https://img.shields.io/badge/Angular-19.2.0-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Native Federation](https://img.shields.io/badge/Native%20Federation-2.0-green)](https://www.npmjs.com/package/@angular-architects/native-federation)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 🎯 Project Overview

FitLog is a modern, **micro-frontend architecture** fitness tracking application built with Angular 19 and Native Federation. Track your weight, build healthy habits with streaks, visualize your progress with charts, and get AI-powered insights!

### **Live Demo**
🌐 Coming soon! (Deploying to Netlify)

---

## ✨ Features

### **📊 Weight Tracker**
- Track daily weight entries
- Calculate BMI automatically
- View weight history
- Multi-language support (8 languages)
- Offline-first with IndexedDB

### **🔥 Streaks**
- Daily check-in system
- Streak counter with calendar heatmap
- Gamification (badges, levels, XP)
- Motivational messages
- Separate micro-frontend (Port 4204)

### **📈 Trends & Charts**
- Interactive weight trend chart
- BMI trend visualization
- Time range filters (1M, 3M, 6M, 1Y, All)
- Statistics cards (average, change, current)
- Ideal weight range indicators

### **🤖 AI Insights** (Coming Soon!)
- Personalized daily insights
- Health status assessment
- Progress recognition
- Smart recommendations
- Powered by Google Gemini API

---

## 🏗️ Architecture

### **Micro-Frontend Structure**

```
FitLog MFE
├── fitlog-shell (Port 4200)          # Shell application
│   ├── Weight Tracker (local)
│   ├── Trends/Charts (local)
│   ├── Setup page
│   └── Home dashboard
│
├── fitlog-streaks (Port 4204)        # Streaks MFE (federated)
│   └── Daily habit tracking
│
└── fitlog-ai-insights (Coming Soon)  # AI features MFE
    └── Personalized insights
```

### **Technology Stack**

**Frontend:**
- Angular 19.2.0 (Standalone components)
- Native Federation (Module Federation)
- Chart.js 4.5.1 + chartjs-adapter-date-fns
- TypeScript 5.7 (strict mode)
- SCSS for styling

**Storage:**
- IndexedDB (via idb package)
- LocalStorage (profile backup)
- Offline-first architecture

**State Management:**
- Angular Signals (reactive)
- Services with RxJS
- Shared state via federation

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 20.x or higher
- npm 10.x or higher
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

The app will be available at `http://localhost:4200`

### **Running with Streaks MFE**

```bash
# Terminal 1: Start Shell
cd fitlog-shell
npm start

# Terminal 2: Start Streaks MFE
cd fitlog-streaks
npm start
```

- Shell: `http://localhost:4200`
- Streaks: `http://localhost:4204`

---

## 📁 Project Structure

```
Phase-1-FitLog-MFE/
├── fitlog-shell/                    # Main shell application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/               # Core services & guards
│   │   │   │   ├── guards/         # Route guards
│   │   │   │   ├── pipes/          # Custom pipes
│   │   │   │   └── services/       # Shared services
│   │   │   ├── features/           # Feature modules
│   │   │   │   └── weight-tracker/ # Weight tracking feature
│   │   │   │       ├── components/ # Charts, forms
│   │   │   │       ├── pages/      # Home, setup, trends
│   │   │   │       └── services/   # Feature services
│   │   │   └── pages/              # Shell pages
│   │   └── public/                 # Static assets
│   │       └── federation.manifest.json
│   ├── federation.config.js        # Federation configuration
│   └── package.json
│
├── fitlog-streaks/                  # Streaks micro-frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/         # Streak components
│   │   │   ├── services/           # Streak services
│   │   │   └── models/             # Data models
│   │   └── public/
│   ├── federation.config.js
│   └── package.json
│
├── PROJECT-STATUS-NOV-2024.md       # Current status & roadmap
├── DEPLOYMENT-CHECKLIST.md          # Deployment guide
└── README.md                        # This file
```

---

## 🎨 Features in Detail

### **Weight Tracker**

**Capabilities:**
- Add weight entries with date validation
- Automatic BMI calculation based on height
- View weight history in table format
- Edit/delete existing entries
- Export data (coming soon)

**Validations:**
- Height must be set before tracking weight
- Date cannot be in the future
- One entry per day
- Weight range: 20-300 kg

### **Streaks**

**Gamification System:**
- **XP System:** Earn 10 XP per check-in
- **Levels:** Progress through 10 levels
- **Badges:** Unlock achievements
  - 🔥 First Check-in
  - 🎯 3-Day Streak
  - 💪 7-Day Streak
  - 🏆 30-Day Streak
  - 👑 100-Day Streak

**Calendar Heatmap:**
- Visual representation of check-ins
- Color intensity based on consistency
- Monthly view with navigation

### **Trends & Charts**

**Weight Chart:**
- Line chart with time-series data
- Ideal weight range visualization
- Statistics: average, change, current
- Responsive design

**BMI Chart:**
- BMI trend over time
- Category indicators (underweight, normal, overweight, obese)
- BMI change tracking

**Time Ranges:**
- 1 Month (30 days)
- 3 Months (90 days)
- 6 Months (180 days)
- 1 Year (365 days)
- All Time (5 years max)

---

## 🌍 Multi-Language Support

**Supported Languages:**
- 🇬🇧 English
- 🇮🇳 Hindi (हिंदी)
- 🇮🇳 Kannada (ಕನ್ನಡ)
- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Tamil (தமிழ்)
- 🇫🇷 French (Français)
- 🇩🇪 German (Deutsch)
- 🇪🇸 Spanish (Español)

**Translation Coverage:**
- Navigation & UI labels
- Feature-specific content
- Error messages
- Success notifications
- Fallback to English for missing keys

---

## 🔧 Development

### **Available Scripts**

```bash
# Development
npm start              # Start dev server (port 4200)
npm run build          # Production build
npm run watch          # Build in watch mode
npm test               # Run unit tests
npm run lint           # Lint code

# Federation
npm run serve:prod     # Serve production build
```

### **Build Configuration**

**Development:**
- Source maps enabled
- Hot module replacement
- Fast refresh

**Production:**
- Optimized bundles
- Tree shaking
- Minification
- Source maps disabled
- Output hashing

---

## 📦 Deployment

### **Netlify (Recommended)**

```bash
# Build settings
Build command: npm run build
Publish directory: dist/fitlog-shell/browser
Node version: 20
```

**Deploy:**
1. Connect GitHub repository
2. Configure build settings
3. Deploy!

**Live URL:** `https://your-app.netlify.app`

### **Vercel**

```bash
# Vercel auto-detects Angular
vercel --prod
```

### **Cloudflare Pages**

```bash
# Build settings
Build command: npm run build
Build output: dist/fitlog-shell/browser
```

---

## 🎯 Roadmap

### **Phase 1: Foundation** ✅ (Completed)
- ✅ Shell application
- ✅ Weight Tracker
- ✅ Streaks MFE
- ✅ Trends/Charts
- ✅ Multi-language support
- ✅ Offline-first storage

### **Phase 2: AI Integration** 🔄 (In Progress)
- [ ] AI Insights feature
- [ ] Daily Goals tracker
- [ ] Enhanced dashboard UX
- [ ] Gemini API integration
- [ ] Personalized recommendations

### **Phase 3: Backend** 🚀 (Planned)
- [ ] NestJS backend
- [ ] User authentication (OAuth)
- [ ] Multi-device sync
- [ ] Cloud storage
- [ ] API gateway

### **Phase 4: Advanced Features** 💡 (Future)
- [ ] Fasting tracker MFE
- [ ] AI chatbot
- [ ] Social features
- [ ] Data export/import
- [ ] PWA support

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sandesh T H**
- GitHub: [@Sandeshth148](https://github.com/Sandeshth148)
- Email: sandeshth148@gmail.com

---

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Native Federation for micro-frontend support
- Chart.js for beautiful visualizations
- Google Gemini for AI capabilities
- Open source community

---

## 📚 Documentation

- [Project Status](PROJECT-STATUS-NOV-2024.md) - Current status & roadmap
- [Deployment Guide](DEPLOYMENT-CHECKLIST.md) - How to deploy
- [Architecture](fitlog-shell/ARCHITECTURE.md) - Technical deep dive
- [Federation Config](fitlog-shell/FEDERATION-CONFIG-EXPLAINED.md) - Module Federation details

---

## 🐛 Known Issues

- Streaks MFE requires localhost:4204 in development
- Chart.js time scale requires explicit registration
- IndexedDB not supported in private browsing

---

## 💬 Support

Having issues? Please check:
1. [GitHub Issues](https://github.com/Sandeshth148/fitlog-shell/issues)
2. [Documentation](PROJECT-STATUS-NOV-2024.md)
3. Create a new issue if needed

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using Angular 19 and Native Federation**
