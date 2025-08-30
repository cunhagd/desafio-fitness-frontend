// /frontend/src/pages/DashboardPage.tsx

import { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, PiggyBank, Scale } from 'lucide-react';
import { Link } from 'react-router-dom'; // Importando o Link para navegação

// Tipagem para os dados que virão do backend
interface DashboardData {
  user: {
    firstName: string;
    initialWeight: number;
    goalWeight: number;
    currentWeight: number;
    weightHistory: { date: string; weight: number }[];
    errorCount: number;
    balance: number;
  };
  partner: {
    firstName: string;
    errorCount: number;
    balance: number;
  } | null;
}

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (err) {
        setError('Não foi possível carregar os dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-clickup-text-muted">Carregando dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  
  if (!data) {
    return null; // ou um estado de erro mais robusto
  }

  const { user, partner } = data;
  const weightLost = user.initialWeight - user.currentWeight;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-clickup-text-dark">Olá, {user.firstName}! 👋</h1>

      {/* Grid de Cards de Resumo */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-clickup-card-shadow border border-gray-100">
          <h3 className="text-sm font-medium text-clickup-text-muted flex items-center gap-2"><Scale /> Progresso de Peso</h3>
          <p className="text-2xl font-bold text-clickup-text-dark mt-1">{user.currentWeight.toFixed(1)} kg</p>
          <p className={`text-xs ${weightLost >= 0 ? 'text-clickup-success' : 'text-clickup-error'}`}>
            {weightLost.toFixed(1)} kg perdidos desde o início
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-clickup-card-shadow border border-gray-100">
          <h3 className="text-sm font-medium text-clickup-text-muted flex items-center gap-2"><PiggyBank /> Saldo Atual</h3>
          <p className="text-2xl font-bold text-clickup-text-dark mt-1">{formatCurrency(user.balance)}</p>
          <p className="text-xs text-clickup-text-muted">Seu balanço financeiro</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-clickup-card-shadow border border-gray-100">
          <h3 className="text-sm font-medium text-clickup-text-muted flex items-center gap-2"><Target /> Total de Erros</h3>
          <p className="text-2xl font-bold text-clickup-text-dark mt-1">{user.errorCount}</p>
          <p className="text-xs text-clickup-text-muted">Seus deslizes registrados</p>
        </div>
      </div>
      
      {/* Gráfico de Evolução de Peso */}
      <div className="bg-white p-6 rounded-lg shadow-clickup-card-shadow border border-gray-100">
         <h3 className="text-lg font-semibold text-clickup-text-dark flex items-center gap-2 mb-4"><TrendingUp /> Sua Evolução</h3>
         <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={user.weightHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')} stroke="#6B7280" fontSize={12} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#6B7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }} />
              <Line type="monotone" dataKey="weight" stroke="#7B68EE" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Peso (kg)" />
            </LineChart>
          </ResponsiveContainer>
         </div>
      </div>

      {/* Comparativo com Parceiro */}
      {partner && (
        <div className="bg-white p-6 rounded-lg shadow-clickup-card-shadow border border-gray-100">
          <h3 className="text-lg font-semibold text-clickup-text-dark mb-4">Comparativo com {partner.firstName}</h3>
          <div className="grid md:grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-sm text-clickup-text-muted">Seus Erros</p>
              <p className="text-3xl font-bold text-clickup-text-dark">{user.errorCount}</p>
            </div>
            <div>
              <p className="text-sm text-clickup-text-muted">Erros de {partner.firstName}</p>
              <p className="text-3xl font-bold text-clickup-text-dark">{partner.errorCount}</p>
            </div>
             <div>
              <p className="text-sm text-clickup-text-muted">Seu Saldo</p>
              <p className={`text-3xl font-bold ${user.balance >= 0 ? 'text-clickup-success' : 'text-clickup-error'}`}>{formatCurrency(user.balance)}</p>
            </div>
             <div>
              <p className="text-sm text-clickup-text-muted">Saldo de {partner.firstName}</p>
              <p className={`text-3xl font-bold ${partner.balance >= 0 ? 'text-clickup-success' : 'text-clickup-error'}`}>{formatCurrency(partner.balance)}</p>
            </div>
          </div>
          <Link to="/parceiro/progresso" className="mt-6 block w-full text-center py-2 px-4 text-sm font-semibold rounded-md text-white bg-clickup-blue hover:bg-clickup-hover-blue transition-colors">
            Ver Progresso Completo
          </Link>
        </div>
      )}
    </div>
  );
}

