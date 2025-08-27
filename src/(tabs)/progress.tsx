import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
    Award,
    BookOpen,
    Calendar,
    Clock,
    Target,
    TrendingUp
} from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    FadeInUp
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock data para o progresso
const weeklyStats = [
  { day: 'Seg', hours: 2.5, target: 3 },
  { day: 'Ter', hours: 1.8, target: 3 },
  { day: 'Qua', hours: 3.2, target: 3 },
  { day: 'Qui', hours: 2.1, target: 3 },
  { day: 'Sex', hours: 2.8, target: 3 },
  { day: 'Sáb', hours: 1.5, target: 3 },
  { day: 'Dom', hours: 0.8, target: 3 },
];

const achievements = [
  {
    id: 1,
    title: 'Primeira Semana',
    description: 'Complete sua primeira semana de estudos',
    icon: 'calendar',
    earned: true,
    date: '2024-01-15',
  },
  {
    id: 2,
    title: 'Meta Diária',
    description: 'Atinja sua meta diária por 5 dias seguidos',
    icon: 'target',
    earned: true,
    date: '2024-01-20',
  },
  {
    id: 3,
    title: 'Estudante Dedicado',
    description: 'Complete 10 horas de estudo em uma semana',
    icon: 'book',
    earned: false,
    progress: 65,
  },
  {
    id: 4,
    title: 'Curso Concluído',
    description: 'Finalize seu primeiro curso',
    icon: 'award',
    earned: false,
    progress: 80,
  },
];

