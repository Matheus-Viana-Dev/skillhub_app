import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { 
          backgroundColor: colors.pageBg 
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Login',
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Cadastro',
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: 'Recuperar Senha',
        }} 
      />
    </Stack>
  );
}


