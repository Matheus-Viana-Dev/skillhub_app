import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { StorageProvider } from '@/contexts';

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
  }, [colorScheme]);

  // ============================================================================
  // RENDERIZAÇÃO
  // ============================================================================

  return (
    <StorageProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            title: 'SkillHub',
          }} 
        />
        <Stack.Screen 
          name="auth/login" 
          options={{ 
            headerShown: false,
            title: 'Login',
          }} 
        />
        <Stack.Screen 
          name="auth/register" 
          options={{ 
            headerShown: false,
            title: 'Cadastro',
          }} 
        />
        <Stack.Screen 
          name="auth/forgot-password" 
          options={{ 
            headerShown: false,
            title: 'Recuperar Senha',
          }} 
        />
      </Stack>
    </StorageProvider>
  );
}
