import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface AuthCheckboxProps {
  checked: boolean;
  onPress: () => void;
  label: string;
  error?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function AuthCheckbox({
  checked,
  onPress,
  label,
  error,
}: AuthCheckboxProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Animações
  const scale = useSharedValue(1);
  const checkOpacity = useSharedValue(checked ? 1 : 0);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const checkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
  }));

  const handlePress = () => {
    // Animação de feedback
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // Animação do check
    checkOpacity.value = withTiming(checked ? 0 : 1, { duration: 200 });
    
    onPress();
  };

  React.useEffect(() => {
    checkOpacity.value = withTiming(checked ? 1 : 0, { duration: 200 });
  }, [checked, checkOpacity]);

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
        activeOpacity={0.7}
      >
        {/* Checkbox */}
        <AnimatedTouchableOpacity
          style={[
            {
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: checked ? colors.buttonPrimary : colors.inputBorder,
              backgroundColor: checked ? colors.buttonPrimary : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
              marginTop: 2,
            },
            animatedStyle,
          ]}
          onPress={handlePress}
        >
          <Animated.View style={checkAnimatedStyle}>
            <Ionicons
              name="checkmark"
              size={14}
              color={colors.buttonText}
            />
          </Animated.View>
        </AnimatedTouchableOpacity>

        {/* Label */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter',
              fontWeight: '400',
              color: colors.textSecondary,
              lineHeight: 20,
            }}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Error message */}
      {error && (
        <Text
          style={{
            fontSize: 14,
            color: colors.error,
            fontFamily: 'Inter',
            fontWeight: '400',
            marginTop: 8,
            marginLeft: 32,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
