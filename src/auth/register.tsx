import {
    AuthButton,
    AuthCheckbox,
    AuthContainer,
    AuthInput,
    AuthLink,
    AuthLogo
} from '@/components/auth';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
}

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    // Validação do nome
    if (!form.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validação do email
    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    // Validação da senha
    if (!form.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (form.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = 'Senha deve conter pelo menos 1 letra maiúscula, 1 minúscula e 1 número';
    }

    // Validação da confirmação de senha
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    // Validação dos termos
    if (!form.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os Termos de Serviço';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função de cadastro
  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simular chamada de API (substituir pela sua lógica de cadastro)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sucesso - mostrar mensagem e navegar para login
      Alert.alert(
        'Cadastro realizado!',
        'Sua conta foi criada com sucesso. Faça login para continuar.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          }
        ]
      );
    } catch {
      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao criar sua conta. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Função de navegação para login
  const handleGoToLogin = () => {
    router.push('./login');
  };

  // Função para atualizar o formulário
  const updateForm = (field: keyof RegisterForm) => (value: string | boolean) => {
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
              color: colors.textPrimary,
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Crie sua conta
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: '400',
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            Preencha os dados para começar
          </Text>
        </View>

        {/* Formulário */}
        <View style={{ marginBottom: 24, gap: 20 }}>
          <AuthInput
            label="Nome completo"
            type="text"
            icon="person"
            placeholder="Digite seu nome completo"
            value={form.name}
            onChangeText={updateForm('name')}
            error={errors.name}
            autoComplete="name"
          />

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
            autoComplete="new-password"
          />

          <AuthInput
            label="Confirmar senha"
            type="password"
            icon="lock-closed"
            placeholder="Confirme sua senha"
            value={form.confirmPassword}
            onChangeText={updateForm('confirmPassword')}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        </View>

        {/* Checkbox dos termos */}
        <View style={{ marginBottom: 24 }}>
          <AuthCheckbox
            checked={form.acceptTerms}
            onPress={() => updateForm('acceptTerms')(!form.acceptTerms)}
            label={`Li e aceito os Termos de Serviço e Política de Privacidade`}
            error={errors.acceptTerms}
          />
        </View>

        {/* Botão de Cadastro */}
        <AuthButton
          title="Criar conta"
          onPress={handleRegister}
          loading={loading}
          style={{ marginBottom: 24 }}
        />

        {/* Link para login */}
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
              color: colors.textSecondary,
              marginRight: 8,
            }}
          >
            Já tem uma conta?
          </Text>
          <AuthLink
            title="Faça login"
            onPress={handleGoToLogin}
            size="medium"
          />
        </View>
      </AuthContainer>
    </>
  );
}
