import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationFR from './locales/fr/translation.json';
import translationDE from './locales/de/translation.json';
import translationRO from './locales/ro/translation.json';
import translationBG from './locales/bg/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  fr: {
    translation: translationFR,
  },
  de: {
    translation: translationDE,
  },
  ro: {
    translation: translationRO,
  },
  bg: {
    translation: translationBG,
  },
};

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .use(LanguageDetector) // Detects language
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['path', 'cookie', 'htmlTag'],
      caches: ['cookie'],
    },
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;
