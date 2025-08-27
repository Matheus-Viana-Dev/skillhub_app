import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
    Clock,
    Filter,
    Search,
    Star,
    Users
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock data para os cursos
const categories = [
  'Todos',
  'Desenvolvimento',
  'Design',
  'Marketing',
  'Negócios',
  'Fotografia'
];

const courses = [
  {
    id: 1,
    title: 'React Native Completo',
    instructor: 'João Silva',
    rating: 4.8,
    students: 1234,
    duration: '15h 30min',
    price: 'R$ 199,90',
    level: 'Intermediário',
    category: 'Desenvolvimento',
    thumbnail: 'https://via.placeholder.com/300x180/1E3A8A/FFFFFF?text=React+Native',
  },
  {
    id: 2,
    title: 'Design System Avançado',
    instructor: 'Maria Santos',
    rating: 4.9,
    students: 856,
    duration: '12h 15min',
    price: 'R$ 149,90',
    level: 'Avançado',
    category: 'Design',
    thumbnail: 'https://via.placeholder.com/300x180/3B82F6/FFFFFF?text=Design+System',
  },
  {
    id: 3,
    title: 'TypeScript Fundamentals',
    instructor: 'Pedro Costa',
    rating: 4.7,
    students: 2156,
    duration: '18h 45min',
    price: 'R$ 179,90',
    level: 'Iniciante',
    category: 'Desenvolvimento',
    thumbnail: 'https://via.placeholder.com/300x180/1E3A8A/FFFFFF?text=TypeScript',
  },
  {
    id: 4,
    title: 'UX Research na Prática',
    instructor: 'Ana Lima',
    rating: 4.9,
    students: 1789,
    duration: '10h 20min',
    price: 'R$ 129,90',
    level: 'Intermediário',
    category: 'Design',
    thumbnail: 'https://via.placeholder.com/300x180/3B82F6/FFFFFF?text=UX+Research',
  },
];

export default function CoursesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'Todos' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colors.pageBg 
    }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 120, // Espaço para a floating tab bar
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: 20,
            marginBottom: 24,
          }}
        >
          <Text style={{
            fontSize: 28,
            fontFamily: 'Inter',
            fontWeight: '700',
            color: colors.textPrimary,
            marginBottom: 8,
          }}>
            Cursos
          </Text>
          <Text style={{
            fontSize: 16,
            fontFamily: 'Inter',
            fontWeight: '400',
            color: colors.textSecondary,
            marginBottom: 20,
          }}>
            Descubra novos conhecimentos
          </Text>

          {/* Barra de pesquisa */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: colors.inputBorder,
            }}>
              <Search
                size={20}
                color={colors.textSecondary}
                strokeWidth={1.5}
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="Buscar cursos..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontFamily: 'Inter',
                  color: colors.textPrimary,
                }}
              />
            </View>

            <TouchableOpacity
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: colors.cardBg,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.inputBorder,
              }}
              activeOpacity={0.7}
            >
              <Filter
                size={20}
                color={colors.textSecondary}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Categorias */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={{ marginBottom: 24 }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              gap: 12,
            }}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 24,
                  backgroundColor: selectedCategory === category 
                    ? colors.buttonPrimary 
                    : colors.cardBg,
                  borderWidth: 1,
                  borderColor: selectedCategory === category 
                    ? colors.buttonPrimary 
                    : colors.inputBorder,
                }}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 14,
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  color: selectedCategory === category 
                    ? colors.buttonText 
                    : colors.textPrimary,
                }}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Lista de cursos */}
        <Animated.View
          entering={FadeInUp.delay(300).springify()}
          style={{
            paddingHorizontal: 20,
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 18,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: colors.textPrimary,
            }}>
              {filteredCourses.length} cursos encontrados
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            {filteredCourses.map((course, index) => (
              <Animated.View
                key={course.id}
                entering={FadeInUp.delay(400 + index * 100).springify()}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: 16,
                    overflow: 'hidden',
                    ...(colorScheme === 'light' && {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 12,
                      elevation: 5,
                    }),
                  }}
                  activeOpacity={0.9}
                >
                  {/* Thumbnail */}
                  <Image
                    source={{ uri: course.thumbnail }}
                    style={{
                      width: '100%',
                      height: 200,
                      backgroundColor: colors.inputBorder,
                    }}
                    resizeMode="cover"
                  />

                  {/* Content */}
                  <View style={{ padding: 16 }}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 8,
                    }}>
                      <View style={{ flex: 1, marginRight: 12 }}>
                        <Text style={{
                          fontSize: 18,
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          color: colors.textPrimary,
                          marginBottom: 4,
                        }}>
                          {course.title}
                        </Text>
                        <Text style={{
                          fontSize: 14,
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          color: colors.textSecondary,
                        }}>
                          {course.instructor}
                        </Text>
                      </View>

                      <View style={{
                        backgroundColor: colors.buttonPrimary,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}>
                        <Text style={{
                          fontSize: 12,
                          fontFamily: 'Inter',
                          fontWeight: '500',
                          color: colors.buttonText,
                        }}>
                          {course.level}
                        </Text>
                      </View>
                    </View>

                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 12,
                      gap: 16,
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <Star
                          size={14}
                          color="#FFB800"
                          fill="#FFB800"
                        />
                        <Text style={{
                          fontSize: 14,
                          fontFamily: 'Inter',
                          fontWeight: '500',
                          color: colors.textPrimary,
                          marginLeft: 4,
                        }}>
                          {course.rating}
                        </Text>
                      </View>

                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <Users
                          size={14}
                          color={colors.textSecondary}
                          strokeWidth={1.5}
                        />
                        <Text style={{
                          fontSize: 14,
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          color: colors.textSecondary,
                          marginLeft: 4,
                        }}>
                          {course.students}
                        </Text>
                      </View>

                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <Clock
                          size={14}
                          color={colors.textSecondary}
                          strokeWidth={1.5}
                        />
                        <Text style={{
                          fontSize: 14,
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          color: colors.textSecondary,
                          marginLeft: 4,
                        }}>
                          {course.duration}
                        </Text>
                      </View>
                    </View>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontSize: 20,
                        fontFamily: 'Inter',
                        fontWeight: '700',
                        color: colors.buttonPrimary,
                      }}>
                        {course.price}
                      </Text>

                      <TouchableOpacity
                        style={{
                          backgroundColor: colors.buttonPrimary,
                          paddingHorizontal: 24,
                          paddingVertical: 10,
                          borderRadius: 8,
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={{
                          fontSize: 14,
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          color: colors.buttonText,
                        }}>
                          Inscrever-se
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

