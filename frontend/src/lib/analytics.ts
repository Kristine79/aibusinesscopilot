const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined
const YM_ID = import.meta.env.VITE_YM_ID as string | undefined

let loaded = false

function loadScript(id: string, src: string) {
  if (document.getElementById(id)) return
  const script = document.createElement("script")
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

export function initAnalytics() {
  if (loaded || typeof window === "undefined") return
  loaded = true

  if (GA4_ID) {
    loadScript("gtag-base", "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID)
    const inline = document.createElement("script")
    inline.id = "gtag-init"
    inline.textContent =
      "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','" +
      GA4_ID +
      "',{send_page_view:true});"
    document.head.appendChild(inline)
  }

  if (YM_ID) {
    loadScript("ym-base", "https://mc.yandex.ru/metrika/tag.js")
    const inline = document.createElement("script")
    inline.id = "ym-init"
    inline.textContent =
      "(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(" +
      YM_ID +
      ",'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});"
    document.head.appendChild(inline)
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return
  const win = window as unknown as Record<string, unknown>
  const gtag = win.gtag as ((...args: unknown[]) => void) | undefined
  const ym = win.ym as ((...args: unknown[]) => void) | undefined

  if (typeof gtag === "function") {
    gtag("event", name, params)
  }
  if (typeof ym === "function" && YM_ID) {
    ym(YM_ID, "reachGoal", name)
  }
  if (!gtag && !ym) {
    console.debug("[analytics]", name, params)
  }
}
