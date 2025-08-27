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
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.pageBg,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: showHeader ? insets.top + 20 : insets.top,
            paddingBottom: insets.bottom + 20,
            minHeight: '100%',
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Container principal com animação */}
          <Animated.View
            entering={FadeInUp.duration(600).springify()}
            style={[
              {
                width: '100%',
                maxWidth: 400,
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 32,
                // Sombra apenas no modo claro
                ...(colorScheme === 'light' && {
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.05,
                  shadowRadius: 12,
                  elevation: 5,
                }),
              },
              style,
            ]}
          >
            {children}
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

