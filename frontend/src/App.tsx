import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/lib/context/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import Landing from "@/pages/Landing"
import Diagnostic from "@/pages/Diagnostic"
import ReportView from "@/pages/ReportView"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import Dashboard from "@/pages/Dashboard"
import LeadsPage from "@/pages/LeadsPage"
import ReportsPage from "@/pages/ReportsPage"
import ReportDetailPage from "@/pages/ReportDetailPage"
import AnalyticsPage from "@/pages/AnalyticsPage"
import KnowledgeBasePage from "@/pages/KnowledgeBasePage"
import ChatPage from "@/pages/ChatPage"
import { AdminLayout } from "@/components/admin/AdminLayout"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthProvider>
  )
}
