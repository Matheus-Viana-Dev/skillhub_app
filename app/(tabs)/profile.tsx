import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
    Bell,
    ChevronRight,
    Edit,
    HelpCircle,
    LogOut,
    Moon,
    Settings,
    Shield,
    Star
} from 'lucide-react-native';
import React from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    FadeInUp
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock data do usuário
const userProfile = {
  name: 'João Silva',
  email: 'joao.silva@email.com',
  avatar: 'https://via.placeholder.com/120x120/1E3A8A/FFFFFF?text=JS',
  level: 'Intermediário',
  coursesCompleted: 12,
  totalHours: 145,
  achievements: 8,
  joinDate: '2023-06-15',
};

const menuSections = [
  {
    title: 'Conta',
    items: [
      { id: 'edit-profile', title: 'Editar Perfil', icon: Edit },
      { id: 'notifications', title: 'Notificações', icon: Bell },
      { id: 'privacy', title: 'Privacidade', icon: Shield },
    ],
  },
  {
    title: 'Preferências',
    items: [
      { id: 'theme', title: 'Tema Escuro', icon: Moon, toggle: true },
      { id: 'settings', title: 'Configurações', icon: Settings },
    ],
  },
  {
    title: 'Suporte',
    items: [
      { id: 'help', title: 'Ajuda', icon: HelpCircle },
      { id: 'feedback', title: 'Enviar Feedback', icon: Star },
    ],
  },
  {
    title: 'Sair',
    items: [
      { id: 'logout', title: 'Sair da Conta', icon: LogOut, danger: true },
    ],
  },
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const handleMenuPress = (itemId: string) => {
    // Implementar ações do menu
    console.log('Menu item pressed:', itemId);
    
    if (itemId === 'logout') {
      // Implementar logout
      // router.replace('/auth/login');
    }
  };

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colors.pageBg 
    }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 120, // Espaço para a floating tab bar
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: 20,
            marginBottom: 32,
          }}
        >
          <Text style={{
            fontSize: 28,
            fontFamily: 'Inter',
            fontWeight: '700',
            color: colors.textPrimary,
          }}>
            Perfil
          </Text>
        </Animated.View>

        {/* Informações do usuário */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={{
            paddingHorizontal: 20,
            marginBottom: 32,
          }}
        >
          <View style={{
            backgroundColor: colors.cardBg,
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            ...(colorScheme === 'light' && {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }),
          }}>
            {/* Avatar */}
            <View style={{ position: 'relative', marginBottom: 16 }}>
              <Image
                source={{ uri: userProfile.avatar }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.inputBorder,
                }}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: colors.buttonPrimary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 3,
                  borderColor: colors.cardBg,
                }}
                activeOpacity={0.8}
              >
                <Edit
                  size={14}
                  color={colors.buttonText}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>

            {/* Nome e email */}
            <Text style={{
              fontSize: 22,
              fontFamily: 'Inter',
              fontWeight: '700',
              color: colors.textPrimary,
              marginBottom: 4,
            }}>
              {userProfile.name}
            </Text>
            <Text style={{
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: '400',
              color: colors.textSecondary,
              marginBottom: 16,
            }}>
              {userProfile.email}
            </Text>

            {/* Nível */}
            <View style={{
              backgroundColor: colors.buttonPrimary,
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 20,
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Inter',
                fontWeight: '600',
                color: colors.buttonText,
              }}>
                {userProfile.level}
              </Text>
            </View>

            {/* Estatísticas */}
            <View style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  fontSize: 24,
                  fontFamily: 'Inter',
                  fontWeight: '700',
                  color: colors.textPrimary,
                  marginBottom: 4,
                }}>
                  {userProfile.coursesCompleted}
                </Text>
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  color: colors.textSecondary,
                }}>
                  Cursos
                </Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  fontSize: 24,
                  fontFamily: 'Inter',
                  fontWeight: '700',
                  color: colors.textPrimary,
                  marginBottom: 4,
                }}>
                  {userProfile.totalHours}h
                </Text>
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  color: colors.textSecondary,
                }}>
                  Estudadas
                </Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  fontSize: 24,
                  fontFamily: 'Inter',
                  fontWeight: '700',
                  color: colors.textPrimary,
                  marginBottom: 4,
                }}>
                  {userProfile.achievements}
                </Text>
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  color: colors.textSecondary,
                }}>
                  Conquistas
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Menu de opções */}
        <Animated.View
          entering={FadeInRight.delay(300).springify()}
          style={{
            paddingHorizontal: 20,
          }}
        >
          {menuSections.map((section, sectionIndex) => (
            <View key={section.title} style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: '600',
                color: colors.textSecondary,
                marginBottom: 12,
                paddingHorizontal: 4,
              }}>
                {section.title}
              </Text>

              <View style={{
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                overflow: 'hidden',
                ...(colorScheme === 'light' && {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 3,
                }),
              }}>
                {section.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  const isLast = itemIndex === section.items.length - 1;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        borderBottomWidth: isLast ? 0 : 1,
                        borderBottomColor: colors.inputBorder,
                      }}
                      onPress={() => handleMenuPress(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: item.danger 
                          ? 'rgba(239, 68, 68, 0.1)' 
                          : `${colors.buttonPrimary}20`,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 16,
                      }}>
                        <IconComponent
                          size={20}
                          color={item.danger ? '#EF4444' : colors.buttonPrimary}
                          strokeWidth={1.5}
                        />
                      </View>

                      <Text style={{
                        flex: 1,
                        fontSize: 16,
                        fontFamily: 'Inter',
                        fontWeight: '500',
                        color: item.danger ? '#EF4444' : colors.textPrimary,
                      }}>
                        {item.title}
                      </Text>

                      {item.toggle ? (
                        <View style={{
                          width: 44,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: colorScheme === 'dark' 
                            ? colors.buttonPrimary 
                            : colors.inputBorder,
                          padding: 2,
                          justifyContent: 'center',
                          alignItems: colorScheme === 'dark' ? 'flex-end' : 'flex-start',
                        }}>
                          <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: colors.cardBg,
                            ...(colorScheme === 'light' && {
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 1 },
                              shadowOpacity: 0.2,
                              shadowRadius: 2,
                              elevation: 2,
                            }),
                          }} />
                        </View>
                      ) : (
                        <ChevronRight
                          size={20}
                          color={colors.textSecondary}
                          strokeWidth={1.5}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Informações da versão */}
          <View style={{
            alignItems: 'center',
            paddingVertical: 20,
          }}>
            <Text style={{
              fontSize: 14,
              fontFamily: 'Inter',
              fontWeight: '400',
              color: colors.textSecondary,
              marginBottom: 4,
            }}>
              SkillHub App
            </Text>
            <Text style={{
              fontSize: 12,
              fontFamily: 'Inter',
              fontWeight: '400',
              color: colors.textSecondary,
            }}>
              Versão 1.0.0
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}


