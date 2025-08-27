import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuthTokens, useUserProfile } from '@/contexts';

// ============================================================================
// INTERFACES
// ============================================================================

interface LoginForm {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function LoginScreen() {
  // ============================================================================
  // HOOKS E ESTADOS
  // ============================================================================
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width, height } = Dimensions.get('window');
  
  // Hooks de storage
  const { updateAuthTokens } = useAuthTokens();
  const { updateUserProfile } = useUserProfile();
  
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ============================================================================
  // FUNÇÕES
  // ============================================================================

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simula chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dados simulados de resposta da API
      const mockResponse = {
        user: {
          id: 'user_123',
          name: 'João Silva',
          email: form.email,
          avatar: 'https://example.com/avatar.jpg',
          role: 'revendedor',
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        tokens: {
          accessToken: 'mock_access_token_123',
          refreshToken: 'mock_refresh_token_456',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        },
      };

      // Salva dados no storage
      await Promise.all([
        updateAuthTokens(mockResponse.tokens),
        updateUserProfile(mockResponse.user),
      ]);

      // Navega para a tela principal
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Erro no login',
        'Verifique suas credenciais e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: keyof LoginForm) => (value: string) => {
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
            name="graduation-cap" 
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
        SkillHub
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
        by Tecskill
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
            name="hand-wave" 
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
          Bem-vindo de volta
        </Text>
        <Text style={{
          fontSize: 15,
          fontWeight: '400', // Regular conforme especificação
          color: colorScheme === 'dark' ? '#6B7280' : '#6B7280', // Cinza texto da identidade visual
          textAlign: 'center',
          lineHeight: 22,
          fontFamily: 'Inter', // Fonte principal da identidade visual
        }}>
          Acesse sua conta de revendedor indicado
        </Text>
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
      <View style={{ marginBottom: 28 }}> {/* Espaçamento arejado */}
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
            autoComplete="password"
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

      {/* Link Esqueceu a senha centralizado seguindo a identidade visual */}
      <View style={{
        alignItems: 'center',
        marginBottom: 32, // Espaçamento arejado
      }}>
        <TouchableOpacity
          onPress={() => router.push('./forgot-password')}
          style={{ 
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 16, // Bordas arredondadas conforme especificação
            backgroundColor: 'rgba(30, 58, 138, 0.08)', // Azul médio muito sutil
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <FontAwesome5 
            name="question-circle" 
            size={14} 
            color="#1E3A8A" // Azul médio da identidade visual
            style={{ marginRight: 8 }}
          />
          <Text style={{
            fontSize: 14,
            color: "#1E3A8A", // Azul médio da identidade visual
            fontWeight: '500', // Medium conforme especificação
            fontFamily: 'Inter', // Fonte principal da identidade visual
          }}>
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão de Login seguindo a identidade visual */}
      <TouchableOpacity
        onPress={handleLogin}
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
              Entrando...
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
              Entrar na plataforma
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

      {/* Botão de Cadastro seguindo a identidade visual */}
      <TouchableOpacity
        onPress={() => router.push('./register')}
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
          name="user-plus" 
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
          Criar nova conta
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
