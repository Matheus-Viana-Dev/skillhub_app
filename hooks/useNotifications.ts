import type { Notification } from '@/components/modals';
import { useCallback, useState } from 'react';

// Mock de notificações iniciais
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'promotion',
    title: 'Oferta Especial TSCONTROL!',
    message: 'Desconto de 30% no software de gestão empresarial até amanhã. Aproveite esta oportunidade única!',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
    read: false,
    action: {
      label: 'Ver Oferta',
      onPress: () => console.log('Abrir oferta TSCONTROL'),
    },
  },
  {
    id: '2',
    type: 'success',
    title: 'Pedido TECTALK Confirmado',
    message: 'Seu pedido da plataforma de atendimento foi confirmado e será ativado em até 24 horas.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Nova Integração Instagram',
    message: 'Agora você pode conectar o Instagram diretamente no seu painel do TECTALK para automatizar respostas.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Renovação Próxima',
    message: 'Sua assinatura do TSCONTROL vence em 7 dias. Renove agora para continuar aproveitando todos os recursos.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    read: true,
    action: {
      label: 'Renovar Agora',
      onPress: () => console.log('Abrir renovação'),
    },
  },
  {
    id: '5',
    type: 'info',
    title: 'Tutorial: Secretária Virtual',
    message: 'Aprenda a configurar sua secretária virtual para agendamentos automáticos em 3 passos simples.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
    read: true,
    action: {
      label: 'Ver Tutorial',
      onPress: () => console.log('Abrir tutorial'),
    },
  },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Marcar uma notificação como lida
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Marcar todas as notificações como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Limpar todas as notificações
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Adicionar nova notificação
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Remover notificação específica
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Contadores úteis
  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCount = notifications.length;

  return {
    notifications,
    unreadCount,
    totalCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    addNotification,
    removeNotification,
  };
};

