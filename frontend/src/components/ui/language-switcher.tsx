import { useTranslation } from "react-i18next"
import { LANGUAGES, setLanguage, type LanguageCode } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
  variant?: "light" | "dark"
}

export function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const current = i18n.language as LanguageCode

  return (
    <div
      className={cn(
        "flex items-center rounded-full border p-0.5",
        variant === "light" ? "border-input bg-background" : "border-white/10 bg-white/[0.03]"
      )}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            current === lang.code
              ? variant === "light"
                ? "bg-primary text-primary-foreground"
                : "bg-white text-black"
              : variant === "light"
                ? "text-muted-foreground hover:text-foreground"
                : "text-white/40 hover:text-white/80"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
