import clientService from '@/services/ClientService';

// ============================================================================
// CRIAÇÃO DE USUÁRIO ADMIN PADRÃO
// ============================================================================

/**
 * Cria um usuário administrador padrão para testes
 * Este usuário pode ser usado para acessar o painel administrativo
 */
export const createDefaultAdmin = async () => {
  try {
    // Verifica se já existe um admin
    const existingAdmin = await clientService.getClientByEmail('admin@skillhub.com');
    
    if (existingAdmin) {
      console.log('Usuário admin padrão já existe:', existingAdmin.id);
      return existingAdmin;
    }

    // Cria o admin padrão
    const defaultAdmin = await clientService.createClient({
      name: 'Administrador SkillHub',
      email: 'admin@skillhub.com',
      phone: '',
      company: 'SkillHub',
      role: 'admin',
      isAdmin: true,
      status: 'active',
      avatar: 'https://example.com/admin-avatar.jpg',
      lastLogin: new Date(),
      preferences: {
        theme: 'system',
        language: 'pt-BR',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          shareData: false,
          marketingEmails: false,
          analytics: true,
        },
      },
      metadata: {
        source: 'system',
        tags: ['admin', 'sistema', 'padrão'],
        notes: 'Usuário administrador padrão criado pelo sistema',
        priority: 'high',
        customFields: {
          isDefaultAdmin: true,
          createdBy: 'system',
        },
      },
    });

    console.log('✅ Usuário admin padrão criado com sucesso:', defaultAdmin.id);
    console.log('📧 Email: admin@skillhub.com');
    console.log('🔑 Senha: qualquer (sistema simulado)');
    
    return defaultAdmin;
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin padrão:', error);
    throw error;
  }
};

/**
 * Verifica se existe pelo menos um usuário admin no sistema
 */
export const checkAdminExists = async (): Promise<boolean> => {
  try {
    const clients = await clientService.getAllClients();
    return clients.some(client => client.isAdmin);
  } catch (error) {
    console.error('Erro ao verificar existência de admin:', error);
    return false;
  }
};

/**
 * Inicializa o sistema com um admin padrão se necessário
 */
export const initializeSystemWithAdmin = async () => {
  try {
    const hasAdmin = await checkAdminExists();
    
    if (!hasAdmin) {
      console.log('🔄 Sistema sem administradores. Criando admin padrão...');
      await createDefaultAdmin();
      console.log('✅ Sistema inicializado com sucesso!');
    } else {
      console.log('✅ Sistema já possui administradores.');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar sistema:', error);
  }
};
