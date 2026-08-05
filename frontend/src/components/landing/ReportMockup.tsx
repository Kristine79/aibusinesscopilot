import { useTranslation } from "react-i18next"
import { Check, FileText, Sparkles, Zap } from "lucide-react"

export function ReportMockup() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/[0.08] bg-[#12121a]/95 p-6 text-left shadow-2xl shadow-black/50 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm text-white/80">AI Business Assessment</span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {t("preview.scoreStatus")}
        </span>
      </div>

      <div className="py-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/30">{t("preview.scoreLabel")}</p>
            <p className="mt-1 text-4xl font-light text-white">{t("preview.scoreValue")}</p>
          </div>
          <div className="w-40">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
              <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400" />
            </div>
          </div>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-white/50">{t("preview.summary")}</p>
      </div>

      <div className="space-y-2 border-t border-white/[0.06] py-4">
        <p className="text-[11px] uppercase tracking-[0.15em] text-white/30">{t("preview.opportunitiesLabel")}</p>
        {["one", "two", "three"].map((key) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3.5 py-2.5"
          >
            <span className="flex items-center gap-2.5 text-[13px] text-white/70">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10">
                <Check className="h-3 w-3 text-emerald-400" />
              </span>
              {t(`preview.items.${key}.problem`)}
            </span>
            <span className="shrink-0 rounded-full bg-indigo-400/10 px-2.5 py-1 text-[11px] font-medium text-indigo-300">
              {t(`preview.items.${key}.impact`)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.06] pt-4">
        <p className="mb-2.5 text-[11px] uppercase tracking-[0.15em] text-white/30">{t("preview.roadmapLabel")}</p>
        <div className="flex flex-wrap gap-2">
          {["one", "two", "three"].map((key, i) => (
            <span
              key={key}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/60"
            >
              {i === 0 ? <Zap className="h-3 w-3 text-amber-400" /> : i === 1 ? <FileText className="h-3 w-3 text-purple-400" /> : null}
              {t(`preview.roadmap.${key}`)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
