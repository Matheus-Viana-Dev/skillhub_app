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
    cancelAnimation,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
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
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Animações aprimoradas para o estado de foco
  const borderScale = useSharedValue(1);
  const borderColor = useSharedValue(colors.inputBorder);
  const glowOpacity = useSharedValue(0);
  const labelScale = useSharedValue(1);
  const cursorBlinkOpacity = useSharedValue(0);
  
  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    transform: [{ scale: borderScale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const animatedLabelStyle = useAnimatedStyle(() => ({
    transform: [{ scale: labelScale.value }],
  }));

  const animatedCursorBlinkStyle = useAnimatedStyle(() => ({
    opacity: cursorBlinkOpacity.value,
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderScale.value = withTiming(1.02, { duration: 200 });
    borderColor.value = withTiming(colors.inputFocus, { duration: 200 });
    glowOpacity.value = withTiming(1, { duration: 200 });
    labelScale.value = withTiming(1.05, { duration: 200 });
    
    // Animação de piscar do cursor personalizado
    cursorBlinkOpacity.value = withRepeat(
      withTiming(1, { duration: 500 }),
      -1,
      true
    );
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderScale.value = withTiming(1, { duration: 200 });
    borderColor.value = withTiming(
      error ? colors.error : colors.inputBorder, 
      { duration: 200 }
    );
    glowOpacity.value = withTiming(0, { duration: 200 });
    labelScale.value = withTiming(1, { duration: 200 });
    
    // Parar animação de piscar do cursor
    cancelAnimation(cursorBlinkOpacity);
    cursorBlinkOpacity.value = withTiming(0, { duration: 200 });
  };

  const isPassword = type === 'password';
  const keyboardType = type === 'email' ? 'email-address' : 'default';
  const secureTextEntry = isPassword && !showPassword;

  return (
    <View>
      {/* Label com animação */}
      <Animated.Text 
        style={[
          {
            fontSize: 14,
            fontWeight: '500',
            color: colors.textPrimary,
            marginBottom: 8,
            fontFamily: 'Inter',
          },
          animatedLabelStyle,
        ]}
      >
        {label}
      </Animated.Text>

      {/* Container do Input com estilo underline */}
      <View style={{ position: 'relative', marginBottom: 8 }}>
        <Animated.View
          style={[
            {
              position: 'relative',
              backgroundColor: 'transparent',
            },
            animatedBorderStyle,
          ]}
        >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 8 }}>
          {/* Ícone opcional */}
          {icon && (
            <View style={{ marginRight: 12 }}>
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
              paddingVertical: 8,
              fontSize: 16,
              fontFamily: 'Inter',
              color: colors.textPrimary,
              backgroundColor: 'transparent',
              borderWidth: 0,
              outline: 'none',
            }}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSelectionChange={(event) => {
              setCursorPosition(event.nativeEvent.selection.start);
            }}
            placeholder={props.placeholder}
            placeholderTextColor={colors.textSecondary}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            autoCapitalize={type === 'email' ? 'none' : 'sentences'}
            selectionColor={colors.cursor}
            cursorColor={colors.cursor}
            caretHidden={false}
            textAlignVertical="center"
            {...props}
          />

          {/* Botão para mostrar/ocultar senha */}
          {isPassword && (
            <TouchableOpacity
              style={{ marginLeft: 8 }}
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

        {/* Linha underline */}
        <View 
          style={{
            height: 1,
            backgroundColor: error ? colors.error : colors.inputBorder,
            position: 'relative',
          }}
        />
        
        {/* Linha de foco animada */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 2,
              backgroundColor: colors.inputFocus,
              transformOrigin: 'center',
            },
            {
              transform: [{ scaleX: isFocused ? 1 : 0 }],
              width: '100%',
            },
          ]}
        />


        </Animated.View>
      </View>

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
    </View>
  );
}


