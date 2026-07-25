import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"

export default function FinalCTA() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative z-10 px-6 md:px-8 py-24 md:py-32" id="cta">
      <div className="max-w-3xl mx-auto text-center">
        <p
          className="text-xs tracking-[0.15em] uppercase text-foreground/30 mb-6"
          style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards` : "none", opacity: 0 }}
        >
          Portfolio Project
        </p>

        <h2
          className="font-heading text-3xl md:text-5xl font-normal tracking-tight mb-6"
          style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.18s forwards` : "none", opacity: 0 }}
        >
          Building practical AI solutions{" "}
          <span className="text-foreground/50">for modern businesses.</span>
        </h2>

        <p
          className="text-foreground/45 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed"
          style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.26s forwards` : "none", opacity: 0 }}
        >
          Exploring how artificial intelligence can automate workflows and improve everyday decision-making.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.34s forwards` : "none", opacity: 0 }}
        >
          <a href="#capabilities" className="group relative inline-flex items-center gap-2.5 rounded-full px-7 py-[18px] bg-white text-black font-medium text-sm md:text-base hover:scale-[1.03] transition-all duration-300 ease-out shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] overflow-hidden">
            <span className="relative z-10">View Project</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-6 md:gap-10 mb-6">
            <a href="#" className="text-xs text-foreground/15 hover:text-foreground/30 transition-colors">GitHub</a>
            <a href="#" className="text-xs text-foreground/15 hover:text-foreground/30 transition-colors">Portfolio</a>
            <a href="#" className="text-xs text-foreground/15 hover:text-foreground/30 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-foreground/8">© 2026 AI Business Copilot. Portfolio Project.</p>
        </div>
      </div>
    </section>
  )
}