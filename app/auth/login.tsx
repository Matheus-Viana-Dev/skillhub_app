import {
    AuthButton,
    AuthContainer,
    AuthInput,
    AuthLink,
    AuthLogo
} from '@/components/auth';
import { useAuthTokens, useUserProfile } from '@/contexts';
import { useClients } from '@/hooks/useClients';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Dimensions, Text } from 'react-native';
import Animated, {
    FadeInUp,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface LoginForm {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  
  // Hooks de storage
  const { updateAuthTokens } = useAuthTokens();
  const { updateUserProfile } = useUserProfile();
  
  // Hook de clientes
  const { getClientByEmail } = useClients();
  
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  
  // Valores para animações
  const screenHeight = Dimensions.get('window').height;
  const loginProgress = useSharedValue(0);
  const shakeAnimation = useSharedValue(0);
  
  // Estilo animado para feedback de erro
  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }));

  // Validação do formulário com animação de erro
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Validação do email
    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    // Validação da senha
    if (!form.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (form.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    
    // Animação de shake se houver erros
    if (Object.keys(newErrors).length > 0) {
      shakeAnimation.value = withSpring(0, { duration: 100 }, () => {
        shakeAnimation.value = withSpring(10, { duration: 50 }, () => {
          shakeAnimation.value = withSpring(-10, { duration: 50 }, () => {
            shakeAnimation.value = withSpring(5, { duration: 50 }, () => {
              shakeAnimation.value = withSpring(0, { duration: 100 });
            });
          });
        });
      });
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Função de login com animação de progresso
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    loginProgress.value = withTiming(1, { duration: 2000 });

    try {
      // Simula chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validação adicional dos dados
      if (!form.email || !form.password) {
        throw new Error('Credenciais inválidas');
      }

      // Verifica se o cliente existe no sistema
      const existingClient = await getClientByEmail(form.email.trim());
      if (!existingClient) {
        throw new Error('Cliente não encontrado. Faça seu cadastro primeiro.');
      }

      // Verifica se a conta está ativa
      if (existingClient.status !== 'active') {
        throw new Error('Sua conta está inativa. Entre em contato com o suporte.');
      }

      // Simula verificação de credenciais
      // Em uma aplicação real, isso seria uma chamada para a API
      const isValidCredentials = form.email.includes('@') && form.password.length >= 6;
      
      if (!isValidCredentials) {
        throw new Error('Credenciais inválidas');
      }
      
      // Dados de resposta da API usando dados do cliente existente
      const mockResponse = {
        user: {
          id: existingClient.id,
          name: existingClient.name,
          email: existingClient.email,
          avatar: existingClient.avatar,
          role: existingClient.role,
          isAdmin: existingClient.isAdmin,
          createdAt: existingClient.createdAt,
          lastLogin: new Date(),
        },
        tokens: {
          accessToken: `access_token_${Date.now()}`,
          refreshToken: `refresh_token_${Date.now()}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        },
      };

      // Salva dados no storage
      await Promise.all([
        updateAuthTokens(mockResponse.tokens),
        updateUserProfile(mockResponse.user),
      ]);

      // Animação de sucesso antes de navegar
      loginProgress.value = withSpring(0, { duration: 300 }, () => {
        runOnJS(router.replace)('/(tabs)');
      });
    } catch (error) {
      console.error('Erro no login:', error);
      loginProgress.value = withSpring(0, { duration: 300 });
      Alert.alert(
        'Erro no login',
        error instanceof Error ? error.message : 'Verifique suas credenciais e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Funções de navegação
  const handleForgotPassword = () => {
    router.push('./forgot-password');
  };

  const handleSignUp = () => {
    router.push('./register');
  };

  // Função para atualizar o formulário
  const updateForm = (field: keyof LoginForm) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Limpar erros quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <AuthContainer>
        {/* Logo com animação stagger */}
        <Animated.View entering={FadeInUp.delay(100).duration(600)}>
          <AuthLogo />
        </Animated.View>

        {/* Título com animação stagger */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(600)}
          style={[{ marginBottom: 32, alignItems: 'center' }, animatedShakeStyle]}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'Inter',
              fontWeight: '700',
              color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Faça seu login
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: '400',
              color: colorScheme === 'dark' ? '#A0AEC0' : '#6B7280',
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            Entre na sua conta para continuar
          </Text>
        </Animated.View>

        {/* Input E-mail com animação stagger */}
        <Animated.View 
          entering={FadeInUp.delay(300).duration(600)}
          style={{ marginBottom: 20 }}
        >
          <AuthInput
            label="E-mail"
            type="email"
            icon="mail"
            placeholder="Digite seu e-mail"
            value={form.email}
            onChangeText={updateForm('email')}
            error={errors.email}
            autoComplete="email"
            autoCapitalize="none"
          />
        </Animated.View>

        {/* Input Senha com animação stagger */}
        <Animated.View 
          entering={FadeInUp.delay(400).duration(600)}
          style={{ marginBottom: 24 }}
        >
          <AuthInput
            label="Senha"
            type="password"
            icon="lock-closed"
            placeholder="Digite sua senha"
            value={form.password}
            onChangeText={updateForm('password')}
            error={errors.password}
            autoComplete="password"
          />
        </Animated.View>

        {/* Link "Esqueceu a senha?" com animação stagger */}
        <Animated.View 
          entering={FadeInUp.delay(500).duration(600)}
          style={{ alignItems: 'flex-end', marginBottom: 32 }}
        >
          <AuthLink
            title="Esqueceu a senha?"
            onPress={handleForgotPassword}
            size="small"
          />
        </Animated.View>

        {/* Botão de Login com animação stagger */}
        <Animated.View entering={FadeInUp.delay(600).duration(600)}>
          <AuthButton
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            style={{ marginBottom: 24 }}
          />
        </Animated.View>

        {/* Link para cadastro com animação stagger */}
        <Animated.View 
          entering={FadeInUp.delay(700).duration(600)}
          style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: '400',
              color: colorScheme === 'dark' ? '#A0AEC0' : '#6B7280',
              marginRight: 8,
            }}
          >
            Não tem uma conta?
          </Text>
          <AuthLink
            title="Cadastre-se"
            onPress={handleSignUp}
            size="medium"
          />
        </Animated.View>
      </AuthContainer>
    </>
  );
}
