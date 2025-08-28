import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// ============================================================================
// TIPOS
// ============================================================================

interface UserProfile {
  id: string | null;
  name: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: Date | null;
  lastLogin: Date | null;
}

interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  autoSync: boolean;
  offlineMode: boolean;
}

interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  hapticFeedback: boolean;
  privacyMode: boolean;
  accessibility: {
    highContrast: boolean;
    reduceMotion: boolean;
    screenReader: boolean;
  };
}

interface OfflineData {
  courses: any[];
  progress: Record<string, any>;
  lastSync: Date | null;
  pendingActions: any[];
}

interface StorageContextType {
  // Estado dos dados
  userProfile: UserProfile;
  authTokens: AuthTokens;
  appSettings: AppSettings;
  userPreferences: UserPreferences;
  offlineData: OfflineData;
  
  // Funções de atualização
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateAuthTokens: (tokens: Partial<AuthTokens>) => Promise<void>;
  updateAppSettings: (settings: Partial<AppSettings>) => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  updateOfflineData: (data: Partial<OfflineData>) => Promise<void>;
  
  // Funções de limpeza
  clearUserData: () => Promise<void>;
  clearAuthData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  
  // Estado de carregamento
  loading: boolean;
  error: string | null;
  
  // Funções utilitárias
  refreshAllData: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<void>;
}

// ============================================================================
// VALORES INICIAIS
// ============================================================================

const initialUserProfile: UserProfile = {
  id: null,
  name: '',
  email: '',
  avatar: '',
  role: '',
  createdAt: null,
  lastLogin: null,
};

const initialAuthTokens: AuthTokens = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

const initialAppSettings: AppSettings = {
  theme: 'system',
  language: 'pt-BR',
  notifications: true,
  autoSync: true,
  offlineMode: false,
};

const initialUserPreferences: UserPreferences = {
  fontSize: 'medium',
  soundEnabled: true,
  hapticFeedback: true,
  privacyMode: false,
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
  },
};

const initialOfflineData: OfflineData = {
  courses: [],
  progress: {},
  lastSync: null,
  pendingActions: [],
};

// ============================================================================
// CONTEXTO
// ============================================================================

const StorageContext = createContext<StorageContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface StorageProviderProps {
  children: ReactNode;
}

