import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import {
    useAppSettings,
    useAuthTokens,
    useOfflineData,
    useUserPreferences,
    useUserProfile
} from '@/contexts';
import { useColorScheme } from '@/hooks/useColorScheme';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function ProfileScreen() {
  // ============================================================================
  // HOOKS E ESTADOS
  // ============================================================================
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width, height } = Dimensions.get('window');
  
  // Hooks de storage
  const { userProfile, updateUserProfile } = useUserProfile();
  const { authTokens, clearAuthData } = useAuthTokens();
  const { appSettings, updateAppSettings } = useAppSettings();
  const { userPreferences, updateUserPreferences } = useUserPreferences();
  const { offlineData, updateOfflineData } = useOfflineData();
  
  const [loading, setLoading] = useState(false);

  // ============================================================================
  // FUNÇÕES
  // ============================================================================

  const handleLogout = async () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // Limpa dados de autenticação
              await clearAuthData();
              
              // Navega para login
              router.replace('/auth/login');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível fazer logout');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleToggleTheme = async () => {
    const newTheme = appSettings.theme === 'light' ? 'dark' : 'light';
    await updateAppSettings({ theme: newTheme });
  };

  const handleToggleNotifications = async () => {
    await updateAppSettings({ notifications: !appSettings.notifications });
  };

  const handleToggleHapticFeedback = async () => {
    await updateUserPreferences({ 
      hapticFeedback: !userPreferences.hapticFeedback 
    });
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Limpar cache',
      'Isso removerá todos os dados offline. Continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateOfflineData({
                courses: [],
                progress: {},
                lastSync: null,
                pendingActions: [],
              });
              Alert.alert('Sucesso', 'Cache limpo com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar o cache');
            }
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      // Aqui você implementaria a exportação real dos dados
      Alert.alert(
        'Exportar dados',
        'Funcionalidade de exportação será implementada em breve!'
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar os dados');
    }
  };

  // ============================================================================
  // COMPONENTES DE RENDERIZAÇÃO
  // ============================================================================

  const renderHeader = () => (
    <View style={{
      backgroundColor: colorScheme === 'dark' 
        ? '#111827' // Fundo escuro da identidade visual
        : '#FFFFFF', // Branco puro da identidade visual
      paddingTop: 60,
      paddingBottom: 32,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' 
        ? 'rgba(107, 114, 128, 0.2)' 
        : 'rgba(107, 114, 128, 0.15)',
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <Text style={{
          fontSize: 28,
          fontWeight: '700', // Bold conforme especificação
          color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
          fontFamily: 'Inter', // Fonte principal da identidade visual
        }}>
          Perfil
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          disabled={loading}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12, // Bordas arredondadas conforme especificação
            backgroundColor: 'rgba(239, 68, 68, 0.1)', // Vermelho sutil
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <FontAwesome5 
            name="sign-out-alt" 
            size={16} 
            color="#EF4444" 
            style={{ marginRight: 8 }}
          />
          <Text style={{
            fontSize: 14,
            fontWeight: '600', // SemiBold conforme especificação
            color: '#EF4444',
            fontFamily: 'Inter', // Fonte principal da identidade visual
          }}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>

      {/* Informações do usuário */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 20, // Bordas arredondadas conforme especificação
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(30, 58, 138, 0.2)' 
            : 'rgba(30, 58, 138, 0.1)',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 20,
        }}>
          {userProfile.avatar ? (
            <FontAwesome5 
              name="user" 
              size={36} 
              color="#1E3A8A" // Azul médio da identidade visual
            />
          ) : (
            <FontAwesome5 
              name="user-circle" 
              size={40} 
              color="#1E3A8A" // Azul médio da identidade visual
            />
          )}
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '700', // Bold conforme especificação
            color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
            marginBottom: 8,
            fontFamily: 'Inter', // Fonte principal da identidade visual
          }}>
            {userProfile.name || 'Usuário'}
          </Text>
          <Text style={{
            fontSize: 16,
            fontWeight: '500', // Medium conforme especificação
            color: colorScheme === 'dark' ? '#6B7280' : '#6B7280', // Cinza texto da identidade visual
            marginBottom: 4,
            fontFamily: 'Inter', // Fonte principal da identidade visual
          }}>
            {userProfile.email || 'email@exemplo.com'}
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <FontAwesome5 
              name="crown" 
              size={14} 
              color="#F59E0B" 
              style={{ marginRight: 6 }}
            />
            <Text style={{
              fontSize: 14,
              fontWeight: '500', // Medium conforme especificação
              color: '#F59E0B',
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              {userProfile.role || 'Revendedor'} Premium
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={{
      marginBottom: 24,
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '600', // SemiBold conforme especificação
        color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
        marginBottom: 16,
        paddingHorizontal: 20,
        fontFamily: 'Inter', // Fonte principal da identidade visual
      }}>
        {title}
      </Text>
      {children}
    </View>
  );

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    rightComponent?: React.ReactNode
  ) => (
    <View style={{
      backgroundColor: colorScheme === 'dark' 
        ? '#111827' // Fundo escuro da identidade visual
        : '#FFFFFF', // Branco puro da identidade visual
      marginHorizontal: 20,
      marginBottom: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderRadius: 16, // Bordas arredondadas conforme especificação
      borderWidth: 1,
      borderColor: colorScheme === 'dark' 
        ? 'rgba(107, 114, 128, 0.2)' 
        : 'rgba(107, 114, 128, 0.15)',
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 12, // Bordas arredondadas conforme especificação
        backgroundColor: colorScheme === 'dark' 
          ? 'rgba(30, 58, 138, 0.2)' 
          : 'rgba(30, 58, 138, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
      }}>
        <FontAwesome5 
          name={icon} 
          size={18} 
          color="#1E3A8A" // Azul médio da identidade visual
        />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600', // SemiBold conforme especificação
          color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
          marginBottom: 4,
          fontFamily: 'Inter', // Fonte principal da identidade visual
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{
            fontSize: 14,
            fontWeight: '400', // Regular conforme especificação
            color: colorScheme === 'dark' ? '#6B7280' : '#6B7280', // Cinza texto da identidade visual
            fontFamily: 'Inter', // Fonte principal da identidade visual
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightComponent}
    </View>
  );

  const renderSettingsSection = () => (
    renderSection('Configurações', (
      <>
        {renderSettingItem(
          'palette',
          'Tema',
          'Personalize a aparência do app',
          <TouchableOpacity
            onPress={handleToggleTheme}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12, // Bordas arredondadas conforme especificação
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(30, 58, 138, 0.2)' 
                : 'rgba(30, 58, 138, 0.1)',
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '600', // SemiBold conforme especificação
              color: '#1E3A8A', // Azul médio da identidade visual
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              {appSettings.theme === 'light' ? 'Claro' : 'Escuro'}
            </Text>
          </TouchableOpacity>
        )}

        {renderSettingItem(
          'bell',
          'Notificações',
          'Receba alertas importantes',
          <Switch
            value={appSettings.notifications}
            onValueChange={handleToggleNotifications}
            trackColor={{
              false: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
              true: '#1E3A8A', // Azul médio da identidade visual
            }}
            thumbColor={appSettings.notifications ? '#FFFFFF' : '#9CA3AF'}
          />
        )}

        {renderSettingItem(
          'hand-paper',
          'Feedback háptico',
          'Vibrações ao tocar',
          <Switch
            value={userPreferences.hapticFeedback}
            onValueChange={handleToggleHapticFeedback}
            trackColor={{
              false: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
              true: '#1E3A8A', // Azul médio da identidade visual
            }}
            thumbColor={userPreferences.hapticFeedback ? '#FFFFFF' : '#9CA3AF'}
          />
        )}
      </>
    ))
  );

  const renderDataSection = () => (
    renderSection('Dados e Armazenamento', (
      <>
        {renderSettingItem(
          'database',
          'Cache offline',
          `${offlineData.courses.length} cursos, ${Object.keys(offlineData.progress).length} progressos`,
          <TouchableOpacity
            onPress={handleClearCache}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12, // Bordas arredondadas conforme especificação
              backgroundColor: 'rgba(239, 68, 68, 0.1)', // Vermelho sutil
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '600', // SemiBold conforme especificação
              color: '#EF4444',
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              Limpar
            </Text>
          </TouchableOpacity>
        )}

        {renderSettingItem(
          'download',
          'Exportar dados',
          'Faça backup das suas informações',
          <TouchableOpacity
            onPress={handleExportData}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12, // Bordas arredondadas conforme especificação
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(30, 58, 138, 0.2)' 
                : 'rgba(30, 58, 138, 0.1)',
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '600', // SemiBold conforme especificação
              color: '#1E3A8A', // Azul médio da identidade visual
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              Exportar
            </Text>
          </TouchableOpacity>
        )}

        {renderSettingItem(
          'sync',
          'Última sincronização',
          offlineData.lastSync 
            ? new Date(offlineData.lastSync).toLocaleDateString('pt-BR')
            : 'Nunca sincronizado',
          <View style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12, // Bordas arredondadas conforme especificação
            backgroundColor: colorScheme === 'dark' 
              ? 'rgba(107, 114, 128, 0.2)' 
              : 'rgba(107, 114, 128, 0.1)',
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '600', // SemiBold conforme especificação
              color: '#6B7280', // Cinza texto da identidade visual
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              {offlineData.lastSync ? 'Atualizado' : 'Pendente'}
            </Text>
          </View>
        )}
      </>
    ))
  );

  const renderAccountSection = () => (
    renderSection('Conta', (
      <>
        {renderSettingItem(
          'user-edit',
          'Editar perfil',
          'Altere suas informações pessoais',
          <TouchableOpacity
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12, // Bordas arredondadas conforme especificação
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(30, 58, 138, 0.2)' 
                : 'rgba(30, 58, 138, 0.1)',
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '600', // SemiBold conforme especificação
              color: '#1E3A8A', // Azul médio da identidade visual
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              Editar
            </Text>
          </TouchableOpacity>
        )}

        {renderSettingItem(
          'shield-alt',
          'Privacidade',
          'Gerencie suas configurações de privacidade',
          <TouchableOpacity
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12, // Bordas arredondadas conforme especificação
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(30, 58, 138, 0.2)' 
                : 'rgba(30, 58, 138, 0.1)',
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '600', // SemiBold conforme especificação
              color: '#1E3A8A', // Azul médio da identidade visual
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              Configurar
            </Text>
          </TouchableOpacity>
        )}

        {renderSettingItem(
          'question-circle',
          'Ajuda e Suporte',
          'Entre em contato conosco',
          <TouchableOpacity
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12, // Bordas arredondadas conforme especificação
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(30, 58, 138, 0.2)' 
                : 'rgba(30, 58, 138, 0.1)',
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '600', // SemiBold conforme especificação
              color: '#1E3A8A', // Azul médio da identidade visual
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              Ajuda
            </Text>
          </TouchableOpacity>
        )}
      </>
    ))
  );

  // ============================================================================
  // RENDERIZAÇÃO PRINCIPAL
  // ============================================================================

  return (
    <View style={{
      flex: 1,
      backgroundColor: colorScheme === 'dark' 
        ? '#0F172A' // Fundo escuro mais escuro
        : '#F9FAFB', // Fundo claro da identidade visual
    }}>
      {/* Header */}
      {renderHeader()}

      {/* Conteúdo principal */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* Configurações */}
        {renderSettingsSection()}

        {/* Dados e Armazenamento */}
        {renderDataSection()}

        {/* Conta */}
        {renderAccountSection()}
      </ScrollView>
    </View>
  );
}


