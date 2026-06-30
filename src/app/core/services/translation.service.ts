import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translation {
  [key: string]: string | Translation;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  // Make this public so components can subscribe to language changes directly
  public currentLanguage$ = new BehaviorSubject<string>('en');
  private translations: { [key: string]: Translation } = {};

  readonly supportedLanguages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  constructor() {
    this.loadTranslations();
    this.loadSavedLanguage();
    
    // Listen for language changes from other MFEs
    window.addEventListener('fitlog-language-change', (event: any) => {
      if (event.detail && event.detail !== this.currentLanguage$.value) {
        this.currentLanguage$.next(event.detail);
      }
    });
  }

  get currentLanguage() {
    return this.currentLanguage$.asObservable();
  }

  getCurrentLanguageCode(): string {
    return this.currentLanguage$.value;
  }

  setLanguage(languageCode: string) {
    if (this.supportedLanguages.find(lang => lang.code === languageCode)) {
      this.currentLanguage$.next(languageCode);
      localStorage.setItem('fitlog-language', languageCode);
      window.dispatchEvent(new CustomEvent('fitlog-language-change', { detail: languageCode }));
    }
  }

  translate(key: string): string {
    if (!key) return '';
    const currentLang = this.currentLanguage$.value;
    
    // Try to get translation in current language
    let translation = this.getNestedTranslation(this.translations[currentLang], key);
    
    // If not found and not English, fallback to English
    if (!translation && currentLang !== 'en') {
      translation = this.getNestedTranslation(this.translations['en'], key);
      console.log(`🌐 Translation fallback: "${key}" not found in ${currentLang}, using English: "${translation}"`);
    }
    
    // If still not found, return the key itself
    return translation || key;
  }

  private getNestedTranslation(obj: Translation, key: string): string {
    if (!key || !obj) return '';
    const keys = key.split('.');
    let result: any = obj;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return '';
      }
    }
    
    return typeof result === 'string' ? result : '';
  }

  private loadSavedLanguage() {
    const savedLanguage = localStorage.getItem('fitlog-language');
    if (savedLanguage && this.supportedLanguages.find(lang => lang.code === savedLanguage)) {
      this.currentLanguage$.next(savedLanguage);
    }
  }

  private loadTranslations() {
    this.translations = {
      en: {
        nav: { home: 'Home', trends: 'Trends', streaks: 'Streaks', weight: 'Weight', tasks: 'Tasks' },
        streaks: {
          title: 'Streaks',
          subtitle: 'Track your consistency and earn badges!',
          current: 'Current Streak',
          longest: 'Longest Streak',
          total: 'Total Days Logged',
          last: 'Last:',
          noEntries: 'No entries yet',
          personalBest: 'Your personal best!',
          keepUp: 'Keep it up!',
          achievements: 'Your Achievements',
          days: 'days',
          entries: 'entries',
          info: {
             daily: 'Daily Logging',
             dailyDesc: 'Track your weight daily to maintain your streak',
             badges: 'Earn Badges',
             badgesDesc: 'Unlock achievements for consistency',
             progress: 'View Progress',
             progressDesc: 'See your streak history in a heatmap'
          },
          badges: {
             trailblazer: 'Trailblazer',
             trailblazerDesc: 'Complete your profile',
             trailblazerLock: 'Add name & age',
             firstStep: 'First Step',
             firstStepDesc: 'Log your first weight',
             firstStepLock: 'Start tracking',
             legend: 'Legend',
             legendDesc: '365-day streak',
             weekender: 'Weekender',
             weekenderDesc: '7-day streak',
             fortnight: 'Fortnight Fighter',
             fortnightDesc: '14-day streak',
             centurion: 'Centurion',
             centurionDesc: '100-day streak',
             dataCollector: 'Data Collector',
             dataCollectorDesc: '50 total entries',
             dedicated: 'Dedicated',
             dedicatedDesc: '100 total entries',
             earned: 'Earned!'
          }
        },
        home: {
          title: 'Weight Tracker',
          subtitle: 'Your personal weight tracking assistant.',
          addEntry: 'Add Entry',
          noEntries: 'No weight entries yet',
          getStarted: 'Add your first weight entry to get started!',
          recentEntries: 'Recent Entries',
          welcomeTitle: 'FitLog Tracker',
          welcomeSubtitle: 'Your premium all-in-one health, task, and habit companion',
          weightTitle: 'Weight Tracker',
          weightDesc: 'Monitor your weight log, BMI, and weight goal trends over time.',
          streaksTitle: 'Habit Streaks',
          streaksDesc: 'Stay motivated by tracking daily health streaks and achievements.',
          fastingTitle: 'Fasting Timer',
          fastingDesc: 'Configure intermittent fasting schedules and analyze stats.',
          tasksTitle: 'Task Manager',
          tasksDesc: 'Track your daily workouts, meal preps, and fitness activities.',
          aiTitle: 'AI Insights',
          aiDesc: 'Receive personalized health reports based on your fitness logs.'
        },
        trends: { title: 'Health Trends', subtitle: 'Track your progress and visualize your fitness journey over time.', weightTrend: 'Weight Trend', bmiTrend: 'BMI Trend', noData: 'No data available for the selected time range.', addEntries: 'Add some weight entries to see your trend!' },
        stats: { average: 'Average', current: 'Current', gained: 'Gained', lost: 'Lost', increased: 'Increased', decreased: 'Decreased', idealRange: 'Ideal Range', status: 'Status', averageBmi: 'Average BMI', currentBmi: 'Current BMI' },
        bmi: { underweight: 'Underweight', normal: 'Normal', overweight: 'Overweight', obese: 'Obese' },
        form: { 
          date: 'Date', 
          weight: 'Weight', 
          notes: 'Notes', 
          height: 'Height', 
          save: 'Save', 
          cancel: 'Cancel', 
          edit: 'Edit', 
          delete: 'Delete',
          at: 'at',
          enterHeight: 'Enter Your Height',
          updateHeight: 'Update Your Height',
          heightDescription: 'We\'ll use this to calculate your BMI and ideal weight range.',
          centimeters: 'Centimeters',
          feetInches: 'Feet & Inches',
          heightCm: 'Height (cm)',
          feet: 'Feet',
          inches: 'Inches',
          heightRequired: 'Height is required.',
          heightPositive: 'Height must be greater than 0.',
          bothRequired: 'Both feet and inches are required.',
          valuesPositive: 'Values must be 0 or greater.',
          inchesLessThan12: 'Inches must be less than 12.',
          yourHeight: 'Your height',
          saveHeight: 'Save Height',
          addWeightEntry: 'Add Weight Entry',
          editWeightEntry: 'Edit Weight Entry',
          units: 'Units',
          time: 'Time (optional)',
          notesOptional: 'Notes (optional)',
          dateRequired: 'Date is required.',
          dateMustBeBetween: 'Date must be between',
          andToday: 'and today.',
          validRange: 'Valid range:',
          to: 'to',
          weightRequired: 'A valid, positive weight is required.',
          saveEntry: 'Save Entry'
        },
        setup: { title: 'Welcome to FitLog', intro: 'Let\'s set up your profile to get started tracking your weight and health metrics.' },
        footer: { copyright: '© {{year}} FitLog. All rights reserved.', tagline: 'Track your fitness journey, one entry at a time.' },
        pwa: { 
          installTitle: 'Install FitLog', 
          installSubtitle: 'Get the full app experience', 
          installButton: 'Install App',
          install: {
            title: 'Install FitLog App',
            description: 'Add FitLog to your home screen for quick access and offline use',
            button: 'Install',
            dismiss: 'Not now'
          }
        },
        profile: {
          title: 'User Profile',
          guest: 'Guest',
          name: 'Name',
          age: 'Age',
          optional: 'optional',
          namePlaceholder: 'Enter your name',
          agePlaceholder: 'Enter your age',
          chooseImage: 'Choose Image',
          imageHint: 'JPG, PNG or GIF (max 5MB)',
          saveSuccess: 'Profile saved successfully',
          saveError: 'Error saving profile',
          validation: {
            nameRequired: 'Name is required',
            nameMinLength: 'Name must be at least 2 characters',
            nameMaxLength: 'Name cannot exceed 50 characters'
          }
        },
        common: {
          save: 'Save',
          saving: 'Saving...',
          cancel: 'Cancel',
          edit: 'Edit',
          delete: 'Delete'
        }
      },
      hi: {
        nav: { home: 'होम', trends: 'रुझान', streaks: 'स्ट्रीक्स', weight: 'वजन', tasks: 'कार्य' },
        home: {
          title: 'वजन ट्रैकर',
          subtitle: 'आपका व्यक्तिगत वजन ट्रैकिंग सहायक।',
          addEntry: 'एंट्री जोड़ें',
          noEntries: 'अभी तक कोई वजन एंट्री नहीं',
          getStarted: 'शुरू करने के लिए अपनी पहली वजन एंट्री जोड़ें!',
          recentEntries: 'हाल की एंट्रीज',
          welcomeTitle: 'फिटलॉग ट्रैकर',
          welcomeSubtitle: 'आपका प्रीमियम ऑल-इन-वन स्वास्थ्य, कार्य और आदत साथी',
          weightTitle: 'वजन ट्रैकर',
          weightDesc: 'समय के साथ अपने वजन लॉग, बीएमआई और वजन लक्ष्य के रुझानों की निगरानी करें।',
          streaksTitle: 'आदत स्ट्रीक्स',
          streaksDesc: 'दैनिक स्वास्थ्य स्ट्रीक्स और उपलब्धियों को ट्रैक करके प्रेरित रहें।',
          fastingTitle: 'फास्टिंग टाइमर',
          fastingDesc: 'रुक-रुक कर उपवास (फास्टिंग) शेड्यूल कॉन्फ़िगर करें और आँकड़ों का विश्लेषण करें।',
          tasksTitle: 'कार्य प्रबंधक',
          tasksDesc: 'अपने दैनिक वर्कआउट, भोजन की तैयारी और फिटनेस गतिविधियों को ट्रैक करें।',
          aiTitle: 'एआई अंतर्दृष्टि',
          aiDesc: 'अपने फिटनेस लॉग के आधार पर व्यक्तिगत स्वास्थ्य रिपोर्ट प्राप्त करें।'
        },
        trends: { title: 'स्वास्थ्य रुझान', subtitle: 'अपनी प्रगति को ट्रैक करें और समय के साथ अपनी फिटनेस यात्रा को देखें।', weightTrend: 'वजन रुझान', bmiTrend: 'बीएमआई रुझान', noData: 'चयनित समय सीमा के लिए कोई डेटा उपलब्ध नहीं।', addEntries: 'अपना रुझान देखने के लिए कुछ वजन एंट्री जोड़ें!' },
        stats: { average: 'औसत', current: 'वर्तमान', gained: 'बढ़ा', lost: 'घटा', increased: 'बढ़ा', decreased: 'घटा', idealRange: 'आदर्श सीमा', status: 'स्थिति', averageBmi: 'औसत बीएमआई', currentBmi: 'वर्तमान बीएमआई' },
        bmi: { underweight: 'कम वजन', normal: 'सामान्य', overweight: 'अधिक वजन', obese: 'मोटापा' },
        profile: {
          title: 'उपयोगकर्ता प्रोफ़ाइल',
          guest: 'अतिथि',
          name: 'नाम',
          namePlaceholder: 'अपना नाम दर्ज करें',
          chooseImage: 'छवि चुनें',
          imageHint: 'JPG, PNG या GIF (अधिकतम 5MB)',
          saveSuccess: 'प्रोफ़ाइल सफलतापूर्वक सहेजा गया',
          saveError: 'प्रोफ़ाइल सहेजने में त्रुटि',
          validation: {
            nameRequired: 'नाम आवश्यक है',
            nameMinLength: 'नाम कम से कम 2 अक्षर होना चाहिए',
            nameMaxLength: 'नाम 50 अक्षरों से अधिक नहीं हो सकता'
          }
        },
        common: {
          save: 'सहेजें',
          cancel: 'रद्द करें',
          edit: 'संपादित करें',
          delete: 'हटाएं'
        },
        footer: { copyright: '© {{year}} FitLog. सर्वाधिकार सुरक्षित।', tagline: 'अपनी फिटनेस यात्रा को ट्रैक करें, एक बार में एक एंट्री।' },
        pwa: {
          installTitle: 'FitLog इंस्टॉल करें',
          installSubtitle: 'पूर्ण ऐप अनुभव प्राप्त करें',
          installButton: 'ऐप इंस्टॉल करें',
          install: {
            title: 'FitLog ऐप इंस्टॉल करें',
            description: 'त्वरित पहुंच और ऑफ़लाइन उपयोग के लिए FitLog को अपनी होम स्क्रीन पर जोड़ें',
            button: 'इंस्टॉल करें',
            dismiss: 'अभी नहीं'
          }
        },
        form: { 
          date: 'तारीख', 
          weight: 'वजन', 
          notes: 'नोट्स', 
          height: 'ऊंचाई', 
          save: 'सेव करें', 
          cancel: 'रद्द करें', 
          edit: 'संपादित करें', 
          delete: 'हटाएं',
          at: 'पर',
          enterHeight: 'अपनी ऊंचाई दर्ज करें',
          updateHeight: 'अपनी ऊंचाई अपडेट करें',
          heightDescription: 'हम आपके BMI और आदर्श वजन सीमा की गणना के लिए इसका उपयोग करेंगे।',
          centimeters: 'सेंटीमीटर',
          feetInches: 'फीट और इंच',
          heightCm: 'ऊंचाई (सेमी)',
          feet: 'फीट',
          inches: 'इंच',
          heightRequired: 'ऊंचाई आवश्यक है।',
          heightPositive: 'ऊंचाई 0 से अधिक होनी चाहिए।',
          bothRequired: 'फीट और इंच दोनों आवश्यक हैं।',
          valuesPositive: 'मान 0 या उससे अधिक होना चाहिए।',
          inchesLessThan12: 'इंच 12 से कम होना चाहिए।',
          yourHeight: 'आपकी ऊंचाई',
          saveHeight: 'ऊंचाई सेव करें',
          addWeightEntry: 'वजन एंट्री जोड़ें',
          editWeightEntry: 'वजन एंट्री संपादित करें',
          units: 'इकाइयाँ',
          time: 'समय (वैकल्पिक)',
          notesOptional: 'नोट्स (वैकल्पिक)',
          dateRequired: 'तारीख आवश्यक है।',
          dateMustBeBetween: 'तारीख के बीच होनी चाहिए',
          andToday: 'और आज।',
          validRange: 'मान्य सीमा:',
          to: 'से',
          weightRequired: 'एक मान्य, सकारात्मक वजन आवश्यक है।',
          saveEntry: 'एंट्री सेव करें'
        },
        setup: { title: 'FitLog में आपका स्वागत है', intro: 'आइए अपना प्रोफ़ाइल सेट करें और अपने वजन और स्वास्थ्य मेट्रिक्स को ट्रैक करना शुरू करें।' }
      },
      kn: {
        nav: { home: 'ಮುಖ್ಯಪುಟ', trends: 'ಪ್ರವೃತ್ತಿಗಳು', streaks: 'ಸ್ಟ್ರೀಕ್ಸ್', weight: 'ತೂಕ', tasks: 'ಕಾರ್ಯಗಳು' },
        streaks: {
          title: 'ಸ್ಟ್ರೀಕ್ಸ್',
          subtitle: 'ನಿಮ್ಮ ಸ್ಥಿರತೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಬ್ಯಾಡ್ಜ್‌ಗಳನ್ನು ಗಳಿಸಿ!',
          current: 'ಪ್ರಸ್ತುತ ಸ್ಟ್ರೀಕ್',
          longest: 'ದೀರ್ಘತಮ ಸ್ಟ್ರೀಕ್',
          total: 'ಒಟ್ಟು ದಿನಗಳು ಲಾಗ್ ಮಾಡಲಾಗಿದೆ',
          last: 'ಕೊನೆಯದು:',
          noEntries: 'ಇನ್ನೂ ಎಂಟ್ರಿಗಳಿಲ್ಲ',
          personalBest: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಅತ್ಯುತ್ತಮ!',
          keepUp: 'ಮುಂದುವರಿಸಿ!',
          achievements: 'ನಿಮ್ಮ ಸಾಧನೆಗಳು',
          days: 'ದಿನಗಳು',
          entries: 'ಎಂಟ್ರಿಗಳು',
          info: {
             daily: 'ದೈನಂದಿನ ಲಾಗಿಂಗ್',
             dailyDesc: 'ನಿಮ್ಮ ಸ್ಟ್ರೀಕ್ ಅನ್ನು ನಿರ್ವಹಿಸಲು ಪ್ರತಿದಿನ ನಿಮ್ಮ ತೂಕವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
             badges: 'ಬ್ಯಾಡ್ಜ್‌ಗಳನ್ನು ಗಳಿಸಿ',
             badgesDesc: 'ಸ್ಥಿರತೆಗಾಗಿ ಸಾಧನೆಗಳನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಿ',
             progress: 'ಪ್ರಗತಿಯನ್ನು ವೀಕ್ಷಿಸಿ',
             progressDesc: 'ಹೀಟ್‌ಮ್ಯಾಪ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಸ್ಟ್ರೀಕ್ ಇತಿಹಾಸವನ್ನು ನೋಡಿ'
          },
          badges: {
             trailblazer: 'ಟ್ರೇಲ್‌ಬ್ಲೇಜರ್',
             trailblazerDesc: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ',
             trailblazerLock: 'ಹೆಸರು ಮತ್ತು ವಯಸ್ಸನ್ನು ಸೇರಿಸಿ',
             firstStep: 'ಮೊದಲ ಹೆಜ್ಜೆ',
             firstStepDesc: 'ನಿಮ್ಮ ಮೊದಲ ತೂಕವನ್ನು ಲಾಗ್ ಮಾಡಿ',
             firstStepLock: 'ಟ್ರ್ಯಾಕಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
             legend: 'ಲೆಜೆಂಡ್',
             legendDesc: '365-ದಿನಗಳ ಸ್ಟ್ರೀಕ್',
             weekender: 'ವೀಕೆಂಡರ್',
             weekenderDesc: '7-ದಿನಗಳ ಸ್ಟ್ರೀಕ್',
             fortnight: 'ಫೋರ್ಟ್‌ನೈಟ್ ಫೈಟರ್',
             fortnightDesc: '14-ದಿನಗಳ ಸ್ಟ್ರೀಕ್',
             centurion: 'ಸೆಂಚೂರಿಯನ್',
             centurionDesc: '100-ದಿನಗಳ ಸ್ಟ್ರೀಕ್',
             dataCollector: 'ಡೇಟಾ ಕಲೆಕ್ಟರ್',
             dataCollectorDesc: '50 ಒಟ್ಟು ಎಂಟ್ರಿಗಳು',
             dedicated: 'ಸಮರ್ಪಿತ',
             dedicatedDesc: '100 ಒಟ್ಟು ಎಂಟ್ರಿಗಳು',
             earned: 'ಗಳಿಸಲಾಗಿದೆ!'
          }
        },
        home: {
          title: 'ತೂಕ ಟ್ರ್ಯಾಕರ್',
          subtitle: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ತೂಕ ಟ್ರ್ಯಾಕಿಂಗ್ ಸಹಾಯಕ।',
          addEntry: 'ಎಂಟ್ರಿ ಸೇರಿಸಿ',
          noEntries: 'ಇನ್ನೂ ಯಾವುದೇ ತೂಕ ಎಂಟ್ರಿಗಳಿಲ್ಲ',
          getStarted: 'ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಮೊದಲ ತೂಕ ಎಂಟ್ರಿಯನ್ನು ಸೇರಿಸಿ!',
          recentEntries: 'ಇತ್ತೀಚಿನ ಎಂಟ್ರಿಗಳು',
          welcomeTitle: 'ಫಿಟ್‌ಲಾಗ್ ಟ್ರ್ಯಾಕರ್',
          welcomeSubtitle: 'ನಿಮ್ಮ ಪ್ರೀಮಿಯಂ ಆಲ್-ಇನ್-ಒನ್ ಆರೋಗ್ಯ, ಕಾರ್ಯ ಮತ್ತು ಹವ್ಯಾಸದ ಒಡನಾಡಿ',
          weightTitle: 'ತೂಕ ಟ್ರ್ಯಾಕರ್',
          weightDesc: 'ಕಾಲಾನಂತರದಲ್ಲಿ ನಿಮ್ಮ ತೂಕದ ಲಾಗ್, ಬಿಎಂಐ ಮತ್ತು ತೂಕದ ಗುರಿಯ ಪ್ರವೃತ್ತಿಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.',
          streaksTitle: 'ಹವ್ಯಾಸದ ಸ್ಟ್ರೀಕ್ಸ್',
          streaksDesc: 'ದೈನಂದಿನ ಆರೋಗ್ಯದ ಸ್ಟ್ರೀಕ್ಸ್ ಮತ್ತು ಸಾಧನೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುವ ಮೂಲಕ ಪ್ರೇರೇಪಿತರಾಗಿರಿ.',
          fastingTitle: 'ಉಪವಾಸದ ಟೈಮರ್',
          fastingDesc: 'ಮಧ್ಯಂತರ ಉಪವಾಸದ ವೇಳಾಪಟ್ಟಿಗಳನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ ಮತ್ತು ಅಂಕಿಅಂಶಗಳನ್ನು ವಿಲೇಷಿಸಿ.',
          tasksTitle: 'ಕಾರ್ಯ ನಿರ್ವಾಹಕ',
          tasksDesc: 'ನಿಮ್ಮ ದೈನಂದಿನ ಜೀವನಕ್ರಮಗಳು, ಊಟದ ಸಿದ್ಧತೆಗಳು ಮತ್ತು ಫಿಟ್ನೆಸ್ ಚಟುವటಿಕೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
          aiTitle: 'AI ಒಳನೋಟಗಳು',
          aiDesc: 'ನಿಮ್ಮ ಫಿಟ್‌ನೆస్ ಲಾಗ್‌ಗಳ ಆಧಾರದ ಮೇಲೆ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಆರೋಗ್ಯ ವರದಿಗಳನ್ನು ಸ್ವೀಕರಿಸಿ.'
        },
        trends: { title: 'ಆರೋಗ್ಯ ಪ್ರವೃತ್ತಿಗಳು', subtitle: 'ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಕಾಲಾನಂತರದಲ್ಲಿ ನಿಮ್ಮ ಫಿಟ್ನೆಸ್ ಪ್ರಯಾಣವನ್ನು ದೃಶ್ಯೀಕರಿಸಿ।', weightTrend: 'ತೂಕ ಪ್ರವೃತ್ತಿ', bmiTrend: 'BMI ಪ್ರವೃತ್ತಿ', noData: 'ಆಯ್ಕೆಮಾಡಿದ ಸಮಯ ವ್ಯಾಪ್ತಿಗೆ ಯಾವುದೇ ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ।', addEntries: 'ನಿಮ್ಮ ಪ್ರವೃತ್ತಿಯನ್ನು ನೋಡಲು ಕೆಲವು ತೂಕ ಎಂಟ್ರಿಗಳನ್ನು ಸೇರಿಸಿ!' },
        stats: { average: 'ಸರಾಸರಿ', current: 'ಪ್ರಸ್ತುತ', gained: 'ಹೆಚ್ಚಾಗಿದೆ', lost: 'ಕಳೆದುಕೊಂಡಿದೆ', increased: 'ಹೆಚ್ಚಾಗಿದೆ', decreased: 'ಕಡಿಮೆಯಾಗಿದೆ', idealRange: 'ಆದರ್ಶ ವ್ಯಾಪ್ತಿ', status: 'ಸ್ಥಿತಿ', averageBmi: 'ಸರಾಸರಿ BMI', currentBmi: 'ಪ್ರಸ್ತುತ BMI' },
        bmi: { underweight: 'ಕಡಿಮೆ ತೂಕ', normal: 'ಸಾಮಾನ್ಯ', overweight: 'ಅಧಿಕ ತೂಕ', obese: 'ಸ್ಥೂಲಕಾಯತೆ' },
        profile: {
          title: 'ಬಳಕೆದಾರ ಪ್ರೊಫೈಲ್',
          guest: 'ಅತಿಥಿ',
          name: 'ಹೆಸರು',
          namePlaceholder: 'ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
          chooseImage: 'ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
          imageHint: 'JPG, PNG ಅಥವಾ GIF (ಗರಿಷ್ಠ 5MB)',
          saveSuccess: 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ',
          saveError: 'ಪ್ರೊಫೈಲ್ ಉಳಿಸುವಲ್ಲಿ ದೋಷ',
          validation: {
            nameRequired: 'ಹೆಸರು ಅಗತ್ಯವಿದೆ',
            nameMinLength: 'ಹೆಸರು ಕನಿಷ್ಠ 2 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು',
            nameMaxLength: 'ಹೆಸರು 50 ಅಕ್ಷರಗಳನ್ನು ಮೀರಬಾರದು'
          }
        },
        common: {
          save: 'ಉಳಿಸಿ',
          cancel: 'ರದ್ದುಮಾಡಿ',
          edit: 'ಸಂಪಾದಿಸಿ',
          delete: 'ಅಳಿಸಿ'
        },
        form: { 
          date: 'ದಿನಾಂಕ', 
          weight: 'ತೂಕ', 
          notes: 'ಟಿಪ್ಪಣಿಗಳು', 
          height: 'ಎತ್ತರ', 
          save: 'ಉಳಿಸಿ', 
          cancel: 'ರದ್ದುಮಾಡಿ', 
          edit: 'ಸಂಪಾದಿಸಿ', 
          delete: 'ಅಳಿಸಿ',
          at: 'ನಲ್ಲಿ',
          enterHeight: 'ನಿಮ್ಮ ಎತ್ತರವನ್ನು ನಮೂದಿಸಿ',
          updateHeight: 'ನಿಮ್ಮ ಎತ್ತರವನ್ನು ನವೀಕರಿಸಿ',
          heightDescription: 'ನಿಮ್ಮ BMI ಮತ್ತು ಆದರ್ಶ ತೂಕದ ವ್ಯಾಪ್ತಿಯನ್ನು ಲೆಕ್ಕಹಾಕಲು ನಾವು ಇದನ್ನು ಬಳಸುತ್ತೇವೆ.',
          centimeters: 'ಸೆಂಟಿಮೀಟರ್‌ಗಳು',
          feetInches: 'ಅಡಿ ಮತ್ತು ಇಂಚುಗಳು',
          heightCm: 'ಎತ್ತರ (ಸೆಂಮೀ)',
          feet: 'ಅಡಿ',
          inches: 'ಇಂಚುಗಳು',
          heightRequired: 'ಎತ್ತರ ಅಗತ್ಯವಿದೆ.',
          heightPositive: 'ಎತ್ತರವು 0 ಕ್ಕಿಂತ ಹೆಚ್ಚಿರಬೇಕು.',
          bothRequired: 'ಅಡಿ ಮತ್ತು ಇಂಚುಗಳು ಎರಡೂ ಅಗತ್ಯವಿದೆ.',
          valuesPositive: 'ಮೌಲ್ಯಗಳು 0 ಅಥವಾ ಅದಕ್ಕಿಂತ ಹೆಚ್ಚಿರಬೇಕು.',
          inchesLessThan12: 'ಇಂಚುಗಳು 12 ಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.',
          yourHeight: 'ನಿಮ್ಮ ಎತ್ತರ',
          saveHeight: 'ಎತ್ತರವನ್ನು ಉಳಿಸಿ',
          addWeightEntry: 'ತೂಕ ಪ್ರವೇಶವನ್ನು ಸೇರಿಸಿ',
          editWeightEntry: 'ತೂಕ ಪ್ರವೇಶವನ್ನು ಸಂಪಾದಿಸಿ',
          units: 'ಘಟಕಗಳು',
          time: 'ಸಮಯ (ಐಚ್ಛಿಕ)',
          notesOptional: 'ಟಿಪ್ಪಣಿಗಳು (ಐಚ್ಛಿಕ)',
          dateRequired: 'ದಿನಾಂಕ ಅಗತ್ಯವಿದೆ.',
          dateMustBeBetween: 'ದಿನಾಂಕವು ನಡುವೆ ಇರಬೇಕು',
          andToday: 'ಮತ್ತು ಇಂದು.',
          validRange: 'ಮಾನ್ಯ ವ್ಯಾಪ್ತಿ:',
          to: 'ರಿಂದ',
          weightRequired: 'ಮಾನ್ಯ, ಧನಾತ್ಮಕ ತೂಕ ಅಗತ್ಯವಿದೆ.',
          saveEntry: 'ಪ್ರವೇಶವನ್ನು ಉಳಿಸಿ'
        },
        footer: { copyright: ' FitLog. ', tagline: '' },
        pwa: { installTitle: '', installSubtitle: '', installButton: '' }
      },
      ta: {
        nav: { home: 'முகப்பு', trends: 'போக்குகள்', streaks: 'ஸ்ட்ரீக்ஸ்', weight: 'எடை', tasks: 'பணிகள்' },
        home: {
          title: 'எடை கண்காணிப்பு',
          addEntry: 'பதிவு சேர்க்கவும்',
          noEntries: 'இன்னும் எடை பதிவுகள் இல்லை',
          getStarted: 'தொடங்க உங்கள் முதல் எடை பதிவைச் சேர்க்கவும்!',
          recentEntries: 'சமீபத்திய பதிவுகள்',
          welcomeTitle: 'பிட்லாக் டிராக்கர்',
          welcomeSubtitle: 'உங்கள் பிரீமியம் ஆல்-இன்-ஒன் ஆரோக்கியம், பணி மற்றும் பழக்கவழக்க துணை',
          weightTitle: 'எடை டிராக்கர்',
          weightDesc: 'காலப்போக்கில் உங்கள் எடை பதிவு, பிஎம்ஐ மற்றும் எடை இலக்கு போக்குகளைக் கண்காணிக்கவும்.',
          streaksTitle: 'பழக்கவழக்க தொடர்கள்',
          streaksDesc: 'தினசரி ஆரோக்கிய தொடர்கள் மற்றும் சாதனைகளைக் கண்காணிப்பதன் மூலம் உந்துதலாக இருங்கள்.',
          fastingTitle: 'நோன்பு டைமர்',
          fastingDesc: 'இடைப்பட்ட நோன்பு அட்டவணைகளை உள்ளமைத்து புள்ளிவிவரங்களை பகுப்பாய்வு செய்யுங்கள்.',
          tasksTitle: 'பணி மேలాளர்',
          tasksDesc: 'உங்கள் தினசரி உடற்பயிற்சிகள், உணவு தயாரிப்புகள் மற்றும் உடற்பயிற்சி செயல்பாடுகளைக் கண்காணிக்கவும்.',
          aiTitle: 'AI நுண்ணறிவு',
          aiDesc: 'உங்கள் உடற்பயிற்சி பதிவுகளின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட சுகாதார அறிக்கைகளைப் பெறுங்கள்.'
        },
        trends: { title: 'உடல்நலப் போக்குகள்', subtitle: 'உங்கள் முன்னேற்றத்தைக் கண்காணித்து, காலப்போக்கில் உங்கள் உடற்பயிற்சி பயணத்தைக் காட்சிப்படுத்துங்கள்।', weightTrend: 'எடை போக்கு', bmiTrend: 'BMI போக்கு', noData: 'தேர்ந்தெடுக்கப்பட்ட நேர வரம்பிற்கு தரவு இல்லை।', addEntries: 'உங்கள் போக்கைப் பார்க்க சில எடை பதிவுகளைச் சேர்க்கவும்!' },
        stats: { average: 'சராசரி', current: 'தற்போதைய', gained: 'அதிகரித்தது', lost: 'இழந்தது', increased: 'அதிகரித்தது', decreased: 'குறைந்தது', idealRange: 'சிறந்த வரம்பு', status: 'நிலை', averageBmi: 'சராசரி BMI', currentBmi: 'தற்போதைய BMI' },
        bmi: { underweight: 'குறைந்த எடை', normal: 'சாதாரண', overweight: 'அதிக எடை', obese: 'உடல்பருமன்' },
        profile: {
          title: 'பயனர் சுயவிவரம்',
          guest: 'விருந்தினர்',
          name: 'பெயர்',
          namePlaceholder: 'உங்கள் பெயரை உள்ளிடவும்',
          chooseImage: 'படத்தைத் தேர்ந்தெடுக்கவும்',
          imageHint: 'JPG, PNG அல்லது GIF (அதிகபட்சம் 5MB)',
          saveSuccess: 'சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது',
          saveError: 'சுயவிவரத்தைச் சேமிப்பதில் பிழை',
          validation: {
            nameRequired: 'பெயர் தேவை',
            nameMinLength: 'பெயரில் குறைந்தபட்சம் 2 எழுத்துக்கள் இருக்க வேண்டும்',
            nameMaxLength: 'பெயர் 50 எழுத்துக்களுக்கு மேல் இருக்கக் கூடாது'
          }
        },
        common: {
          save: 'சேமிக்கவும்',
          cancel: 'ரத்து செய்யவும்',
          edit: 'திருத்தவும்',
          delete: 'நீக்கவும்'
        },
        form: { 
          date: 'தேதி', 
          weight: 'எடை', 
          notes: 'குறிப்புகள்', 
          height: 'உயரம்', 
          save: 'சேமிக்கவும்', 
          cancel: 'ரத்து செய்யவும்', 
          edit: 'திருத்தவும்', 
          delete: 'நீக்கவும்',
          at: 'அளவில்',
          enterHeight: 'உங்கள் உயரத்தை உள்ளிடவும்',
          updateHeight: 'உங்கள் உயரத்தை புதுப்பிக்கவும்',
          heightDescription: 'உங்கள் BMI மற்றும் சிறந்த எடை வரம்பைக் கணக்கிட இதைப் பயன்படுத்துவோம்.',
          centimeters: 'சென்டிமீட்டர்கள்',
          feetInches: 'அடி மற்றும் அங்குலங்கள்',
          heightCm: 'உயரம் (செ.மீ)',
          feet: 'அடி',
          inches: 'அங்குலங்கள்',
          heightRequired: 'உயரம் தேவை.',
          heightPositive: 'உயரம் 0 ஐ விட அதிகமாக இருக்க வேண்டும்.',
          bothRequired: 'அடி மற்றும் அங்குலங்கள் இரண்டும் தேவை.',
          valuesPositive: 'மதிப்புகள் 0 அல்லது அதற்கு மேல் இருக்க வேண்டும்.',
          inchesLessThan12: 'அங்குலங்கள் 12 ஐ விட குறைவாக இருக்க வேண்டும்.',
          yourHeight: 'உங்கள் உயரம்',
          saveHeight: 'உயரத்தை சேமிக்கவும்',
          addWeightEntry: 'எடை பதிவைச் சேர்க்கவும்',
          editWeightEntry: 'எடை பதிவைத் திருத்தவும்',
          units: 'அலகுகள்',
          time: 'நேரம் (விருப்பமானது)',
          notesOptional: 'குறிப்புகள் (விருப்பமானது)',
          dateRequired: 'தேதி தேவை.',
          dateMustBeBetween: 'தேதி இடையே இருக்க வேண்டும்',
          andToday: 'மற்றும் இன்று.',
          validRange: 'சரியான வரம்பு:',
          to: 'முதல்',
          weightRequired: 'சரியான, நேர்மறை எடை தேவை.',
          saveEntry: 'பதிவைச் சேமிக்கவும்'
        },
        footer: { copyright: '© {{year}} FitLog. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை।', tagline: 'உங்கள் உடற்பயிற்சி பயணத்தைக் கண்காணிக்கவும், ஒரு நேரத்தில் ஒரு பதிவு।' },
        pwa: { installTitle: 'FitLog நிறுவவும்', installSubtitle: 'முழு பயன்பாட்டு அனுபவத்தைப் பெறுங்கள்', installButton: 'பயன்பாடு நிறுவவும்' }
      },
      te: {
        nav: { home: 'హోమ్', trends: 'ట్రెండ్స్', streaks: 'స్ట్రీక్స్', weight: 'బరువు', tasks: 'పనులు' },
        streaks: {
          title: 'స్ట్రీక్స్',
          subtitle: 'మీ స్థిరత్వాన్ని ట్రాక్ చేయండి మరియు బ్యాడ్జ్‌లను సంపాదించండి!',
          current: 'ప్రస్తుత స్ట్రీక్',
          longest: 'అత్యధిక స్ట్రీక్',
          total: 'మొత్తం రోజులు',
          last: 'చివరిసారి:',
          noEntries: 'ఎంట్రీలు లేవు',
          personalBest: 'మీ వ్యక్తిగత రికార్డు!',
          keepUp: 'కొనసాగించండి!',
          achievements: 'మీ విజయాలు',
          days: 'రోజులు',
          entries: 'ఎంట్రీలు',
          info: {
             daily: 'రోజువారీ లాగింగ్',
             dailyDesc: 'స్ట్రీక్‌ను కొనసాగించడానికి ప్రతిరోజూ మీ బరువును ట్రాక్ చేయండి',
             badges: 'బ్యాడ్జ్‌లు సంపాదించండి',
             badgesDesc: 'స్థిరత్వం కోసం విజయాలను అన్‌లాక్ చేయండి',
             progress: 'పురోగతి చూడండి',
             progressDesc: 'హీట్‌మ్యాప్‌లో మీ స్ట్రీక్ చరిత్రను చూడండి'
          },
          badges: {
             trailblazer: 'ట్రైల్‌బ్లేజర్',
             trailblazerDesc: 'మీ ప్రొఫైల్‌ను పూర్తి చేయండి',
             trailblazerLock: 'పేరు & వయస్సు జోడించండి',
             firstStep: 'మొదటి అడుగు',
             firstStepDesc: 'మీ మొదటి బరువును లాగ్ చేయండి',
             firstStepLock: 'ట్రాకింగ్ ప్రారంభించండి',
             legend: 'లెజెండ్',
             legendDesc: '365 రోజుల స్ట్రీక్',
             weekender: 'వీకెండర్',
             weekenderDesc: '7 రోజుల స్ట్రీక్',
             fortnight: 'ఫోర్ట్‌నైట్ ఫైటర్',
             fortnightDesc: '14 రోజుల స్ట్రీక్',
             centurion: 'సెంచూరియన్',
             centurionDesc: '100 రోజుల స్ట్రీక్',
             dataCollector: 'డేటా కలెక్టర్',
             dataCollectorDesc: '50 మొత్తం ఎంట్రీలు',
             dedicated: 'అంకితభావం',
             dedicatedDesc: '100 మొత్తం ఎంట్రీలు',
             earned: 'సంపాదించారు!'
          }
        },
        home: {
          title: 'బరువు ట్రాకర్',
          subtitle: 'మీ వ్యక్తిగత బరువు ట్రాకింగ్ సహాయకుడు.',
          addEntry: 'ఎంట్రీ జోడించండి',
          noEntries: 'ఇంకా బరువు ఎంట్రీలు లేవు',
          getStarted: 'ప్రారంభించడానికి మీ మొదటి బరువు ఎంట్రీని జోడించండి!',
          recentEntries: 'ఇటీవలి ఎంట్రీలు',
          welcomeTitle: 'ఫిట్‌లాగ్ ట్రాకర్',
          welcomeSubtitle: 'ఆరోగ్యం, పనులు మరియు అలవాట్ల కోసం ఆల్-ఇన్-వన్ సహచరుడు',
          weightTitle: 'బరువు ట్రాకర్',
          weightDesc: 'సమయంతో పాటు మీ బరువు లాగ్, BMI మరియు బరువు లక్ష్యాలను పర్యవేక్షించండి.',
          streaksTitle: 'అలవాటు స్ట్రీక్స్',
          streaksDesc: 'రోజువారీ ఆరోగ్య స్ట్రీక్స్ మరియు విజయాలను ట్రాక్ చేయడం ద్వారా ప్రేరణ పొందండి.',
          fastingTitle: 'ఉపవాస టైమర్',
          fastingDesc: 'మధ్యంతర ఉపవాస షెడ్యూల్‌లను కాన్ఫిగర్ చేయండి మరియు గణాంకాలను విశ్లేషించండి.',
          tasksTitle: 'టాస్క్ మేనేజర్',
          tasksDesc: 'మీ రోజువారీ వ్యాయామాలు, భోజన సన్నాహాలు మరియు ఫిట్‌నెస్ కార్యకలాపాలను ట్రాక్ చేయండి.',
          aiTitle: 'AI అంతర్దృష్టులు',
          aiDesc: 'మీ ఫిట్‌నెస్ లాగ్‌ల ఆధారంగా వ్యక్తిగతీకరించిన ఆరోగ్య నివేదికలను స్వీకరించండి.'
        },
        trends: { title: 'ఆరోగ్య ట్రెండ్స్', subtitle: 'మీ పురోగతిని ట్రాక్ చేయండి మరియు కాలక్రమేణా మీ ఫిట్నెస్ ప్రయాణాన్ని దృశ్యమానం చేయండి।', weightTrend: 'బరువు ట్రెండ్', bmiTrend: 'BMI ట్రెండ్', noData: 'ఎంచుకున్న సమయ పరిధికి డేటా అందుబాటులో లేదు।', addEntries: 'మీ ట్రెండ్ను చూడటానికి కొన్ని బరువు ఎంట్రీలను జోడించండి!' },
        stats: { average: 'సగటు', current: 'ప్రస్తుత', gained: 'పెరిగింది', lost: 'కోల్పోయింది', increased: 'పెరిగింది', decreased: 'తగ్గింది', idealRange: 'ఆదర్శ పరిధి', status: 'స్థితి', averageBmi: 'సగటు BMI', currentBmi: 'ప్రస్తుత BMI' },
        bmi: { underweight: 'తక్కువ బరువు', normal: 'సాధారణ', overweight: 'అధిక బరువు', obese: 'స్థూలకాయం' },
        profile: {
          title: 'వినియోగదారుల ప్రొఫైల్',
          guest: 'అతిథి',
          name: 'పేరు',
          namePlaceholder: 'మీ పేరుని నమోదు చేయండి',
          chooseImage: 'చిత్రాన్ని ఎంచుకోండి',
          imageHint: 'JPG, PNG లేదా GIF (గరిష్ఠంగా 5MB)',
          saveSuccess: 'ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది',
          saveError: 'ప్రొఫైల్‌ని సేవ్ చేయడంలో లోపం',
          validation: {
            nameRequired: 'పేరు అవసరం',
            nameMinLength: 'పేరు కనీసం 2 అక్షరాలు ఉండాలి',
            nameMaxLength: 'పేరు 50 అక్షరాలకు మించరాదు'
          }
        },
        common: {
          save: 'సేవ్ చేయండి',
          cancel: 'రద్దు చేయండి',
          edit: 'సవరించండి',
          delete: 'తొలగించండి'
        },
        form: { 
          date: 'తేదీ', 
          weight: 'బరువు', 
          notes: 'గమనికలు', 
          height: 'ఎత్తు', 
          save: 'సేవ్ చేయండి', 
          cancel: 'రద్దు చేయండి', 
          edit: 'సవరించండి', 
          delete: 'తొలగించండి',
          at: 'వద్ద',
          enterHeight: 'మీ ఎత్తును నమోదు చేయండి',
          updateHeight: 'మీ ఎత్తును నవీకరించండి',
          heightDescription: 'మేము మీ BMI మరియు ఆదర్శ బరువు శ్రేణిని లెక్కించడానికి దీన్ని ఉపయోగిస్తాము.',
          centimeters: 'సెంటీమీటర్లు',
          feetInches: 'అడుగులు & అంగుళాలు',
          heightCm: 'ఎత్తు (సెంమీ)',
          feet: 'అడుగులు',
          inches: 'అంగుళాలు',
          heightRequired: 'ఎత్తు అవసరం.',
          heightPositive: 'ఎత్తు 0 కంటే ఎక్కువగా ఉండాలి.',
          bothRequired: 'అడుగులు మరియు అంగుళాలు రెండూ అవసరం.',
          valuesPositive: 'విలువలు 0 లేదా అంతకంటే ఎక్కువగా ఉండాలి.',
          inchesLessThan12: 'అంగుళాలు 12 కంటే తక్కువగా ఉండాలి.',
          yourHeight: 'మీ ఎత్తు',
          saveHeight: 'ఎత్తును సేవ్ చేయండి',
          addWeightEntry: 'బరువు ఎంట్రీని జోడించండి',
          editWeightEntry: 'బరువు ఎంట్రీని సవరించండి',
          units: 'యూనిట్లు',
          time: 'సమయం (ఐచ్ఛికం)',
          notesOptional: 'గమనికలు (ఐచ్ఛికం)',
          dateRequired: 'తేదీ అవసరం.',
          dateMustBeBetween: 'తేదీ మధ్య ఉండాలి',
          andToday: 'మరియు నేడు.',
          validRange: 'చెల్లుబాటు అయ్యే పరిధి:',
          to: 'నుండి',
          weightRequired: 'చెల్లుబాటు అయ్యే, సానుకూల బరువు అవసరం.',
          saveEntry: 'ఎంట్రీని సేవ్ చేయండి'
        },
        footer: { copyright: '© {{year}} FitLog. అన్ని హక్కులు రక్షించబడ్డాయి।', tagline: 'మీ ఫిట్నెస్ ప్రయాణాన్ని ట్రాక్ చేయండి, ఒకేసారి ఒక ఎంట్రీ।' },
        pwa: { installTitle: 'FitLog ఇన్స్టాల్ చేయండి', installSubtitle: 'పూర్తి యాప్ అనుభవాన్ని పొందండి', installButton: 'యాప్ ఇన్స్టాల్ చేయండి' }
      },
      fr: {
        nav: { home: 'Accueil', trends: 'Tendances', streaks: 'Séries', weight: 'Poids', tasks: 'Tâches' },
        home: {
          title: 'Suivi du Poids',
          addEntry: 'Ajouter une Entrée',
          noEntries: 'Aucune entrée de poids pour le moment',
          getStarted: 'Ajoutez votre première entrée de poids pour commencer!',
          welcomeTitle: 'FitLog Tracker',
          welcomeSubtitle: 'Votre compagnon premium tout-en-un pour la santé, les tâches et les habitudes',
          weightTitle: 'Suivi du Poids',
          weightDesc: 'Surveillez votre journal de poids, votre IMC et vos tendances d\'objectifs de poids au fil du temps.',
          streaksTitle: 'Séries d\'Habitudes',
          streaksDesc: 'Restez motivé en suivant quotidiennement vos séries de santé et vos réalisations.',
          fastingTitle: 'Minuteur de Jeûne',
          fastingDesc: 'Configurez des programmes de jeûne intermittent et analysez les statistiques.',
          tasksTitle: 'Gestionnaire de Tâches',
          tasksDesc: 'Suivez vos entraînements quotidiens, préparations de repas et activités physiques.',
          aiTitle: 'Analyses IA',
          aiDesc: 'Recevez des rapports de santé personnalisés basés sur vos journaux de fitness.'
        },
        trends: { title: 'Tendances Santé', subtitle: 'Suivez vos progrès et visualisez votre parcours fitness au fil du temps.', weightTrend: 'Tendance du Poids', bmiTrend: 'Tendance IMC', noData: 'Aucune donnée disponible pour la plage de temps sélectionnée.', addEntries: 'Ajoutez quelques entrées de poids pour voir votre tendance!' },
        stats: { average: 'Moyenne', current: 'Actuel', gained: 'Gagné', lost: 'Perdu', increased: 'Augmenté', decreased: 'Diminué', idealRange: 'Plage Idéale', status: 'Statut', averageBmi: 'IMC Moyen', currentBmi: 'IMC Actuel' },
        bmi: { underweight: 'Insuffisance pondérale', normal: 'Normal', overweight: 'Surpoids', obese: 'Obèse' },
        profile: {
          title: 'Profil Utilisateur',
          guest: 'Invité',
          name: 'Nom',
          namePlaceholder: 'Entrez votre nom',
          chooseImage: 'Choisir une image',
          imageHint: 'JPG, PNG ou GIF (max 5Mo)',
          saveSuccess: 'Profil enregistré avec succès',
          saveError: 'Erreur lors de l\'enregistrement du profil',
          validation: {
            nameRequired: 'Le nom est requis',
            nameMinLength: 'Le nom doit comporter au moins 2 caractères',
            nameMaxLength: 'Le nom ne doit pas dépasser 50 caractères'
          }
        },
        common: {
          save: 'Enregistrer',
          cancel: 'Annuler',
          edit: 'Modifier',
          delete: 'Supprimer'
        },
        form: { 
          date: 'Date', 
          weight: 'Poids', 
          notes: 'Notes', 
          height: 'Taille', 
          save: 'Enregistrer', 
          cancel: 'Annuler', 
          edit: 'Modifier', 
          delete: 'Supprimer',
          at: 'à',
          enterHeight: 'Entrez votre taille',
          updateHeight: 'Mettez à jour votre taille',
          heightDescription: 'Nous utiliserons cette information pour calculer votre IMC et votre plage de poids idéale.',
          centimeters: 'Centimètres',
          feetInches: 'Pieds et pouces',
          heightCm: 'Taille (cm)',
          feet: 'Pieds',
          inches: 'Pouces',
          heightRequired: 'La taille est requise.',
          heightPositive: 'La taille doit être supérieure à 0.',
          bothRequired: 'Les pieds et les pouces sont tous deux requis.',
          valuesPositive: 'Les valeurs doivent être supérieures ou égales à 0.',
          inchesLessThan12: 'Les pouces doivent être inférieurs à 12.',
          yourHeight: 'Votre taille',
          saveHeight: 'Enregistrer la taille',
          addWeightEntry: 'Ajouter une Entrée de Poids',
          editWeightEntry: 'Modifier l\'Entrée de Poids',
          units: 'Unités',
          time: 'Heure (facultatif)',
          notesOptional: 'Notes (facultatif)',
          dateRequired: 'La date est requise.',
          dateMustBeBetween: 'La date doit être entre',
          andToday: 'et aujourd\'hui.',
          validRange: 'Plage valide:',
          to: 'à',
          weightRequired: 'Un poids valide et positif est requis.',
          saveEntry: 'Enregistrer l\'Entrée'
        },
        footer: { copyright: '© {{year}} FitLog. Tous droits réservés.', tagline: 'Suivez votre parcours fitness, une entrée à la fois.' },
        pwa: { installTitle: 'Installer FitLog', installSubtitle: 'Obtenez l\'expérience complète de l\'application', installButton: 'Installer l\'App' }
      },
      de: {
        nav: { home: 'Startseite', trends: 'Trends', streaks: 'Serien', weight: 'Gewicht', tasks: 'Aufgaben' },
        home: {
          title: 'Gewichts-Tracker',
          addEntry: 'Eintrag hinzufügen',
          noEntries: 'Noch keine Gewichtseinträge',
          getStarted: 'Fügen Sie Ihren ersten Gewichtseintrag hinzu, um zu beginnen!',
          welcomeTitle: 'FitLog Tracker',
          welcomeSubtitle: 'Ihr erstklassiger All-in-One-Begleiter für Gesundheit, Aufgaben und Gewohnheiten',
          weightTitle: 'Gewichts-Tracker',
          weightDesc: 'Überwachen Sie Ihr Gewichtsprotokoll, Ihren BMI und Ihre Gewichtszeiltrends im Laufe der Zeit.',
          streaksTitle: 'Gewohnheitsserien',
          streaksDesc: 'Bleiben Sie motiviert, indem Sie tägliche Gesundheitsserien und Erfolge verfolgen.',
          fastingTitle: 'Fasten-Timer',
          fastingDesc: 'Konfigurieren Sie intermittierende Fastenpläne und analysieren Sie Statistiken.',
          tasksTitle: 'Aufgaben-Manager',
          tasksDesc: 'Verfolgen Sie Ihre täglichen Workouts, Essenszubereitungen und Fitnessaktivitäten.',
          aiTitle: 'KI-Erkenntnisse',
          aiDesc: 'Erhalten Sie personalisierte Gesundheitsberichte basierend auf Ihren Fitnessprotokollen.'
        },
        trends: { title: 'Gesundheitstrends', subtitle: 'Verfolgen Sie Ihren Fortschritt und visualisieren Sie Ihre Fitness-Reise über die Zeit.', weightTrend: 'Gewichtstrend', bmiTrend: 'BMI-Trend', noData: 'Keine Daten für den ausgewählten Zeitraum verfügbar.', addEntries: 'Fügen Sie einige Gewichtseinträge hinzu, um Ihren Trend zu sehen!' },
        stats: { average: 'Durchschnitt', current: 'Aktuell', gained: 'Zugenommen', lost: 'Verloren', increased: 'Gestiegen', decreased: 'Gesunken', idealRange: 'Idealbereich', status: 'Status', averageBmi: 'Durchschnittlicher BMI', currentBmi: 'Aktueller BMI' },
        bmi: { underweight: 'Untergewicht', normal: 'Normal', overweight: 'Übergewicht', obese: 'Adipös' },
        profile: {
          title: 'Benutzerprofil',
          guest: 'Gast',
          name: 'Name',
          namePlaceholder: 'Geben Sie Ihren Namen ein',
          chooseImage: 'Bild auswählen',
          imageHint: 'JPG, PNG oder GIF (max. 5MB)',
          saveSuccess: 'Profil erfolgreich gespeichert',
          saveError: 'Fehler beim Speichern des Profils',
          validation: {
            nameRequired: 'Name ist erforderlich',
            nameMinLength: 'Name muss mindestens 2 Zeichen lang sein',
            nameMaxLength: 'Name darf nicht länger als 50 Zeichen sein'
          }
        },
        common: {
          save: 'Speichern',
          cancel: 'Abbrechen',
          edit: 'Bearbeiten',
          delete: 'Löschen'
        },
        form: { 
          date: 'Datum', 
          weight: 'Gewicht', 
          notes: 'Notizen', 
          height: 'Größe', 
          save: 'Speichern', 
          cancel: 'Abbrechen', 
          edit: 'Bearbeiten', 
          delete: 'Löschen',
          at: 'bei',
          enterHeight: 'Geben Sie Ihre Größe ein',
          updateHeight: 'Aktualisieren Sie Ihre Größe',
          heightDescription: 'Wir verwenden diese Angabe, um Ihren BMI und Ihren idealen Gewichtsbereich zu berechnen.',
          centimeters: 'Zentimeter',
          feetInches: 'Fuß und Zoll',
          heightCm: 'Größe (cm)',
          feet: 'Fuß',
          inches: 'Zoll',
          heightRequired: 'Größe ist erforderlich.',
          heightPositive: 'Größe muss größer als 0 sein.',
          bothRequired: 'Fuß und Zoll sind beide erforderlich.',
          valuesPositive: 'Werte müssen größer oder gleich 0 sein.',
          inchesLessThan12: 'Zoll müssen kleiner als 12 sein.',
          yourHeight: 'Ihre Größe',
          saveHeight: 'Größe speichern',
          addWeightEntry: 'Gewichtseintrag hinzufügen',
          editWeightEntry: 'Gewichtseintrag bearbeiten',
          units: 'Einheiten',
          time: 'Zeit (optional)',
          notesOptional: 'Notizen (optional)',
          dateRequired: 'Datum ist erforderlich.',
          dateMustBeBetween: 'Datum muss zwischen',
          andToday: 'und heute liegen.',
          validRange: 'Gültiger Bereich:',
          to: 'bis',
          weightRequired: 'Ein gültiges, positives Gewicht ist erforderlich.',
          saveEntry: 'Eintrag speichern'
        },
        footer: { copyright: '© {{year}} FitLog. Alle Rechte vorbehalten.', tagline: 'Verfolgen Sie Ihre Fitness-Reise, einen Eintrag nach dem anderen.' },
        pwa: { installTitle: 'FitLog installieren', installSubtitle: 'Holen Sie sich die vollständige App-Erfahrung', installButton: 'App installieren' }
      }
    };
  }
}
