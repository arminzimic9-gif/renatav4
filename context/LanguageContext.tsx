// @refresh reset
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resolveRoute } from '../routes';
import { translations as defaultTranslations, Translations } from '../translations';
import { translationsService } from '../admin/services/firestoreService';

export type Language = 'BHS' | 'EN';

interface LanguageContextType {
  lang: Language;
  dict: typeof defaultTranslations;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'BHS',
  dict: defaultTranslations,
  isLoading: true,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const resolved = resolveRoute(location.pathname);
  const lang: Language = resolved ? resolved.lang : 'BHS';

  const [dict, setDict] = useState<typeof defaultTranslations>(defaultTranslations);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const data = await translationsService.get();
        if (data) {
          setDict(data);
        }
      } catch (error) {
        console.error('Error fetching translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, dict, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
