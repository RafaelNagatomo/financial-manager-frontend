import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export const useLanguage = () => {
  const { i18n: i18nextInstance } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  return {
    currentLanguage: i18nextInstance.language,
    changeLanguage,
  };
};
