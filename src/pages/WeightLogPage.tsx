// /frontend/src/pages/WeightLogPage.tsx (Redesenhado com o tema ClickUp)

import { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { Scale, PlusCircle } from 'lucide-react';

interface WeightLog {
  id: string;
  weight: number;
  logDate: string;
}

export function WeightLogPage() {
  const [weight, setWeight] = useState('');
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeightLogs = async () => {
    try {
      const response = await api.get('/weight');
      setLogs(response.data); // A API já retorna ordenado por data descendente
    } catch (error) {
      console.error('Erro ao buscar registros de peso:', error);
      setError('Não foi possível carregar o histórico de peso.');
    }
  };

  useEffect(() => {
    fetchWeightLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || Number(weight) <= 0) {
      setError('Por favor, insira um peso válido.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post('/weight', { weight });
      setWeight('');
      await fetchWeightLogs();
    } catch (err) {
      setError('Ocorreu um erro ao registrar o peso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Coluna do Formulário */}
      <div className="bg-clickup-card p-6 rounded-lg shadow-clickup-card-shadow border border-gray-100">
        <h2 className="text-2xl font-bold text-clickup-text-dark mb-4 flex items-center gap-2">
          <Scale /> Registrar Pesagem
        </h2>
        <p className="text-sm text-clickup-text-muted mb-6">
          Lembre-se: toda sexta-feira, em jejum. A consistência é a chave para o sucesso!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-semibold text-clickup-text-dark mb-1">
              Seu peso em kg (ex: 85.5)
            </label>
            <input
              type="number"
              step="0.1"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-3 bg-white border border-clickup-border rounded-md focus:outline-none focus:ring-2 focus:ring-clickup-blue transition-all duration-200 text-clickup-text-dark placeholder-clickup-text-muted"
              placeholder="0.0"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-semibold rounded-md text-white bg-gradient-to-r from-clickup-gradient-start to-clickup-gradient-end hover:opacity-90 transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            <PlusCircle size={18} />
            {loading ? 'Salvando...' : 'Salvar Pesagem'}
          </button>
        </form>
        {error && <p className="text-clickup-error text-center text-xs mt-3 p-2 bg-red-50 border border-clickup-error rounded-md">{error}</p>}
      </div>

      {/* Coluna do Histórico */}
      <div className="bg-clickup-card p-6 rounded-lg shadow-clickup-card-shadow border border-gray-100">
        <h2 className="text-2xl font-bold text-clickup-text-dark mb-4">Histórico de Pesagem</h2>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {logs.length > 0 ? (
            logs.map((log, index) => {
              // Compara com o registro anterior na lista (que é o mais antigo em data)
              const previousLog = logs[index + 1];
              const change = previousLog ? log.weight - previousLog.weight : 0;
              
              const ChangeIndicator = () => {
                if (change === 0 || !previousLog) return null;
                const isLoss = change < 0;
                return (
                  <span className={`text-xs font-semibold ${isLoss ? 'text-clickup-success' : 'text-clickup-error'}`}>
                    ({change > 0 ? '+' : ''}{change.toFixed(1)} kg)
                  </span>
                );
              };

              return (
                <div key={log.id} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-md">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-lg text-clickup-text-dark">{log.weight.toFixed(1)} kg</span>
                    <ChangeIndicator />
                  </div>
                  <span className="text-sm text-clickup-text-muted">
                    {new Date(log.logDate).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10">
              <p className="font-semibold text-clickup-text-dark">Nenhum registro de peso.</p>
              <p className="text-sm text-clickup-text-muted">Sua primeira pesagem aparecerá aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

