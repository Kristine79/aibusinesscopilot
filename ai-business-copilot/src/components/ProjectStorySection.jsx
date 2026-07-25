import { useState, useEffect } from "react"
import { ExternalLink, GitBranch } from "lucide-react"

export default function ProjectStorySection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative z-10 px-6 md:px-8 py-24 md:py-32" id="project-story">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs tracking-[0.15em] uppercase text-foreground/30 mb-4"
            style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards` : "none", opacity: 0 }}
          >
            Case Study
          </p>
          <h2
            className="font-heading text-3xl md:text-5xl font-normal tracking-tight"
            style={{ animation: mounted ? `scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s forwards` : "none", opacity: 0 }}
          >
            AI Product Engineering <span className="text-foreground/50">case study.</span>
          </h2>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards` : "none", opacity: 0 }}
        >
          <div className="lg:col-span-3 border border-white/[0.06] rounded-2xl bg-white/[0.015] p-7 md:p-9">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-foreground/20 mb-2">Challenge</p>
                <p className="text-sm text-foreground/65 leading-relaxed">
                  Businesses waste time on repetitive operations — manual reporting, information overload, routine workflows. The goal was to build an AI system that understands business context and automates these processes.
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-foreground/20 mb-2">Approach</p>
                <p className="text-sm text-foreground/65 leading-relaxed">
                  Designed a multi-agent architecture with a conversational interface on top of agentic workflows. Used LLM orchestration for reasoning, RAG for knowledge retrieval, and tool-based execution for automation.
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-foreground/20 mb-2">Architecture</p>
                <p className="text-sm text-foreground/65 leading-relaxed">
                  User requests flow through intent classification, LLM processing with context retrieval, and tool execution to produce automated business actions. Each layer is independently observable and replaceable.
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-foreground/20 mb-2">Implementation</p>
                <p className="text-sm text-foreground/65 leading-relaxed">
                  Built with React 19, TypeScript, and Tailwind CSS v4. AI layer uses OpenAI, Claude, and Gemini models. RAG system uses vector search for context retrieval. Automation connects through n8n and API integrations.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 mt-8 pt-6 border-t border-white/[0.04]">
              <a href="#" className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors">
                <GitBranch className="w-4 h-4" />
                View on GitHub
                <ExternalLink className="w-3 h-3 text-foreground/20" />
              </a>
              <a href="#" className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors">
                Portfolio
                <ExternalLink className="w-3 h-3 text-foreground/20" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 border border-white/[0.06] rounded-2xl bg-white/[0.015] p-7 md:p-9">
            <p className="text-[10px] tracking-[0.12em] uppercase text-foreground/20 mb-5">Project Snapshot</p>
            <div className="space-y-4">
              {[
                { label: "Type", value: "AI Product Engineering Case Study" },
                { label: "AI Models", value: "GPT-4, Claude 3, Gemini Pro" },
                { label: "Retrieval", value: "Vector Search (RAG)" },
                { label: "Automation", value: "n8n Workflow Engine" },
                { label: "Frontend", value: "React 19 + Tailwind CSS v4" },
                { label: "Deployment", value: "Vercel + Docker" },
              ].map((s) => (
                <div key={s.label} className="pb-3 border-b border-white/[0.04] last:border-b-0 last:pb-0">
                  <p className="text-[10px] text-foreground/20 mb-0.5">{s.label}</p>
                  <p className="text-sm text-foreground/60">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}