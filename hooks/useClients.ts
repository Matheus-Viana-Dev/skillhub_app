import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import clientService from '@/services/ClientService';
import { Client, ClientFilters, ClientStats } from '@/types/Client';

// ============================================================================
// HOOK PARA GERENCIAMENTO DE CLIENTES
// ============================================================================

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ClientStats | null>(null);

  // ============================================================================
  // CARREGAMENTO INICIAL
  // ============================================================================

  const loadClients = useCallback(async (filters?: ClientFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const loadedClients = await clientService.getAllClients(filters);
      setClients(loadedClients);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar clientes';
      setError(errorMessage);
      console.error('Erro ao carregar clientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const clientStats = await clientService.getClientStats();
      setStats(clientStats);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }, []);

  // Carrega clientes e estatísticas ao montar o hook
  useEffect(() => {
    loadClients();
    loadStats();
  }, [loadClients, loadStats]);

  // ============================================================================
  // OPERAÇÕES CRUD
  // ============================================================================

  const createClient = useCallback(async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newClient = await clientService.createClient(clientData);
      
      // Atualiza a lista local
      setClients(prev => [newClient, ...prev]);
      
      // Atualiza estatísticas
      await loadStats();
      
      Alert.alert(
        'Sucesso!',
        `Cliente ${newClient.name} criado com ID: ${newClient.id}`,
        [{ text: 'OK' }]
      );
      
      return newClient;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cliente';
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  const updateClient = useCallback(async (id: string, updates: Partial<Omit<Client, 'id' | 'createdAt'>>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedClient = await clientService.updateClient(id, updates);
      
      if (updatedClient) {
        // Atualiza a lista local
        setClients(prev => 
          prev.map(client => 
            client.id === id ? updatedClient : client
          )
        );
        
        Alert.alert(
          'Sucesso!',
          `Cliente ${updatedClient.name} atualizado com sucesso`,
          [{ text: 'OK' }]
        );
        
        return updatedClient;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cliente';
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    try {
      const success = await clientService.deleteClient(id);
      
      if (success) {
        // Remove da lista local
        setClients(prev => prev.filter(client => client.id !== id));
        
        // Atualiza estatísticas
        await loadStats();
        
        Alert.alert(
          'Sucesso!',
          'Cliente removido com sucesso',
          [{ text: 'OK' }]
        );
        
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover cliente';
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
      throw err;
    }
  }, [loadStats]);

  // ============================================================================
  // OPERAÇÕES DE BUSCA E FILTRAGEM
  // ============================================================================

  const searchClients = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      await loadClients();
      return;
    }
    
    const filters: ClientFilters = { search: searchTerm };
    await loadClients(filters);
  }, [loadClients]);

  const filterClients = useCallback(async (filters: ClientFilters) => {
    await loadClients(filters);
  }, [loadClients]);

  const getClientById = useCallback(async (id: string): Promise<Client | null> => {
    try {
      return await clientService.getClientById(id);
    } catch (err) {
      console.error('Erro ao obter cliente por ID:', err);
      return null;
    }
  }, []);

  const getClientByEmail = useCallback(async (email: string): Promise<Client | null> => {
    try {
      return await clientService.getClientByEmail(email);
    } catch (err) {
      console.error('Erro ao obter cliente por email:', err);
      return null;
    }
  }, []);

  // ============================================================================
  // OPERAÇÕES DE UTILIDADE
  // ============================================================================

  const refreshClients = useCallback(async () => {
    await loadClients();
    await loadStats();
  }, [loadClients, loadStats]);

  const exportClients = useCallback(async (): Promise<string> => {
    try {
      return await clientService.exportClients();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao exportar clientes';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const importClients = useCallback(async (jsonData: string): Promise<number> => {
    setLoading(true);
    setError(null);
    
    try {
      const importedCount = await clientService.importClients(jsonData);
      
      // Recarrega a lista
      await loadClients();
      await loadStats();
      
      Alert.alert(
        'Sucesso!',
        `${importedCount} clientes importados com sucesso`,
        [{ text: 'OK' }]
      );
      
      return importedCount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao importar clientes';
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadClients, loadStats]);

  const backupClients = useCallback(async (): Promise<string> => {
    try {
      return await clientService.backupClients();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer backup';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const clearAllClients = useCallback(async () => {
    Alert.alert(
      'Confirmar Limpeza',
      'Tem certeza que deseja remover TODOS os clientes? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover Tudo',
          style: 'destructive',
          onPress: async () => {
            try {
              await clientService.clearAllClients();
              setClients([]);
              setStats(null);
              Alert.alert('Sucesso!', 'Todos os clientes foram removidos');
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Erro ao limpar clientes';
              setError(errorMessage);
              Alert.alert('Erro', errorMessage);
            }
          },
        },
      ]
    );
  }, []);

  // ============================================================================
  // RETORNO DO HOOK
  // ============================================================================

  return {
    // Estado
    clients,
    loading,
    error,
    stats,
    
    // Operações CRUD
    createClient,
    updateClient,
    deleteClient,
    getClientById,
    getClientByEmail,
    
    // Busca e filtros
    searchClients,
    filterClients,
    
    // Utilitários
    refreshClients,
    exportClients,
    importClients,
    backupClients,
    clearAllClients,
    
    // Recarregamento
    loadClients,
    loadStats,
  };
};
