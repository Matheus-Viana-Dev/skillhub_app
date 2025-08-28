import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { useUserProfile } from '@/contexts';
import { useClients } from '@/hooks/useClients';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Client } from '@/types/Client';

const { width, height } = Dimensions.get('window');

export default function AdminScreen() {
  const colorScheme = useColorScheme();
  const { userProfile } = useUserProfile();
  const {
    clients,
    loading,
    error,
    stats,
    updateClient,
    deleteClient,
    refreshClients,
    exportClients,
    backupClients,
    clearAllClients,
  } = useClients();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // ============================================================================
  // VERIFICAÇÃO DE ADMIN
  // ============================================================================

  // Verifica se o usuário atual é admin
  const isCurrentUserAdmin = userProfile?.isAdmin === true;

  if (!isCurrentUserAdmin) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorScheme === 'dark' ? '#0A1A2F' : '#F9FAFB',
        padding: 20,
      }}>
        <FontAwesome5
          name="shield-alt"
          size={64}
          color={colorScheme === 'dark' ? '#EF4444' : '#DC2626'}
          style={{ marginBottom: 24 }}
        />
        <Text style={{
          fontSize: 24,
          fontWeight: '700',
          color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F',
          textAlign: 'center',
          marginBottom: 16,
        }}>
          Acesso Negado
        </Text>
        <Text style={{
          fontSize: 16,
          color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
          textAlign: 'center',
          lineHeight: 24,
        }}>
          Você não tem permissão para acessar esta área. Apenas usuários administradores podem acessar o painel de controle.
        </Text>
      </View>
    );
  }

  // ============================================================================
  // FUNÇÕES ADMINISTRATIVAS
  // ============================================================================

  const handleMakeAdmin = async (client: Client) => {
    try {
      await updateClient(client.id, { isAdmin: true });
      Alert.alert(
        'Sucesso!',
        `${client.name} agora é um administrador`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao promover usuário a admin');
    }
  };

  const handleRemoveAdmin = async (client: Client) => {
    if (client.id === userProfile?.id) {
      Alert.alert('Erro', 'Você não pode remover seus próprios privilégios de admin');
      return;
    }

    Alert.alert(
      'Confirmar Remoção',
      `Tem certeza que deseja remover ${client.name} como administrador?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover Admin',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateClient(client.id, { isAdmin: false });
              Alert.alert(
                'Sucesso!',
                `${client.name} não é mais um administrador`,
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Erro', 'Falha ao remover privilégios de admin');
            }
          },
        },
      ]
    );
  };

  const handleChangeRole = async (client: Client, newRole: 'revendedor' | 'cliente' | 'admin') => {
    try {
      await updateClient(client.id, { 
        role: newRole,
        isAdmin: newRole === 'admin' ? true : client.isAdmin
      });
      Alert.alert(
        'Sucesso!',
        `Role de ${client.name} alterado para ${newRole}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao alterar role do usuário');
    }
  };

  const handleChangeStatus = async (client: Client, newStatus: 'active' | 'inactive' | 'pending') => {
    if (client.id === userProfile?.id && newStatus === 'inactive') {
      Alert.alert('Erro', 'Você não pode desativar sua própria conta');
      return;
    }

    try {
      await updateClient(client.id, { status: newStatus });
      Alert.alert(
        'Sucesso!',
        `Status de ${client.name} alterado para ${newStatus}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao alterar status do usuário');
    }
  };

  const handleDeleteClient = (client: Client) => {
    if (client.id === userProfile?.id) {
      Alert.alert('Erro', 'Você não pode deletar sua própria conta');
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja remover o usuário ${client.name}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover Usuário',
          style: 'destructive',
          onPress: () => deleteClient(client.id),
        },
      ]
    );
  };

  const handleExportAllData = async () => {
    try {
      const data = await exportClients();
      Alert.alert(
        'Exportação Concluída',
        `Todos os dados foram exportados com sucesso!\n\nTotal de usuários: ${clients.length}`,
        [{ text: 'OK' }]
      );
      console.log('Dados exportados:', data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar dados');
    }
  };

  const handleBackupAllData = async () => {
    try {
      const backup = await backupClients();
      Alert.alert(
        'Backup Concluído',
        `Backup completo realizado com sucesso!\n\nTotal de usuários: ${clients.length}`,
        [{ text: 'OK' }]
      );
      console.log('Backup realizado:', backup);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao realizar backup');
    }
  };

  // ============================================================================
  // COMPONENTES DE RENDERIZAÇÃO
  // ============================================================================

  const renderHeader = () => (
    <View style={{
      backgroundColor: colorScheme === 'dark' ? '#0A1A2F' : '#F9FAFB',
      padding: 20,
      paddingTop: 40,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <FontAwesome5
          name="shield-alt"
          size={28}
          color="#EF4444"
          style={{ marginRight: 12 }}
        />
        <Text style={{
          fontSize: 28,
          fontWeight: '700',
          color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F',
        }}>
          Painel Administrativo
        </Text>
      </View>
      <Text style={{
        fontSize: 16,
        color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
      }}>
        {stats ? `${stats.total} usuários cadastrados` : 'Carregando...'}
      </Text>
      <Text style={{
        fontSize: 14,
        color: '#EF4444',
        fontWeight: '600',
        marginTop: 8,
      }}>
        🔒 Área restrita para administradores
      </Text>
    </View>
  );

  const renderAdminStats = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ padding: 20 }}
    >
      {stats && (
        <>
          <View style={{
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
            padding: 16,
            borderRadius: 12,
            marginRight: 12,
            minWidth: 120,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#EF4444',
              textAlign: 'center',
            }}>
              {clients.filter(c => c.isAdmin).length}
            </Text>
            <Text style={{
              fontSize: 14,
              color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
              textAlign: 'center',
            }}>
              Administradores
            </Text>
          </View>

          <View style={{
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
            padding: 16,
            borderRadius: 12,
            marginRight: 12,
            minWidth: 120,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#10B981',
              textAlign: 'center',
            }}>
              {stats.total}
            </Text>
            <Text style={{
              fontSize: 14,
              color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
              textAlign: 'center',
            }}>
              Total de Usuários
            </Text>
          </View>

          <View style={{
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
            padding: 16,
            borderRadius: 12,
            marginRight: 12,
            minWidth: 120,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#3B82F6',
              textAlign: 'center',
            }}>
              {stats.active}
            </Text>
            <Text style={{
              fontSize: 14,
              color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
              textAlign: 'center',
            }}>
              Contas Ativas
            </Text>
          </View>

          <View style={{
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
            padding: 16,
            borderRadius: 12,
            minWidth: 120,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#F59E0B',
              textAlign: 'center',
            }}>
              {stats.recentRegistrations}
            </Text>
            <Text style={{
              fontSize: 14,
              color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
              textAlign: 'center',
            }}>
              Novos (30d)
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );

  const renderUserItem = ({ item }: { item: Client }) => (
    <View style={{
      backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
      marginHorizontal: 20,
      marginBottom: 12,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
    }}>
      {/* Header do usuário */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
      }}>
        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F',
            }}>
              {item.name}
            </Text>
            {item.isAdmin && (
              <View style={{
                backgroundColor: '#EF4444',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
                marginLeft: 8,
              }}>
                <Text style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                }}>
                  ADMIN
                </Text>
              </View>
            )}
          </View>
          <Text style={{
            fontSize: 14,
            color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
            marginBottom: 2,
          }}>
            {item.email}
          </Text>
          <Text style={{
            fontSize: 12,
            color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
            textTransform: 'capitalize',
          }}>
            Role: {item.role} | ID: {item.id}
          </Text>
        </View>
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: item.status === 'active' ? '#10B981' : 
                           item.status === 'pending' ? '#F59E0B' : '#EF4444',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            marginRight: 8,
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#FFFFFF',
              textTransform: 'uppercase',
            }}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Ações administrativas */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
      }}>
        {/* Botão Admin */}
        {!item.isAdmin ? (
          <TouchableOpacity
            onPress={() => handleMakeAdmin(item)}
            style={{
              backgroundColor: '#EF4444',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#FFFFFF',
            }}>
              Tornar Admin
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => handleRemoveAdmin(item)}
            style={{
              backgroundColor: '#F59E0B',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#FFFFFF',
            }}>
              Remover Admin
            </Text>
          </TouchableOpacity>
        )}

        {/* Botão Role */}
        <TouchableOpacity
          onPress={() => {
            const roles: Array<'revendedor' | 'cliente' | 'admin'> = ['revendedor', 'cliente', 'admin'];
            const currentIndex = roles.indexOf(item.role);
            const nextRole = roles[(currentIndex + 1) % roles.length];
            handleChangeRole(item, nextRole);
          }}
          style={{
            backgroundColor: '#3B82F6',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
          }}
        >
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#FFFFFF',
          }}>
            Alterar Role
          </Text>
        </TouchableOpacity>

        {/* Botão Status */}
        <TouchableOpacity
          onPress={() => {
            const statuses: Array<'active' | 'inactive' | 'pending'> = ['active', 'inactive', 'pending'];
            const currentIndex = statuses.indexOf(item.status);
            const nextStatus = statuses[(currentIndex + 1) % statuses.length];
            handleChangeStatus(item, nextStatus);
          }}
          style={{
            backgroundColor: '#10B981',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
          }}
        >
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#FFFFFF',
          }}>
            Alterar Status
          </Text>
        </TouchableOpacity>

        {/* Botão Deletar */}
        <TouchableOpacity
          onPress={() => handleDeleteClient(item)}
          style={{
            backgroundColor: '#DC2626',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
          }}
        >
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#FFFFFF',
          }}>
            Deletar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Informações adicionais */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <FontAwesome5
            name="calendar"
            size={12}
            color={colorScheme === 'dark' ? '#6B7280' : '#6B7280'}
            style={{ marginRight: 6 }}
          />
          <Text style={{
            fontSize: 12,
            color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
          }}>
            Criado: {item.createdAt.toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <FontAwesome5
            name="clock"
            size={12}
            color={colorScheme === 'dark' ? '#6B7280' : '#6B7280'}
            style={{ marginRight: 6 }}
          />
          <Text style={{
            fontSize: 12,
            color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
          }}>
            {item.lastLogin ? item.lastLogin.toLocaleDateString('pt-BR') : 'Nunca logou'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={{
      padding: 20,
      backgroundColor: colorScheme === 'dark' ? '#111827' : '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <TouchableOpacity
          onPress={handleExportAllData}
          style={{
            flex: 1,
            backgroundColor: '#3B82F6',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginRight: 8,
            alignItems: 'center',
          }}
        >
          <FontAwesome5
            name="download"
            size={16}
            color="#FFFFFF"
            style={{ marginBottom: 4 }}
          />
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#FFFFFF',
          }}>
            Exportar Tudo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleBackupAllData}
          style={{
            flex: 1,
            backgroundColor: '#10B981',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginLeft: 8,
            alignItems: 'center',
          }}
        >
          <FontAwesome5
            name="save"
            size={16}
            color="#FFFFFF"
            style={{ marginBottom: 4 }}
          />
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#FFFFFF',
          }}>
            Backup Completo
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={clearAllClients}
        style={{
          backgroundColor: '#DC2626',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <FontAwesome5
          name="trash-alt"
          size={16}
          color="#FFFFFF"
          style={{ marginBottom: 4 }}
        />
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#FFFFFF',
        }}>
          🚨 LIMPAR TODOS OS USUÁRIOS (IRREVERSÍVEL)
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ============================================================================
  // RENDERIZAÇÃO PRINCIPAL
  // ============================================================================

  return (
    <View style={{
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#0A1A2F' : '#F9FAFB',
    }}>
      {renderHeader()}
      {renderAdminStats()}
      
      <FlatList
        data={clients}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshClients}
            colors={['#EF4444']}
            tintColor={colorScheme === 'dark' ? '#FFFFFF' : '#EF4444'}
          />
        }
        ListEmptyComponent={
          <View style={{
            padding: 40,
            alignItems: 'center',
          }}>
            <FontAwesome5
              name="users"
              size={48}
              color={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
              style={{ marginBottom: 16 }}
            />
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              Nenhum usuário encontrado
            </Text>
            <Text style={{
              fontSize: 14,
              color: colorScheme === 'dark' ? '#6B7280' : '#9CA3AF',
              textAlign: 'center',
            }}>
              Os usuários aparecerão aqui quando forem cadastrados
            </Text>
          </View>
        }
      />
      
      {renderActions()}
    </View>
  );
}
