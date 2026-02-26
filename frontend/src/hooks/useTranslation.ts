import { useState, useEffect } from 'react';
import { getTranslations, getCurrentLanguage, setLanguage, type Translations } from '../lib/i18n';

export function useTranslation() {
  const [translations, setTranslations] = useState<Translations>(getTranslations());
  const [currentLang, setCurrentLang] = useState<string>(getCurrentLanguage());

  const changeLanguage = (lang: string) => {
    // The setLanguage function now handles the page reload automatically
    setLanguage(lang);
  };

  // Re-render when language changes
  useEffect(() => {
    setTranslations(getTranslations());
  }, [currentLang]);

  return {
    t: translations,
    currentLanguage: currentLang,
    changeLanguage
  };
}
