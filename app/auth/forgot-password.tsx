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
import { useColorScheme } from '@/hooks/useColorScheme';

// ============================================================================
// INTERFACES
// ============================================================================

interface ForgotPasswordForm {
  email: string;
}

interface ForgotPasswordErrors {
  email?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function ForgotPasswordScreen() {
  // ============================================================================
  // HOOKS E ESTADOS
  // ============================================================================
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width, height } = Dimensions.get('window');
  
  const [form, setForm] = useState<ForgotPasswordForm>({
    email: '',
  });
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // ============================================================================
  // FUNÇÕES
  // ============================================================================

  const validateForm = (): boolean => {
    const newErrors: ForgotPasswordErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendLink = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEmailSent(true);
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível enviar o link de recuperação. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: keyof ForgotPasswordForm) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setForm({ email: '' });
    setErrors({});
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
            name="key" 
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

  const renderSuccessState = () => (
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
      {/* Ícone de sucesso */}
      <View style={{
        alignItems: 'center',
        marginBottom: 32, // Espaçamento arejado
      }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(34, 197, 94, 0.1)' 
            : 'rgba(34, 197, 94, 0.08)',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24, // Espaçamento arejado
        }}>
          <FontAwesome5 
            name="mail" 
            size={36} 
            color="#22C55E" // Verde para sucesso
          />
        </View>
        
        <Text style={{
          fontSize: 24,
          fontWeight: '600', // SemiBold conforme especificação
          color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F', // Cores da identidade visual
          textAlign: 'center',
          marginBottom: 16,
          fontFamily: 'Inter', // Fonte principal da identidade visual
        }}>
          E-mail enviado!
        </Text>
        
        <Text style={{
          fontSize: 16,
          fontWeight: '400', // Regular conforme especificação
          color: colorScheme === 'dark' ? '#6B7280' : '#6B7280', // Cinza texto da identidade visual
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 32, // Espaçamento arejado
          fontFamily: 'Inter', // Fonte principal da identidade visual
        }}>
          Enviamos um link de recuperação para{'\n'}
          <Text style={{ fontWeight: '600', color: colorScheme === 'dark' ? '#FFFFFF' : '#0A1A2F' }}>
            {form.email}
          </Text>
        </Text>
      </View>

      {/* Botões de ação */}
      <TouchableOpacity
        onPress={() => {
          // Abrir app de e-mail
          Alert.alert('Abrir e-mail', 'Redirecionando para o app de e-mail...');
        }}
        style={{
          backgroundColor: '#1E3A8A', // Azul médio da identidade visual
          borderRadius: 16, // Bordas arredondadas conforme especificação
          height: 56,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16, // Espaçamento arejado
          shadowColor: '#1E3A8A',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 6,
          flexDirection: 'row',
        }}
      >
        <FontAwesome5 
          name="envelope-open" 
          size={18} 
          color="white" 
          style={{ marginRight: 10 }}
        />
        <Text style={{
          fontSize: 16,
          fontWeight: '600', // SemiBold conforme especificação
          color: 'white',
          fontFamily: 'Inter', // Fonte principal da identidade visual
        }}>
          Abrir e-mail
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleTryAgain}
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
          name="redo" 
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
          Tentar novamente
        </Text>
      </TouchableOpacity>
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
      {/* Mensagem de instrução seguindo a identidade visual */}
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
            name="question-circle" 
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
          Esqueceu sua senha?
        </Text>
        <Text style={{
          fontSize: 15,
          fontWeight: '400', // Regular conforme especificação
          color: colorScheme === 'dark' ? '#6B7280' : '#6B7280', // Cinza texto da identidade visual
          textAlign: 'center',
          lineHeight: 22,
          fontFamily: 'Inter', // Fonte principal da identidade visual
        }}>
          Digite seu e-mail e enviaremos um link{'\n'}para redefinir sua senha
        </Text>
      </View>

      {/* Campo E-mail seguindo a identidade visual */}
      <View style={{ marginBottom: 32 }}> {/* Espaçamento arejado */}
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

      {/* Botão de envio seguindo a identidade visual */}
      <TouchableOpacity
        onPress={handleSendLink}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#6B7280' : '#1E3A8A', // Azul médio da identidade visual
          borderRadius: 16, // Bordas arredondadas conforme especificação
          height: 56,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24, // Espaçamento arejado
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
              Enviando...
            </Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5 
              name="paper-plane" 
              size={18} 
              color="white" 
              style={{ marginRight: 10 }}
            />
            <Text style={{
              fontSize: 16,
              fontWeight: '600', // SemiBold conforme especificação
              color: 'white',
              fontFamily: 'Inter', // Fonte principal da identidade visual
            }}>
              Enviar link
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Link de voltar seguindo a identidade visual */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          alignItems: 'center',
          paddingVertical: 16,
          borderRadius: 16, // Bordas arredondadas conforme especificação
          backgroundColor: 'rgba(30, 58, 138, 0.05)', // Azul médio muito sutil
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <FontAwesome5 
          name="arrow-left" 
          size={16} 
          color="#1E3A8A" // Azul médio da identidade visual
          style={{ marginRight: 8 }}
        />
        <Text style={{
          fontSize: 16,
          fontWeight: '500', // Medium conforme especificação
          color: "#1E3A8A", // Azul médio da identidade visual
          fontFamily: 'Inter', // Fonte principal da identidade visual
        }}>
          Voltar para o login
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
            {/* Formulário ou estado de sucesso */}
            {emailSent ? renderSuccessState() : renderForm()}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
