import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useLinkBuilder } from '@react-navigation/native';
import React from 'react';
import {
    Pressable,
    Text,
    View
} from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Configuração dos ícones para cada rota
const TabIcons = {
  index: 'home',
  courses: 'shopping-bag',
  progress: 'chart-line',
  profile: 'user',
};

// Labels das abas
const TabLabels = {
  index: 'Home',
  courses: 'Produtos',
  progress: 'Pedidos',
  profile: 'Perfil',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TabButtonProps {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  colors: any;
}

function TabButton({ 
  routeName, 
  isFocused, 
  onPress, 
  onLongPress, 
  colors 
}: TabButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const iconName = TabIcons[routeName as keyof typeof TabIcons];
  const label = TabLabels[routeName as keyof typeof TabLabels];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };

  const handlePress = () => {
    // Animação de feedback
    scale.value = withSequence(
      withTiming(0.9, { duration: 50 }),
      withTiming(1, { duration: 150 })
    );
    onPress();
  };

  if (!iconName) return null;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
          paddingHorizontal: 4,
        },
        animatedStyle,
      ]}
    >
      {/* Ícone */}
      <View style={{ marginBottom: 4 }}>
        <FontAwesome5
          name={iconName}
          size={20}
          color={isFocused ? colors.buttonPrimary : colors.textSecondary}
          solid={isFocused}
        />
      </View>

      {/* Label */}
      <Text
        style={{
          fontSize: 11,
          fontFamily: 'Inter',
          fontWeight: isFocused ? '600' : '500',
          color: isFocused ? colors.buttonPrimary : colors.textSecondary,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export default function FloatingTabBar({ 
  state, 
  descriptors, 
  navigation 
}: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { buildHref } = useLinkBuilder();

  return (
    <Animated.View
      entering={FadeInUp.delay(300).springify()}
      style={{
        position: 'absolute',
        bottom: insets.bottom + 24,
        left: 16,
        right: 16,
        backgroundColor: colors.cardBg,
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        // Sombra no modo claro
        ...(colorScheme === 'light' && {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 10,
        }),
        // Borda sutil no modo escuro
        ...(colorScheme === 'dark' && {
          borderWidth: 1,
          borderColor: '#374151',
        }),
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabButton
            key={route.name}
            routeName={route.name}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            colors={colors}
          />
        );
      })}
    </Animated.View>
  );
}
