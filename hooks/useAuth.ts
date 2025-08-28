import { useAuthTokens, useUserProfile } from '@/contexts';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const { authTokens } = useAuthTokens();
  const { userProfile } = useUserProfile();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Verifica se há tokens válidos e perfil de usuário
      const hasValidTokens = authTokens.accessToken && 
                           authTokens.refreshToken && 
                           authTokens.expiresAt && 
                           new Date(authTokens.expiresAt) > new Date();
      
      const hasValidProfile = userProfile.id && 
                            userProfile.name && 
                            userProfile.email;

      const authenticated = hasValidTokens && hasValidProfile;
      setIsAuthenticated(authenticated);
      setIsLoading(false);

      return authenticated;
    };

    checkAuth();
  }, [authTokens, userProfile]);

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
      return false;
    }
    return true;
  };

  const requireGuest = () => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
      return false;
    }
    return true;
  };

  return {
    isAuthenticated,
    isLoading,
    requireAuth,
    requireGuest,
    userProfile,
    authTokens,
  };
};
