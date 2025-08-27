# 📱 Sistema de Local Storage - SkillHub App

## 🎯 Visão Geral

Este documento descreve o sistema de local storage implementado para o app SkillHub, que utiliza AsyncStorage do React Native para persistir dados localmente no dispositivo.

## 🏗️ Arquitetura

### Estrutura de Arquivos
```
hooks/
├── useLocalStorage.ts          # Hook base para storage
└── index.ts                   # Exportações dos hooks

contexts/
├── StorageContext.tsx         # Contexto React para storage
└── index.ts                   # Exportações dos contextos
```

## 🚀 Como Usar

### 1. Configuração Inicial

Primeiro, instale a dependência necessária:

```bash
npm install @react-native-async-storage/async-storage
```

### 2. Envolver o App com o Provider

No seu arquivo principal (`_layout.tsx` ou `App.tsx`):

```tsx
import { StorageProvider } from '@/contexts';

export default function App() {
  return (
    <StorageProvider>
      {/* Resto do seu app */}
    </StorageProvider>
  );
}
```

### 3. Usar nos Componentes

#### Hook Básico
```tsx
import { useLocalStorage } from '@/hooks';

function MyComponent() {
  const { value, setValue, loading, error } = useLocalStorage('my_key', 'default_value');
  
  return (
    <View>
      {loading ? <Text>Carregando...</Text> : <Text>{value}</Text>}
      <Button onPress={() => setValue('novo valor')} title="Atualizar" />
    </View>
  );
}
```

#### Hooks Especializados
```tsx
import { useUserProfile, useAuthTokens, useAppSettings } from '@/contexts';

function ProfileScreen() {
  const { userProfile, updateUserProfile } = useUserProfile();
  const { authTokens, updateAuthTokens } = useAuthTokens();
  const { appSettings, updateAppSettings } = useAppSettings();
  
  const handleUpdateProfile = async () => {
    await updateUserProfile({
      name: 'Novo Nome',
      email: 'novo@email.com'
    });
  };
  
  return (
    <View>
      <Text>Nome: {userProfile.name}</Text>
      <Text>Email: {userProfile.email}</Text>
      <Button onPress={handleUpdateProfile} title="Atualizar Perfil" />
    </View>
  );
}
```

## 🔧 Funcionalidades Disponíveis

### Hooks de Storage
- `useLocalStorage<T>(key, initialValue)` - Hook genérico para qualquer tipo de dado
- `useUserProfile()` - Gerenciar perfil do usuário
- `useAuthTokens()` - Gerenciar tokens de autenticação
- `useAppSettings()` - Gerenciar configurações do app
- `useUserPreferences()` - Gerenciar preferências do usuário
- `useOfflineData()` - Gerenciar dados offline

### Funções Utilitárias
- `saveToStorage(key, value)` - Salvar dados
- `getFromStorage(key)` - Recuperar dados
- `removeFromStorage(key)` - Remover dados
- `clearStorage()` - Limpar todo o storage
- `getAllKeys()` - Obter todas as chaves
- `getMultipleValues(keys)` - Obter múltiplos valores
- `setMultipleValues(data)` - Salvar múltiplos valores

### Funções de Backup e Migração
- `exportStorageData()` - Exportar todos os dados
- `importStorageData(jsonData)` - Importar dados
- `cleanupOldData(maxAgeInDays)` - Limpar dados antigos
- `getStorageStats()` - Obter estatísticas do storage

## 📊 Estrutura de Dados

### Chaves de Storage Disponíveis
```typescript
type StorageKey = 
  | 'user_profile'           // Perfil do usuário
  | 'auth_token'             // Tokens de autenticação
  | 'refresh_token'          // Token de refresh
  | 'app_settings'           // Configurações do app
  | 'onboarding_completed'   // Status do onboarding
  | 'theme_preference'       // Preferência de tema
  | 'notifications_enabled'  // Status das notificações
  | 'last_sync'              // Última sincronização
  | 'cached_courses'         // Cursos em cache
  | 'user_preferences'       // Preferências do usuário
  | 'offline_data'           // Dados offline
  | 'search_history';        // Histórico de busca
```

### Estrutura dos Dados

#### UserProfile
```typescript
interface UserProfile {
  id: string | null;
  name: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: Date | null;
  lastLogin: Date | null;
}
```

#### AuthTokens
```typescript
interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
}
```

#### AppSettings
```typescript
interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  autoSync: boolean;
  offlineMode: boolean;
}
```

## 💡 Exemplos de Uso

### Exemplo 1: Gerenciar Tema
```tsx
import { useAppSettings } from '@/contexts';

function ThemeToggle() {
  const { appSettings, updateAppSettings } = useAppSettings();
  
  const toggleTheme = () => {
    const newTheme = appSettings.theme === 'light' ? 'dark' : 'light';
    updateAppSettings({ theme: newTheme });
  };
  
  return (
    <Button 
      onPress={toggleTheme}
      title={`Tema: ${appSettings.theme}`}
    />
  );
}
```

