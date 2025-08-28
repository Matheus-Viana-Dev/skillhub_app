import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { useAuthTokens, useUserProfile } from '@/contexts';
import { useClients } from '@/hooks/useClients';
import { useColorScheme } from '@/hooks/useColorScheme';

// ============================================================================
// INTERFACES
// ============================================================================

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

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function RegisterScreen() {
  // ============================================================================
  // HOOKS E ESTADOS
  // ============================================================================
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width, height } = Dimensions.get('window');
  
  // Hooks de storage
  const { updateUserProfile } = useUserProfile();
  const { updateAuthTokens } = useAuthTokens();
  
  // Hook de clientes
  const { createClient } = useClients();
  
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============================================================================
  // FUNÇÕES
  // ============================================================================

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!form.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (form.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (!form.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos e condições';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simula chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Cria o cliente no sistema
      const newClient = await createClient({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: '',
        company: '',
        role: 'revendedor',
        isAdmin: false, // Por padrão, novos usuários não são admin
        status: 'active',
        avatar: 'https://example.com/default-avatar.jpg',
        lastLogin: new Date(),
        preferences: {
          theme: 'system',
          language: 'pt-BR',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          privacy: {
            shareData: false,
            marketingEmails: true,
            analytics: true,
          },
        },
        metadata: {
          source: 'direct',
          tags: ['novo-cadastro', 'revendedor'],
          notes: 'Cliente cadastrado via app',
          priority: 'medium',
          customFields: {},
        },
      });

      // Dados simulados de resposta da API
      const mockResponse = {
        user: {
          id: newClient.id, // Usa o ID gerado pelo sistema
          name: newClient.name,
          email: newClient.email,
          avatar: newClient.avatar,
          role: newClient.role,
          createdAt: newClient.createdAt,
          lastLogin: newClient.lastLogin,
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

      // Mostra mensagem de sucesso com o ID do cliente
      Alert.alert(
        'Conta criada com sucesso!',
        `Bem-vindo ao SkillHub! Sua conta foi criada com ID: ${newClient.id}`,
        [
          {
            text: 'Continuar',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      Alert.alert(
        'Erro ao criar conta',
        error instanceof Error ? error.message : 'Ocorreu um erro ao criar sua conta. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: keyof RegisterForm) => (value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // ============================================================================
  // COMPONENTES DE RENDERIZAÇÃO
  // ============================================================================

  const renderBackground = () => (
    <>
      {/* Background principal seguindo a identidade visual */}
      <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height * 0.45,
        backgroundColor: colorScheme === 'dark' 
          ? '#111827' // Fundo escuro da identidade visual
          : '#F9FAFB', // Fundo claro da identidade visual
      }} />
      
      {/* Gradiente superior sutil */}
      <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height * 0.3,
        backgroundColor: colorScheme === 'dark' 
          ? 'rgba(30, 58, 138, 0.1)' // Azul médio sutil para modo escuro
          : 'rgba(59, 130, 246, 0.08)', // Azul claro muito sutil para modo claro
      }} />
      
      {/* Círculos decorativos sutis */}
      <View style={{
        position: 'absolute',
        top: height * 0.05,
        right: -width * 0.1,
        width: width * 0.25,
        height: width * 0.25,
        borderRadius: width * 0.125,
        backgroundColor: colorScheme === 'dark' 
          ? 'rgba(30, 58, 138, 0.08)' // Azul médio muito sutil
          : 'rgba(59, 130, 246, 0.06)', // Azul claro muito sutil
      }} />
      
      <View style={{
        position: 'absolute',
        top: height * 0.15,
        left: -width * 0.08,
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width * 0.1,
        backgroundColor: colorScheme === 'dark' 
          ? 'rgba(30, 58, 138, 0.06)' // Azul médio muito sutil
          : 'rgba(59, 130, 246, 0.04)', // Azul claro muito sutil
      }} />
      
      <View style={{
        position: 'absolute',
        top: height * 0.08,
        left: width * 0.3,
        width: width * 0.15,
        height: width * 0.15,
        borderRadius: width * 0.075,
        backgroundColor: colorScheme === 'dark' 
          ? 'rgba(30, 58, 138, 0.05)' // Azul médio muito sutil
          : 'rgba(59, 130, 246, 0.03)', // Azul claro muito sutil
      }} />
    </>
  );

  const renderHeader = () => (
    <View style={{
      height: height * 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
    }}>
      {/* Logo container seguindo a identidade visual */}
      <View style={{
        width: 90,
        height: 90,
        borderRadius: 20, // Bordas arredondadas conforme especificação
        backgroundColor: colorScheme === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' // Muito sutil para modo escuro
          : 'rgba(10, 26, 47, 0.03)', // Muito sutil para modo claro
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24, // Espaçamento arejado
        shadowColor: colorScheme === 'dark' ? '#000' : '#0A1A2F',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08, // Sombra muito suave
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: colorScheme === 'dark' 
          ? 'rgba(30, 58, 138, 0.1)' 
          : 'rgba(10, 26, 47, 0.08)',
      }}>
        <View style={{
          width: 55,
          height: 55,
          borderRadius: 16, // Bordas arredondadas conforme especificação
          backgroundColor: colorScheme === 'dark' 
            ? '#1E3A8A' // Azul médio da identidade visual
            : '#1E3A8A', // Azul médio da identidade visual
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <FontAwesome5 
            name="user-plus" 
            size={26} 
            color="#FFFFFF" // Branco puro da identidade visual
          />
        </View>
      </View>

      {/* Título principal seguindo a tipografia da identidade visual */}
      <Text style={{
        fontSize: 28,
        fontWeight: '700', // Bold conforme especificação
        color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5,
        fontFamily: 'Inter', // Fonte principal da identidade visual
      }}>
        Criar Conta
      </Text>

      {/* Subtítulo seguindo a tipografia da identidade visual */}
      <Text style={{
        fontSize: 14,
        fontWeight: '500', // Medium conforme especificação
        color: colorScheme === 'dark' 
          ? '#6B7280' // Cinza texto da identidade visual
          : '#6B7280', // Cinza texto da identidade visual
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.3,
        fontFamily: 'Inter', // Fonte principal da identidade visual
      }}>
        Junte-se ao SkillHub e comece sua jornada
      </Text>
    </View>
  );

  const renderForm = () => (
    <View style={{
      backgroundColor: colorScheme === 'dark' 
        ? '#111827' // Fundo escuro da identidade visual
        : '#FFFFFF', // Branco puro da identidade visual
      borderRadius: 20, // Bordas arredondadas conforme especificação
      padding: 32, // Espaçamento arejado
      marginHorizontal: 20,
      marginTop: 10,
      shadowColor: colorScheme === 'dark' ? '#000' : '#0A1A2F',
      shadowOffset: { width: 0, height: 12 }, // Sombra suave para profundidade
      shadowOpacity: colorScheme === 'dark' ? 0.2 : 0.08,
      shadowRadius: 24,
      elevation: 8,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' 
        ? 'rgba(30, 58, 138, 0.15)' 
        : 'rgba(10, 26, 47, 0.08)',
    }}>
      {/* Mensagem de boas-vindas seguindo a identidade visual */}
      <View style={{
        alignItems: 'center',
        marginBottom: 32, // Espaçamento arejado
        paddingBottom: 28,
        borderBottomWidth: 1,
        borderBottomColor: colorScheme === 'dark' 
          ? 'rgba(107, 114, 128, 0.2)' // Cinza texto sutil
          : 'rgba(107, 114, 128, 0.15)', // Cinza texto sutil
      }}>
        <View style={{
          width: 50,
          height: 50,
          borderRadius: 16,
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(30, 58, 138, 0.1)' 
            : 'rgba(30, 58, 138, 0.08)',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20, // Espaçamento arejado
        }}>
          <FontAwesome5 
            name="rocket" 
            size={24} 
            color="#1E3A8A" // Azul médio da identidade visual
          />
        </View>
        <Text style={{
          fontSize: 20,
          fontWeight: '600', // SemiBold conforme especificação
          color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
          textAlign: 'center',
          marginBottom: 12,
          fontFamily: 'Inter', // Fonte principal da identidade visual
        }}>
          Comece sua jornada
        </Text>
        <Text style={{
          fontSize: 15,
          fontWeight: '400', // Regular conforme especificação
          color: colorScheme === 'dark' ? '#6B7280' : '#6B7280', // Cinza texto da identidade visual
          textAlign: 'center',
          lineHeight: 22,
          fontFamily: 'Inter', // Fonte principal da identidade visual
        }}>
          Crie sua conta e tenha acesso a todos os recursos
        </Text>
      </View>

      {/* Campo Nome seguindo a identidade visual */}
      <View style={{ marginBottom: 24 }}> {/* Espaçamento arejado */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <FontAwesome5 
            name="user" 
            size={16} 
            color="#1E3A8A" // Azul médio da identidade visual
            style={{ marginRight: 8 }}
          />
          <Text style={{
            fontSize: 16,
            fontWeight: '500', // Medium conforme especificação
            color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
            fontFamily: 'Inter', // Fonte principal da identidade visual
          }}>
            Nome completo
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: errors.name ? '#EF4444' : 'rgba(30, 58, 138, 0.2)', // Azul médio sutil
          borderRadius: 16, // Bordas arredondadas conforme especificação
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(17, 24, 39, 0.6)' 
            : 'rgba(249, 250, 251, 0.8)', // Fundo claro da identidade visual
          paddingHorizontal: 20,
          height: 56,
          shadowColor: errors.name ? '#EF4444' : '#1E3A8A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: errors.name ? 0.2 : 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}>
          <FontAwesome5 
            name="user" 
            size={18} 
            color={errors.name ? '#EF4444' : '#6B7280'} // Cinza texto da identidade visual
            style={{ marginRight: 16 }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
              fontWeight: '400', // Regular conforme especificação
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}
            placeholder="Digite seu nome completo"
            placeholderTextColor="#6B7280" // Cinza texto da identidade visual
            value={form.name}
            onChangeText={updateForm('name')}
            autoComplete="name"
            autoCapitalize="words"
          />
        </View>
        {errors.name && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
            marginLeft: 4,
          }}>
            <FontAwesome5 
              name="exclamation-triangle" 
              size={12} 
              color="#EF4444" 
              style={{ marginRight: 6 }}
            />
            <Text style={{
              fontSize: 13,
              color: '#EF4444',
              fontWeight: '500', // Medium conforme especificação
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              {errors.name}
            </Text>
          </View>
        )}
      </View>

      {/* Campo E-mail seguindo a identidade visual */}
      <View style={{ marginBottom: 24 }}> {/* Espaçamento arejado */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <FontAwesome5 
            name="envelope" 
            size={16} 
            color="#1E3A8A" // Azul médio da identidade visual
            style={{ marginRight: 8 }}
          />
          <Text style={{
            fontSize: 16,
            fontWeight: '500', // Medium conforme especificação
            color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
            fontFamily: 'Inter', // Fonte principal da identidade visual
          }}>
            E-mail
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: errors.email ? '#EF4444' : 'rgba(30, 58, 138, 0.2)', // Azul médio sutil
          borderRadius: 16, // Bordas arredondadas conforme especificação
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(17, 24, 39, 0.6)' 
            : 'rgba(249, 250, 251, 0.8)', // Fundo claro da identidade visual
          paddingHorizontal: 20,
          height: 56,
          shadowColor: errors.email ? '#EF4444' : '#1E3A8A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: errors.email ? 0.2 : 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}>
          <FontAwesome5 
            name="envelope" 
            size={18} 
            color={errors.email ? '#EF4444' : '#6B7280'} // Cinza texto da identidade visual
            style={{ marginRight: 16 }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
              fontWeight: '400', // Regular conforme especificação
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}
            placeholder="seu.email@exemplo.com"
            placeholderTextColor="#6B7280" // Cinza texto da identidade visual
            value={form.email}
            onChangeText={updateForm('email')}
            autoComplete="email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        {errors.email && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
            marginLeft: 4,
          }}>
            <FontAwesome5 
              name="exclamation-triangle" 
              size={12} 
              color="#EF4444" 
              style={{ marginRight: 6 }}
            />
            <Text style={{
              fontSize: 13,
              color: '#EF4444',
              fontWeight: '500', // Medium conforme especificação
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              {errors.email}
            </Text>
          </View>
        )}
      </View>

      {/* Campo Senha seguindo a identidade visual */}
      <View style={{ marginBottom: 24 }}> {/* Espaçamento arejado */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <FontAwesome5 
            name="lock" 
            size={16} 
            color="#1E3A8A" // Azul médio da identidade visual
            style={{ marginRight: 8 }}
          />
          <Text style={{
            fontSize: 16,
            fontWeight: '500', // Medium conforme especificação
            color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
            fontFamily: 'Inter', // Fonte principal da identidade visual
          }}>
            Senha
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: errors.password ? '#EF4444' : 'rgba(30, 58, 138, 0.2)', // Azul médio sutil
          borderRadius: 16, // Bordas arredondadas conforme especificação
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(17, 24, 39, 0.6)' 
            : 'rgba(249, 250, 251, 0.8)', // Fundo claro da identidade visual
          paddingHorizontal: 20,
          height: 56,
          shadowColor: errors.password ? '#EF4444' : '#1E3A8A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: errors.password ? 0.2 : 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}>
          <FontAwesome5 
            name="lock" 
            size={18} 
            color={errors.password ? '#EF4444' : '#6B7280'} // Cinza texto da identidade visual
            style={{ marginRight: 16 }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
              fontWeight: '400', // Regular conforme especificação
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}
            placeholder="Digite sua senha"
            placeholderTextColor="#6B7280" // Cinza texto da identidade visual
            value={form.password}
            onChangeText={updateForm('password')}
            secureTextEntry={!showPassword}
            autoComplete="password-new"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              padding: 10,
              borderRadius: 12, // Bordas arredondadas conforme especificação
              backgroundColor: 'rgba(30, 58, 138, 0.08)', // Azul médio muito sutil
            }}
          >
            <FontAwesome5 
              name={showPassword ? "eye-slash" : "eye"} 
              size={18} 
              color="#1E3A8A" // Azul médio da identidade visual
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
            marginLeft: 4,
          }}>
            <FontAwesome5 
              name="exclamation-triangle" 
              size={12} 
              color="#EF4444" 
              style={{ marginRight: 6 }}
            />
            <Text style={{
              fontSize: 13,
              color: '#EF4444',
              fontWeight: '500', // Medium conforme especificação
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              {errors.password}
            </Text>
          </View>
        )}
      </View>

      {/* Campo Confirmar Senha seguindo a identidade visual */}
      <View style={{ marginBottom: 24 }}> {/* Espaçamento arejado */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <FontAwesome5 
            name="lock" 
            size={16} 
            color="#1E3A8A" // Azul médio da identidade visual
            style={{ marginRight: 8 }}
          />
          <Text style={{
            fontSize: 16,
            fontWeight: '500', // Medium conforme especificação
            color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
            fontFamily: 'Inter', // Fonte principal da identidade visual
          }}>
            Confirmar senha
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: errors.confirmPassword ? '#EF4444' : 'rgba(30, 58, 138, 0.2)', // Azul médio sutil
          borderRadius: 16, // Bordas arredondadas conforme especificação
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(17, 24, 39, 0.6)' 
            : 'rgba(249, 250, 251, 0.8)', // Fundo claro da identidade visual
          paddingHorizontal: 20,
          height: 56,
          shadowColor: errors.confirmPassword ? '#EF4444' : '#1E3A8A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: errors.confirmPassword ? 0.2 : 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}>
          <FontAwesome5 
            name="lock" 
            size={18} 
            color={errors.confirmPassword ? '#EF4444' : '#6B7280'} // Cinza texto da identidade visual
            style={{ marginRight: 16 }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
              fontWeight: '400', // Regular conforme especificação
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}
            placeholder="Confirme sua senha"
            placeholderTextColor="#6B7280" // Cinza texto da identidade visual
            value={form.confirmPassword}
            onChangeText={updateForm('confirmPassword')}
            secureTextEntry={!showConfirmPassword}
            autoComplete="password-new"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              padding: 10,
              borderRadius: 12, // Bordas arredondadas conforme especificação
              backgroundColor: 'rgba(30, 58, 138, 0.08)', // Azul médio muito sutil
            }}
          >
            <FontAwesome5 
              name={showConfirmPassword ? "eye-slash" : "eye"} 
              size={18} 
              color="#1E3A8A" // Azul médio da identidade visual
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
            marginLeft: 4,
          }}>
            <FontAwesome5 
              name="exclamation-triangle" 
              size={12} 
              color="#EF4444" 
              style={{ marginRight: 6 }}
            />
            <Text style={{
              fontSize: 13,
              color: '#EF4444',
              fontWeight: '500', // Medium conforme especificação
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              {errors.confirmPassword}
            </Text>
          </View>
        )}
      </View>

      {/* Checkbox Termos e Condições seguindo a identidade visual */}
      <View style={{ marginBottom: 32 }}> {/* Espaçamento arejado */}
        <TouchableOpacity
          onPress={() => updateForm('acceptTerms')(!form.acceptTerms)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
          }}
        >
          <View style={{
            width: 24,
            height: 24,
            borderRadius: 6, // Bordas arredondadas conforme especificação
            borderWidth: 2,
            borderColor: form.acceptTerms ? '#1E3A8A' : 'rgba(30, 58, 138, 0.3)', // Azul médio da identidade visual
            backgroundColor: form.acceptTerms ? '#1E3A8A' : 'transparent', // Azul médio da identidade visual
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            {form.acceptTerms && (
              <FontAwesome5 
                name="check" 
                size={14} 
                color="#FFFFFF" // Branco puro da identidade visual
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '400', // Regular conforme especificação
              color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
              lineHeight: 20,
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              Eu aceito os{' '}
              <Text style={{
                color: '#1E3A8A', // Azul médio da identidade visual
                fontWeight: '600', // SemiBold conforme especificação
                textDecorationLine: 'underline',
              }}>
                Termos de Uso
              </Text>
              {' '}e{' '}
              <Text style={{
                color: '#1E3A8A', // Azul médio da identidade visual
                fontWeight: '600', // SemiBold conforme especificação
                textDecorationLine: 'underline',
              }}>
                Política de Privacidade
              </Text>
            </Text>
          </View>
        </TouchableOpacity>
        {errors.acceptTerms && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
            marginLeft: 36,
          }}>
            <FontAwesome5 
              name="exclamation-triangle" 
              size={12} 
              color="#EF4444" 
              style={{ marginRight: 6 }}
            />
            <Text style={{
              fontSize: 13,
              color: '#EF4444',
              fontWeight: '500', // Medium conforme especificação
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              {errors.acceptTerms}
            </Text>
          </View>
        )}
      </View>

      {/* Botão de Cadastro seguindo a identidade visual */}
      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#6B7280' : '#1E3A8A', // Azul médio da identidade visual
          borderRadius: 16, // Bordas arredondadas conforme especificação
          height: 56,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 28, // Espaçamento arejado
          shadowColor: '#1E3A8A',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: loading ? 0 : 0.15,
          shadowRadius: 16,
          elevation: 6,
        }}
      >
        {loading ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 20,
              height: 20,
              borderWidth: 2,
              borderColor: 'white',
              borderTopColor: 'transparent',
              borderRadius: 10,
              marginRight: 12,
            }} />
            <Text style={{
              fontSize: 16,
              fontWeight: '600', // SemiBold conforme especificação
              color: 'white',
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              Criando conta...
            </Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5 
              name="rocket" 
              size={18} 
              color="white" 
              style={{ marginRight: 10 }}
            />
            <Text style={{
              fontSize: 16,
              fontWeight: '600', // SemiBold conforme especificação
              color: 'white',
              marginRight: 8,
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              Criar conta
            </Text>
            <FontAwesome5 name="arrow-right" size={18} color="white" />
          </View>
        )}
      </TouchableOpacity>

      {/* Divisor elegante seguindo a identidade visual */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28, // Espaçamento arejado
      }}>
        <View style={{
          flex: 1,
          height: 1,
          backgroundColor: 'rgba(107, 114, 128, 0.2)', // Cinza texto sutil
        }} />
        <View style={{
          marginHorizontal: 20,
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(30, 58, 138, 0.08)' 
            : 'rgba(30, 58, 138, 0.05)',
          borderRadius: 12, // Bordas arredondadas conforme especificação
        }}>
          <FontAwesome5 
            name="star" 
            size={12} 
            color="#6B7280" // Cinza texto da identidade visual
          />
        </View>
        <View style={{
          flex: 1,
          height: 1,
          backgroundColor: 'rgba(107, 114, 128, 0.2)', // Cinza texto sutil
        }} />
      </View>

      {/* Botão de Login seguindo a identidade visual */}
      <TouchableOpacity
        onPress={() => router.push('./login')}
        style={{
          borderWidth: 2,
          borderColor: '#1E3A8A', // Azul médio da identidade visual
          borderRadius: 16, // Bordas arredondadas conforme especificação
          height: 56,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(30, 58, 138, 0.03)', // Azul médio muito sutil
          flexDirection: 'row',
        }}
      >
        <FontAwesome5 
          name="arrow-left" 
          size={18} 
          color="#1E3A8A" // Azul médio da identidade visual
          style={{ marginRight: 10 }}
        />
        <Text style={{
          fontSize: 16,
          fontWeight: '600', // SemiBold conforme especificação
          color: "#1E3A8A", // Azul médio da identidade visual
          fontFamily: 'Inter', // Fonte principal da identidade visual
        }}>
          Já tenho uma conta
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ============================================================================
  // RENDERIZAÇÃO PRINCIPAL
  // ============================================================================

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <View style={{
        flex: 1,
        backgroundColor: colors.pageBg,
      }}>
        {/* Background */}
        {renderBackground()}

        {/* Header */}
        {renderHeader()}

        {/* Conteúdo principal */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: 0,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Formulário */}
            {renderForm()}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
