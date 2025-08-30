// /frontend/src/pages/PartnerDashboardPage.tsx

import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HeartHandshake, TrendingUp, Target, Camera, Trophy, Wine, Cigarette, AlertTriangle } from 'lucide-react';

// Tipagem para os dados que virão do backend
interface PartnerData {
  firstName: string;
  weightHistory: { date: string; weight: number }[];
  errorLogs: { id: string; type: 'DRINKING' | 'SMOKING' | 'BOTH'; reason: string; erroredAt: string }[];
  photos: { id: string; imageUrl: string }[];
  achievementsCount: number;
}

const errorTypeDetails = {
  DRINKING: { text: 'Bebeu', icon: <Wine size={16} className="text-purple-500" /> },
  SMOKING: { text: 'Fumou', icon: <Cigarette size={16} className="text-orange-500" /> },
  BOTH: { text: 'Ambos', icon: <AlertTriangle size={16} className="text-red-500" /> },
};

export function PartnerDashboardPage() {
  const [data, setData] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/partner/dashboard');
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Não foi possível carregar os dados do parceiro.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center text-clickup-text-muted">Carregando dados do parceiro...</div>;
  if (error) return <div className="text-center text-red-500 bg-red-50 p-4 rounded-md">{error}</div>;
  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center">
        <HeartHandshake className="mx-auto h-16 w-16 text-clickup-purple mb-4" />
        <h1 className="text-4xl font-bold text-clickup-text-dark">Progresso de {data.firstName}</h1>
        <p className="text-clickup-text-muted mt-2">Acompanhe a jornada do seu parceiro de desafio!</p>
      </div>

      {/* Seção de Gráfico e Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-clickup-card-shadow border">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><TrendingUp /> Evolução do Peso</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data.weightHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')} fontSize={12} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#7B68EE" strokeWidth={2} name="Peso (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-clickup-card-shadow border text-center">
            <Target className="mx-auto h-8 w-8 text-clickup-error mb-2" />
            <p className="text-3xl font-bold">{data.errorLogs.length}</p>
            <p className="text-sm text-clickup-text-muted">Erros Registrados</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-clickup-card-shadow border text-center">
            <Trophy className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
            <p className="text-3xl font-bold">{data.achievementsCount}</p>
            <p className="text-sm text-clickup-text-muted">Conquistas Desbloqueadas</p>
          </div>
        </div>
      </div>

      {/* Seção de Histórico de Erros e Galeria de Fotos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-clickup-card-shadow border">
          <h3 className="text-lg font-semibold mb-4">Histórico de Erros</h3>
          <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
            {data.errorLogs.length > 0 ? data.errorLogs.map(log => (
              <div key={log.id} className="p-3 bg-gray-50/80 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center gap-2">{errorTypeDetails[log.type].icon} {errorTypeDetails[log.type].text}</span>
                  <span className="text-xs text-clickup-text-muted">{new Date(log.erroredAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            )) : <p className="text-sm text-center text-clickup-text-muted py-8">Nenhum erro registrado. Mandou bem!</p>}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-clickup-card-shadow border">
          <h3 className="text-lg font-semibold mb-4">Galeria de Fotos</h3>
          <div className="max-h-96 overflow-y-auto pr-2">
            {data.photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {data.photos.map(photo => (
                  <img key={photo.id} src={photo.imageUrl} alt="Progresso do parceiro" className="w-full h-full object-cover aspect-square rounded-md" />
                ))}
              </div>
            ) : <p className="text-sm text-center text-clickup-text-muted py-8">Nenhuma foto na galeria ainda.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}