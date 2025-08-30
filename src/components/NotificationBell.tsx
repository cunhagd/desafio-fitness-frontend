// /frontend/src/components/NotificationBell.tsx

import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Bell, CheckCheck } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Opcional: Adicionar um intervalo para buscar novas notificações periodicamente
    const interval = setInterval(fetchNotifications, 60000); // A cada 1 minuto
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    setIsOpen(!isOpen);
    // Se o painel está sendo aberto e existem notificações não lidas
    if (!isOpen && unreadCount > 0) {
      try {
        await api.post('/notifications/read');
        // Atualiza o estado local para refletir que foram lidas
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      } catch (error) {
        console.error("Erro ao marcar notificações como lidas:", error);
      }
    }
  };

  return (
    <div className="relative">
      <button onClick={handleToggle} className="relative p-2 rounded-full hover:bg-gray-200 transition-colors">
        <Bell size={20} className="text-clickup-text-muted" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-10 animate-fade-in-down">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-clickup-text-dark">Notificações</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div key={notification.id} className={`p-4 border-b text-sm ${!notification.isRead ? 'bg-blue-50/50' : ''}`}>
                  <p className="text-clickup-text-dark">{notification.message}</p>
                  <p className="text-xs text-clickup-text-muted mt-1">
                    {new Date(notification.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-clickup-text-muted">
                <CheckCheck size={32} className="mx-auto mb-2" />
                <p>Tudo em dia!</p>
                <p className="text-xs">Nenhuma notificação nova.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}