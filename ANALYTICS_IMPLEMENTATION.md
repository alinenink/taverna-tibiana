# Implementação do Google Tag Manager - Taverna Tibiana

## Visão Geral

O Google Tag Manager (GTM) foi implementado de forma completa no projeto Angular para rastrear todas as interações dos usuários, páginas visitadas, ações realizadas e erros que ocorrem. O GTM oferece maior flexibilidade e permite gerenciar tags sem alterar o código.

## Configuração Inicial

### 1. Script do Google Tag Manager
- Adicionado no `src/index.html` com o ID `GTM-WZR6F9FM`
- Inclui script principal no `<head>` e noscript no `<body>`
- Configurado para usar dataLayer para comunicação

### 2. Serviço de Analytics
- Criado `src/app/services/analytics.service.ts` com métodos específicos para cada tipo de evento
- Implementa tracking automático de navegação entre páginas
- Fornece métodos para rastrear ações customizadas
- Usa dataLayer para comunicação com GTM

### 3. Interceptor de Analytics
- Criado `src/app/services/analytics.interceptor.ts` para rastrear automaticamente:
  - Todas as chamadas de API
  - Tempo de resposta das requisições
  - Erros de API
- Integrado no `app.config.ts` junto com o AuthInterceptor

## Eventos Rastreados

### 📊 Page Views
- **Rastreamento Automático**: Todas as navegações entre páginas são rastreadas automaticamente
- **Páginas Mapeadas**:
  - `/` - Login
  - `/login` - Login
  - `/register` - Registro
  - `/forgot-password` - Recuperação de senha
  - `/home` - Página inicial
  - `/consult` - Consulta de personagem
  - `/animous-mastery` - Masteries
  - `/simulacao` - Simulação
  - `/calculators` - Calculadoras

### 🔐 Autenticação
- **Login**: Rastreado com método (email/guest)
- **Logout**: Rastreado automaticamente
- **Registro**: Rastreado com método (email)
- **Recuperação de senha**: Rastreado com sucesso/falha
- **Verificação de código**: Rastreado com sucesso/falha

### 🧮 Calculadoras
- **Seleção de calculadora**: Rastreado quando usuário escolhe uma calculadora
- **Uso de calculadora**: Rastreado com parâmetros específicos:
  - Exercise Weapons: vocação, skill, níveis, etc.
  - Stamina: stamina atual e desejada
  - Charm Damage: dano, HP da criatura, resistência
  - Loot Split: sessão de loot

### 👤 Consulta de Personagem
- **Consulta**: Rastreado com ID do personagem
- **Busca**: Rastreado com termo de busca e tipo

### ⚔️ Masteries
- **Busca**: Rastreado com filtros aplicados
- **Seleção**: Rastreado quando usuário seleciona/desseleciona masteries
- **Upload**: Rastreado com nome do arquivo
- **Salvamento**: Rastreado quando usuário salva seleções

### 🎮 Simulação
- **Seleção de aba**: Rastreado quando usuário muda entre abas
- **Início de simulação**: Rastreado com nome do personagem e progresso
- **Exportação JSON**: Rastreado com dados da simulação
- **Importação JSON**: Rastreado com sucesso/erro

### 🏠 Página Inicial
- **Botões clicados**: Rastreado quando usuário clica em botões específicos
- **Navegação**: Rastreado quando usuário navega para outras páginas

### 📋 Formulários
- **Submissão**: Rastreado com nome do formulário e sucesso/falha
- **Validação**: Rastreado quando há erros de validação

### 🔍 Buscas
- **Termo de busca**: Rastreado com o termo e tipo de busca
- **Resultados**: Rastreado com quantidade de resultados

### ⏱️ Tempo na Página
- **Engajamento**: Rastreado quando usuário passa tempo significativo em uma página

### 🚨 Erros
- **Erros de API**: Rastreados automaticamente pelo interceptor
- **Erros de validação**: Rastreados quando formulários falham
- **Erros de importação**: Rastreados quando arquivos não podem ser processados

## Métodos do AnalyticsService

### Eventos Básicos
- `trackPageView(pagePath: string)`: Rastreia visualização de página
- `trackEvent(eventName: string, parameters?: object)`: Rastreia evento customizado
- `trackUserAction(action: string, category: string, label?: string, value?: number)`: Rastreia ação do usuário

