import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Zap, ArrowRight } from "lucide-react"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { blogPosts } from "@/lib/blog-data"

export function BlogPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === "en" ? "en" : "ru"

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f7]">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Zap className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-medium tracking-tight">{t("brand")}</span>
          </Link>
          <LanguageSwitcher variant="dark" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        <p className="text-xs tracking-[0.15em] uppercase text-white/30">{t("nav.blog")}</p>
        <h1 className="mt-3 text-3xl md:text-5xl font-normal tracking-tight">{t("blog.title")}</h1>
        <p className="mt-3 max-w-xl text-sm text-white/40">{t("blog.subtitle")}</p>

        <div className="mt-12 space-y-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
            >
              <p className="text-xs text-white/30">
                {t("blog.meta", { date: new Date(post.date).toLocaleDateString(lang === "en" ? "en-US" : "ru-RU"), minutes: post.minutes })}
              </p>
              <h2 className="mt-2 text-xl font-medium text-white/85 group-hover:text-white transition-colors">
                {post[lang].title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/45">{post[lang].excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-indigo-300">
                {t("blog.readMore")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
