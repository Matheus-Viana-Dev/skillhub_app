import { NotificationModal } from '@/components/modals';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNotifications } from '@/hooks/useNotifications';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInLeft,
    FadeInRight,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Produtos em destaque - MMExpress
const featuredProducts = [
  {
    id: 1,
    name: 'TSCONTROL',
    description: 'Software completo de gestão para pequenas empresas',
    price: 297.00,
    originalPrice: 397.00,
    discount: 25,
    rating: 4.9,
    reviews: 847,
    image: 'https://via.placeholder.com/300x300/1E3A8A/FFFFFF?text=TSCONTROL',
    badge: 'Bestseller',
    inStock: true,
    features: ['Controle financeiro', 'Gestão de estoque', 'Notas fiscais', 'Relatórios'],
    cta: 'Solicitar demonstração',
  },
  {
    id: 2,
    name: 'TECTALK',
    description: 'Plataforma completa de gestão de chamados e tickets',
    price: 197.00,
    originalPrice: 247.00,
    discount: 20,
    rating: 4.8,
    reviews: 623,
    image: 'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=TECTALK',
    badge: 'Popular',
    inStock: true,
    features: ['WhatsApp/Telegram', 'IA para respostas', 'Métricas', 'Redes sociais'],
    cta: 'Melhorar atendimento',
  },
  {
    id: 3,
    name: 'TSCONSTRUCT',
    description: 'Software especializado para construtoras',
    price: 497.00,
    originalPrice: 597.00,
    discount: 17,
    rating: 4.7,
    reviews: 234,
    image: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=TSCONSTRUCT',
    badge: 'Especializado',
    inStock: true,
    features: ['Gestão por projeto', 'Controle investidores', 'Dashboards', 'Cronogramas'],
    cta: 'Conhecer solução',
  },
];

// Categorias de serviços com Font Awesome
const categories = [
  { id: 1, name: 'Gestão Empresarial', icon: 'briefcase', iconSet: 'FontAwesome5', color: '#1E3A8A' },
  { id: 2, name: 'Agentes de IA', icon: 'robot', iconSet: 'FontAwesome5', color: '#7C3AED' },
  { id: 3, name: 'Atendimento', icon: 'comments', iconSet: 'FontAwesome5', color: '#059669' },
  { id: 4, name: 'Construção', icon: 'hard-hat', iconSet: 'FontAwesome5', color: '#DC2626' },
  { id: 5, name: 'Análise Crédito', icon: 'chart-bar', iconSet: 'FontAwesome5', color: '#EA580C' },
  { id: 6, name: 'Certificação', icon: 'certificate', iconSet: 'FontAwesome5', color: '#DB2777' },
];

// Serviços populares - MMExpress
const popularProducts = [
  {
    id: 4,
    name: 'Secretária Virtual',
    price: 147.00,
    rating: 4.6,
    reviews: 456,
    image: 'https://via.placeholder.com/150x150/6366F1/FFFFFF?text=Virtual',
    inStock: true,
    description: 'Assistente que agenda e organiza automaticamente',
    cta: 'Contratar secretária',
  },
  {
    id: 5,
    name: 'Agente Instagram',
    price: 97.00,
    rating: 4.8,
    reviews: 787,
    image: 'https://via.placeholder.com/150x150/8B5CF6/FFFFFF?text=Instagram',
    inStock: true,
    description: 'Automatize respostas e interações no Instagram',
    cta: 'Potencializar Instagram',
  },
  {
    id: 6,
    name: 'Jingles com IA',
    price: 197.00,
    rating: 4.7,
    reviews: 324,
    image: 'https://via.placeholder.com/150x150/06B6D4/FFFFFF?text=Music',
    inStock: true,
    description: 'Trilhas personalizadas para sua marca',
    cta: 'Criar jingle',
  },
  {
    id: 7,
    name: 'Análise de Crédito',
    price: 67.00,
    rating: 4.9,
    reviews: 1247,
    image: 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=Credit',
    inStock: true,
    description: 'Relatórios de comportamento financeiro',
    cta: 'Consultar CPF/CNPJ',
  },
];

