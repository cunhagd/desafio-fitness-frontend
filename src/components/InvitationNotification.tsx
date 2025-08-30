// /frontend/src/components/InvitationNotification.tsx

import { api } from '../lib/api.ts';
import { Handshake } from 'lucide-react';

interface Invitation {
  id: string;
  senderName: string;
}

interface InvitationNotificationProps {
  invitation: Invitation;
  onClose: () => void;
  onResponse: () => void; // Para recarregar o status do parceiro
}

export function InvitationNotification({ invitation, onClose, onResponse }: InvitationNotificationProps) {
  const handleResponse = async (response: 'ACCEPT' | 'DECLINE') => {
    try {
      await api.post('/invites/respond', { invitationId: invitation.id, response });
      onResponse(); // Informa o componente pai que uma resposta foi enviada
      onClose();
    } catch (error) {
      console.error(`Erro ao ${response === 'ACCEPT' ? 'aceitar' : 'recusar'} convite`, error);
      // Opcional: mostrar um erro para o usuário
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
        <Handshake className="mx-auto h-16 w-16 text-clickup-purple mb-4" />
        <h2 className="text-2xl font-bold text-clickup-text-dark">Você tem um convite!</h2>
        <p className="text-clickup-text-muted mt-2">
          <span className="font-semibold text-clickup-purple">{invitation.senderName}</span> convidou você para ser parceiro(a) de desafio no Palhacitos.
        </p>
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => handleResponse('DECLINE')}
            className="flex-1 py-3 px-4 text-sm font-semibold rounded-md text-clickup-text-muted bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={() => handleResponse('ACCEPT')}
            className="flex-1 py-3 px-4 text-sm font-semibold rounded-md text-white bg-gradient-to-r from-clickup-gradient-start to-clickup-gradient-end hover:opacity-90 transition-all duration-300 shadow-lg"
          >
            Aceitar Convite
          </button>
        </div>
      </div>
    </div>
  );
}