export const StorageProvider: React.FC<StorageProviderProps> = ({ children }) => {
  // Estados locais
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [authTokens, setAuthTokens] = useState<AuthTokens>(initialAuthTokens);
  const [appSettings, setAppSettings] = useState<AppSettings>(initialAppSettings);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(initialUserPreferences);
  const [offlineData, setOfflineData] = useState<OfflineData>(initialOfflineData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // FUNÇÕES DE CARREGAMENTO
  // ============================================================================

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carrega todos os dados em paralelo
      const [
        profileData,
        tokensData,
        settingsData,
        preferencesData,
        offlineDataResult,
      ] = await Promise.all([
        AsyncStorage.getItem('user_profile'),
        AsyncStorage.getItem('auth_token'),
        AsyncStorage.getItem('app_settings'),
        AsyncStorage.getItem('user_preferences'),
        AsyncStorage.getItem('offline_data'),
      ]);

      // Atualiza os estados com os dados carregados
      if (profileData) {
        setUserProfile(JSON.parse(profileData));
      }
      if (tokensData) {
        setAuthTokens(JSON.parse(tokensData));
      }
      if (settingsData) {
        setAppSettings(JSON.parse(settingsData));
      }
      if (preferencesData) {
        setUserPreferences(JSON.parse(preferencesData));
      }
      if (offlineDataResult) {
        setOfflineData(JSON.parse(offlineDataResult));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      console.error('Erro ao carregar dados do storage:', err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // FUNÇÕES DE ATUALIZAÇÃO
  // ============================================================================

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    try {
      const newProfile = { ...userProfile, ...profile };
      setUserProfile(newProfile);
      await AsyncStorage.setItem('user_profile', JSON.stringify(newProfile));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
      throw err;
    }
  };

  const updateAuthTokens = async (tokens: Partial<AuthTokens>) => {
    try {
      const newTokens = { ...authTokens, ...tokens };
      setAuthTokens(newTokens);
      await AsyncStorage.setItem('auth_token', JSON.stringify(newTokens));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tokens');
      throw err;
    }
  };

  const updateAppSettings = async (settings: Partial<AppSettings>) => {
    try {
      const newSettings = { ...appSettings, ...settings };
      setAppSettings(newSettings);
      await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar configurações');
      throw err;
    }
  };

  const updateUserPreferences = async (preferences: Partial<UserPreferences>) => {
    try {
      const newPreferences = { ...userPreferences, ...preferences };
      setUserPreferences(newPreferences);
      await AsyncStorage.setItem('user_preferences', JSON.stringify(newPreferences));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar preferências');
      throw err;
    }
  };

  const updateOfflineData = async (data: Partial<OfflineData>) => {
    try {
      const newOfflineData = { ...offlineData, ...data };
      setOfflineData(newOfflineData);
      await AsyncStorage.setItem('offline_data', JSON.stringify(newOfflineData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar dados offline');
      throw err;
    }
  };

  // ============================================================================
  // FUNÇÕES DE LIMPEZA
  // ============================================================================

  const clearUserData = async () => {
    try {
      setUserProfile(initialUserProfile);
      setOfflineData(initialOfflineData);
      await Promise.all([
        AsyncStorage.removeItem('user_profile'),
        AsyncStorage.removeItem('offline_data'),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao limpar dados do usuário');
      throw err;
    }
  };

  const clearAuthData = async () => {
    try {
      setAuthTokens(initialAuthTokens);
      await AsyncStorage.removeItem('auth_token');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao limpar dados de autenticação');
      throw err;
    }
  };

  const clearAllData = async () => {
    try {
      setUserProfile(initialUserProfile);
      setAuthTokens(initialAuthTokens);
      setAppSettings(initialAppSettings);
      setUserPreferences(initialUserPreferences);
      setOfflineData(initialOfflineData);
      await AsyncStorage.clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao limpar todos os dados');
      throw err;
    }
  };

  // ============================================================================
  // FUNÇÕES UTILITÁRIAS
  // ============================================================================

  const refreshAllData = async () => {
    await loadAllData();
  };

  const exportData = async (): Promise<string> => {
    try {
      const allData = {
        user_profile: userProfile,
        auth_token: authTokens,
        app_settings: appSettings,
        user_preferences: userPreferences,
        offline_data: offlineData,
        exportDate: new Date().toISOString(),
      };
      return JSON.stringify(allData, null, 2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao exportar dados');
      throw err;
    }
  };

  const importData = async (jsonData: string): Promise<void> => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.user_profile) setUserProfile(data.user_profile);
      if (data.auth_token) setAuthTokens(data.auth_token);
      if (data.app_settings) setAppSettings(data.app_settings);
      if (data.user_preferences) setUserPreferences(data.user_preferences);
      if (data.offline_data) setOfflineData(data.offline_data);

      // Salva todos os dados importados
      await Promise.all([
        AsyncStorage.setItem('user_profile', JSON.stringify(data.user_profile || initialUserProfile)),
        AsyncStorage.setItem('auth_token', JSON.stringify(data.auth_token || initialAuthTokens)),
        AsyncStorage.setItem('app_settings', JSON.stringify(data.app_settings || initialAppSettings)),
        AsyncStorage.setItem('user_preferences', JSON.stringify(data.user_preferences || initialUserPreferences)),
        AsyncStorage.setItem('offline_data', JSON.stringify(data.offline_data || initialOfflineData)),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao importar dados');
      throw err;
    }
  };

  // ============================================================================
  // EFEITOS
  // ============================================================================

  useEffect(() => {
    loadAllData();
  }, []);

  // ============================================================================
  // VALOR DO CONTEXTO
  // ============================================================================

  const contextValue: StorageContextType = {
    userProfile,
    authTokens,
    appSettings,
    userPreferences,
    offlineData,
    updateUserProfile,
    updateAuthTokens,
    updateAppSettings,
    updateUserPreferences,
    updateOfflineData,
    clearUserData,
    clearAuthData,
    clearAllData,
    loading,
    error,
    refreshAllData,
    exportData,
    importData,
  };

  return (
    <StorageContext.Provider value={contextValue}>
      {children}
    </StorageContext.Provider>
  );
};

// ============================================================================
// HOOK PERSONALIZADO
// ============================================================================

export const useStorage = (): StorageContextType => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage deve ser usado dentro de um StorageProvider');
  }
  return context;
};

// ============================================================================
// HOOKS ESPECIALIZADOS
// ============================================================================

export const useUserProfile = () => {
  const { userProfile, updateUserProfile } = useStorage();
  return { userProfile, updateUserProfile };
};

export const useAuthTokens = () => {
  const { authTokens, updateAuthTokens, clearAuthData } = useStorage();
  return { authTokens, updateAuthTokens, clearAuthData };
};

export const useAppSettings = () => {
  const { appSettings, updateAppSettings } = useStorage();
  return { appSettings, updateAppSettings };
};

export const useUserPreferences = () => {
  const { userPreferences, updateUserPreferences } = useStorage();
  return { userPreferences, updateUserPreferences };
};

export const useOfflineData = () => {
  const { offlineData, updateOfflineData } = useStorage();
  return { offlineData, updateOfflineData };
};