// Ofertas relâmpago - MMExpress
const flashOffers = [
  {
    id: 8,
    name: 'Persona Digital',
    price: 397.00,
    originalPrice: 597.00,
    discount: 33,
    timeLeft: '2h 15m',
    image: 'https://via.placeholder.com/200x200/EF4444/FFFFFF?text=Persona',
    soldCount: 47,
    totalStock: 100,
    description: 'Avatar personalizado para anúncios e vídeos',
    cta: 'Criar persona digital',
  },
  {
    id: 9,
    name: 'MMCert - Certificado Digital',
    price: 147.00,
    originalPrice: 197.00,
    discount: 25,
    timeLeft: '4h 32m',
    image: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=MMCert',
    soldCount: 23,
    totalStock: 50,
    description: 'Assinatura eletrônica com validade jurídica',
    cta: 'Adquirir certificado',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const [cartCount, setCartCount] = useState(3);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  
  // Hook de notificações
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const addToCart = (productId: number) => {
    setCartCount(prev => prev + 1);
    // Implementar lógica de adicionar ao carrinho
    console.log('Produto adicionado ao carrinho:', productId);
  };

  // Saudação dinâmica baseada na hora
  const getDynamicGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return { greeting: 'Bom dia!', message: 'Comece bem o dia com nossas soluções' };
    } else if (currentHour >= 12 && currentHour < 18) {
      return { greeting: 'Boa tarde!', message: 'Descubra produtos incríveis' };
    } else {
      return { greeting: 'Boa noite!', message: 'Explore nossas soluções empresariais' };
    }
  };

  const { greeting, message } = getDynamicGreeting();

  // Animação pulsante para a logo
  const logoScale = useSharedValue(1);

  React.useEffect(() => {
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

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
        {/* Header Dinâmico com Logo */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: 20,
            marginBottom: 24,
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            {/* Logo e Saudação */}
            <View style={{ flex: 1 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}>
                {/* Logo SkillHub Animada */}
                <Animated.View style={[
                  {
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: colors.buttonPrimary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                    ...(colorScheme === 'light' && {
                      shadowColor: colors.buttonPrimary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 3,
                    }),
                  },
                  logoAnimatedStyle
                ]}>
                  <FontAwesome5
                    name="graduation-cap"
                    size={22}
                    color={colors.buttonText}
                  />
                </Animated.View>
                
                <View>
                  <Text style={{
                    fontSize: 20,
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    color: colors.textPrimary,
                  }}>
                    SkillHub
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: colors.textSecondary,
                  }}>
                    Soluções empresariais
                  </Text>
                </View>
              </View>
              
              <Text style={{
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: '400',
                color: colors.textSecondary,
              }}>
                {greeting}
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Inter',
                fontWeight: '400',
                color: colors.textSecondary,
                marginTop: 2,
              }}>
                {message}
              </Text>
            </View>

            {/* Ícones de ação */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setNotificationModalVisible(true)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.cardBg,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  ...(colorScheme === 'light' && {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 3,
                  }),
                }}
                activeOpacity={0.7}
              >
                <FontAwesome5
                  name="bell"
                  size={18}
                  color={colors.textSecondary}
                />
                {/* Badge de notificação */}
                {unreadCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: '#EF4444',
                    borderRadius: 8,
                    minWidth: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: colors.cardBg,
                  }}>
                    <Text style={{
                      fontSize: 10,
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      color: '#FFFFFF',
                    }}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Carrinho com contador */}
              <TouchableOpacity
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.buttonPrimary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  ...(colorScheme === 'light' && {
                    shadowColor: colors.buttonPrimary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }),
                }}
                activeOpacity={0.8}
              >
                <FontAwesome5
                  name="shopping-cart"
                  size={18}
                  color={colors.buttonText}
                />
                {cartCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    backgroundColor: '#EF4444',
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: colors.cardBg,
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      color: '#FFFFFF',
                    }}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Barra de pesquisa melhorada */}
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
                          <FontAwesome5
              name="search"
              size={16}
              color={colors.textSecondary}
              style={{ marginRight: 12 }}
            />
              <TextInput
                placeholder="Buscar soluções empresariais..."
                placeholderTextColor={colors.textSecondary}
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
              <FontAwesome5
                name="filter"
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Categorias de Produtos */}
        <Animated.View
          entering={FadeInRight.delay(200).springify()}
          style={{
            marginBottom: 32,
          }}
        >
          <View style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 20,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: colors.textPrimary,
            }}>
              Nossas Soluções
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              gap: 12,
              alignItems: 'center',
            }}
          >
            {categories.map((category, index) => {
              const IconComponent = category.iconSet === 'FontAwesome5' ? FontAwesome5 : FontAwesome;
              return (
                <Animated.View
                  key={category.id}
                  entering={FadeInRight.delay(300 + index * 100).springify()}
                >
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 85,
                      height: 85,
                      borderRadius: 22,
                      backgroundColor: colors.cardBg,
                      ...(colorScheme === 'light' && {
                        shadowColor: category.color,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        elevation: 5,
                      }),
                      borderWidth: 2,
                      borderColor: `${category.color}20`,
                      marginHorizontal: 2,
                    }}
                    activeOpacity={0.8}
                  >
                    <IconComponent
                      name={category.icon}
                      size={24}
                      color={category.color}
                      style={{ marginBottom: 6 }}
                    />
                    <Text style={{
                      fontSize: 10,
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      color: colors.textPrimary,
                      textAlign: 'center',
                      lineHeight: 12,
                      paddingHorizontal: 4,
                    }}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Ofertas Relâmpago */}
        <Animated.View
          entering={FadeInUp.delay(400).springify()}
          style={{
            marginBottom: 32,
          }}
        >
          <View style={{
            paddingHorizontal: 20,
            marginBottom: 16,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5
                  name="bolt"
                  size={20}
                  color="#EF4444"
                />
                <Text style={{
                  fontSize: 20,
                  fontFamily: 'Inter',
                  fontWeight: '700',
                  color: colors.textPrimary,
                  marginLeft: 8,
                }}>
                  Ofertas Relâmpago
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Inter',
                fontWeight: '600',
                color: '#EF4444',
              }}>
                Termina em breve!
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              gap: 16,
            }}
          >
            {flashOffers.map((offer, index) => (
              <Animated.View
                key={offer.id}
                entering={FadeInLeft.delay(500 + index * 100).springify()}
              >
                <TouchableOpacity
                  style={{
                    width: 200,
                    backgroundColor: colors.cardBg,
                    borderRadius: 16,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: '#EF4444',
                    ...(colorScheme === 'light' && {
                      shadowColor: '#EF4444',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.25,
                      shadowRadius: 12,
                      elevation: 8,
                    }),
                  }}
                  activeOpacity={0.9}
                >
                  {/* Badge de Desconto */}
                  <View style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    backgroundColor: '#EF4444',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    zIndex: 1,
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontFamily: 'Inter',
                      fontWeight: '700',
                      color: '#FFFFFF',
                    }}>
                      -{offer.discount}%
                    </Text>
                  </View>

                  <Image
                    source={{ uri: offer.image }}
                    style={{
                      width: '100%',
                      height: 120,
                      backgroundColor: colors.inputBorder,
                    }}
                    resizeMode="cover"
                  />

                  <View style={{ padding: 12 }}>
                    <Text style={{
                      fontSize: 14,
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      color: colors.textPrimary,
                      marginBottom: 6,
                    }}>
                      {offer.name}
                    </Text>

                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}>
                      <Text style={{
                        fontSize: 16,
                        fontFamily: 'Inter',
                        fontWeight: '700',
                        color: '#EF4444',
                      }}>
                        {formatPrice(offer.price)}
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        color: colors.textSecondary,
                        textDecorationLine: 'line-through',
                        marginLeft: 6,
                      }}>
                        {formatPrice(offer.originalPrice)}
                      </Text>
                    </View>

                    {/* Contador de tempo */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}>
                      <FontAwesome5
                        name="clock"
                        size={12}
                        color="#EF4444"
                      />
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        color: '#EF4444',
                        marginLeft: 4,
                      }}>
                        {offer.timeLeft} restantes
                      </Text>
                    </View>

                    {/* Barra de progresso de vendas */}
                    <View style={{
                      marginBottom: 8,
                    }}>
                      <View style={{
                        height: 6,
                        backgroundColor: colors.inputBorder,
                        borderRadius: 3,
                      }}>
                        <View style={{
                          width: `${(offer.soldCount / offer.totalStock) * 100}%`,
                          height: '100%',
                          backgroundColor: '#EF4444',
                          borderRadius: 3,
                        }} />
                      </View>
                      <Text style={{
                        fontSize: 11,
                        fontFamily: 'Inter',
                        fontWeight: '500',
                        color: colors.textSecondary,
                        marginTop: 4,
                      }}>
                        {offer.soldCount} vendidos de {offer.totalStock}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Produtos em Destaque */}
        <Animated.View
          entering={FadeInUp.delay(600).springify()}
          style={{
            marginBottom: 32,
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 20,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: colors.textPrimary,
            }}>
              Software em Destaque
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Inter',
                fontWeight: '500',
                color: colors.link,
              }}>
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              gap: 16,
            }}
          >
            {featuredProducts.map((product, index) => (
              <Animated.View
                key={product.id}
                entering={FadeInRight.delay(700 + index * 100).springify()}
              >
                                  <TouchableOpacity
                    style={{
                      width: 290,
                      backgroundColor: colors.cardBg,
                      borderRadius: 18,
                      overflow: 'hidden',
                      marginHorizontal: 4,
                      ...(colorScheme === 'light' && {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.1,
                        shadowRadius: 15,
                        elevation: 8,
                      }),
                    }}
                    activeOpacity={0.9}
                  >
                  {/* Imagem do produto */}
                  <View style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: product.image }}
                      style={{
                        width: '100%',
                        height: 200,
                        backgroundColor: colors.inputBorder,
                      }}
                      resizeMode="cover"
                    />

                    {/* Badge do produto */}
                    <View style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: product.badge === 'Bestseller' ? '#10B981' : 
                                     product.badge === 'Oferta' ? '#EF4444' : '#3B82F6',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}>
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        color: '#FFFFFF',
                      }}>
                        {product.badge}
                      </Text>
                    </View>

                    {/* Botão de favorito */}
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      activeOpacity={0.8}
                    >
                      <FontAwesome5
                        name="heart"
                        size={16}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Informações do produto */}
                  <View style={{ padding: 18 }}>
                    <Text style={{
                      fontSize: 16,
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      color: colors.textPrimary,
                      marginBottom: 4,
                    }}>
                      {product.name}
                    </Text>

                    <Text style={{
                      fontSize: 13,
                      fontFamily: 'Inter',
                      fontWeight: '400',
                      color: colors.textSecondary,
                      marginBottom: 8,
                      lineHeight: 18,
                    }}>
                      {product.description}
                    </Text>

                    {/* Rating e reviews */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}>
                      <FontAwesome
                        name="star"
                        size={14}
                        color="#FFB800"
                      />
                      <Text style={{
                        fontSize: 14,
                        fontFamily: 'Inter',
                        fontWeight: '500',
                        color: colors.textPrimary,
                        marginLeft: 4,
                      }}>
                        {product.rating}
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        color: colors.textSecondary,
                        marginLeft: 6,
                      }}>
                        ({product.reviews} reviews)
                      </Text>
                    </View>

                    {/* Recursos principais */}
                    <View style={{
                      marginBottom: 12,
                    }}>
                      {product.features?.slice(0, 3).map((feature, index) => (
                        <View key={index} style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 3,
                        }}>
                          <View style={{
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: colors.buttonPrimary,
                            marginRight: 8,
                          }} />
                          <Text style={{
                            fontSize: 11,
                            fontFamily: 'Inter',
                            fontWeight: '500',
                            color: colors.textSecondary,
                          }}>
                            {feature}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Preços */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}>
                      <Text style={{
                        fontSize: 20,
                        fontFamily: 'Inter',
                        fontWeight: '700',
                        color: colors.buttonPrimary,
                      }}>
                        {formatPrice(product.price)}
                      </Text>
                      {product.originalPrice && (
                        <>
                          <Text style={{
                            fontSize: 14,
                            fontFamily: 'Inter',
                            fontWeight: '400',
                            color: colors.textSecondary,
                            textDecorationLine: 'line-through',
                            marginLeft: 8,
                          }}>
                            {formatPrice(product.originalPrice)}
                          </Text>
                          <View style={{
                            backgroundColor: '#10B981',
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                            marginLeft: 8,
                          }}>
                            <Text style={{
                              fontSize: 11,
                              fontFamily: 'Inter',
                              fontWeight: '600',
                              color: '#FFFFFF',
                            }}>
                              -{product.discount}%
                            </Text>
                          </View>
                        </>
                      )}
                    </View>

                    {/* Botão de adicionar ao carrinho */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.buttonPrimary,
                        paddingVertical: 12,
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => addToCart(product.id)}
                      activeOpacity={0.8}
                    >
                      <FontAwesome5
                        name="shopping-cart"
                        size={16}
                        color={colors.buttonText}
                      />
                      <Text style={{
                        fontSize: 14,
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        color: colors.buttonText,
                        marginLeft: 8,
                      }}>
                        {product.cta}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Produtos Populares */}
        <Animated.View
          entering={FadeInUp.delay(800).springify()}
          style={{
            paddingHorizontal: 20,
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 20,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: colors.textPrimary,
            }}>
              Serviços Populares
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Inter',
                fontWeight: '500',
                color: colors.link,
              }}>
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            {popularProducts.map((product, index) => (
              <Animated.View
                key={product.id}
                entering={FadeInUp.delay(900 + index * 100).springify()}
                style={{
                  width: (width - 52) / 2, // 2 colunas perfeitamente alinhadas
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: 12,
                    overflow: 'hidden',
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
                  <View style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: product.image }}
                      style={{
                        width: '100%',
                        height: 120,
                        backgroundColor: colors.inputBorder,
                      }}
                      resizeMode="cover"
                    />

                    {/* Status de estoque */}
                    {!product.inStock && (
                      <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <Text style={{
                          fontSize: 14,
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          color: '#FFFFFF',
                        }}>
                          Fora de Estoque
                        </Text>
                      </View>
                    )}

                    {/* Botão de favorito */}
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      activeOpacity={0.8}
                    >
                      <FontAwesome5
                        name="heart"
                        size={14}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{ padding: 14 }}>
                    <Text style={{
                      fontSize: 14,
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      color: colors.textPrimary,
                      marginBottom: 4,
                    }}>
                      {product.name}
                    </Text>

                    <Text style={{
                      fontSize: 11,
                      fontFamily: 'Inter',
                      fontWeight: '400',
                      color: colors.textSecondary,
                      marginBottom: 6,
                      lineHeight: 14,
                    }}>
                      {product.description}
                    </Text>

                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}>
                      <FontAwesome
                        name="star"
                        size={12}
                        color="#FFB800"
                      />
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter',
                        fontWeight: '500',
                        color: colors.textPrimary,
                        marginLeft: 4,
                      }}>
                        {product.rating} ({product.reviews})
                      </Text>
                    </View>

                    <Text style={{
                      fontSize: 16,
                      fontFamily: 'Inter',
                      fontWeight: '700',
                      color: colors.buttonPrimary,
                      marginBottom: 8,
                    }}>
                      {formatPrice(product.price)}
                    </Text>

                    <TouchableOpacity
                      style={{
                        backgroundColor: product.inStock ? colors.buttonPrimary : colors.textSecondary,
                        paddingVertical: 8,
                        borderRadius: 6,
                        alignItems: 'center',
                      }}
                      onPress={() => product.inStock && addToCart(product.id)}
                      disabled={!product.inStock}
                      activeOpacity={0.8}
                    >
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        color: colors.buttonText,
                      }}>
                        {product.inStock ? product.cta : 'Indisponível'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

             {/* Popup de Notificações */}
       {notificationModalVisible && (
         <NotificationModal
           visible={notificationModalVisible}
           onClose={() => setNotificationModalVisible(false)}
           notifications={notifications}
           onMarkAsRead={markAsRead}
           onMarkAllAsRead={markAllAsRead}
           onClearAll={clearAll}
         />
       )}
     </View>
   );
 }
