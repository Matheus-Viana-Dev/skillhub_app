import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function AnimatedBackground() {
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    // Animação contínua do gradiente
    animationProgress.value = withRepeat(
      withTiming(1, {
        duration: 15000, // 15 segundos para um ciclo completo
      }),
      -1, // Repetir infinitamente
      true // Reverter (vai e volta)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    // Interpolar a posição do gradiente
    const translateX = interpolate(
      animationProgress.value,
      [0, 1],
      [-width * 0.5, width * 0.5]
    );
    
    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [-height * 0.3, height * 0.3]
    );

    return {
      transform: [
        { translateX },
        { translateY },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={[
          '#0A1A2F', // Azul Marinho Escuro
          '#1E3A8A', // Azul Médio
          '#111827', // Fundo Escuro
          '#0A1A2F', // Volta para o início para continuidade
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.gradient}
      />
      
      {/* Gradiente secundário para mais profundidade */}
      <LinearGradient
        colors={[
          'rgba(30, 58, 138, 0.3)', // #1E3A8A com transparência
          'rgba(10, 26, 47, 0.5)',  // #0A1A2F com transparência
          'rgba(17, 24, 39, 0.4)',  // #111827 com transparência
        ]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.gradient, styles.overlayGradient]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -height * 0.5,
    left: -width * 0.5,
    width: width * 2,
    height: height * 2,
    zIndex: -1,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlayGradient: {
    opacity: 0.8,
  },
});
