import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useClients } from '@/hooks/useClients';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Client, ClientFilters } from '@/types/Client';

const { width, height } = Dimensions.get('window');

export default function ClientsScreen() {
  const colorScheme = useColorScheme();
  const {
    clients,
    loading,
    error,
    stats,
    createClient,
    updateClient,
    deleteClient,
    searchClients,
    filterClients,
    refreshClients,
    exportClients,
    importClients,
    backupClients,
    clearAllClients,
  } = useClients();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<ClientFilters>({});

  // ============================================================================
  // FUNÇÕES
  // ============================================================================

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    searchClients(text);
  };

  const handleFilter = (filters: ClientFilters) => {
    setSelectedFilters(filters);
    filterClients(filters);
  };

  const handleExport = async () => {
    try {
      const data = await exportClients();
      Alert.alert(
        'Exportação Concluída',
        `Dados exportados com sucesso!\n\nTotal de clientes: ${clients.length}`,
        [{ text: 'OK' }]
      );
      console.log('Dados exportados:', data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar dados');
    }
  };

  const handleBackup = async () => {
    try {
      const backup = await backupClients();
      Alert.alert(
        'Backup Concluído',
        `Backup realizado com sucesso!\n\nTotal de clientes: ${clients.length}`,
        [{ text: 'OK' }]
      );
      console.log('Backup realizado:', backup);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao realizar backup');
    }
  };

  const handleDeleteClient = (client: Client) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja remover o cliente ${client.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => deleteClient(client.id),
        },
      ]
    );
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
      <Text style={{
        fontSize: 28,
        fontWeight: '700',
        color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F',
        marginBottom: 8,
      }}>
        Gerenciar Clientes
      </Text>
      <Text style={{
        fontSize: 16,
        color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
      }}>
        {stats ? `${stats.total} clientes cadastrados` : 'Carregando...'}
      </Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={{
      padding: 20,
      backgroundColor: colorScheme === 'dark' ? '#111827' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
      }}>
        <FontAwesome5
          name="search"
          size={16}
          color={colorScheme === 'dark' ? '#6B7280' : '#6B7280'}
          style={{ marginRight: 12 }}
        />
        <TextInput
          style={{
            flex: 1,
            height: 48,
            fontSize: 16,
            color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F',
          }}
          placeholder="Buscar clientes..."
          placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );

  const renderStats = () => (
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
              Total
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
              Ativos
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
              color: '#8B5CF6',
              textAlign: 'center',
            }}>
              {stats.conversionRate.toFixed(1)}%
            </Text>
            <Text style={{
              fontSize: 14,
              color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
              textAlign: 'center',
            }}>
              Conversão
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );

  const renderClientItem = ({ item }: { item: Client }) => (
    <View style={{
      backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
      marginHorizontal: 20,
      marginBottom: 12,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F',
            marginBottom: 4,
          }}>
            {item.name}
          </Text>
          <Text style={{
            fontSize: 14,
            color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
            marginBottom: 2,
          }}>
            {item.email}
          </Text>
          {item.company && (
            <Text style={{
              fontSize: 14,
              color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
              marginBottom: 2,
            }}>
              {item.company}
            </Text>
          )}
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
          
          <TouchableOpacity
            onPress={() => handleDeleteClient(item)}
            style={{
              padding: 8,
              borderRadius: 6,
              backgroundColor: '#EF4444',
            }}
          >
            <FontAwesome5
              name="trash"
              size={14}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>

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
            name="id-badge"
            size={12}
            color={colorScheme === 'dark' ? '#6B7280' : '#6B7280'}
            style={{ marginRight: 6 }}
          />
          <Text style={{
            fontSize: 12,
            color: colorScheme === 'dark' ? '#6B7280' : '#6B7280',
          }}>
            {item.id}
          </Text>
        </View>

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
            {item.createdAt.toLocaleDateString('pt-BR')}
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
      }}>
        <TouchableOpacity
          onPress={handleExport}
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
            Exportar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleBackup}
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
            Backup
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={clearAllClients}
        style={{
          backgroundColor: '#EF4444',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
          marginTop: 12,
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
          Limpar Todos os Clientes
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
      {renderSearchBar()}
      {renderStats()}
      
      <FlatList
        data={clients}
        renderItem={renderClientItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshClients}
            colors={['#1E3A8A']}
            tintColor={colorScheme === 'dark' ? '#FFFFFF' : '#1E3A8A'}
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
              Nenhum cliente encontrado
            </Text>
            <Text style={{
              fontSize: 14,
              color: colorScheme === 'dark' ? '#6B7280' : '#9CA3AF',
              textAlign: 'center',
            }}>
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Os clientes aparecerão aqui quando forem cadastrados'}
            </Text>
          </View>
        }
      />
      
      {renderActions()}
    </View>
  );
}
