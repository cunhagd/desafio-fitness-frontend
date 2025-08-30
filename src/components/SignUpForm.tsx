// /frontend/src/components/SignUpForm.tsx (Com ícones maiores e alinhados)

import React, { useState } from 'react';
import { api } from '../lib/api';
import { User, Mail, Lock, Calendar, Ruler, Weight, Target, ChevronRight, CheckCircle2 } from 'lucide-react';

type FieldStatus = 'idle' | 'valid' | 'invalid';
type FormStatus = { [key: string]: FieldStatus; };

// Estilos
const inputLabelStyle = "block text-xs font-semibold text-clickup-text-dark mb-1";
const inputWrapperStyle = "flex items-center relative w-full bg-white border border-clickup-border rounded-md focus-within:ring-2 focus-within:ring-clickup-blue transition-all duration-200";
const inputIconStyle = "pl-3 text-clickup-text-muted";
// Padding ajustado para o novo tamanho do ícone e para o check da direita
const inputFieldStyle = "w-full py-2.5 pr-10 pl-2 bg-transparent focus:outline-none text-clickup-text-dark placeholder-clickup-text-muted";
const checkIconStyle = "absolute right-3 text-green-500";
const buttonPurpleGradientStyle = "w-full py-2.5 px-6 text-sm font-semibold rounded-md text-white bg-gradient-to-r from-clickup-gradient-start to-clickup-gradient-end hover:opacity-90 transition-all duration-300 shadow-lg flex items-center justify-center gap-2";

export function SignUpForm() {
  // A lógica de estado (useState, etc.) permanece a mesma da versão anterior.
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', 
    birthDate: '', height: '', initialWeight: '', goalWeight: '',
  });
  const [formStatus, setFormStatus] = useState<FormStatus>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let isValid: boolean = false;

    switch (name) {
      case 'firstName':
      case 'lastName':
        isValid = value.length >= 2;
        break;
      case 'email':
        isValid = /\S+@\S+\.\S+/.test(value);
        break;
      case 'password':
        isValid = value.length >= 6;
        break;
      case 'birthDate':
        isValid = !isNaN(new Date(value).getTime()) && value !== '';
        break;
      case 'height':
      case 'initialWeight':
      case 'goalWeight':
        isValid = !isNaN(parseFloat(value)) && parseFloat(value) > 0;
        break;
      default:
        isValid = true;
    }
    
    setFormStatus(prev => ({ ...prev, [name]: isValid ? 'valid' : 'invalid' }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const submissionData = {
        ...formData,
        birthDate: new Date(formData.birthDate).toISOString(),
        height: parseInt(formData.height, 10),
        initialWeight: parseFloat(formData.initialWeight),
        goalWeight: parseFloat(formData.goalWeight),
      };

      const response = await api.post('/users', submissionData);
      
      if (response.status === 201) {
        setSuccess('🎉 Sua conta foi criada! Bem-vindo ao Palhacitos Fitness.');
        setFormData({ 
          firstName: '', lastName: '', email: '', password: '', 
          birthDate: '', height: '', initialWeight: '', goalWeight: '',
        });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ops! Algo deu errado ao criar sua conta.';
      setError(`😥 ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="firstName" className={inputLabelStyle}>Nome</label>
        <div className={inputWrapperStyle}>
          <User size={25} className={inputIconStyle} />
          <input type="text" id="firstName" name="firstName" placeholder="Nome" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} className={inputFieldStyle} required />
          {formStatus.firstName === 'valid' && <CheckCircle2 size={20} className={`${checkIconStyle} animate-scale-in`} />}
        </div>
      </div>
      
      <div>
        <label htmlFor="lastName" className={inputLabelStyle}>Sobrenome</label>
        <div className={inputWrapperStyle}>
          <User size={25} className={inputIconStyle} />
          <input type="text" id="lastName" name="lastName" placeholder="Sobrenome" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} className={inputFieldStyle} required />
          {formStatus.lastName === 'valid' && <CheckCircle2 size={20} className={`${checkIconStyle} animate-scale-in`} />}
        </div>
      </div>

      <div>
        <label htmlFor="email" className={inputLabelStyle}>E-mail</label>
        <div className={inputWrapperStyle}>
          <Mail size={25} className={inputIconStyle} />
          <input type="email" id="email" name="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={inputFieldStyle} required />
          {formStatus.email === 'valid' && <CheckCircle2 size={20} className={`${checkIconStyle} animate-scale-in`} />}
        </div>
      </div>
      
      <div>
        <label htmlFor="password" className={inputLabelStyle}>Senha</label>
        <div className={inputWrapperStyle}>
          <Lock size={25} className={inputIconStyle} />
          <input type="password" id="password" name="password" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={handleChange} onBlur={handleBlur} className={inputFieldStyle} required />
          {formStatus.password === 'valid' && <CheckCircle2 size={20} className={`${checkIconStyle} animate-scale-in`} />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="birthDate" className={inputLabelStyle}>Nascimento</label>
          <div className={inputWrapperStyle}>
            <Calendar size={25} className={inputIconStyle} />
            <input type="date" id="birthDate" name="birthDate" value={formData.birthdate} onChange={handleChange} onBlur={handleBlur} className={inputFieldStyle} required />
            {formStatus.birthDate === 'valid' && <CheckCircle2 size={20} className={`${checkIconStyle} animate-scale-in`} />}
          </div>
        </div>
        <div>
          <label htmlFor="height" className={inputLabelStyle}>Altura (cm)</label>
          <div className={inputWrapperStyle}>
            <Ruler size={25} className={inputIconStyle} />
            <input type="number" id="height" name="height" placeholder="Ex: 175" value={formData.height} onChange={handleChange} onBlur={handleBlur} className={inputFieldStyle} required />
            {formStatus.height === 'valid' && <CheckCircle2 size={20} className={`${checkIconStyle} animate-scale-in`} />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="initialWeight" className={inputLabelStyle}>Peso Inicial (kg)</label>
          <div className={inputWrapperStyle}>
            <Weight size={25} className={inputIconStyle} />
            <input type="number" step="0.1" id="initialWeight" name="initialWeight" placeholder="Ex: 85.5" value={formData.initialWeight} onChange={handleChange} onBlur={handleBlur} className={inputFieldStyle} required />
            {formStatus.initialWeight === 'valid' && <CheckCircle2 size={20} className={`${checkIconStyle} animate-scale-in`} />}
          </div>
        </div>
        <div>
          <label htmlFor="goalWeight" className={inputLabelStyle}>Meta de Peso (kg)</label>
          <div className={inputWrapperStyle}>
            <Target size={25} className={inputIconStyle} />
            <input type="number" step="0.1" id="goalWeight" name="goalWeight" placeholder="Ex: 78.0" value={formData.goalWeight} onChange={handleChange} onBlur={handleBlur} className={inputFieldStyle} required />
            {formStatus.goalWeight === 'valid' && <CheckCircle2 size={20} className={`${checkIconStyle} animate-scale-in`} />}
          </div>
        </div>
      </div>
      
      {error && <p className="text-clickup-error text-center text-xs mt-3 p-2 bg-red-50 border border-clickup-error rounded-md">{error}</p>}
      {success && <p className="text-clickup-success text-center text-xs mt-3 p-2 bg-green-50 border border-clickup-success rounded-md">{success}</p>}

      <div className="pt-2">
        <button type="submit" className={`${buttonPurpleGradientStyle} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={loading}>
          {loading ? 'Criando conta...' : <>Começar a Brincadeira <ChevronRight size={20} /></>}
        </button>
      </div>
    </form>
  );
}