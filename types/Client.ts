// ============================================================================
// TIPOS PARA SISTEMA DE CLIENTES
// ============================================================================

export interface Client {
  id: string;                    // ID único do cliente
  name: string;                  // Nome completo
  email: string;                 // Email único
  phone?: string;                // Telefone (opcional)
  company?: string;              // Empresa (opcional)
  role: 'revendedor' | 'cliente' | 'admin'; // Tipo de usuário
  isAdmin: boolean;              // Flag para usuário administrador
  status: 'active' | 'inactive' | 'pending'; // Status da conta
  avatar?: string;               // URL do avatar
  createdAt: Date;               // Data de criação
  updatedAt: Date;               // Última atualização
  lastLogin?: Date;              // Último login
  preferences: ClientPreferences; // Preferências do cliente
  metadata: ClientMetadata;      // Metadados adicionais
}

export interface ClientPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareData: boolean;
    marketingEmails: boolean;
    analytics: boolean;
  };
}

export interface ClientMetadata {
  source: 'direct' | 'referral' | 'marketing' | 'partner';
  tags: string[];
  notes?: string;
  assignedTo?: string;           // ID do responsável
  priority: 'low' | 'medium' | 'high';
  customFields: Record<string, any>;
}

export interface ClientFilters {
  search?: string;
  status?: Client['status'];
  role?: Client['role'];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  assignedTo?: string;
}

export interface ClientStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  byRole: Record<Client['role'], number>;
  byStatus: Record<Client['status'], number>;
  recentRegistrations: number;   // Últimos 30 dias
  conversionRate: number;        // % de ativação
}
