// /frontend/src/pages/LoginPage.tsx

import { LoginForm } from "../components/LoginForm";
import { Link } from "react-router-dom"; // Importe o Link para navegação

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-clickup-bg">
      <header className="w-full flex justify-between items-center p-4 sm:px-8 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-clickup-blue">🤡 Palhacitos</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-clickup-text-muted hidden md:inline">
            Ainda não é um Palhacito?
          </span>
          {/* Use o componente Link para navegar para a página de cadastro */}
          <Link to="/signup" className="px-5 py-2 font-semibold rounded-md text-white bg-clickup-blue hover:bg-clickup-hover-blue transition-colors">
            Cadastre-se
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-sm bg-clickup-card p-8 rounded-lg shadow-clickup-card-shadow border border-gray-100">
          <h1 className="text-3xl font-bold text-clickup-text-dark text-center mb-2">
            Bem-vindo de volta! 👋
          </h1>
          <p className="text-clickup-text-muted text-center text-sm mb-6">
            Insira suas credenciais para continuar.
          </p>
          
          <LoginForm />
        </div>
      </main>

      <footer className="w-full bg-clickup-bg p-4 sm:px-8 text-center text-clickup-text-muted text-xs">
        <p>
          Desenvolvido por <span className="font-semibold text-clickup-purple">Synapticode IA</span> em Belo Horizonte, Minas Gerais.
        </p>
      </footer>
    </div>
  );
}