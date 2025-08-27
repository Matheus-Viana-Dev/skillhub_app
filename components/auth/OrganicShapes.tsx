import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Dimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface OrganicShapesProps {
  position: 'top' | 'bottom';
}

export default function OrganicShapes({ position }: OrganicShapesProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // SVG para forma superior
  const TopShape = () => (
    <Svg
      width={width}
      height={height * 0.4}
      viewBox={`0 0 ${width} ${height * 0.4}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      {/* Forma principal superior */}
      <Path
        d={`M0,0 L${width},0 L${width},${height * 0.25} 
            C${width * 0.8},${height * 0.28} ${width * 0.6},${height * 0.22} ${width * 0.4},${height * 0.26}
            C${width * 0.25},${height * 0.28} ${width * 0.1},${height * 0.24} 0,${height * 0.27} Z`}
        fill={colors.shape1}
        opacity={0.7}
      />
      
      {/* Forma secundária superior */}
      <Path
        d={`M0,0 L${width},0 L${width},${height * 0.18} 
            C${width * 0.75},${height * 0.2} ${width * 0.5},${height * 0.16} ${width * 0.3},${height * 0.19}
            C${width * 0.2},${height * 0.2} ${width * 0.08},${height * 0.17} 0,${height * 0.19} Z`}
        fill={colors.shape2}
        opacity={0.6}
      />
    </Svg>
  );

  // SVG para forma inferior
  const BottomShape = () => (
    <Svg
      width={width}
      height={height * 0.35}
      viewBox={`0 0 ${width} ${height * 0.35}`}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      {/* Forma principal inferior */}
      <Path
        d={`M0,${height * 0.35} L${width},${height * 0.35} L${width},${height * 0.12}
            C${width * 0.8},${height * 0.09} ${width * 0.6},${height * 0.15} ${width * 0.4},${height * 0.11}
            C${width * 0.25},${height * 0.09} ${width * 0.1},${height * 0.13} 0,${height * 0.1} Z`}
        fill={colors.shape1}
        opacity={0.7}
      />
      
      {/* Forma secundária inferior */}
      <Path
        d={`M0,${height * 0.35} L${width},${height * 0.35} L${width},${height * 0.2}
            C${width * 0.75},${height * 0.17} ${width * 0.5},${height * 0.23} ${width * 0.3},${height * 0.19}
            C${width * 0.2},${height * 0.17} ${width * 0.08},${height * 0.21} 0,${height * 0.18} Z`}
        fill={colors.shape2}
        opacity={0.6}
      />
    </Svg>
  );

  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
      {position === 'top' ? <TopShape /> : <BottomShape />}
    </View>
  );
}
