import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  type?: 'text' | 'email' | 'password';
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function AuthInput({
  label,
  error,
  type = 'text',
  icon,
  value,
  onChangeText,
  ...props
}: AuthInputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Animação para o estado de foco
  const borderScale = useSharedValue(1);
  const borderColor = useSharedValue(colors.inputBorder);
  
  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    transform: [{ scale: borderScale.value }],
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderScale.value = withTiming(1.02, { duration: 200 });
    borderColor.value = withTiming(colors.inputFocus, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderScale.value = withTiming(1, { duration: 200 });
    borderColor.value = withTiming(
      error ? colors.error : colors.inputBorder, 
      { duration: 200 }
    );
  };

  const isPassword = type === 'password';
  const keyboardType = type === 'email' ? 'email-address' : 'default';
  const secureTextEntry = isPassword && !showPassword;

  return (
    <Animated.View entering={FadeInDown.delay(100).springify()}>
      {/* Label */}
      <Text 
        style={{
          fontSize: 14,
          fontWeight: '500',
          color: colors.textPrimary,
          marginBottom: 8,
          fontFamily: 'Inter',
        }}
      >
        {label}
      </Text>

      {/* Container do Input */}
      <Animated.View
        style={[
          {
            position: 'relative',
            borderWidth: 1,
            borderRadius: 12,
            backgroundColor: colors.cardBg,
          },
          animatedBorderStyle,
          error && { borderColor: colors.error },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Ícone opcional */}
          {icon && (
            <View style={{ paddingLeft: 16 }}>
              <Ionicons 
                name={icon} 
                size={20} 
                color={colors.textSecondary} 
              />
            </View>
          )}

          {/* Input */}
          <TextInput
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: icon ? 12 : 16,
              fontSize: 16,
              fontFamily: 'Inter',
              color: colors.textPrimary,
            }}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={props.placeholder}
            placeholderTextColor={colors.textSecondary}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            autoCapitalize={type === 'email' ? 'none' : 'sentences'}
            {...props}
          />

          {/* Botão para mostrar/ocultar senha */}
          {isPassword && (
            <TouchableOpacity
              style={{ paddingRight: 16, paddingLeft: 8 }}
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Indicador de foco */}
        {isFocused && !error && (
          <Animated.View
            entering={FadeInDown.duration(200)}
            style={{
              position: 'absolute',
              bottom: -2,
              left: -1,
              right: -1,
              height: 2,
              backgroundColor: colors.inputFocus,
              borderRadius: 1,
              opacity: 0.6,
            }}
          />
        )}
      </Animated.View>

      {/* Mensagem de erro */}
      {error && (
        <Animated.View 
          entering={FadeInDown.delay(50).springify()}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginTop: 6 
          }}
        >
          <Ionicons 
            name="alert-circle" 
            size={16} 
            color={colors.error} 
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              fontSize: 14,
              color: colors.error,
              fontFamily: 'Inter',
              fontWeight: '400',
            }}
          >
            {error}
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

