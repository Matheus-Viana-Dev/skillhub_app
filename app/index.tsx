import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Verifica se há dados de autenticação válidos
        const [authToken, userProfile] = await Promise.all([
          AsyncStorage.getItem('auth_token'),
          AsyncStorage.getItem('user_profile'),
        ]);

        // Aguarda um pouco para garantir que o layout esteja montado
        await new Promise(resolve => setTimeout(resolve, 100));

        if (authToken && userProfile) {
          // Usuário já está logado, vai para a tela principal
          router.replace('/(tabs)');
        } else {
          // Usuário não está logado, vai para login
          router.replace('/auth/login');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Em caso de erro, vai para login
        router.replace('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#F9FAFB' 
    }}>
      <Text style={{ fontSize: 18, color: '#6B7280' }}>
        {isLoading ? 'Verificando autenticação...' : 'Redirecionando...'}
      </Text>
    </View>
  );
}
