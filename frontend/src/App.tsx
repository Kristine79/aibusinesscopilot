import { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/lib/context/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import Landing from "@/pages/Landing"
import { AdminLayout } from "@/components/admin/AdminLayout"

const Diagnostic = lazy(() => import("@/pages/Diagnostic"))
const ReportView = lazy(() => import("@/pages/ReportView"))
const LoginPage = lazy(() => import("@/pages/LoginPage"))
const RegisterPage = lazy(() => import("@/pages/RegisterPage"))
const Dashboard = lazy(() => import("@/pages/Dashboard"))
const LeadsPage = lazy(() => import("@/pages/LeadsPage"))
const ReportsPage = lazy(() => import("@/pages/ReportsPage"))
const ReportDetailPage = lazy(() => import("@/pages/ReportDetailPage"))
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"))
const KnowledgeBasePage = lazy(() => import("@/pages/KnowledgeBasePage"))
const ChatPage = lazy(() => import("@/pages/ChatPage"))

function PageLoader() {
  return <div className="flex min-h-screen items-center justify-center" />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
            <Route path="/report/:id" element={<ReportView />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="reports/:id" element={<ReportDetailPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="knowledge" element={<KnowledgeBasePage />} />
              <Route path="chat" element={<ChatPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
