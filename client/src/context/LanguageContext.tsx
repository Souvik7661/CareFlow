import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { LANGUAGES, Language, DEFAULT_LANGUAGE } from '../i18n/languages';
import { getTranslatedString, translateDynamicText } from '../i18n/translator';

interface LanguageContextType {
  currentLanguage: string;
  currentLanguageObj: Language;
  t: (keyPath: string, fallback?: string) => string;
  translateText: (text: string) => string;
  setLanguage: (code: string) => void;
  setLanguageWithTransition: (code: string, onFinish?: () => void) => void;
  isTransitioning: boolean;
  transitionProgress: number;
  targetLanguage: Language | null;
  isLanguageModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
  hasExplicitlyChosenLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'careflow_language';
const CHOSEN_KEY = 'careflow_lang_chosen';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  });

  const [hasExplicitlyChosenLanguage, setHasExplicitlyChosenLanguage] = useState<boolean>(() => {
    return localStorage.getItem(CHOSEN_KEY) === 'true';
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionProgress, setTransitionProgress] = useState<number>(0);
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);

  const transitionTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  const currentLanguageObj = LANGUAGES.find(l => l.code === currentLanguage) || DEFAULT_LANGUAGE;

  // Set document dir for RTL languages (e.g. Arabic, Urdu)
  useEffect(() => {
    if (currentLanguageObj.direction === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    document.documentElement.setAttribute('lang', currentLanguage);
  }, [currentLanguage, currentLanguageObj]);

  const t = (keyPath: string, fallback?: string): string => {
    return getTranslatedString(currentLanguage, keyPath, fallback);
  };

  const translateText = (text: string): string => {
    return translateDynamicText(text, currentLanguage);
  };

  const setLanguage = (code: string) => {
    const lang = LANGUAGES.find(l => l.code === code) || DEFAULT_LANGUAGE;
    setCurrentLanguageState(lang.code);
    localStorage.setItem(STORAGE_KEY, lang.code);
    localStorage.setItem(CHOSEN_KEY, 'true');
    setHasExplicitlyChosenLanguage(true);
  };

  const setLanguageWithTransition = (code: string, onFinish?: () => void) => {
    const nextLang = LANGUAGES.find(l => l.code === code) || DEFAULT_LANGUAGE;
    setTargetLanguage(nextLang);
    setIsTransitioning(true);
    setTransitionProgress(0);
    setIsLanguageModalOpen(false);

    // Smoothly animate progress 0% -> 100% over exactly 1500ms
    const startTime = Date.now();
    const duration = 1500;

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setTransitionProgress(progress);
      if (progress >= 100) {
        clearInterval(progressIntervalRef.current);
      }
    }, 25);

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      setCurrentLanguageState(nextLang.code);
      localStorage.setItem(STORAGE_KEY, nextLang.code);
      localStorage.setItem(CHOSEN_KEY, 'true');
      setHasExplicitlyChosenLanguage(true);
      setIsTransitioning(false);
      setTransitionProgress(100);
      setTargetLanguage(null);

      if (onFinish) {
        onFinish();
      }
    }, duration);
  };

  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        currentLanguageObj,
        t,
        translateText,
        setLanguage,
        setLanguageWithTransition,
        isTransitioning,
        transitionProgress,
        targetLanguage,
        isLanguageModalOpen,
        openLanguageModal,
        closeLanguageModal,
        hasExplicitlyChosenLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
