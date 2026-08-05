import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { FileText, ArrowLeft } from "lucide-react"
import { LanguageSwitcher } from "@/components/ui/language-switcher"

export function TermsPage() {
  const { t, i18n } = useTranslation()
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f7]">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 text-sm text-white/60 hover:text-white/90">
            <ArrowLeft className="h-4 w-4" />
            {t("brand")}
          </Link>
          <LanguageSwitcher variant="dark" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10">
          <FileText className="h-6 w-6 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{t("terms.title")}</h1>
        <p className="mt-2 text-sm text-white/30">{t("terms.updated", { date: new Date().toLocaleDateString(i18n.language) })}</p>
        <p className="mt-6 text-sm leading-relaxed text-white/50">{t("terms.intro")}</p>

        <div className="mt-10 space-y-8">
          {(["one", "two", "three", "four", "five", "six"] as const).map((k) => (
            <section key={k}>
              <h2 className="text-lg font-medium text-white/85">{t(`terms.sections.${k}.title`)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/45">{t(`terms.sections.${k}.body`)}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
