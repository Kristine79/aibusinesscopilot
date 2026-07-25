import { useState, useEffect } from "react"

const PROBLEMS = [
  { number: "01", title: "Manual Reporting", desc: "Hours spent collecting and preparing information." },
  { number: "02", title: "Information Overload", desc: "Important insights are buried inside large amounts of data." },
  { number: "03", title: "Repetitive Communication", desc: "Teams spend time on routine messages and tasks." },
  { number: "04", title: "Data Analysis", desc: "Decision-making requires processing complex information." },
  { number: "05", title: "Routine Workflows", desc: "Manual processes slow down business operations." },
]

export default function FeaturesSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative z-10 px-6 md:px-8 py-24 md:py-32" id="business-problem">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-20">
          <div
            className="lg:w-5/12 shrink-0"
            style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards` : "none", opacity: 0 }}
          >
            <p className="text-xs tracking-[0.15em] uppercase text-foreground/30 mb-5">The Business Problem</p>
            <h2 className="font-heading text-3xl md:text-5xl font-normal tracking-tight leading-[1.1]">
              Businesses lose time on{" "}
              <span className="text-foreground/50">repetitive operations.</span>
            </h2>
            <div className="mt-8 h-px bg-white/[0.06]" />
            <p className="mt-6 text-sm text-foreground/45 leading-relaxed">
              AI transforms these processes into intelligent workflows.
            </p>
          </div>

          <div className="flex-1 min-w-0">
            <div className="space-y-0">
              {PROBLEMS.map((item, i) => (
                <div
                  key={item.number}
                  className="border-b border-white/[0.04] last:border-b-0"
                  style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.06}s forwards` : "none", opacity: 0 }}
                >
                  <div className="flex items-start gap-5 py-5 md:py-6 px-3 -mx-3 rounded-xl hover:bg-white/[0.02] transition-all duration-300 cursor-default">
                    <span className="text-[11px] font-mono text-foreground/15 tracking-wider shrink-0 mt-0.5 w-6">
                      {item.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base text-foreground/80 font-medium mb-0.5 hover:text-foreground transition-colors">{item.title}</p>
                      <p className="text-sm text-foreground/45 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
