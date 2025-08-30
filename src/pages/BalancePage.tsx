// /frontend/src/pages/BalancePage.tsx (Redesenhado com o tema ClickUp)

import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PiggyBank, ArrowUpCircle, ArrowDownCircle, Landmark } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'DEPOSIT' | 'PENALTY_GIVEN' | 'PENALTY_RECEIVED';
  transactionDate: string;
}

interface BalanceData {
  transactions: Transaction[];
  totalBalance: number;
}

// Objeto de detalhes atualizado para o tema claro
const transactionTypeDetails = {
  DEPOSIT: { icon: <ArrowUpCircle className="text-clickup-blue" />, color: 'text-clickup-blue' },
  PENALTY_RECEIVED: { icon: <ArrowUpCircle className="text-clickup-success" />, color: 'text-clickup-success' },
  PENALTY_GIVEN: { icon: <ArrowDownCircle className="text-clickup-error" />, color: 'text-clickup-error' },
};

export function BalancePage() {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/balance');
      setBalanceData(response.data);
    } catch (err) {
      setError('Não foi possível carregar os dados de saldo.');
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleDeposit = async () => {
    setDepositLoading(true);
    setDepositError(null);
    try {
      await api.post('/balance/deposit');
      await fetchBalance();
    } catch (err: any) {
      setDepositError(err.response?.data?.message || 'Erro ao registrar depósito.');
    } finally {
      setDepositLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (error) return <div className="text-center text-clickup-error">{error}</div>;
  if (!balanceData) return <div className="text-center text-clickup-text-muted">Carregando saldo...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna do Saldo e Ações */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-r from-clickup-gradient-start to-clickup-gradient-end p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-lg font-semibold flex items-center gap-2 opacity-90">
              <PiggyBank /> Saldo Atual
            </h2>
            <p className="text-4xl font-bold mt-2">
              {formatCurrency(balanceData.totalBalance)}
            </p>
          </div>

          <div className="bg-clickup-card p-6 rounded-lg shadow-clickup-card-shadow border border-gray-100">
            <h2 className="text-xl font-bold text-clickup-text-dark mb-4">Ações Financeiras</h2>
            <button
              onClick={handleDeposit}
              disabled={depositLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-clickup-success text-white font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Landmark size={18} />
              {depositLoading ? 'Registrando...' : 'Registrar Depósito Mensal'}
            </button>
            {depositError && <p className="text-clickup-error text-xs mt-2 text-center">{depositError}</p>}
          </div>
        </div>

        {/* Coluna do Extrato */}
        <div className="lg:col-span-2 bg-clickup-card p-6 rounded-lg shadow-clickup-card-shadow border border-gray-100">
          <h2 className="text-2xl font-bold text-clickup-text-dark mb-4">Extrato Detalhado</h2>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {balanceData.transactions.length > 0 ? (
              balanceData.transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between bg-gray-50/50 p-4 rounded-md">
                  <div className="flex items-center gap-4">
                    {transactionTypeDetails[tx.type].icon}
                    <div>
                      <p className="font-semibold text-clickup-text-dark">{tx.description}</p>
                      <p className="text-xs text-clickup-text-muted">
                        {new Date(tx.transactionDate).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <p className={`font-bold text-lg ${transactionTypeDetails[tx.type].color}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="font-semibold text-clickup-text-dark">Nenhuma transação registrada.</p>
                <p className="text-sm text-clickup-text-muted">Seu extrato aparecerá aqui.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

