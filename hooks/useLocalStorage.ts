import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

// ============================================================================
// TIPOS
// ============================================================================

type StorageKey = 
  | 'user_profile'
  | 'auth_token'
  | 'refresh_token'
  | 'app_settings'
  | 'onboarding_completed'
  | 'theme_preference'
  | 'notifications_enabled'
  | 'last_sync'
  | 'cached_courses'
  | 'user_preferences'
  | 'offline_data'
  | 'search_history';

interface StorageData {
  [key: string]: any;
}

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

/**
 * Salva dados no AsyncStorage
 */
export const saveToStorage = async (key: StorageKey, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Erro ao salvar no storage (${key}):`, error);
    throw error;
  }
};

/**
 * Recupera dados do AsyncStorage
 */
export const getFromStorage = async (key: StorageKey): Promise<any | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Erro ao recuperar do storage (${key}):`, error);
    return null;
  }
};

/**
 * Remove dados do AsyncStorage
 */
export const removeFromStorage = async (key: StorageKey): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Erro ao remover do storage (${key}):`, error);
    throw error;
  }
};

/**
 * Limpa todo o AsyncStorage
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Erro ao limpar storage:', error);
    throw error;
  }
};

/**
 * Obtém todas as chaves do AsyncStorage
 */
export const getAllKeys = async (): Promise<string[]> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Erro ao obter chaves do storage:', error);
    return [];
  }
};

/**
 * Obtém múltiplos valores do AsyncStorage
 */
export const getMultipleValues = async (keys: StorageKey[]): Promise<StorageData> => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    const result: StorageData = {};
    
    values.forEach(([key, value]) => {
      if (value !== null) {
        result[key] = JSON.parse(value);
      }
    });
    
    return result;
  } catch (error) {
    console.error('Erro ao obter múltiplos valores do storage:', error);
    return {};
  }
};

/**
 * Salva múltiplos valores no AsyncStorage
 */
export const setMultipleValues = async (data: StorageData): Promise<void> => {
  try {
    const keyValuePairs = Object.entries(data).map(([key, value]) => [
      key,
      JSON.stringify(value)
    ]);
    
    await AsyncStorage.multiSet(keyValuePairs);
  } catch (error) {
    console.error('Erro ao salvar múltiplos valores no storage:', error);
    throw error;
  }
};

// ============================================================================
// HOOK PERSONALIZADO
// ============================================================================

/**
 * Hook para gerenciar dados no local storage
 */
export const useLocalStorage = <T>(key: StorageKey, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega o valor inicial do storage
  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        setLoading(true);
        setError(null);
        const item = await getFromStorage(key);
        setStoredValue(item !== null ? item : initialValue);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setStoredValue(initialValue);
      } finally {
        setLoading(false);
      }
    };

    loadStoredValue();
  }, [key, initialValue]);

  // Função para atualizar o valor no storage
  const setValue = useCallback(async (value: T | ((val: T) => T)) => {
    try {
      setError(null);
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await saveToStorage(key, valueToStore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar no storage');
    }
  }, [key, storedValue]);

  // Função para remover o valor do storage
  const removeValue = useCallback(async () => {
    try {
      setError(null);
      setStoredValue(initialValue);
      await removeFromStorage(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover do storage');
    }
  }, [key, initialValue]);

  // Função para recarregar o valor do storage
  const refreshValue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const item = await getFromStorage(key);
      setStoredValue(item !== null ? item : initialValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao recarregar do storage');
    } finally {
      setLoading(false);
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    refreshValue,
    loading,
    error,
  };
};

// ============================================================================
// HOOKS ESPECIALIZADOS
// ============================================================================

/**
 * Hook para gerenciar o perfil do usuário
 */
export const useUserProfile = () => {
  return useLocalStorage('user_profile', {
    id: null,
    name: '',
    email: '',
    avatar: '',
    role: '',
    createdAt: null,
    lastLogin: null,
  });
};

/**
 * Hook para gerenciar tokens de autenticação
 */
export const useAuthTokens = () => {
  return useLocalStorage('auth_token', {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  });
};

/**
 * Hook para gerenciar configurações do app
 */
export const useAppSettings = () => {
  return useLocalStorage('app_settings', {
    theme: 'system',
    language: 'pt-BR',
    notifications: true,
    autoSync: true,
    offlineMode: false,
  });
};

/**
 * Hook para gerenciar preferências do usuário
 */
export const useUserPreferences = () => {
  return useLocalStorage('user_preferences', {
    fontSize: 'medium',
    soundEnabled: true,
    hapticFeedback: true,
    privacyMode: false,
    accessibility: {
      highContrast: false,
      reduceMotion: false,
      screenReader: false,
    },
  });
};

/**
 * Hook para gerenciar dados offline
 */
export const useOfflineData = () => {
  return useLocalStorage('offline_data', {
    courses: [],
    progress: {},
    lastSync: null,
    pendingActions: [],
  });
};

// ============================================================================
// FUNÇÕES DE MIGRAÇÃO E BACKUP
// ============================================================================

/**
 * Exporta todos os dados do storage
 */
export const exportStorageData = async (): Promise<string> => {
  try {
    const keys = await getAllKeys();
    const data = await getMultipleValues(keys as StorageKey[]);
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Erro ao exportar dados do storage:', error);
    throw error;
  }
};

/**
 * Importa dados para o storage
 */
export const importStorageData = async (jsonData: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonData);
    await setMultipleValues(data);
  } catch (error) {
    console.error('Erro ao importar dados para o storage:', error);
    throw error;
  }
};

/**
 * Limpa dados antigos baseado em timestamp
 */
export const cleanupOldData = async (maxAgeInDays: number = 30): Promise<void> => {
  try {
    const keys = await getAllKeys();
    const cutoffTime = Date.now() - (maxAgeInDays * 24 * 60 * 60 * 1000);
    
    for (const key of keys) {
      const data = await getFromStorage(key as StorageKey);
      if (data && data.timestamp && data.timestamp < cutoffTime) {
        await removeFromStorage(key as StorageKey);
      }
    }
  } catch (error) {
    console.error('Erro ao limpar dados antigos:', error);
  }
};

/**
 * Obtém estatísticas do storage
 */
export const getStorageStats = async (): Promise<{
  totalKeys: number;
  totalSize: number;
  keys: string[];
}> => {
  try {
    const keys = await getAllKeys();
    let totalSize = 0;
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += new Blob([value]).size;
      }
    }
    
    return {
      totalKeys: keys.length,
      totalSize,
      keys,
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas do storage:', error);
    return {
      totalKeys: 0,
      totalSize: 0,
      keys: [],
    };
  }
};

