import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface AuthLinkProps extends TouchableOpacityProps {
  title: string;
  size?: 'small' | 'medium' | 'large';
  underline?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function AuthLink({
  title,
  size = 'medium',
  underline = false,
  onPress,
  style,
  ...props
}: AuthLinkProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Animação para o hover/press
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    opacity.value = withTiming(0.7, { duration: 100 });
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    opacity.value = withTiming(1, { duration: 150 });
    scale.value = withTiming(1, { duration: 150 });
  };

  // Estilos baseados no tamanho
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[
        {
          alignSelf: 'flex-start',
        },
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      {...props}
    >
      <Text
        style={{
          fontSize: getFontSize(),
          fontFamily: 'Inter',
          fontWeight: '500',
          color: colors.link,
          textDecorationLine: underline ? 'underline' : 'none',
        }}
      >
        {title}
      </Text>
    </AnimatedTouchableOpacity>
  );
}