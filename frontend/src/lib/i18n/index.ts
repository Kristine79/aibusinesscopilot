import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en"
import ru from "./ru"

export const LANGUAGES = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]["code"]

const STORAGE_KEY = "aibc-lang"

function detectLanguage(): LanguageCode {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === "ru" || saved === "en" ? saved : "ru"
}

i18n.use(initReactI18next).init({
  resources: { ru, en },
  lng: detectLanguage(),
  fallbackLng: "ru",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

document.title = i18n.t("documentTitle")

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  document.title = i18n.t("documentTitle")
})

export function setLanguage(lng: LanguageCode) {
  i18n.changeLanguage(lng)
}

export function tBusinessType(value: string): string {
  const key = `diagnostic.businessTypes.${value}`
  return i18n.exists(key) ? i18n.t(key) : value
}

export function tLeadStatus(value: string): string {
  const key = `leads.status.${value}`
  return i18n.exists(key) ? i18n.t(key) : value
}

export default i18n
