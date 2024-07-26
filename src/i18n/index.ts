import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import ptBrTranslations from './locales/pt-br.json'
import enUsTranslations from './locales/en-us.json'

const resources = {
  'en-US': enUsTranslations,
  'pt-BR': ptBrTranslations
}

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en-US',
    lng: navigator.language,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
