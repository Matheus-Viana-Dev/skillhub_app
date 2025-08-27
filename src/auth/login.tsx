import {
    AuthButton,
    AuthContainer,
    AuthInput,
    AuthLink,
    AuthLogo
} from '@/components/auth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

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
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  // Validação do formulário
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
    return Object.keys(newErrors).length === 0;
  };

  // Função de login
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simular chamada de API (substituir pela sua lógica de autenticação)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sucesso - navegar para a tela principal
      router.replace('/(tabs)');
    } catch {
      Alert.alert(
        'Erro no login',
        'Verifique suas credenciais e tente novamente.'
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
        {/* Logo */}
        <AuthLogo />

        {/* Título */}
        <View style={{ marginBottom: 32, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'Inter',
              fontWeight: '700',
              color: '#0A1A2F',
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
              color: '#6B7280',
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            Entre na sua conta para continuar
          </Text>
        </View>

        {/* Formulário */}
        <View style={{ marginBottom: 24, gap: 20 }}>
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
        </View>

        {/* Link "Esqueceu a senha?" */}
        <View style={{ alignItems: 'flex-end', marginBottom: 32 }}>
          <AuthLink
            title="Esqueceu a senha?"
            onPress={handleForgotPassword}
            size="small"
          />
        </View>

        {/* Botão de Login */}
        <AuthButton
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
          style={{ marginBottom: 24 }}
        />

        {/* Link para cadastro */}
        <View 
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
              color: '#6B7280',
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
        </View>
      </AuthContainer>
    </>
  );
}
