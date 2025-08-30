// /frontend/src/layouts/AuthenticatedLayout.tsx

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Target, PiggyBank, Scale, Users, LogOut, Trophy } from 'lucide-react';
import { NotificationBell } from '../components/NotificationBell';
import { /*...,*/ Camera } from 'lucide-react';


const navLinkStyle = "flex items-center gap-2 px-3 py-2 text-clickup-text-muted hover:text-clickup-text-dark transition-colors";
const activeLinkStyle = "font-semibold text-clickup-purple";

export function AuthenticatedLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-clickup-bg">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6">
        <NavLink to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-clickup-blue">
          <span>🤡</span>
          <span className="hidden sm:inline">Palhacitos</span>
        </NavLink>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-10">
          <NavLink to="/dashboard" className={({isActive}) => `${navLinkStyle} ${isActive ? activeLinkStyle : ''}`} end>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/erros" className={({isActive}) => `${navLinkStyle} ${isActive ? activeLinkStyle : ''}`}>
            <Target size={16} /> Registrar Erro
          </NavLink>
          <NavLink to="/saldo" className={({isActive}) => `${navLinkStyle} ${isActive ? activeLinkStyle : ''}`}>
            <PiggyBank size={16} /> Saldo
          </NavLink>
          <NavLink to="/peso" className={({isActive}) => `${navLinkStyle} ${isActive ? activeLinkStyle : ''}`}>
            <Scale size={16} /> Registrar Peso
          </NavLink>
          <NavLink to="/parceiro" className={({isActive}) => `${navLinkStyle} ${isActive ? activeLinkStyle : ''}`}>
            <Users size={16} /> Parceiro
          </NavLink>
          <NavLink to="/conquistas" className={({isActive}) => `${navLinkStyle} ${isActive ? activeLinkStyle : ''}`}>
            <Trophy size={16} /> Conquistas
          </NavLink>
          <NavLink to="/fotos" className={({isActive}) => `${navLinkStyle} ${isActive ? activeLinkStyle : ''}`}>
            <Camera size={16} /> Fotos
          </NavLink>
        </nav>
        <div className="flex items-center ml-auto gap-4">
          <NotificationBell />
          <button onClick={handleLogout} className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <LogOut size={20} className="text-clickup-text-muted" />
          </button>
        </div>
      </header>
      <main className="flex-1 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}