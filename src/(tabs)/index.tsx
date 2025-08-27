import { router } from 'expo-router';
import { useEffect } from 'react';

export default function IndexScreen() {
  useEffect(() => {
    // Após login bem-sucedido, redirecionar para a tela home
    router.replace('./home');
  }, []);

  return null;
}