import { useState, useEffect } from "react"
import { MessageCircle, Zap, Search, BarChart3, Activity, TrendingUp, Clock, CheckCircle, FileText } from "lucide-react"

const METRICS = [
  { icon: Activity, label: "Active Workflows", value: "47", change: "+12%", accent: "text-indigo-400" },
  { icon: CheckCircle, label: "Success Rate", value: "97.3%", change: "+2.1%", accent: "text-emerald-400" },
  { icon: Clock, label: "Avg Response", value: "2.4s", change: "-0.3s", accent: "text-amber-400" },
  { icon: TrendingUp, label: "Tasks Today", value: "284", change: "+8%", accent: "text-indigo-400" },
]

const sparkline = "M0,20 L10,18 L20,22 L30,14 L40,16 L50,10 L60,12 L70,8 L80,10 L90,5 L100,7"

export default function DashboardSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative z-10 px-6 md:px-8 py-24 md:py-32" id="product-demo">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs tracking-[0.15em] uppercase text-foreground/30 mb-4"
            style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards` : "none", opacity: 0 }}
          >
            Product Demo
          </p>
          <h2
            className="font-heading text-3xl md:text-5xl font-normal tracking-tight"
            style={{ animation: mounted ? `scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s forwards` : "none", opacity: 0 }}
          >
            Application <span className="text-foreground/50">interface.</span>
          </h2>
        </div>

        <div
          className="glass-premium rounded-2xl overflow-hidden"
          style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards` : "none", opacity: 0 }}
        >
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.04] bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/8" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/8" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/8" />
            </div>
            <span className="text-[10px] text-foreground/15 font-mono ml-3">AI Business Copilot — Workspace</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.04]">
            <div className="lg:col-span-2 p-5 md:p-6">
              <div className="flex items-center gap-2 mb-5">
                <MessageCircle className="w-4 h-4 text-foreground/30" />
                <span className="text-xs font-medium text-foreground/60">AI Assistant</span>
                <span className="ml-auto text-[10px] text-foreground/15 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-indigo-400/50" />
                  GPT-4 · active
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-end">
                  <div className="rounded-xl bg-indigo-500/15 border border-indigo-500/20 px-4 py-3 max-w-[80%] md:max-w-[70%]">
                    <p className="text-sm text-foreground/80">Analyze last month's sales performance across all regions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-400/60" />
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 max-w-[85%] md:max-w-[75%]">
                    <p className="text-sm text-foreground/65 leading-relaxed mb-3">
                      Here's the breakdown for last month:
                    </p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                        <span className="text-foreground/45">North America</span>
                        <span className="text-foreground/80 font-medium">$847K</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                        <span className="text-foreground/45">Europe</span>
                        <span className="text-foreground/80 font-medium">$623K</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                        <span className="text-foreground/45">Asia Pacific</span>
                        <span className="text-foreground/80 font-medium">$412K</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-foreground/60 font-medium">Total Revenue</span>
                        <span className="text-emerald-400 font-medium">$1.88M</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/[0.04]">
                      <p className="text-xs text-foreground/45 leading-relaxed">
                        <span className="text-emerald-400/80">▲ 23%</span> growth compared to previous month. Recommendations for underperforming regions are available.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="rounded-xl bg-indigo-500/15 border border-indigo-500/20 px-4 py-3 max-w-[80%] md:max-w-[70%]">
                    <p className="text-sm text-foreground/80">Show the recommendations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-400/60" />
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 max-w-[85%] md:max-w-[75%]">
                    <p className="text-sm text-foreground/65 leading-relaxed">
                      <strong className="text-foreground/80">APAC:</strong> Consider expanding the sales team — conversion dropped 8% after team reduction.
                    </p>
                    <p className="text-sm text-foreground/65 leading-relaxed mt-1">
                      <strong className="text-foreground/80">Europe:</strong> Seasonal pattern detected. Increasing ad spend in Q4 could recover ~$90K.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                <div className="flex-1 rounded-lg bg-white/[0.03] border border-white/[0.06] px-4 py-2.5">
                  <p className="text-sm text-foreground/20">Ask about your workflows, data, or business operations...</p>
                </div>
                <button className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Send message">
                  <Zap className="w-4 h-4 text-foreground/30" />
                </button>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-3.5 h-3.5 text-foreground/25" />
                  <span className="text-xs font-medium text-foreground/50">Performance</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {METRICS.map((m) => {
                    const MIcon = m.icon
                    return (
                      <div key={m.label} className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                        <MIcon className={`w-3.5 h-3.5 ${m.accent || "text-foreground/25"} mb-1.5`} />
                        <p className={`text-sm font-medium ${m.accent || "text-foreground/70"}`}>{m.value}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-foreground/25">{m.label}</p>
                          <span className={`text-[9px] ${m.change.startsWith("+") ? "text-emerald-400/50" : "text-amber-400/50"}`}>{m.change}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-foreground/25" />
                  <span className="text-xs font-medium text-foreground/50">Revenue Trend</span>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-4">
                  <svg className="w-full h-12" viewBox="0 0 100 25" preserveAspectRatio="none">
                    <path d={sparkline} fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    <path d={`${sparkline} L100,25 L0,25 Z`} fill="url(#sparkGradient)" opacity="0.15" />
                    <defs>
                      <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex justify-between mt-1 text-[9px] text-foreground/15 font-mono">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-3.5 h-3.5 text-foreground/25" />
                  <span className="text-xs font-medium text-foreground/50">Knowledge Search</span>
                </div>
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3.5 py-2.5 flex items-center gap-2 mb-2">
                  <Search className="w-3 h-3 text-foreground/20 shrink-0" />
                  <p className="text-xs text-foreground/30 truncate">Search company documents...</p>
                </div>
                <div className="space-y-1.5">
                  {[
                    { title: "data retention policy", match: "92%" },
                    { title: "Q3 revenue summary", match: "87%" },
                    { title: "onboarding playbook v2", match: "78%" },
                  ].map((q) => (
                    <div key={q.title} className="flex items-center gap-2 rounded-lg bg-white/[0.02] border border-white/[0.04] px-2.5 py-1.5">
                      <FileText className="w-3 h-3 text-foreground/20 shrink-0" />
                      <span className="text-[11px] text-foreground/40 truncate flex-1">{q.title}</span>
                      <span className="text-[9px] text-foreground/15 font-mono">{q.match}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}