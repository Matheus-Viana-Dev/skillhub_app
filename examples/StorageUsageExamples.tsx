import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    cleanupOldData,
    exportStorageData,
    getAllKeys,
    getFromStorage,
    getStorageStats,
    removeFromStorage,
    // Funções utilitárias
    saveToStorage,
    useAppSettings,
    useOfflineData,
    useStorage,
    useUserPreferences,
    useUserProfile
} from '@/contexts';

// ============================================================================
// EXEMPLOS DE USO DO SISTEMA DE STORAGE
// ============================================================================

/**
 * Exemplo 1: Gerenciamento Básico de Perfil
 */
export const ProfileManagementExample = () => {
  const { userProfile, updateUserProfile } = useUserProfile();
  const [newName, setNewName] = useState('');

  const handleUpdateName = async () => {
    if (newName.trim()) {
      await updateUserProfile({ name: newName.trim() });
      setNewName('');
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    }
  };

  const handleUpdateAvatar = async () => {
    const newAvatar = `https://example.com/avatar-${Date.now()}.jpg`;
    await updateUserProfile({ avatar: newAvatar });
    Alert.alert('Sucesso', 'Avatar atualizado com sucesso!');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        Gerenciamento de Perfil
      </Text>
      
      <Text style={{ marginBottom: 8 }}>
        Nome atual: {userProfile.name || 'Não definido'}
      </Text>
      
      <TextInput
        placeholder="Novo nome"
        value={newName}
        onChangeText={setNewName}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 16,
          borderRadius: 8,
        }}
      />
      
      <TouchableOpacity
        onPress={handleUpdateName}
        style={{
          backgroundColor: '#1E3A8A',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Atualizar Nome
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleUpdateAvatar}
        style={{
          backgroundColor: '#059669',
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Atualizar Avatar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Exemplo 2: Gerenciamento de Configurações
 */
export const SettingsManagementExample = () => {
  const { appSettings, updateAppSettings } = useAppSettings();
  const { userPreferences, updateUserPreferences } = useUserPreferences();

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

  const handleChangeLanguage = async () => {
    const newLanguage = appSettings.language === 'pt-BR' ? 'en-US' : 'pt-BR';
    await updateAppSettings({ language: newLanguage });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        Gerenciamento de Configurações
      </Text>
      
      <View style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>
          Tema: {appSettings.theme}
        </Text>
        <TouchableOpacity
          onPress={handleToggleTheme}
          style={{
            backgroundColor: '#1E3A8A',
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Alternar Tema
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>
          Notificações: {appSettings.notifications ? 'Ativadas' : 'Desativadas'}
        </Text>
        <Switch
          value={appSettings.notifications}
          onValueChange={handleToggleNotifications}
        />
      </View>
      
      <View style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>
          Feedback Háptico: {userPreferences.hapticFeedback ? 'Ativado' : 'Desativado'}
        </Text>
        <Switch
          value={userPreferences.hapticFeedback}
          onValueChange={handleToggleHapticFeedback}
        />
      </View>
      
      <View style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>
          Idioma: {appSettings.language}
        </Text>
        <TouchableOpacity
          onPress={handleChangeLanguage}
          style={{
            backgroundColor: '#059669',
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Alterar Idioma
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Exemplo 3: Gerenciamento de Dados Offline
 */
export const OfflineDataManagementExample = () => {
  const { offlineData, updateOfflineData } = useOfflineData();
  const [newCourse, setNewCourse] = useState('');

  const handleAddCourse = async () => {
    if (newCourse.trim()) {
      const course = {
        id: `course_${Date.now()}`,
        title: newCourse.trim(),
        addedAt: new Date(),
      };
      
      await updateOfflineData({
        courses: [...offlineData.courses, course],
        lastSync: new Date(),
      });
      
      setNewCourse('');
      Alert.alert('Sucesso', 'Curso adicionado ao cache!');
    }
  };

  const handleAddProgress = async () => {
    const progress = {
      courseId: `course_${Date.now()}`,
      completed: Math.floor(Math.random() * 100),
      lastAccess: new Date(),
    };
    
    await updateOfflineData({
      progress: { ...offlineData.progress, [progress.courseId]: progress },
    });
    
    Alert.alert('Sucesso', 'Progresso adicionado!');
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Limpar Cache',
      'Isso removerá todos os dados offline. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await updateOfflineData({
              courses: [],
              progress: {},
              lastSync: null,
              pendingActions: [],
            });
            Alert.alert('Sucesso', 'Cache limpo com sucesso!');
          },
        },
      ]
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        Gerenciamento de Dados Offline
      </Text>
      
      <Text style={{ marginBottom: 8 }}>
        Cursos em cache: {offlineData.courses.length}
      </Text>
      <Text style={{ marginBottom: 8 }}>
        Progressos salvos: {Object.keys(offlineData.progress).length}
      </Text>
      <Text style={{ marginBottom: 16 }}>
        Última sincronização: {offlineData.lastSync 
          ? new Date(offlineData.lastSync).toLocaleDateString('pt-BR')
          : 'Nunca'
        }
      </Text>
      
      <TextInput
        placeholder="Nome do curso"
        value={newCourse}
        onChangeText={setNewCourse}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 16,
          borderRadius: 8,
        }}
      />
      
      <TouchableOpacity
        onPress={handleAddCourse}
        style={{
          backgroundColor: '#1E3A8A',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Adicionar Curso
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleAddProgress}
        style={{
          backgroundColor: '#059669',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Adicionar Progresso
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleClearCache}
        style={{
          backgroundColor: '#DC2626',
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Limpar Cache
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Exemplo 4: Funções Utilitárias Avançadas
 */
export const AdvancedStorageFunctionsExample = () => {
  const [customKey, setCustomKey] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [stats, setStats] = useState<any>(null);

  const handleSaveCustomData = async () => {
    if (customKey.trim() && customValue.trim()) {
      try {
        await saveToStorage(customKey as any, customValue);
        Alert.alert('Sucesso', 'Dados salvos com sucesso!');
        setCustomKey('');
        setCustomValue('');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar os dados');
      }
    }
  };

  const handleGetCustomData = async () => {
    if (customKey.trim()) {
      try {
        const data = await getFromStorage(customKey as any);
        Alert.alert('Dados', `Valor: ${data || 'Não encontrado'}`);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível recuperar os dados');
      }
    }
  };

  const handleRemoveCustomData = async () => {
    if (customKey.trim()) {
      try {
        await removeFromStorage(customKey as any);
        Alert.alert('Sucesso', 'Dados removidos com sucesso!');
        setCustomKey('');
        setCustomValue('');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível remover os dados');
      }
    }
  };

  const handleGetAllKeys = async () => {
    try {
      const keys = await getAllKeys();
      Alert.alert('Chaves', `Total: ${keys.length}\n\n${keys.join('\n')}`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter as chaves');
    }
  };

  const handleGetStats = async () => {
    try {
      const storageStats = await getStorageStats();
      setStats(storageStats);
      Alert.alert('Estatísticas', 
        `Chaves: ${storageStats.totalKeys}\nTamanho: ${(storageStats.totalSize / 1024).toFixed(2)} KB`
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter as estatísticas');
    }
  };

  const handleExportData = async () => {
    try {
      const exportedData = await exportStorageData();
      console.log('Dados exportados:', exportedData);
      Alert.alert('Sucesso', 'Dados exportados! Verifique o console.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar os dados');
    }
  };

  const handleCleanupOldData = async () => {
    try {
      await cleanupOldData(7); // Limpa dados com mais de 7 dias
      Alert.alert('Sucesso', 'Limpeza concluída!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível limpar os dados antigos');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        Funções Utilitárias Avançadas
      </Text>
      
      <TextInput
        placeholder="Chave personalizada"
        value={customKey}
        onChangeText={setCustomKey}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 12,
          borderRadius: 8,
        }}
      />
      
      <TextInput
        placeholder="Valor personalizado"
        value={customValue}
        onChangeText={setCustomValue}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 16,
          borderRadius: 8,
        }}
      />
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <TouchableOpacity
          onPress={handleSaveCustomData}
          style={{
            backgroundColor: '#1E3A8A',
            padding: 10,
            borderRadius: 8,
            flex: 0.48,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
            Salvar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleGetCustomData}
          style={{
            backgroundColor: '#059669',
            padding: 10,
            borderRadius: 8,
            flex: 0.48,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
            Recuperar
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        onPress={handleRemoveCustomData}
        style={{
          backgroundColor: '#DC2626',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Remover Dados
        </Text>
      </TouchableOpacity>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <TouchableOpacity
          onPress={handleGetAllKeys}
          style={{
            backgroundColor: '#7C3AED',
            padding: 10,
            borderRadius: 8,
            flex: 0.48,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
            Todas as Chaves
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleGetStats}
          style={{
            backgroundColor: '#F59E0B',
            padding: 10,
            borderRadius: 8,
            flex: 0.48,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
            Estatísticas
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          onPress={handleExportData}
          style={{
            backgroundColor: '#10B981',
            padding: 10,
            borderRadius: 8,
            flex: 0.48,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
            Exportar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleCleanupOldData}
          style={{
            backgroundColor: '#EF4444',
            padding: 10,
            borderRadius: 8,
            flex: 0.48,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
            Limpeza
          </Text>
        </TouchableOpacity>
      </View>
      
      {stats && (
        <View style={{ marginTop: 16, padding: 12, backgroundColor: '#F3F4F6', borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Estatísticas do Storage:</Text>
          <Text>Total de chaves: {stats.totalKeys}</Text>
          <Text>Tamanho total: {(stats.totalSize / 1024).toFixed(2)} KB</Text>
        </View>
      )}
    </View>
  );
};

/**
 * Exemplo 5: Hook Personalizado useStorage
 */
export const UseStorageHookExample = () => {
  const storage = useStorage();

  const handleRefreshData = async () => {
    await storage.refreshAllData();
    Alert.alert('Sucesso', 'Dados atualizados!');
  };

  const handleExportAllData = async () => {
    try {
      const exportedData = await storage.exportData();
      console.log('Todos os dados exportados:', exportedData);
      Alert.alert('Sucesso', 'Todos os dados exportados! Verifique o console.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar os dados');
    }
  };

  const handleClearAllData = async () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'Isso removerá TODOS os dados do app. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar Tudo',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAllData();
            Alert.alert('Sucesso', 'Todos os dados foram removidos!');
          },
        },
      ]
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        Hook useStorage Completo
      </Text>
      
      <Text style={{ marginBottom: 8 }}>
        Status: {storage.loading ? 'Carregando...' : 'Pronto'}
      </Text>
      
      {storage.error && (
        <Text style={{ marginBottom: 16, color: '#DC2626' }}>
          Erro: {storage.error}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={handleRefreshData}
        style={{
          backgroundColor: '#1E3A8A',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Atualizar Todos os Dados
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleExportAllData}
        style={{
          backgroundColor: '#059669',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Exportar Todos os Dados
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleClearAllData}
        style={{
          backgroundColor: '#DC2626',
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Limpar Todos os Dados
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Componente Principal com Todos os Exemplos
 */
export default function StorageUsageExamples() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          Exemplos de Uso do Sistema de Storage
        </Text>
        
        <ProfileManagementExample />
        <SettingsManagementExample />
        <OfflineDataManagementExample />
        <AdvancedStorageFunctionsExample />
        <UseStorageHookExample />
      </View>
    </ScrollView>
  );
}
