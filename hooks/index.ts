// ============================================================================
// HOOKS DE STORAGE
// ============================================================================

export {
  useLocalStorage,
  useUserProfile,
  useAuthTokens,
  useAppSettings,
  useUserPreferences,
  useOfflineData,
  saveToStorage,
  getFromStorage,
  removeFromStorage,
  clearStorage,
  getAllKeys,
  getMultipleValues,
  setMultipleValues,
  exportStorageData,
  importStorageData,
  cleanupOldData,
  getStorageStats,
} from './useLocalStorage';

// ============================================================================
// HOOKS EXISTENTES
// ============================================================================

export { default as useColorScheme } from './useColorScheme';
export { default as useColorScheme as useColorSchemeWeb } from './useColorScheme.web';
export { default as useThemeColor } from './useThemeColor';
export { default as useNotifications } from './useNotifications';
