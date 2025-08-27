import {
    AuthButton,
    AuthContainer,
    AuthInput,
    AuthLink,
    AuthLogo
} from '@/components/auth';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

interface ForgotPasswordForm {
  email: string;
}

interface ForgotPasswordErrors {
  email?: string;
}

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [form, setForm] = useState<ForgotPasswordForm>({
    email: '',
  });
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: ForgotPasswordErrors = {};

    // Validação do email
    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função de envio do e-mail de recuperação
  const handleSendResetEmail = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simular chamada de API (substituir pela sua lógica de recuperação)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sucesso - mostrar estado de e-mail enviado
      setEmailSent(true);
    } catch {
      Alert.alert(
        'Erro ao enviar e-mail',
        'Não foi possível enviar o e-mail de recuperação. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Função para tentar novamente
  const handleTryAgain = () => {
    setEmailSent(false);
    setForm({ email: '' });
    setErrors({});
  };

  // Função de navegação para login
  const handleBackToLogin = () => {
    router.back();
  };

  // Função para atualizar o formulário
  const updateForm = (field: keyof ForgotPasswordForm) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Limpar erros quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Renderização do estado de sucesso
  if (emailSent) {
    return (
      <>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <AuthContainer>
          {/* Ícone de sucesso */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: 32,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.buttonPrimary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <Ionicons
                name="mail"
                size={40}
                color={colors.buttonText}
              />
            </View>
          </View>

          {/* Título e descrição */}
          <View style={{ marginBottom: 32, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 28,
                fontFamily: 'Inter',
                fontWeight: '700',
                color: colors.textPrimary,
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              E-mail enviado!
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: '400',
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 24,
                marginBottom: 8,
              }}
            >
              Enviamos um link de recuperação para:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: '600',
                color: colors.textPrimary,
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              {form.email}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter',
                fontWeight: '400',
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              Verifique sua caixa de entrada e spam. O link expira em 24 horas.
            </Text>
          </View>

          {/* Botões */}
          <View style={{ gap: 16 }}>
            <AuthButton
              title="Abrir app de e-mail"
              onPress={() => {
                // Implementar abertura do app de e-mail
                Alert.alert('Info', 'Abrir app de e-mail');
              }}
              style={{ marginBottom: 8 }}
            />
            
            <AuthButton
              title="Tentar novamente"
              variant="secondary"
              onPress={handleTryAgain}
              style={{ marginBottom: 16 }}
            />
          </View>

          {/* Link para voltar */}
          <View style={{ alignItems: 'center' }}>
            <AuthLink
              title="Voltar para o login"
              onPress={handleBackToLogin}
              size="medium"
            />
          </View>
        </AuthContainer>
      </>
    );
  }

  // Renderização do formulário principal
  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <AuthContainer>
        {/* Logo */}
        <AuthLogo size="medium" />

        {/* Título e descrição */}
        <View style={{ marginBottom: 32, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'Inter',
              fontWeight: '700',
              color: colors.textPrimary,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            Recupere sua senha
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: '400',
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
              paddingHorizontal: 20,
            }}
          >
            Digite seu e-mail e enviaremos um link para você redefinir sua senha.
          </Text>
        </View>

        {/* Formulário */}
        <View style={{ marginBottom: 32 }}>
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
            autoFocus
          />
        </View>

        {/* Botão de envio */}
        <AuthButton
          title="Enviar link"
          onPress={handleSendResetEmail}
          loading={loading}
          style={{ marginBottom: 24 }}
        />

        {/* Link para voltar */}
        <View style={{ alignItems: 'center' }}>
          <AuthLink
            title="Voltar para o login"
            onPress={handleBackToLogin}
            size="medium"
          />
        </View>
      </AuthContainer>
    </>
  );
}
