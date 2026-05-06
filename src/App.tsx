import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Terms from "./pages/Terms"
import Privacy from "./pages/Privacy"
import Dashboard from "./pages/Dashboard"
import Onboarding from "./pages/Onboarding"
import NewLead from "./pages/NewLead"
import LeadConfirmation from "./pages/LeadConfirmation"
import LeadDetail from "./pages/LeadDetail"
import Commissions from "./pages/Commissions"
import AdminDashboard from "./pages/AdminDashboard"
import AdminLeads from "./pages/AdminLeads"
import AdminCommissions from "./pages/AdminCommissions"
import AuthLayout from "./components/AuthLayout"

function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/termos" element={<Terms />} />
      <Route path="/privacidade" element={<Privacy />} />

      {/* Partner routes */}
      <Route path="/dashboard" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
      <Route path="/onboarding" element={<AuthWrapper><Onboarding /></AuthWrapper>} />
      <Route path="/indicar" element={<AuthWrapper><NewLead /></AuthWrapper>} />
      <Route path="/confirmacao/:id" element={<AuthWrapper><LeadConfirmation /></AuthWrapper>} />
      <Route path="/indicacoes" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
      <Route path="/indicacoes/:id" element={<AuthWrapper><LeadDetail /></AuthWrapper>} />
      <Route path="/comissoes" element={<AuthWrapper><Commissions /></AuthWrapper>} />

      {/* Admin routes */}
      <Route path="/admin" element={<AuthWrapper><AdminDashboard /></AuthWrapper>} />
      <Route path="/admin/leads" element={<AuthWrapper><AdminLeads /></AuthWrapper>} />
      <Route path="/admin/comissoes" element={<AuthWrapper><AdminCommissions /></AuthWrapper>} />
      <Route path="/admin/relatorios" element={<AuthWrapper><AdminDashboard /></AuthWrapper>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
