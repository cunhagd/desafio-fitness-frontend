// /frontend/src/pages/PartnerPage.tsx

import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Users, Send, Mail, CheckCircle, AlertTriangle, Check, X } from 'lucide-react';

interface PartnerStatus {
  hasPartner: boolean;
  partner: {
    firstName: string;
    email: string;
  } | null;
}

interface Invitation {
  id: string;
  sender: {
    firstName: string;
    email: string;
  };
}

// Interface para ajudar na tipagem de erros da API
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function PartnerPage() {
  const [status, setStatus] = useState<PartnerStatus | null>(null);
  const [pendingInvites, setPendingInvites] = useState<Invitation[]>([]);
  const [invitedEmail, setInvitedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // Loading para ações específicas (aceitar/recusar)
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

  const fetchData = async () => {
    setError(null); // Limpa erros antigos antes de buscar
    try {
      const [statusRes, invitesRes] = await Promise.all([
        api.get('/invites/status'),
        api.get('/invites/pending'),
      ]);
      setStatus(statusRes.data);
      setPendingInvites(invitesRes.data);
    } catch { // CORREÇÃO: Removido o parâmetro 'err' não utilizado
      setError('Não foi possível carregar os dados da parceria.');
      // CORREÇÃO: Define um estado padrão para 'status' em caso de erro para desbloquear a UI
      setStatus({ hasPartner: false, partner: null });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post('/invites/send', { invitedEmail });
      setSuccess(`Convite enviado com sucesso para ${invitedEmail}!`);
      setInvitedEmail('');
    } catch (err) { // CORREÇÃO: Removido 'any' e adicionada tipagem segura
      const error = err as ApiError;
      setError(error.response?.data?.message || 'Erro ao enviar o convite.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePartner = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete('/invites/remove');
      setIsConfirmingRemove(false);
      await fetchData(); // Atualiza a página para mostrar o formulário de convite
    } catch (err) { // CORREÇÃO: Removido 'any' e adicionada tipagem segura
      const error = err as ApiError;
      setError(error.response?.data?.message || 'Erro ao remover parceria.');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (invitationId: string, accepted: boolean) => {
    setActionLoading(true);
    setError(null);
    try {
      await api.post('/invites/respond', { invitationId, acceptance: accepted });
      await fetchData(); // Atualiza toda a página após a resposta
    } catch (err) { // CORREÇÃO: Removido 'any' e adicionada tipagem segura
      const error = err as ApiError;
      setError(error.response?.data?.message || 'Erro ao responder convite.');
    } finally {
      setActionLoading(false);
    }
  };

  if (!status) {
    return <div className="text-center text-clickup-text-muted">Verificando status...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Exibe o erro principal no topo da página, se houver */}
      {error && <p className="text-clickup-error text-center text-sm p-3 bg-red-50 border border-clickup-error rounded-md">{error}</p>}
      
      {/* CARD DE STATUS ATUAL */}
      {status.hasPartner && status.partner ? (
        <div className="bg-clickup-card p-8 rounded-lg shadow-clickup-card-shadow border border-gray-100 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-clickup-success mb-4" />
          <h2 className="text-2xl font-bold text-clickup-text-dark">Você já tem um parceiro!</h2>
          <p className="text-clickup-text-muted mt-2">Sua jornada é em dupla com:</p>
          <div className="mt-6 bg-gray-50/80 p-4 rounded-md">
            <p className="text-xl font-semibold text-clickup-purple">{status.partner.firstName}</p>
            <p className="text-sm text-clickup-text-muted">{status.partner.email}</p>
          </div>
          <button
            onClick={() => setIsConfirmingRemove(true)}
            className="mt-6 w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold rounded-md text-clickup-error bg-red-100 hover:bg-red-200 border border-red-200 transition-colors"
          >
            <AlertTriangle size={16} />
            Remover Parceria
          </button>
        </div>
      ) : (
        <>
          {/* SEÇÃO: LISTA DE CONVITES PENDENTES */}
          {pendingInvites.length > 0 && (
            <div className="bg-clickup-card p-8 rounded-lg shadow-clickup-card-shadow border border-gray-100">
              <h2 className="text-2xl font-bold text-clickup-text-dark mb-4">Convites Pendentes 📬</h2>
              <div className="space-y-4">
                {pendingInvites.map(invite => (
                  <div key={invite.id} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-md">
                    <div>
                      <p className="font-semibold text-clickup-text-dark">{invite.sender.firstName}</p>
                      <p className="text-sm text-clickup-text-muted">{invite.sender.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleRespond(invite.id, false)} 
                        className="p-2 text-clickup-error bg-red-100 hover:bg-red-200 rounded-full transition-colors disabled:opacity-50"
                        disabled={actionLoading}
                      >
                        <X size={16} />
                      </button>
                      <button 
                        onClick={() => handleRespond(invite.id, true)} 
                        className="p-2 text-clickup-success bg-green-100 hover:bg-green-200 rounded-full transition-colors disabled:opacity-50"
                        disabled={actionLoading}
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        
          {/* CARD PARA CONVIDAR PARCEIRO */}
          <div className="bg-clickup-card p-8 rounded-lg shadow-clickup-card-shadow border border-gray-100">
            <h2 className="text-2xl font-bold text-clickup-text-dark flex items-center gap-2">
              <Users /> Convidar um Parceiro
            </h2>
            <p className="text-sm text-clickup-text-muted mt-2 mb-6">
              Envie um convite para o email de um amigo(a) cadastrado no Palhacitos.
            </p>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-clickup-text-dark mb-1">
                  Email do parceiro
                </label>
                <div className="flex items-center relative w-full bg-white border border-clickup-border rounded-md focus-within:ring-2 focus-within:ring-clickup-blue transition-all duration-200">
                  <Mail size={20} className="pl-3 text-clickup-text-muted" />
                  <input
                    type="email"
                    id="email"
                    value={invitedEmail}
                    onChange={(e) => setInvitedEmail(e.target.value)}
                    placeholder="amigo@exemplo.com"
                    className="w-full p-3 pl-2 bg-transparent focus:outline-none text-clickup-text-dark placeholder-clickup-text-muted"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-semibold rounded-md text-white bg-gradient-to-r from-clickup-gradient-start to-clickup-gradient-end hover:opacity-90 transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                <Send size={18} />
                {loading ? 'Enviando...' : 'Enviar Convite'}
              </button>
            </form>
            {/* Mensagens de erro/sucesso do formulário */}
            {error && <p className="text-clickup-error text-center text-xs mt-3 p-2 bg-red-50 border border-clickup-error rounded-md">{error}</p>}
            {success && <p className="text-clickup-success text-center text-xs mt-3 p-2 bg-green-50 border border-clickup-success rounded-md">{success}</p>}
          </div>
        </>
      )}

      {/* MODAL DE CONFIRMAÇÃO PARA REMOVER PARCERIA */}
      {isConfirmingRemove && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-clickup-error mb-4" />
            <h2 className="text-2xl font-bold text-clickup-text-dark">Tem certeza?</h2>
            <p className="text-clickup-text-muted mt-2">
              Esta ação removerá a parceria com {status?.partner?.firstName}. Esta ação não pode ser desfeita.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setIsConfirmingRemove(false)}
                className="flex-1 py-3 px-4 text-sm font-semibold rounded-md text-clickup-text-muted bg-gray-200 hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleRemovePartner}
                className="flex-1 py-3 px-4 text-sm font-semibold rounded-md text-white bg-clickup-error hover:bg-red-600 transition-all duration-300 shadow-lg"
                disabled={loading}
              >
                {loading ? 'Removendo...' : 'Sim, remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

