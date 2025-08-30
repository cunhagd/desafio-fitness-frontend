// /frontend/src/pages/ErrorLogPage.tsx (Redesenhado com o tema ClickUp)

import { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { Target, PlusCircle, Wine, Cigarette, AlertTriangle } from 'lucide-react';

interface ErrorLog {
  id: string;
  type: 'DRINKING' | 'SMOKING' | 'BOTH';
  reason: string;
  erroredAt: string;
}

// Objeto de detalhes atualizado para o tema claro
const errorTypeDetails = {
  DRINKING: { text: 'Bebeu', icon: <Wine size={20} className="text-purple-500" />, borderColor: 'border-purple-500' },
  SMOKING: { text: 'Fumou', icon: <Cigarette size={20} className="text-orange-500" />, borderColor: 'border-orange-500' },
  BOTH: { text: 'Ambos', icon: <AlertTriangle size={20} className="text-red-500" />, borderColor: 'border-red-500' },
};

export function ErrorLogPage() {
  const [type, setType] = useState<'DRINKING' | 'SMOKING' | 'BOTH' | ''>('');
  const [reason, setReason] = useState('');
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchErrorLogs = async () => {
    try {
      const response = await api.get('/errors');
      setLogs(response.data);
    } catch (error) {
      console.error('Erro ao buscar registros de erro:', error);
      setError('Não foi possível carregar o histórico de erros.');
    }
  };

  useEffect(() => {
    fetchErrorLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !reason) {
      setError('Por favor, selecione o tipo e descreva o motivo.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post('/errors', { type, reason });
      setType('');
      setReason('');
      await fetchErrorLogs();
    } catch (err: any) { // A chave de abertura '{' estava faltando aqui
      setError(err.response?.data?.message || 'Ocorreu um erro ao registrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Coluna do Formulário */}
      <div className="bg-clickup-card p-6 rounded-lg shadow-clickup-card-shadow border border-gray-100">
        <h2 className="text-2xl font-bold text-clickup-text-dark mb-4 flex items-center gap-2">
          <Target /> Registrar um Deslize
        </h2>
        <p className="text-sm text-clickup-text-muted mb-6">Acontece. O importante é ser honesto(a) e registrar para aprendermos juntos.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-clickup-text-dark mb-2">Qual foi o erro?</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.keys(errorTypeDetails).map((key) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setType(key as 'DRINKING' | 'SMOKING' | 'BOTH')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all text-sm font-semibold ${type === key ? `border-clickup-purple bg-purple-50 text-clickup-purple` : `border-gray-200 bg-white hover:border-gray-300`}`}
                >
                  {errorTypeDetails[key as keyof typeof errorTypeDetails].icon}
                  {errorTypeDetails[key as keyof typeof errorTypeDetails].text}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-semibold text-clickup-text-dark mb-1">
              Descreva o que aconteceu...
            </label>
            <textarea
              id="reason"
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 bg-white border border-clickup-border rounded-md focus:outline-none focus:ring-2 focus:ring-clickup-blue transition-all duration-200 text-clickup-text-dark placeholder-clickup-text-muted"
              placeholder="O que sentiu? O que levou ao erro? Seja detalhista."
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-semibold rounded-md text-white bg-gradient-to-r from-clickup-gradient-start to-clickup-gradient-end hover:opacity-90 transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            <PlusCircle size={18} />
            {loading ? 'Registrando...' : 'Confirmar Erro'}
          </button>
        </form>
        {error && <p className="text-clickup-error text-center text-xs mt-3 p-2 bg-red-50 border border-clickup-error rounded-md">{error}</p>}
      </div>

      {/* Coluna do Histórico de Erros */}
      <div className="bg-clickup-card p-6 rounded-lg shadow-clickup-card-shadow border border-gray-100">
        <h2 className="text-2xl font-bold text-clickup-text-dark mb-4">Histórico de Erros</h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {logs.length > 0 ? (
            logs.map(log => (
              <div key={log.id} className={`p-4 rounded-lg border-l-4 bg-gray-50/50 ${errorTypeDetails[log.type].borderColor}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 font-bold text-clickup-text-dark">
                    {errorTypeDetails[log.type].icon}
                    <span>{errorTypeDetails[log.type].text}</span>
                  </div>
                  <span className="text-xs text-clickup-text-muted">
                    {new Date(log.erroredAt).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-clickup-text-muted">{log.reason}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="font-semibold text-clickup-text-dark">Nenhum erro registrado ainda!</p>
              <p className="text-sm text-clickup-text-muted">Continue assim. Parabéns! 🥳</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

