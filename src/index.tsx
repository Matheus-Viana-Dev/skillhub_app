import { router } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    // Ponto de entrada do app - redirecionar para login
    // Em uma aplicação real, você verificaria se o usuário já está autenticado
    // Se autenticado: router.replace('/(tabs)') 
    // Se não autenticado: router.replace('./auth/login')
    router.replace('./auth/login');
  }, []);

  return null;
}
