// /frontend/src/components/LoginForm.tsx

import React, { useState } from 'react';
import { api } from '../lib/api';
import { Mail, Lock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Hook para redirecionar o usuário

const inputWrapperStyle = "flex items-center relative w-full bg-white border border-clickup-border rounded-md focus-within:ring-2 focus-within:ring-clickup-blue transition-all duration-200";
const inputIconStyle = "pl-3 text-clickup-text-muted";
const inputFieldStyle = "w-full py-2.5 pl-2 bg-transparent focus:outline-none text-clickup-text-dark placeholder-clickup-text-muted";
const buttonPurpleGradientStyle = "w-full py-2.5 px-6 text-sm font-semibold rounded-md text-white bg-gradient-to-r from-clickup-gradient-start to-clickup-gradient-end hover:opacity-90 transition-all duration-300 shadow-lg flex items-center justify-center gap-2";

export function LoginForm() {
  const navigate = useNavigate(); // Inicializa o hook de navegação
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      
      // 1. Pega o token da resposta
      const { token } = response.data;

      // 2. Salva o token no localStorage do navegador
      localStorage.setItem('authToken', token);

      // 3. Redireciona o usuário para o dashboard
      navigate('/dashboard');

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Falha no login. Verifique suas credenciais.';
      setError(`😥 ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className={inputWrapperStyle}>
          <Mail size={25} className={inputIconStyle} />
          <input type="email" name="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} className={inputFieldStyle} required />
        </div>
      </div>
      
      <div>
        <div className={inputWrapperStyle}>
          <Lock size={25} className={inputIconStyle} />
          <input type="password" name="password" placeholder="Sua senha" value={formData.password} onChange={handleChange} className={inputFieldStyle} required />
        </div>
      </div>
      
      {error && <p className="text-clickup-error text-center text-xs mt-3 p-2 bg-red-50 border border-clickup-error rounded-md">{error}</p>}

      <div className="pt-2">
        <button type="submit" className={`${buttonPurpleGradientStyle} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={loading}>
          {loading ? 'Entrando...' : <>Entrar <ChevronRight size={20} /></>}
        </button>
      </div>
    </form>
  );
}