### Eventos Específicos
- `trackLogin(method: string)`: Login
- `trackLogout()`: Logout
- `trackRegistration(method: string)`: Registro
- `trackCalculatorUsage(calculatorType: string, parameters?: any)`: Uso de calculadora
- `trackCharacterConsultation(characterId: string)`: Consulta de personagem
- `trackMasteryAction(action: string, masteryType?: string)`: Ações de mastery
- `trackSimulationUsage(simulationType: string, parameters?: any)`: Uso de simulação
- `trackFormSubmission(formName: string, success: boolean)`: Submissão de formulário
- `trackButtonClick(buttonName: string, page?: string)`: Clique em botão
- `trackSearch(searchTerm: string, searchType: string)`: Busca
- `trackError(errorType: string, errorMessage: string, errorStack?: string)`: Erro

## Interceptor de API

O `AnalyticsInterceptor` rastreia automaticamente:
- **Endpoint**: URL da requisição
- **Método**: GET, POST, PUT, DELETE
- **Status**: Código de resposta HTTP
- **Tempo de resposta**: Em milissegundos
- **Erros**: Detalhes de erros de API

## Configuração no Google Tag Manager

### Eventos Customizados
Todos os eventos são enviados para o dataLayer, permitindo:
- Configuração flexível de tags no GTM
- Análise detalhada do comportamento do usuário
- Segmentação por tipo de ação
- Funnels de conversão
- Análise de performance

### Parâmetros Padronizados
- `event`: Nome do evento
- `event_category`: Categoria do evento
- `event_label`: Label específico do evento
- `value`: Valor numérico quando aplicável
- Parâmetros específicos para cada tipo de evento

### Configuração no GTM
1. Acesse o Google Tag Manager com o ID `GTM-WZR6F9FM`
2. Configure tags para capturar eventos do dataLayer
3. Configure triggers baseados nos eventos enviados
4. Configure variáveis para extrair dados do dataLayer

## Privacidade e Compliance

- **Cookies**: Configurados com flags de segurança
- **Dados Pessoais**: Não são rastreados dados pessoais sensíveis
- **Consentimento**: Implementação preparada para GDPR (pode ser expandida)

## Monitoramento

### Métricas Principais
- Usuários ativos
- Páginas mais visitadas
- Calculadoras mais usadas
- Taxa de conversão de registro
- Tempo médio de sessão
- Taxa de erro

### Relatórios Sugeridos
- Funnel de onboarding (registro → verificação → login)
- Uso de calculadoras por tipo
- Consultas de personagem por popularidade
- Masteries mais selecionadas
- Performance de API

### Configuração de Tags no GTM
1. **Google Analytics 4**: Configure tag GA4 para capturar eventos do dataLayer
2. **Google Analytics Enhanced Ecommerce**: Para tracking de conversões
3. **Facebook Pixel**: Se necessário para marketing
4. **Hotjar**: Para análise de comportamento do usuário
5. **Google Ads**: Para remarketing e conversões

## Manutenção

### Adicionando Novos Eventos
1. Adicione método no `AnalyticsService`
2. Chame o método no componente apropriado
3. Documente o evento neste arquivo

### Modificando Eventos Existentes
1. Atualize o método no `AnalyticsService`
2. Atualize as chamadas nos componentes
3. Atualize a documentação

### Debugging
- Use o console do navegador para verificar se `window.dataLayer` está disponível
- Verifique se os eventos estão sendo enviados no Network tab
- Use o Google Tag Manager Preview Mode para desenvolvimento
- Verifique o dataLayer no console: `console.log(window.dataLayer)`

## Próximos Passos

1. **Configurar Google Analytics 4 no GTM** para capturar eventos
2. **Implementar consentimento GDPR** se necessário
3. **Adicionar tracking de performance** (Core Web Vitals)
4. **Criar dashboards personalizados** no Google Analytics
5. **Implementar alertas** para erros críticos
6. **Adicionar tracking de A/B testing** se implementado
7. **Configurar Facebook Pixel** se necessário para marketing
8. **Implementar Enhanced Ecommerce** para tracking de conversões 