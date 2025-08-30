// /frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout';
import { WeightLogPage } from './pages/WeightLogPage';
import { ErrorLogPage } from './pages/ErrorLogPage';
import { BalancePage } from './pages/BalancePage';
import { PartnerPage } from './pages/PartnerPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ProgressPhotosPage } from './pages/ProgressPhotosPage';
import { PartnerDashboardPage } from './pages/PartnerDashboardPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rotas Protegidas dentro do Layout Autenticado */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          {/* A página inicial da área logada será o dashboard */}
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="erros" element={<ErrorLogPage />} />
          <Route path="saldo" element={<BalancePage />} />
          <Route path="peso" element={<WeightLogPage />} />
          <Route path="parceiro" element={<PartnerPage />} />
          <Route path="conquistas" element={<AchievementsPage />} />
          <Route path="fotos" element={<ProgressPhotosPage />} />
          <Route path="parceiro/progresso" element={<PartnerDashboardPage />} />

        </Route>

        {/* Rota padrão: redireciona para login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;