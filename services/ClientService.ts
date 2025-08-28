import { Client, ClientFilters, ClientStats } from '@/types/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// SERVIÇO DE GERENCIAMENTO DE CLIENTES
// ============================================================================

class ClientService {
  private readonly STORAGE_KEY = 'skillhub_clients';
  private readonly CLIENT_COUNTER_KEY = 'skillhub_client_counter';

  // ============================================================================
  // MÉTODOS PRIVADOS
  // ============================================================================

  /**
   * Gera um ID único para o cliente
   */
  private async generateClientId(): Promise<string> {
    try {
      const counter = await this.getClientCounter();
      const newCounter = counter + 1;
      await this.setClientCounter(newCounter);
      
      // Formato: CLIENT_001, CLIENT_002, etc.
      return `CLIENT_${newCounter.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('Erro ao gerar ID do cliente:', error);
      // Fallback: timestamp + random
      return `CLIENT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  /**
   * Obtém o contador atual de clientes
   */
  private async getClientCounter(): Promise<number> {
    try {
      const counter = await AsyncStorage.getItem(this.CLIENT_COUNTER_KEY);
      return counter ? parseInt(counter, 10) : 0;
    } catch (error) {
      console.error('Erro ao obter contador de clientes:', error);
      return 0;
    }
  }

  /**
   * Define o contador de clientes
   */
  private async setClientCounter(counter: number): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CLIENT_COUNTER_KEY, counter.toString());
    } catch (error) {
      console.error('Erro ao definir contador de clientes:', error);
    }
  }

  /**
   * Obtém todos os clientes do storage
   */
  private async getAllClientsFromStorage(): Promise<Client[]> {
    try {
      const clientsJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (!clientsJson) return [];
      
      const clients = JSON.parse(clientsJson);
      // Converte strings de data de volta para objetos Date
      return clients.map((client: any) => ({
        ...client,
        createdAt: new Date(client.createdAt),
        updatedAt: new Date(client.updatedAt),
        lastLogin: client.lastLogin ? new Date(client.lastLogin) : undefined,
      }));
    } catch (error) {
      console.error('Erro ao obter clientes do storage:', error);
      return [];
    }
  }

  /**
   * Salva todos os clientes no storage
   */
  private async saveAllClientsToStorage(clients: Client[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(clients));
    } catch (error) {
      console.error('Erro ao salvar clientes no storage:', error);
      throw error;
    }
  }

  // ============================================================================
  // MÉTODOS PÚBLICOS - CRUD
  // ============================================================================

  /**
   * Cria um novo cliente com ID único
   */
  async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    try {
      const clients = await this.getAllClientsFromStorage();
      
      // Verifica se o email já existe
      const emailExists = clients.some(client => client.email === clientData.email);
      if (emailExists) {
        throw new Error('Email já cadastrado para outro cliente');
      }

      const newClient: Client = {
        ...clientData,
        id: await this.generateClientId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      clients.push(newClient);
      await this.saveAllClientsToStorage(clients);

      console.log(`Cliente criado com sucesso: ${newClient.id}`);
      return newClient;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  /**
   * Obtém um cliente por ID
   */
  async getClientById(id: string): Promise<Client | null> {
    try {
      const clients = await this.getAllClientsFromStorage();
      return clients.find(client => client.id === id) || null;
    } catch (error) {
      console.error('Erro ao obter cliente por ID:', error);
      return null;
    }
  }

  /**
   * Obtém um cliente por email
   */
  async getClientByEmail(email: string): Promise<Client | null> {
    try {
      const clients = await this.getAllClientsFromStorage();
      return clients.find(client => client.email === email) || null;
    } catch (error) {
      console.error('Erro ao obter cliente por email:', error);
      return null;
    }
  }

  /**
   * Obtém todos os clientes com filtros opcionais
   */
  async getAllClients(filters?: ClientFilters): Promise<Client[]> {
    try {
      let clients = await this.getAllClientsFromStorage();

      if (filters) {
        clients = this.applyFilters(clients, filters);
      }

      // Ordena por data de criação (mais recentes primeiro)
      return clients.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Erro ao obter todos os clientes:', error);
      return [];
    }
  }

  /**
   * Atualiza um cliente existente
   */
  async updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client | null> {
    try {
      const clients = await this.getAllClientsFromStorage();
      const clientIndex = clients.findIndex(client => client.id === id);
      
      if (clientIndex === -1) {
        throw new Error('Cliente não encontrado');
      }

      // Verifica se o email está sendo alterado para um que já existe
      if (updates.email && updates.email !== clients[clientIndex].email) {
        const emailExists = clients.some(client => client.email === updates.email);
        if (emailExists) {
          throw new Error('Email já cadastrado para outro cliente');
        }
      }

      const updatedClient: Client = {
        ...clients[clientIndex],
        ...updates,
        updatedAt: new Date(),
      };

      clients[clientIndex] = updatedClient;
      await this.saveAllClientsToStorage(clients);

      console.log(`Cliente atualizado com sucesso: ${id}`);
      return updatedClient;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  /**
   * Remove um cliente
   */
  async deleteClient(id: string): Promise<boolean> {
    try {
      const clients = await this.getAllClientsFromStorage();
      const filteredClients = clients.filter(client => client.id !== id);
      
      if (filteredClients.length === clients.length) {
        throw new Error('Cliente não encontrado');
      }

      await this.saveAllClientsToStorage(filteredClients);
      console.log(`Cliente removido com sucesso: ${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      throw error;
    }
  }

  /**
   * Atualiza o último login de um cliente
   */
  async updateLastLogin(id: string): Promise<void> {
    try {
      await this.updateClient(id, { lastLogin: new Date() });
    } catch (error) {
      console.error('Erro ao atualizar último login:', error);
    }
  }

  // ============================================================================
  // MÉTODOS DE FILTRAGEM E ESTATÍSTICAS
  // ============================================================================

  /**
   * Aplica filtros aos clientes
   */
  private applyFilters(clients: Client[], filters: ClientFilters): Client[] {
    return clients.filter(client => {
      // Filtro de busca (nome, email, empresa)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          client.name.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          (client.company && client.company.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Filtro de status
      if (filters.status && client.status !== filters.status) {
        return false;
      }

      // Filtro de role
      if (filters.role && client.role !== filters.role) {
        return false;
      }

      // Filtro de tags
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          client.metadata.tags.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      // Filtro de data
      if (filters.dateRange) {
        const clientDate = client.createdAt;
        if (clientDate < filters.dateRange.start || clientDate > filters.dateRange.end) {
          return false;
        }
      }

      // Filtro de responsável
      if (filters.assignedTo && client.metadata.assignedTo !== filters.assignedTo) {
        return false;
      }

      return true;
    });
  }

  /**
   * Obtém estatísticas dos clientes
   */
  async getClientStats(): Promise<ClientStats> {
    try {
      const clients = await this.getAllClientsFromStorage();
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const stats: ClientStats = {
        total: clients.length,
        active: clients.filter(c => c.status === 'active').length,
        inactive: clients.filter(c => c.status === 'inactive').length,
        pending: clients.filter(c => c.status === 'pending').length,
        byRole: {
          revendedor: clients.filter(c => c.role === 'revendedor').length,
          cliente: clients.filter(c => c.role === 'cliente').length,
          admin: clients.filter(c => c.role === 'admin').length,
        },
        byStatus: {
          active: clients.filter(c => c.status === 'active').length,
          inactive: clients.filter(c => c.status === 'inactive').length,
          pending: clients.filter(c => c.status === 'pending').length,
        },
        recentRegistrations: clients.filter(c => c.createdAt > thirtyDaysAgo).length,
        conversionRate: clients.length > 0 
          ? (clients.filter(c => c.status === 'active').length / clients.length) * 100 
          : 0,
      };

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas dos clientes:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        pending: 0,
        byRole: { revendedor: 0, cliente: 0, admin: 0 },
        byStatus: { active: 0, inactive: 0, pending: 0 },
        recentRegistrations: 0,
        conversionRate: 0,
      };
    }
  }

  // ============================================================================
  // MÉTODOS DE UTILIDADE
  // ============================================================================

  /**
   * Exporta todos os clientes para JSON
   */
  async exportClients(): Promise<string> {
    try {
      const clients = await this.getAllClientsFromStorage();
      return JSON.stringify(clients, null, 2);
    } catch (error) {
      console.error('Erro ao exportar clientes:', error);
      throw error;
    }
  }

  /**
   * Importa clientes de um JSON
   */
  async importClients(jsonData: string): Promise<number> {
    try {
      const clients = JSON.parse(jsonData);
      if (!Array.isArray(clients)) {
        throw new Error('Formato de dados inválido');
      }

      // Valida e processa cada cliente
      const validClients = clients.map((client: any) => ({
        ...client,
        createdAt: new Date(client.createdAt || Date.now()),
        updatedAt: new Date(client.updatedAt || Date.now()),
        lastLogin: client.lastLogin ? new Date(client.lastLogin) : undefined,
      }));

      await this.saveAllClientsToStorage(validClients);
      console.log(`${validClients.length} clientes importados com sucesso`);
      return validClients.length;
    } catch (error) {
      console.error('Erro ao importar clientes:', error);
      throw error;
    }
  }

  /**
   * Limpa todos os dados dos clientes
   */
  async clearAllClients(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      await AsyncStorage.removeItem(this.CLIENT_COUNTER_KEY);
      console.log('Todos os clientes foram removidos');
    } catch (error) {
      console.error('Erro ao limpar clientes:', error);
      throw error;
    }
  }

  /**
   * Faz backup dos dados
   */
  async backupClients(): Promise<string> {
    try {
      const clients = await this.getAllClientsFromStorage();
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        totalClients: clients.length,
        data: clients,
      };
      return JSON.stringify(backup, null, 2);
    } catch (error) {
      console.error('Erro ao fazer backup dos clientes:', error);
      throw error;
    }
  }
}

// Exporta uma instância única do serviço
export const clientService = new ClientService();
export default clientService;
