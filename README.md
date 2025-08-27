# 🚀 SkillHub App - Plataforma Mobile para Parceiros TecSkill

## 📱 Visão Geral

O **SkillHub App** é uma aplicação mobile nativa desenvolvida com React Native e Expo, oferecendo uma experiência otimizada para parceiros TecSkill gerenciarem suas performances de vendas, acompanharem KPIs e acessarem recursos de marketing.

## 🏗️ Estrutura do Projeto

```
skillhub_app/
├── 📁 src/                          # Código fonte principal
│   ├── 📁 app/                      # Expo Router (navegação)
│   ├── 📁 components/               # Componentes reutilizáveis
│   ├── 📁 hooks/                    # Hooks customizados
│   ├── 📁 services/                 # Serviços e APIs
│   ├── 📁 stores/                   # Gerenciamento de estado
│   ├── 📁 types/                    # Tipos TypeScript
│   ├── 📁 utils/                    # Utilitários e helpers
│   └── 📁 constants/                # Constantes e configurações
├── 📁 assets/                       # Recursos estáticos
├── 📁 docs/                         # Documentação técnica
├── 📁 scripts/                      # Scripts de desenvolvimento
└── 📄 Arquivos de configuração
```

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o Projeto
```bash
# Desenvolvimento
npm start

# Plataformas específicas
npm run ios
npm run android
npm run web
```

### 3. Resetar Projeto (se necessário)
```bash
npm run reset-project
```

## 🛠️ Tecnologias Utilizadas

- **React Native 0.79.6** - Framework mobile
- **Expo 53.0.22** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Expo Router 5.1.5** - Navegação baseada em arquivos
- **NativeWind** - Tailwind CSS para React Native
- **React Native Reanimated** - Animações nativas
- **Expo Vector Icons** - Biblioteca de ícones

## 📱 Funcionalidades Principais

### 🔐 Autenticação
- Login com validação em tempo real
- Cadastro com critérios de senha forte
- Recuperação de senha
- Autenticação de dois fatores (2FA)

### 🏠 Dashboard
- KPIs em tempo real
- Gráficos interativos
- Acompanhamento de performance
- Sistema de notificações

### 🛍️ Produtos
- Catálogo completo de soluções TecSkill
- Filtros por categoria
- Busca inteligente
- Geração de links de afiliado

### 📊 Progresso
- Acompanhamento de metas
- Sistema de tiers
- Benefícios desbloqueados
- Histórico de atividades

### 👤 Perfil
- Dados pessoais
- Configurações de conta
- Histórico de transações
- Preferências de notificação

## 🎨 Design System

### Paleta de Cores
- **Primária:** #8C52FF (Roxo TecSkill)
- **Secundária:** #C5FF52 (Verde complementar)
- **Neutras:** #0A1A2F, #111827, #6B7280
- **Sucesso:** #10B981
- **Erro:** #EF4444
- **Aviso:** #F59E0B

### Tipografia
- **Fonte Principal:** Inter (400, 500, 600, 700)
- **Hierarquia:** Títulos, subtítulos, corpo, captions
- **Responsiva:** Adaptação automática ao tema do sistema

## 🔧 Configuração

### Variáveis de Ambiente
```bash
# Criar arquivo .env
EXPO_PUBLIC_API_URL=https://api.skillhub.tecskill.com.br
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Configurações de Build
- **iOS:** Suporte a tablet, orientação portrait
- **Android:** Edge-to-edge, ícone adaptativo
- **Web:** Bundler Metro, output estático

## 📚 Documentação

- **`docs/AUTH.md`** - Implementação de autenticação
- **`docs/NAVIGATION.md`** - Sistema de navegação
- **`docs/COMPONENTS.md`** - Biblioteca de componentes
- **`docs/API.md`** - Integração com backend

## 🤝 Contribuição

### Padrões de Código
- ESLint para qualidade de código
- Prettier para formatação
- Conventional Commits para mensagens
- TypeScript para tipagem

### Workflow
```bash
# Criar feature
git checkout -b feature/nova-funcionalidade

# Commit
git commit -m "feat: adicionar sistema de notificações"

# Push
git push origin feature/nova-funcionalidade
```

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

- **Email:** dev@tecskill.com.br
- **Website:** https://tecskill.com.br
- **Documentação:** https://docs.tecskill.com.br/skillhub

---

**Desenvolvido com ❤️ pela equipe TecSkill**

*Transformando conhecimento em oportunidades de negócio*
