import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { StorageProvider } from '@/contexts';
import { initializeSystemWithAdmin } from '@/utils/createDefaultAdmin';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // ============================================================================
  // EFEITOS
  // ============================================================================

  useEffect(() => {
    // Configurações iniciais do app
    console.log('App iniciado com tema:', colorScheme);
    
    // Inicializa o sistema com admin padrão se necessário
    initializeSystemWithAdmin();
  }, [colorScheme]);

  // ============================================================================
  // RENDERIZAÇÃO
  // ============================================================================

  return (
    <StorageProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            title: 'SkillHub',
          }} 
        />
        <Stack.Screen 
          name="auth" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
    </StorageProvider>
  );
}
