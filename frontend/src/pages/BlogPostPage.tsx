import { useTranslation } from "react-i18next"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Zap, Clock } from "lucide-react"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { blogPosts } from "@/lib/blog-data"

export function BlogPostPage() {
  const { t, i18n } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const lang = i18n.language === "en" ? "en" : "ru"
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white/60">
        <Link to="/blog" className="text-sm hover:text-white">{t("blog.back")}</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f7]">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Zap className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-medium tracking-tight">{t("brand")}</span>
          </Link>
          <LanguageSwitcher variant="dark" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80">
          <ArrowLeft className="h-4 w-4" />
          {t("blog.back")}
        </Link>
        <p className="mt-8 flex items-center gap-2 text-xs text-white/30">
          {new Date(post.date).toLocaleDateString(lang === "en" ? "en-US" : "ru-RU")}
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <Clock className="h-3.5 w-3.5" />
          {post.minutes} {lang === "en" ? "min read" : "мин чтения"}
        </p>
        <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight leading-tight">{post[lang].title}</h1>
        <div className="mt-8 space-y-5">
          {post[lang].content.map((paragraph, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-white/60">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-indigo-400/20 bg-indigo-500/[0.06] p-6">
          <p className="text-sm text-white/70">{t("cta.titleA")} <span className="text-white/40">{t("cta.titleB")}</span></p>
          <Link
            to="/diagnostic"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 h-11 text-sm font-medium text-black hover:bg-white/90"
          >
            {t("cta.viewProject")}
          </Link>
        </div>
      </main>
    </div>
  )
}
