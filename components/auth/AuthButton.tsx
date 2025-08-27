import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View
} from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function AuthButton({
  title,
  variant = 'primary',
  loading = false,
  icon,
  fullWidth = true,
  onPress,
  disabled,
  style,
  ...props
}: AuthButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Animações aprimoradas
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const shadowElevation = useSharedValue(5);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const animatedShadowStyle = useAnimatedStyle(() => ({
    elevation: shadowElevation.value,
    shadowOpacity: shadowElevation.value / 20,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
    shadowElevation.value = withTiming(12, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withTiming(1.02, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    shadowElevation.value = withTiming(8, { duration: 200 });
  };

  const handlePress = (event: any) => {
    if (!loading && !disabled && onPress) {
      // Feedback tátil através da animação
      scale.value = withSequence(
        withTiming(0.95, { duration: 50 }),
        withTiming(1, { duration: 150 })
      );
      
      runOnJS(onPress)(event);
    }
  };

  // Estilos baseados na variante
  const getButtonStyles = () => {
    const baseStyles = {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: 50,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: disabled || loading ? colors.textSecondary : colors.buttonPrimary,
          shadowColor: colorScheme === 'light' ? colors.buttonPrimary : '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colorScheme === 'light' ? 0.3 : 0.2,
          shadowRadius: 14,
          elevation: 8,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.inputBorder,
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyles;
    }
  };

  const getTextStyles = () => {
    const baseStyles = {
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          color: colors.buttonText,
        };
      case 'secondary':
        return {
          ...baseStyles,
          color: colors.textPrimary,
        };
      case 'ghost':
        return {
          ...baseStyles,
          color: colors.link,
          fontWeight: '500' as const,
        };
      default:
        return baseStyles;
    }
  };

  const buttonStyles = getButtonStyles();
  const textStyles = getTextStyles();

  return (
      <AnimatedTouchableOpacity
        style={[
          buttonStyles,
          fullWidth && { width: '100%' },
          animatedStyle,
          animatedShadowStyle,
          style,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...props}
      >
      {loading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator 
            size="small" 
            color={colors.buttonText}
            style={{ marginRight: 8 }}
          />
          <Text style={[textStyles, { opacity: 0.8 }]}>
            Carregando...
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={textStyles.color}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={textStyles}>
            {title}
          </Text>
        </View>
      )}
      </AnimatedTouchableOpacity>
  );
}


