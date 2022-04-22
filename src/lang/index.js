// import { createApp } from 'vue'
// import VueI18n from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
// import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
// import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
// import elementEsLocale from 'element-ui/lib/locale/lang/es'// element-ui lang
// import elementJaLocale from 'element-ui/lib/locale/lang/ja'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
import esLocale from './es'
import jaLocale from './ja'

import esADempiere from './ADempiere/es/index.js'
import enADempiere from './ADempiere/en/index.js'

// // app.use(VueI18n)
// const alo = createApp(VueI18n)
// const dateTimeFormats = {
//   'en': {
//     long: {
//       year: 'numeric',
//       month: 'long',
//       day: '2-digit',
//       weekday: 'long',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: false
//     }
//   },
//   'es': {
//     long: {
//       year: 'numeric',
//       month: 'long',
//       day: '2-digit',
//       weekday: 'long',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     }
//   }
// }

const messages = {
  en: {
    ...enLocale,
    ...enADempiere
  },
  zh: {
    ...zhLocale
  },
  es: {
    ...esLocale,
    ...esADempiere
  },
  ja: {
    ...jaLocale
  }
}
export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}
// const i18n = new VueI18n({
//   // set locale
//   // options: en | zh | es
//   locale: getLanguage(),
//   fallbackLocale: 'en',
//   // set locale messages
//   messages,
//   dateTimeFormats
// })
const i18n = createI18n({
  legacy: false,
  locale: 'es',
  globalInjection: true,
  messages: {
    en: {
      message: {
        language: 'English',
        greeting: 'Hello !'
      }
    },
    ar: {
      message: {
        language: 'العربية',
        greeting: 'السلام عليكم'
      }
    },
    es: {
      message: {
        language: 'Español',
        greeting: 'Hola !'
      }
    }
  }
})

export default i18n
