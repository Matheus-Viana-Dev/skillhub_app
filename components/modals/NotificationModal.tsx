import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Tipos de notificação
export type NotificationType = 'success' | 'warning' | 'error' | 'info' | 'promotion';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

// Mock de notificações para demonstração
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'promotion',
    title: 'Oferta Especial!',
    message: 'Desconto de 30% no TSCONTROL até amanhã. Não perca esta oportunidade!',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
    read: false,
    action: {
      label: 'Ver Oferta',
      onPress: () => console.log('Ver oferta'),
    },
  },
  {
    id: '2',
    type: 'success',
    title: 'Pedido Confirmado',
    message: 'Seu pedido do TECTALK foi confirmado e será ativado em até 24 horas.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Nova Funcionalidade',
    message: 'Agora você pode integrar o Instagram diretamente no seu painel do TECTALK.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Renovação Próxima',
    message: 'Sua assinatura do TSCONTROL vence em 7 dias. Renove para continuar usando.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    read: true,
    action: {
      label: 'Renovar',
      onPress: () => console.log('Renovar assinatura'),
    },
  },
];

export default function NotificationModal({
  visible,
  onClose,
  notifications = mockNotifications,
  onMarkAsRead = (id) => console.log('Mark as read:', id),
  onMarkAllAsRead = () => console.log('Mark all as read'),
  onClearAll = () => console.log('Clear all'),
}: NotificationModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return { name: 'check-circle', color: '#10B981' };
      case 'warning':
        return { name: 'exclamation-triangle', color: '#F59E0B' };
      case 'error':
        return { name: 'times-circle', color: '#EF4444' };
      case 'info':
        return { name: 'info-circle', color: '#3B82F6' };
      case 'promotion':
        return { name: 'tag', color: '#8B5CF6' };
      default:
        return { name: 'bell', color: colors.textSecondary };
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      return `${days}d atrás`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!visible) return null;

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    }}>
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Popup Content */}
      <Animated.View
        entering={SlideInDown.delay(100).springify()}
        exiting={SlideOutUp.springify()}
        style={{
          position: 'absolute',
          top: insets.top + 80, // Posição abaixo do header
          right: 16,
          width: width - 32,
          maxWidth: 400,
          maxHeight: height * 0.7,
          backgroundColor: colors.cardBg,
          borderRadius: 20,
          ...(colorScheme === 'light' && {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 25,
            elevation: 20,
          }),
          ...(colorScheme === 'dark' && {
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }),
        }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeIn.delay(200)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.inputBorder,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5
              name="bell"
              size={20}
              color={colors.buttonPrimary}
              style={{ marginRight: 8 }}
            />
            <Text style={{
              fontSize: 18,
              fontFamily: 'Inter',
              fontWeight: '700',
              color: colors.textPrimary,
            }}>
              Notificações
            </Text>
            {unreadCount > 0 && (
              <View style={{
                backgroundColor: '#EF4444',
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 8,
              }}>
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  color: '#FFFFFF',
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.inputBorder,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={0.7}
          >
            <FontAwesome5
              name="times"
              size={14}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Actions */}
        {notifications.length > 0 && (
          <Animated.View
            entering={FadeIn.delay(300)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: colors.inputBorder,
            }}
          >
            <TouchableOpacity
              onPress={onMarkAllAsRead}
              disabled={unreadCount === 0}
              activeOpacity={0.7}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: 'Inter',
                fontWeight: '600',
                color: unreadCount > 0 ? colors.buttonPrimary : colors.textSecondary,
              }}>
                Marcar todas como lidas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClearAll}
              activeOpacity={0.7}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: 'Inter',
                fontWeight: '600',
                color: colors.error,
              }}>
                Limpar todas
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Notifications List */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <Animated.View
              entering={FadeIn.delay(400)}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 60,
                paddingHorizontal: 20,
              }}
            >
              <FontAwesome5
                name="bell-slash"
                size={48}
                color={colors.textSecondary}
                style={{ marginBottom: 16 }}
              />
              <Text style={{
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: '600',
                color: colors.textSecondary,
                textAlign: 'center',
                marginBottom: 8,
              }}>
                Nenhuma notificação
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Inter',
                fontWeight: '400',
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 20,
              }}>
                Você não tem notificações no momento. Elas aparecerão aqui quando chegarem.
              </Text>
            </Animated.View>
          ) : (
            notifications.map((notification, index) => {
              const icon = getNotificationIcon(notification.type);
              
              return (
                <Animated.View
                  key={notification.id}
                  entering={FadeIn.delay(400 + index * 100)}
                >
                  <TouchableOpacity
                    onPress={() => onMarkAsRead(notification.id)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      borderBottomWidth: index < notifications.length - 1 ? 1 : 0,
                      borderBottomColor: colors.inputBorder,
                      backgroundColor: notification.read ? 'transparent' : `${colors.buttonPrimary}05`,
                    }}
                  >
                    {/* Icon */}
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: `${icon.color}15`,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}>
                      <FontAwesome5
                        name={icon.name}
                        size={18}
                        color={icon.color}
                      />
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 4,
                      }}>
                        <Text style={{
                          fontSize: 15,
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          color: colors.textPrimary,
                          flex: 1,
                          marginRight: 8,
                        }}>
                          {notification.title}
                        </Text>
                        
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter',
                            fontWeight: '400',
                            color: colors.textSecondary,
                            marginRight: 8,
                          }}>
                            {formatTimestamp(notification.timestamp)}
                          </Text>
                          
                          {!notification.read && (
                            <View style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: colors.buttonPrimary,
                            }} />
                          )}
                        </View>
                      </View>

                      <Text style={{
                        fontSize: 14,
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        color: colors.textSecondary,
                        lineHeight: 20,
                        marginBottom: notification.action ? 12 : 0,
                      }}>
                        {notification.message}
                      </Text>

                      {/* Action Button */}
                      {notification.action && (
                        <TouchableOpacity
                          onPress={notification.action.onPress}
                          style={{
                            backgroundColor: colors.buttonPrimary,
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 8,
                            alignSelf: 'flex-start',
                          }}
                          activeOpacity={0.8}
                        >
                          <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter',
                            fontWeight: '600',
                            color: colors.buttonText,
                          }}>
                            {notification.action.label}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })
          )}
                 </ScrollView>
       </Animated.View>
     </View>
   );
}