### Exemplo 2: Cache de Dados
```tsx
import { useOfflineData } from '@/contexts';

function CourseList() {
  const { offlineData, updateOfflineData } = useOfflineData();
  
  const cacheCourses = async (courses) => {
    await updateOfflineData({
      courses,
      lastSync: new Date()
    });
  };
  
  return (
    <View>
      {offlineData.courses.map(course => (
        <Text key={course.id}>{course.title}</Text>
      ))}
    </View>
  );
}
```

### Exemplo 3: Autenticação
```tsx
import { useAuthTokens, useUserProfile } from '@/contexts';

function LoginScreen() {
  const { updateAuthTokens } = useAuthTokens();
  const { updateUserProfile } = useUserProfile();
  
  const handleLogin = async (credentials) => {
    try {
      // Chamada da API
      const response = await api.login(credentials);
      
      // Salva no storage
      await Promise.all([
        updateAuthTokens(response.tokens),
        updateUserProfile(response.user)
      ]);
      
      // Navega para a tela principal
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };
  
  return (
    <LoginForm onSubmit={handleLogin} />
  );
}
```

## 🔒 Segurança e Boas Práticas

### 1. Dados Sensíveis
- **NUNCA** armazene senhas em texto plano
- Use tokens de acesso com expiração
- Considere criptografar dados sensíveis

### 2. Limpeza de Dados
```tsx
// Limpar dados ao fazer logout
const handleLogout = async () => {
  await Promise.all([
    clearAuthData(),
    clearUserData()
  ]);
  router.replace('/login');
};
```

### 3. Tratamento de Erros
```tsx
const { value, error, loading } = useLocalStorage('my_key', 'default');

if (error) {
  console.error('Erro no storage:', error);
  // Fallback para valor padrão
}
```

### 4. Sincronização
```tsx
// Sincronizar dados quando houver conexão
useEffect(() => {
  if (isOnline && offlineData.pendingActions.length > 0) {
    syncPendingActions();
  }
}, [isOnline]);
```

## 🧪 Testes

### Testando o Storage
```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { StorageProvider, useLocalStorage } from '@/contexts';

test('useLocalStorage salva e recupera dados', async () => {
  const wrapper = ({ children }) => (
    <StorageProvider>{children}</StorageProvider>
  );
  
  const { result } = renderHook(() => useLocalStorage('test_key', 'initial'), { wrapper });
  
  await act(async () => {
    await result.current.setValue('new_value');
  });
  
  expect(result.current.value).toBe('new_value');
});
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Dados não persistem
- Verifique se o AsyncStorage está instalado
- Confirme se o StorageProvider está envolvendo o app
- Verifique se há erros no console

#### 2. Performance lenta
- Use `getMultipleValues` para múltiplas chaves
- Implemente cache para dados frequentemente acessados
- Considere limpar dados antigos periodicamente

#### 3. Erros de parsing JSON
- Sempre use try-catch ao fazer parse
- Valide dados antes de salvar
- Use valores padrão como fallback

### Debug
```tsx
import { getStorageStats } from '@/hooks';

// Obter estatísticas do storage
const stats = await getStorageStats();
console.log('Storage stats:', stats);

// Exportar dados para debug
const exportData = await exportStorageData();
console.log('Exported data:', exportData);
```

## 📈 Performance

### Otimizações Recomendadas
1. **Lazy Loading**: Carregue dados apenas quando necessário
2. **Batch Operations**: Use `setMultipleValues` para múltiplas operações
3. **Cleanup**: Implemente limpeza automática de dados antigos
4. **Compression**: Considere comprimir dados grandes

### Monitoramento
```tsx
// Monitorar tamanho do storage
useEffect(() => {
  const checkStorageSize = async () => {
    const stats = await getStorageStats();
    if (stats.totalSize > 50 * 1024 * 1024) { // 50MB
      console.warn('Storage muito grande, considere limpar dados antigos');
    }
  };
  
  checkStorageSize();
}, []);
```

## 🔄 Migração e Versionamento

### Estrutura de Versionamento
```typescript
interface StorageData {
  version: string;
  data: any;
  timestamp: number;
}

// Ao salvar dados
const storageData: StorageData = {
  version: '1.0.0',
  data: actualData,
  timestamp: Date.now()
};
```

### Migração de Dados
```typescript
const migrateData = async (oldVersion: string, newVersion: string) => {
  if (oldVersion === '1.0.0' && newVersion === '1.1.0') {
    // Migrar dados da versão 1.0.0 para 1.1.0
    const oldData = await getFromStorage('user_profile');
    const newData = transformDataForNewVersion(oldData);
    await saveToStorage('user_profile', newData);
  }
};
```

## 📚 Referências

- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
- [React Context API](https://reactjs.org/docs/context.html)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)

## 🤝 Contribuição

Para contribuir com melhorias no sistema de storage:

1. Crie uma issue descrevendo a melhoria
2. Implemente as mudanças seguindo os padrões existentes
3. Adicione testes para novas funcionalidades
4. Atualize esta documentação
5. Submeta um pull request

---

**Desenvolvido para o SkillHub App** 🚀