const activeCourses = [
  {
    id: 1,
    title: 'React Native Avançado',
    progress: 65,
    nextLesson: 'State Management com Redux',
    timeSpent: '8h 30min',
    totalTime: '12h 30min',
  },
  {
    id: 2,
    title: 'Design System com Figma',
    progress: 30,
    nextLesson: 'Criando Tokens de Design',
    timeSpent: '2h 45min',
    totalTime: '8h 15min',
  },
  {
    id: 3,
    title: 'TypeScript Fundamentals',
    progress: 45,
    nextLesson: 'Tipos Avançados',
    timeSpent: '6h 15min',
    totalTime: '15h 45min',
  },
];

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const totalHoursThisWeek = weeklyStats.reduce((sum, day) => sum + day.hours, 0);
  const averageDaily = totalHoursThisWeek / 7;

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar': return Calendar;
      case 'target': return Target;
      case 'book': return BookOpen;
      case 'award': return Award;
      default: return Award;
    }
  };

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
            Seu Progresso
          </Text>
          <Text style={{
            fontSize: 16,
            fontFamily: 'Inter',
            fontWeight: '400',
            color: colors.textSecondary,
          }}>
            Acompanhe sua evolução nos estudos
          </Text>
        </Animated.View>

        {/* Estatísticas gerais */}
        <Animated.View
          entering={FadeInRight.delay(200).springify()}
          style={{
            paddingHorizontal: 20,
            marginBottom: 32,
          }}
        >
          <View style={{
            flexDirection: 'row',
            gap: 12,
          }}>
            {/* Horas esta semana */}
            <View style={{
              flex: 1,
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 16,
              ...(colorScheme === 'light' && {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 3,
              }),
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <Clock
                  size={18}
                  color={colors.buttonPrimary}
                  strokeWidth={1.5}
                />
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  color: colors.textSecondary,
                  marginLeft: 6,
                }}>
                  Esta semana
                </Text>
              </View>
              <Text style={{
                fontSize: 24,
                fontFamily: 'Inter',
                fontWeight: '700',
                color: colors.textPrimary,
                marginBottom: 4,
              }}>
                {totalHoursThisWeek.toFixed(1)}h
              </Text>
              <Text style={{
                fontSize: 12,
                fontFamily: 'Inter',
                fontWeight: '400',
                color: colors.textSecondary,
              }}>
                Média: {averageDaily.toFixed(1)}h/dia
              </Text>
            </View>

            {/* Sequência */}
            <View style={{
              flex: 1,
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 16,
              ...(colorScheme === 'light' && {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 3,
              }),
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <TrendingUp
                  size={18}
                  color={colors.buttonPrimary}
                  strokeWidth={1.5}
                />
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  color: colors.textSecondary,
                  marginLeft: 6,
                }}>
                  Sequência
                </Text>
              </View>
              <Text style={{
                fontSize: 24,
                fontFamily: 'Inter',
                fontWeight: '700',
                color: colors.textPrimary,
                marginBottom: 4,
              }}>
                7 dias
              </Text>
              <Text style={{
                fontSize: 12,
                fontFamily: 'Inter',
                fontWeight: '400',
                color: colors.textSecondary,
              }}>
                Recorde pessoal!
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Gráfico semanal */}
        <Animated.View
          entering={FadeInUp.delay(300).springify()}
          style={{
            paddingHorizontal: 20,
            marginBottom: 32,
          }}
        >
          <Text style={{
            fontSize: 20,
            fontFamily: 'Inter',
            fontWeight: '600',
            color: colors.textPrimary,
            marginBottom: 16,
          }}>
            Atividade Semanal
          </Text>

          <View style={{
            backgroundColor: colors.cardBg,
            borderRadius: 16,
            padding: 20,
            ...(colorScheme === 'light' && {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }),
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'end',
              justifyContent: 'space-between',
              height: 120,
              marginBottom: 12,
            }}>
              {weeklyStats.map((day, index) => {
                const barHeight = (day.hours / 4) * 100; // Max 4 horas = 100%
                const targetHeight = (day.target / 4) * 100;
                
                return (
                  <View key={day.day} style={{ alignItems: 'center', flex: 1 }}>
                    <View style={{
                      width: 20,
                      height: 100,
                      backgroundColor: colors.inputBorder,
                      borderRadius: 10,
                      position: 'relative',
                      marginBottom: 8,
                    }}>
                      {/* Target line */}
                      <View style={{
                        position: 'absolute',
                        top: 100 - targetHeight,
                        left: -2,
                        right: -2,
                        height: 2,
                        backgroundColor: colors.textSecondary,
                        borderRadius: 1,
                      }} />
                      
                      {/* Progress bar */}
                      <View style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${Math.min(barHeight, 100)}%`,
                        backgroundColor: day.hours >= day.target 
                          ? colors.buttonPrimary 
                          : colors.buttonPrimaryHover,
                        borderRadius: 10,
                      }} />
                    </View>
                    
                    <Text style={{
                      fontSize: 12,
                      fontFamily: 'Inter',
                      fontWeight: '500',
                      color: colors.textSecondary,
                    }}>
                      {day.day}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: colors.buttonPrimary,
                  borderRadius: 6,
                  marginRight: 6,
                }} />
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: '400',
                  color: colors.textSecondary,
                }}>
                  Horas estudadas
                </Text>
              </View>
              
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <View style={{
                  width: 12,
                  height: 2,
                  backgroundColor: colors.textSecondary,
                  marginRight: 6,
                }} />
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: '400',
                  color: colors.textSecondary,
                }}>
                  Meta diária
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Cursos ativos */}
        <Animated.View
          entering={FadeInUp.delay(400).springify()}
          style={{
            paddingHorizontal: 20,
            marginBottom: 32,
          }}
        >
          <Text style={{
            fontSize: 20,
            fontFamily: 'Inter',
            fontWeight: '600',
            color: colors.textPrimary,
            marginBottom: 16,
          }}>
            Cursos em Andamento
          </Text>

          <View style={{ gap: 12 }}>
            {activeCourses.map((course, index) => (
              <Animated.View
                key={course.id}
                entering={FadeInUp.delay(500 + index * 100).springify()}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: 12,
                    padding: 16,
                    ...(colorScheme === 'light' && {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 8,
                      elevation: 3,
                    }),
                  }}
                  activeOpacity={0.9}
                >
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 12,
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 16,
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
                        Próximo: {course.nextLesson}
                      </Text>
                    </View>

                    <Text style={{
                      fontSize: 14,
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      color: colors.buttonPrimary,
                    }}>
                      {course.progress}%
                    </Text>
                  </View>

                  {/* Progress bar */}
                  <View style={{
                    height: 6,
                    backgroundColor: colors.inputBorder,
                    borderRadius: 3,
                    marginBottom: 8,
                  }}>
                    <View style={{
                      width: `${course.progress}%`,
                      height: '100%',
                      backgroundColor: colors.buttonPrimary,
                      borderRadius: 3,
                    }} />
                  </View>

                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontFamily: 'Inter',
                      fontWeight: '400',
                      color: colors.textSecondary,
                    }}>
                      {course.timeSpent} de {course.totalTime}
                    </Text>

                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.buttonPrimary,
                        paddingHorizontal: 16,
                        paddingVertical: 6,
                        borderRadius: 6,
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        color: colors.buttonText,
                      }}>
                        Continuar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Conquistas */}
        <Animated.View
          entering={FadeInUp.delay(600).springify()}
          style={{
            paddingHorizontal: 20,
          }}
        >
          <Text style={{
            fontSize: 20,
            fontFamily: 'Inter',
            fontWeight: '600',
            color: colors.textPrimary,
            marginBottom: 16,
          }}>
            Conquistas
          </Text>

          <View style={{ gap: 12 }}>
            {achievements.map((achievement, index) => {
              const IconComponent = getAchievementIcon(achievement.icon);
              
              return (
                <Animated.View
                  key={achievement.id}
                  entering={FadeInUp.delay(700 + index * 100).springify()}
                >
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: colors.cardBg,
                    borderRadius: 12,
                    padding: 16,
                    opacity: achievement.earned ? 1 : 0.6,
                    ...(colorScheme === 'light' && {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 8,
                      elevation: 3,
                    }),
                  }}>
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: achievement.earned 
                        ? colors.buttonPrimary 
                        : colors.inputBorder,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 16,
                    }}>
                      <IconComponent
                        size={24}
                        color={achievement.earned 
                          ? colors.buttonText 
                          : colors.textSecondary}
                        strokeWidth={1.5}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        color: colors.textPrimary,
                        marginBottom: 4,
                      }}>
                        {achievement.title}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        color: colors.textSecondary,
                        marginBottom: achievement.progress ? 8 : 0,
                      }}>
                        {achievement.description}
                      </Text>

                      {achievement.progress && (
                        <View style={{
                          height: 4,
                          backgroundColor: colors.inputBorder,
                          borderRadius: 2,
                        }}>
                          <View style={{
                            width: `${achievement.progress}%`,
                            height: '100%',
                            backgroundColor: colors.buttonPrimary,
                            borderRadius: 2,
                          }} />
                        </View>
                      )}
                    </View>

                    {achievement.earned && achievement.date && (
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        color: colors.textSecondary,
                      }}>
                        {new Date(achievement.date).toLocaleDateString('pt-BR')}
                      </Text>
                    )}
                  </View>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

