import { useState, useEffect } from "react"

const LAYERS = [
  {
    number: "01",
    name: "Frontend",
    items: ["React 19", "TypeScript", "Tailwind CSS v4"],
  },
  {
    number: "02",
    name: "AI Models",
    items: ["GPT-4", "Claude 3", "Gemini Pro"],
  },
  {
    number: "03",
    name: "AI Architecture",
    items: ["AI Agents", "RAG Pipeline", "Vector Search", "Embeddings"],
  },
  {
    number: "04",
    name: "Data Layer",
    items: ["PostgreSQL", "Vector Store", "Knowledge Base"],
  },
  {
    number: "05",
    name: "Automation",
    items: ["n8n Workflows", "API Gateway", "Tool Integrations"],
  },
  {
    number: "06",
    name: "Infrastructure",
    items: ["Vercel", "Docker", "CI/CD"],
  },
]

export default function TechStackSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative z-10 px-6 md:px-8 py-24 md:py-32" id="tech-stack">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs tracking-[0.15em] uppercase text-foreground/30 mb-4"
            style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards` : "none", opacity: 0 }}
          >
            Technology Stack
          </p>
          <h2
            className="font-heading text-3xl md:text-5xl font-normal tracking-tight"
            style={{ animation: mounted ? `scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s forwards` : "none", opacity: 0 }}
          >
            Engineering <span className="text-foreground/50">stack.</span>
          </h2>
        </div>

        <div
          className="glass-premium rounded-2xl p-6 md:p-8"
          style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards` : "none", opacity: 0 }}
        >
          {LAYERS.map((layer, i) => (
            <div key={layer.name}>
              <div className="flex items-start gap-4 md:gap-6 py-4 md:py-5">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-foreground/15 tracking-wider">{layer.number}</span>
                  {i < LAYERS.length - 1 && <div className="w-px flex-1 bg-white/[0.04] mt-2" />}
                </div>
                <div className="w-px h-8 shrink-0 rounded-full bg-white/[0.08]" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground/50 mb-2">{layer.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-md bg-white/[0.03] border border-white/[0.05] px-2.5 py-1 text-[11px] text-foreground/40 font-mono"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {i < LAYERS.length - 1 && <div className="ml-8 h-px bg-white/[0.03]" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}