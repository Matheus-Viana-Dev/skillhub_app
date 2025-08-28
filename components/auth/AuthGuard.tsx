import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = false, 
  requireGuest = false 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      // Usuário não autenticado tentando acessar rota protegida
      router.replace('/auth/login');
      return;
    }

    if (requireGuest && isAuthenticated) {
      // Usuário autenticado tentando acessar rota de guest
      router.replace('/(tabs)');
      return;
    }
  }, [isAuthenticated, isLoading, requireAuth, requireGuest, router]);

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#F9FAFB' 
      }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={{ 
          marginTop: 16, 
          fontSize: 16, 
          color: '#6B7280' 
        }}>
          Verificando autenticação...
        </Text>
      </View>
    );
  }

  // Se não há restrições ou as restrições são atendidas, renderiza os children
  if ((!requireAuth && !requireGuest) || 
      (requireAuth && isAuthenticated) || 
      (requireGuest && !isAuthenticated)) {
    return <>{children}</>;
  }

  // Caso contrário, não renderiza nada (está redirecionando)
  return null;
};
