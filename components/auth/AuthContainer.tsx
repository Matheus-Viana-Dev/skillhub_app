import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    ViewStyle
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrganicShapes from './OrganicShapes';

interface AuthContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  showHeader?: boolean;
}

export default function AuthContainer({ 
  children, 
  style,
  showHeader = true 
}: AuthContainerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // Valores animados para o efeito de entrada
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  React.useEffect(() => {
    // Animação de entrada suave
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.8, 0.25, 1),
    });
    scale.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.8, 0.25, 1),
    });
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View 
      style={{
        flex: 1,
        backgroundColor: colors.pageBg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Formas orgânicas de fundo */}
      <OrganicShapes position="top" />
      <OrganicShapes position="bottom" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: showHeader ? insets.top + 40 : insets.top + 20,
            paddingBottom: insets.bottom + 40,
            minHeight: '100%',
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Container principal com conteúdo */}
          <Animated.View
            style={[
              {
                width: '100%',
                maxWidth: 400,
                paddingHorizontal: 32,
                paddingVertical: 40,
                position: 'relative',
                zIndex: 1,
              },
              animatedContainerStyle,
              style,
            ]}
          >
            {children}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}