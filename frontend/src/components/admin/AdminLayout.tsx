import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  BrainCircuit,
  MessageSquare,
  Menu,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useAuth } from "@/lib/context/AuthContext"

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const navigation = [
    { name: t("layout.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("layout.leads"), href: "/dashboard/leads", icon: Users },
    { name: t("layout.reports"), href: "/dashboard/reports", icon: FileText },
    { name: t("layout.analytics"), href: "/dashboard/analytics", icon: BarChart3 },
    { name: t("layout.knowledgeBase"), href: "/dashboard/knowledge", icon: BrainCircuit },
    { name: t("layout.aiChat"), href: "/dashboard/chat", icon: MessageSquare },
  ]

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
    )}

      <aside
        aria-label={t("layout.mainMenu")}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <BrainCircuit className="h-6 w-6 text-indigo-600" />
          <span className="text-lg font-bold">{t("layout.brand")}</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/dashboard"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label={t("layout.openMenu")}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <LanguageSwitcher />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.name || t("layout.user")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title={t("layout.signOut")}
              aria-label={t("layout.signOut")}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
