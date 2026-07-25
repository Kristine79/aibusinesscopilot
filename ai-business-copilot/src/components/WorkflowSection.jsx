import { useState, useEffect } from "react"
import { ArrowDown } from "lucide-react"

const LAYERS = [
  {
    label: "User Request",
    tag: "INPUT",
    meta: ["HTTP", "WebSocket", "JSON"],
    tagColor: "text-white/30 border-white/10",
    textColor: "text-foreground/80",
    metaColor: "text-foreground/30",
  },
  {
    label: "AI Interface",
    tag: "CLASSIFICATION",
    meta: ["Intent Parsing", "Prompt Assembly"],
    tagColor: "text-indigo-400/40 border-indigo-500/20",
    textColor: "text-indigo-300/70",
    metaColor: "text-indigo-300/35",
  },
  {
    label: "LLM Orchestration",
    tag: "MODEL ROUTING",
    meta: ["GPT-4", "Claude", "Gemini"],
    tagColor: "text-indigo-400/40 border-indigo-500/20",
    textColor: "text-indigo-300/70",
    metaColor: "text-indigo-300/35",
    inner: [
      { name: "GPT-4", detail: "Primary reasoning" },
      { name: "Claude", detail: "Analysis" },
      { name: "Gemini", detail: "Multimodal" },
    ],
  },
  {
    label: "RAG / Knowledge Layer",
    tag: "RETRIEVAL",
    meta: ["Vector Search", "Semantic Retrieval", "Re-ranking"],
    tagColor: "text-purple-400/40 border-purple-500/20",
    textColor: "text-purple-300/60",
    metaColor: "text-purple-300/30",
  },
  {
    label: "Tools & Integrations",
    tag: "EXECUTION",
    meta: ["Function Calling", "API Gateway", "n8n"],
    tagColor: "text-purple-400/40 border-purple-500/20",
    textColor: "text-purple-300/60",
    metaColor: "text-purple-300/30",
  },
  {
    label: "Business Action",
    tag: "OUTPUT",
    meta: ["Workflow Trigger", "Response Delivery"],
    tagColor: "text-emerald-400/40 border-emerald-500/20",
    textColor: "text-emerald-300/60",
    metaColor: "text-emerald-300/30",
  },
]

export default function WorkflowSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative z-10 px-6 md:px-8 py-24 md:py-32" id="architecture">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs tracking-[0.15em] uppercase text-foreground/30 mb-4"
            style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards` : "none", opacity: 0 }}
          >
            System Architecture
          </p>
          <h2
            className="font-heading text-3xl md:text-5xl font-normal tracking-tight"
            style={{ animation: mounted ? `scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s forwards` : "none", opacity: 0 }}
          >
            Request to action <span className="text-foreground/50">pipeline.</span>
          </h2>
        </div>

        <div
          className="relative"
          style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards` : "none", opacity: 0 }}
        >
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/5 via-white/5 to-transparent pointer-events-none" />

          {LAYERS.map((layer, i) => (
            <div key={layer.label} className="relative">
              <div className="flex items-center gap-4 md:gap-6 lg:gap-10">
                <div className="hidden lg:flex flex-col items-center w-20 shrink-0">
                  <span className="text-[10px] font-mono text-foreground/10">{`0${i + 1}`}</span>
                  <div className="w-px flex-1 bg-white/[0.04] mt-2" />
                </div>

                <div className="flex-1 glass-premium rounded-xl px-5 md:px-7 py-4 md:py-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${layer.tagColor}`}>{layer.tag}</span>
                    <h3 className={`text-sm md:text-base font-medium ${layer.textColor}`}>{layer.label}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.meta.map((m) => (
                      <span key={m} className={`text-[11px] font-mono ${layer.metaColor}`}>{m}</span>
                    ))}
                  </div>
                  {layer.inner && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/[0.04]">
                      {layer.inner.map((item) => (
                        <div key={item.name} className="flex items-center gap-1.5 rounded-md bg-white/[0.03] border border-white/[0.05] px-2 py-1">
                          <span className="text-[11px] text-foreground/60 font-medium">{item.name}</span>
                          <span className="text-[9px] text-foreground/20 font-mono">{item.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {i < LAYERS.length - 1 && (
                <div className="flex justify-center py-2 md:py-3">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-px h-4 bg-gradient-to-b from-white/[0.08] to-transparent" />
                    <ArrowDown className="w-3.5 h-3.5 text-foreground/12 animate-flow-arrow" />
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/40" />
              <span className="text-[10px] text-foreground/20 font-mono">end-to-end latency ~2.4s</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}