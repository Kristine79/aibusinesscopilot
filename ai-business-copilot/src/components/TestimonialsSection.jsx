import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"

const SCENARIOS = [
  {
    number: "01",
    title: "Research Assistant",
    problem: "Manual research and information gathering",
    transformation: "AI analysis processes and summarizes documents automatically",
    outcome: "Insights delivered in minutes instead of hours",
  },
  {
    number: "02",
    title: "Operations Assistant",
    problem: "Manual operational tasks across disconnected systems",
    transformation: "AI workflows connect tools and execute processes autonomously",
    outcome: "Operational overhead reduced by 70%",
  },
  {
    number: "03",
    title: "Content Assistant",
    problem: "Manual content creation and formatting",
    transformation: "AI generates on-brand materials from templates",
    outcome: "Production time cut by 80%",
  },
  {
    number: "04",
    title: "Knowledge Assistant",
    problem: "Searching documents and wikis manually",
    transformation: "RAG retrieves exact answers with source attribution",
    outcome: "Instant access to company knowledge",
  },
]

export default function TestimonialsSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative z-10 px-6 md:px-8 py-24 md:py-32" id="scenarios">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs tracking-[0.15em] uppercase text-foreground/30 mb-4"
            style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards` : "none", opacity: 0 }}
          >
            Business Scenarios
          </p>
          <h2
            className="font-heading text-3xl md:text-5xl font-normal tracking-tight"
            style={{ animation: mounted ? `scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s forwards` : "none", opacity: 0 }}
          >
            From manual to <span className="text-foreground/50">automated.</span>
          </h2>
        </div>

        <div className="glass-premium rounded-2xl p-6 md:p-8">
          <div className="space-y-1">
            {SCENARIOS.map((item, i) => (
              <div
                key={item.number}
                className="relative"
                style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.06}s forwards` : "none", opacity: 0 }}
              >
                <div className="group flex flex-col md:flex-row gap-4 md:gap-0 py-5 md:py-6 px-3 -mx-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-4 md:w-56 shrink-0">
                    <span className="text-[11px] font-mono text-foreground/10 tracking-wider mt-0.5 w-6">{item.number}</span>
                    <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{item.title}</span>
                  </div>

                  <div className="hidden md:flex items-center pt-0.5 px-2">
                    <ArrowRight className="w-3 h-3 text-foreground/12" />
                  </div>

                  <div className="flex-1 min-w-0 md:pl-3">
                    <p className="text-xs text-foreground/35 leading-relaxed line-through decoration-foreground/8">
                      {item.problem}
                    </p>
                  </div>

                  <div className="hidden md:flex items-center pt-0.5 px-2">
                    <ArrowRight className="w-3 h-3 text-indigo-400/25" />
                  </div>

                  <div className="flex-1 min-w-0 md:pl-3">
                    <p className="text-xs text-indigo-300/45 leading-relaxed">{item.transformation}</p>
                  </div>

                  <div className="hidden md:flex items-center pt-0.5 px-2">
                    <ArrowRight className="w-3 h-3 text-emerald-400/25" />
                  </div>

                  <div className="md:w-48 shrink-0 md:pl-3">
                    <p className="text-xs text-emerald-300/50 font-medium">{item.outcome}</p>
                  </div>
                </div>
                {i < SCENARIOS.length - 1 && <div className="ml-4 md:ml-0 h-px bg-white/[0.03]" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}