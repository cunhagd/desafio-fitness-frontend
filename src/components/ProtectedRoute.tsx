// /frontend/src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Se não há token, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se há token, renderiza o componente filho (a página protegida)
  return <>{children}</>;
}