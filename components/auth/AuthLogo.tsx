import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Image, Text } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

interface AuthLogoProps {
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  logoVariant?: '1' | '2' | '6';
}

export default function AuthLogo({ 
  showText = true, 
  size = 'large',
  logoVariant = '1'
}: AuthLogoProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Tamanhos baseados na prop size
  const getSizes = () => {
    switch (size) {
      case 'small':
        return { logo: 60, title: 24, subtitle: 14 };
      case 'medium':
        return { logo: 80, title: 32, subtitle: 16 };
      case 'large':
        return { logo: 100, title: 42, subtitle: 18 };
      default:
        return { logo: 100, title: 42, subtitle: 18 };
    }
  };

  const sizes = getSizes();
  
  // Função para obter a imagem baseada na variante
  const getLogoSource = () => {
    switch (logoVariant) {
      case '1':
        return require('@/assets/images/iloveimg-background-removed (2)/1.png');
      case '2':
        return require('@/assets/images/iloveimg-background-removed (2)/2.png');
      case '6':
        return require('@/assets/images/iloveimg-background-removed (2)/6.png');
      default:
        return require('@/assets/images/iloveimg-background-removed (2)/1.png');
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(300).springify()}
      style={{
        alignItems: 'center',
        marginBottom: showText ? 40 : 20,
      }}
    >
      {/* Logo Image */}
      <Animated.View
        entering={ZoomIn.delay(400).springify()}
        style={{
          marginBottom: showText ? 16 : 0,
          shadowColor: colors.buttonPrimary,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
        <Image
          source={getLogoSource()}
          style={{
            width: sizes.logo,
            height: sizes.logo,
            borderRadius: 20,
          }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Texto do logo */}
      {showText && (
        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={{ alignItems: 'center' }}
        >
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
              maxWidth: 220,
            }}
          >
            Desenvolva suas habilidades
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}


