import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AuthLogoProps {
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function AuthLogo({ 
  showText = true, 
  size = 'large' 
}: AuthLogoProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Tamanhos baseados na prop size
  const getSizes = () => {
    switch (size) {
      case 'small':
        return { icon: 32, title: 24, subtitle: 14 };
      case 'medium':
        return { icon: 48, title: 32, subtitle: 16 };
      case 'large':
        return { icon: 64, title: 42, subtitle: 18 };
      default:
        return { icon: 64, title: 42, subtitle: 18 };
    }
  };

  const sizes = getSizes();

  return (
    <Animated.View
      entering={FadeInDown.delay(300).springify()}
      style={{
        alignItems: 'center',
        marginBottom: showText ? 40 : 20,
      }}
    >
      {/* Ícone/Logo */}
      <View
        style={{
          width: sizes.icon + 20,
          height: sizes.icon + 20,
          borderRadius: (sizes.icon + 20) / 2,
          backgroundColor: colors.buttonPrimary,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: showText ? 16 : 0,
          shadowColor: colors.buttonPrimary,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons
          name="school"
          size={sizes.icon}
          color={colors.buttonText}
        />
      </View>

      {/* Texto do logo */}
      {showText && (
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: sizes.title,
              fontFamily: 'Inter',
              fontWeight: '700',
              color: colors.textPrimary,
              marginBottom: 4,
              letterSpacing: -0.5,
            }}
          >
            SkillHub
          </Text>
          <Text
            style={{
              fontSize: sizes.subtitle,
              fontFamily: 'Inter',
              fontWeight: '400',
              color: colors.textSecondary,
              textAlign: 'center',
              maxWidth: 200,
            }}
          >
            Desenvolva suas habilidades
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

