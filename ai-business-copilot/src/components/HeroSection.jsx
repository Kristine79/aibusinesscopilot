import { useState, useEffect, useRef } from "react"
import { Menu, X, ArrowDown } from "lucide-react"

const NAV_ITEMS = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Architecture", href: "#architecture" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "GitHub", href: "#", external: true },
]

const CAPABILITIES = ["AI Agents", "RAG Knowledge Base", "Workflow Automation", "Business Intelligence"]

const ENTERPRISE_LOGOS = [
  "OpenAI", "Anthropic", "Vercel", "Supabase", "n8n",
  "PostgreSQL", "Docker", "React", "TypeScript",
]

function BackgroundVideo() {
  const videoRef = useRef(null)
  const wrapperRef = useRef(null)
  const fadeRef = useRef({ phase: "idle", startTime: 0 })

  useEffect(() => {
    const video = videoRef.current
    const wrapper = wrapperRef.current
    if (!video || !wrapper) return

    wrapper.style.opacity = "0"
    let rafId

    const animate = (timestamp) => {
      const state = fadeRef.current
      const dur = video.duration

      if (state.phase === "fading-in") {
        const elapsed = timestamp - state.startTime
        const progress = Math.min(elapsed / 500, 1)
        wrapper.style.opacity = progress
        if (progress >= 1) {
          state.phase = "idle"
          wrapper.style.opacity = "1"
        }
      }

      if (state.phase === "fading-out") {
        const elapsed = timestamp - state.startTime
        const progress = Math.min(elapsed / 500, 1)
        wrapper.style.opacity = 1 - progress
        if (progress >= 1) {
          state.phase = "idle"
          wrapper.style.opacity = "0"
          video.pause()
          video.currentTime = 0
          setTimeout(() => video.play(), 100)
        }
      }

      if (dur && dur - video.currentTime <= 0.5 && dur - video.currentTime > 0 && state.phase === "idle") {
        state.phase = "fading-out"
        state.startTime = timestamp
      }

      rafId = requestAnimationFrame(animate)
    }

    const handlePlay = () => {
      fadeRef.current.phase = "fading-in"
      fadeRef.current.startTime = performance.now()
    }

    video.addEventListener("play", handlePlay)
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      video.removeEventListener("play", handlePlay)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="absolute inset-0 w-full h-full overflow-hidden" style={{ opacity: 0 }}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4"
      />
    </div>
  )
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative min-h-screen flex flex-col overflow-visible" id="hero">
      <BackgroundVideo />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 z-[2] pointer-events-none" />

      <div
        className="w-[800px] h-[500px] opacity-40 bg-[#0a0a1a] blur-[100px] absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[3]"
        aria-hidden="true"
      />

      <nav className="w-full py-5 px-6 md:px-8 flex items-center justify-between relative z-30">
        <div
          className="flex items-center gap-2.5"
          style={{ animation: mounted ? "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards" : "none", opacity: 0 }}
        >
          <img src="/logo.png" alt="AI Business Copilot" height={32} className="h-8 w-auto" />
        </div>

        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 tracking-wide"
              style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) ${0.12 + i * 0.04}s forwards` : "none", opacity: 0 }}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div
          className="hidden md:flex items-center gap-5"
          style={{ animation: mounted ? "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.32s forwards" : "none", opacity: 0 }}
        >
          <a href="#capabilities" className="rounded-full px-4 py-2 bg-white text-black text-sm font-medium hover:scale-[1.03] transition-all duration-300 ease-out shadow-lg shadow-white/5">
            Explore Capabilities
          </a>
        </div>

        <button
          className="md:hidden text-foreground/60 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 animate-fade-in">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="text-xl text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <hr className="w-16 border-white/5" />
          <a href="#capabilities" className="rounded-full px-8 py-3.5 bg-white text-black font-medium" onClick={() => setMobileOpen(false)}>Explore Capabilities</a>
        </div>
      )}

      <div className="absolute bottom-0 left-8 right-8 z-20">
        <div className="h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 md:px-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-6 max-w-5xl mx-auto -mt-16 md:-mt-20">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.07] text-xs text-foreground/40 tracking-[0.15em] uppercase"
            style={{ animation: mounted ? "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards" : "none", opacity: 0 }}
          >
            Portfolio Project &bull; AI Automation Platform
          </div>

          <h1
            className="font-heading font-normal leading-[1.02] tracking-[-0.02em]"
            style={{ animation: mounted ? "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s forwards" : "none", opacity: 0 }}
          >
            <span
              className="block text-[60px] xs:text-[72px] sm:text-[90px] md:text-[110px] lg:text-[130px] leading-[0.92] bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to left, #6366f1, #a855f7, #fcd34d)" }}
            >
              AI
            </span>
            <span className="block text-[60px] xs:text-[72px] sm:text-[90px] md:text-[110px] lg:text-[130px] text-foreground leading-[0.92] mt-1 sm:mt-0">
              Business Copilot
            </span>
          </h1>

          <p
            className="text-base md:text-lg leading-7 md:leading-8 max-w-[520px] text-foreground/60"
            style={{ animation: mounted ? "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s forwards" : "none", opacity: 0 }}
          >
            An intelligent AI assistant that helps automate workflows, analyze information, and turn business data into actionable insights.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center gap-4"
            style={{ animation: mounted ? "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s forwards" : "none", opacity: 0 }}
          >
            <a href="#capabilities" className="group relative inline-flex items-center gap-2.5 rounded-full px-7 py-[18px] bg-white text-black font-medium text-sm md:text-base hover:scale-[1.03] transition-all duration-300 ease-out shadow-2xl shadow-white/10 overflow-hidden">
              <span className="relative z-10">Explore Capabilities</span>
              <ArrowDown className="relative z-10 w-4 h-4" />
            </a>
            <a href="#architecture" className="group inline-flex items-center gap-2.5 rounded-full px-7 py-[18px] border border-white/10 text-foreground/60 text-sm md:text-base hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300">
              View Architecture
            </a>
          </div>

          <div
            className="flex items-center gap-3 text-xs text-foreground/35"
            style={{ animation: mounted ? "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.6s forwards" : "none", opacity: 0 }}
          >
            {CAPABILITIES.map((cap, i) => (
              <span key={cap} className="flex items-center gap-3">
                <span>{cap}</span>
                {i < CAPABILITIES.length - 1 && <span className="w-1 h-1 rounded-full bg-foreground/8" />}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-8 overflow-hidden">
        <div className="flex items-center gap-8 opacity-[0.08]">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
            {[...ENTERPRISE_LOGOS, ...ENTERPRISE_LOGOS].map((name, i) => (
              <span key={`${name}-${i}`} className="text-xs font-medium tracking-widest uppercase text-foreground">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}