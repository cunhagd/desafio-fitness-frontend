// /frontend/src/pages/SignUpPage.tsx

import { SignUpForm } from "../components/SignUpForm"; // O caminho para o componente muda
import { Link } from 'react-router-dom'; // Garanta que o Link está importado

export function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-clickup-bg">
      <header className="w-full flex justify-between items-center p-4 sm:px-8 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-clickup-blue">🤡 Palhacitos</span>
          <span className="text-sm text-clickup-text-muted hidden sm:inline">
            Sua rotina de exercícios, levada a sério. Ou não.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-clickup-text-muted hidden md:inline">
              Já é um Palhacito?
            </span>
            {/* Troque o <button> por <Link> */}
            <Link to="/login" className="px-5 py-2 font-semibold rounded-md text-white bg-clickup-blue hover:bg-clickup-hover-blue transition-colors">
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-md bg-clickup-card p-8 rounded-lg shadow-clickup-card-shadow border border-gray-100">
          <h1 className="text-3xl font-bold text-clickup-text-dark text-center mb-2">
            Crie sua conta! ✨
          </h1>
          <p className="text-clickup-text-muted text-center text-sm mb-6">
            Vamos começar essa palhaçada...
          </p>
          
          <SignUpForm />
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