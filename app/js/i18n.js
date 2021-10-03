import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import translationEn from './translations/en/translations.json'
import translationFr from './translations/fr/translations.json'
const resources = {
  en: { translation: translationEn },
  fr: { translation: translationFr }
}
/**
 * DESC
 * configuration for i18next
 *
 * USAGE
 * import in index.js (import './i18n';)
 *
 */

const options = {
  // order and from where user language should be detected
  order: ['path', 'querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'subdomain'],
  // keys or params to lookup language from
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  // cache user language on
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
  // optional expire and domain for set cookie
  cookieMinutes: 10,
  cookieDomain: 'myDomain',
  // optional htmlTag with lang attribute, the default is:
  htmlTag: document.documentElement,
  // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
  cookieOptions: { path: '/', sameSite: 'strict' }
}
i18next
  // detects user language:
  // based on browsers set language or on querystring ?lng=LANGUAGE
  // @see https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    lng: 'fr',
    compatibilityJSON: 'v2',
    fallbackLng: 'en',
    debug: false,
    whitelist: ['en', 'fr'],
    load: 'languageOnly',
    detection: options,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    // react specific
    // @see https://react.i18next.com/latest/i18next-instance
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true, // allow <br/> and simple html elements in translations
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'], // don't convert to <1></1> if simple react elements
      useSuspense: false
    }
  }, err => {
    if (err) {
      console.error('Error loading translation files', err)
      return
    }
  })
  .then(() => {
    document.documentElement.lang = i18next.language
  })
export default i18next
