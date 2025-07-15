# Implementação do Google Analytics no Charlovinho

Este documento descreve a implementação do Google Analytics (GA4) no projeto Charlovinho para rastreamento de eventos e comportamento do usuário.

## Configuração Inicial

### 1. Script do Google Analytics

O script do Google Analytics foi adicionado ao arquivo `src/index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-G7E8VTW2XD"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-G7E8VTW2XD');
</script>
```

### 2. ID do Google Analytics
- **ID da Propriedade**: `G-G7E8VTW2XD`

## Serviços Implementados

### AnalyticsService

Localizado em `src/app/services/analytics.service.ts`, este serviço centraliza todas as funcionalidades de rastreamento:

#### Métodos Principais:

1. **trackPageView(pagePath: string)**
   - Rastreia visualizações de página automaticamente
   - Configurado para rastrear mudanças de rota

2. **trackEvent(eventName: string, parameters?: object)**
   - Método genérico para rastrear eventos customizados
   - Usa a função `gtag('event', eventName, parameters)`

3. **trackUserAction(action: string, category: string, label?: string, value?: number)**
   - Rastreia ações específicas do usuário
   - Categoriza ações para melhor análise

4. **trackApiCall(endpoint: string, method: string, status: number, responseTime?: number)**
   - Rastreia chamadas de API
   - Monitora tempo de resposta e status

5. **trackError(errorType: string, errorMessage: string, errorStack?: string)**
   - Rastreia erros da aplicação
   - Captura detalhes do erro para debugging

#### Métodos Específicos:

- **trackLogin(method: string)** - Rastreia logins
- **trackLogout()** - Rastreia logouts
- **trackRegistration(method: string)** - Rastreia registros
- **trackCalculatorUsage(calculatorType: string, parameters?: any)** - Rastreia uso de calculadoras
- **trackCharacterConsultation(characterId: string)** - Rastreia consultas de personagens
- **trackMasteryAction(action: string, masteryType?: string)** - Rastreia ações de maestria
- **trackSimulationUsage(simulationType: string, parameters?: any)** - Rastreia uso de simulações
- **trackAchievementAction(action: string, achievementType?: string)** - Rastreia ações de conquistas
- **trackOutfitMountAction(action: string, itemType: string, itemName?: string)** - Rastreia ações de roupas/montarias
- **trackQuestAction(action: string, questName?: string)** - Rastreia ações de quests
- **trackGemAction(action: string, gemType?: string)** - Rastreia ações de gemas
- **trackFormSubmission(formName: string, success: boolean)** - Rastreia submissões de formulários
- **trackButtonClick(buttonName: string, page?: string)** - Rastreia cliques em botões
- **trackSearch(searchTerm: string, searchType: string)** - Rastreia buscas
- **trackTimeOnPage(page: string, timeSpent: number)** - Rastreia tempo em páginas
- **trackEngagement(action: string, content: string)** - Rastreia engajamento

### AnalyticsInterceptor

Localizado em `src/app/services/analytics.interceptor.ts`, este interceptor rastreia automaticamente:

- Todas as chamadas de API
- Tempo de resposta das requisições
- Erros de API
- Status das respostas

## Integração nos Componentes

### 1. Login Component (`src/app/components/login/login.component.ts`)
```typescript
// Rastreia tentativas de login
this.analyticsService.trackLogin('email');

// Rastreia erros de login
this.analyticsService.trackError('login_error', error.message);

// Rastreia sucesso no login
this.analyticsService.trackUserAction('login_success', 'authentication');
```

### 2. Register Component (`src/app/components/register/register.component.ts`)
```typescript
// Rastreia tentativas de registro
this.analyticsService.trackRegistration('email');

// Rastreia erros de registro
this.analyticsService.trackError('registration_error', error.message);
```

### 3. Consult Component (`src/app/components/consult/consult.component.ts`)
```typescript
// Rastreia consultas de personagens
this.analyticsService.trackCharacterConsultation(characterId);

// Rastreia buscas
this.analyticsService.trackSearch(searchTerm, 'character');
```

### 4. Calculators Component (`src/app/components/calculators/calculators.component.ts`)
```typescript
// Rastreia uso de calculadoras
this.analyticsService.trackCalculatorUsage(calculatorType, parameters);
```

### 5. Simulation Component (`src/app/components/simulation/simulation.component.ts`)
```typescript
// Rastreia uso de simulações
this.analyticsService.trackSimulationUsage(simulationType, parameters);
```

### 6. Animous Mastery Component (`src/app/components/animous-mastery/animous-mastery.component.ts`)
```typescript
// Rastreia ações de maestria
this.analyticsService.trackMasteryAction(action, masteryType);
```

### 7. Home Component (`src/app/components/home/home.component.ts`)
```typescript
// Rastreia engajamento na página inicial
this.analyticsService.trackEngagement('page_view', 'home');
```

### 8. Forgot Password Component (`src/app/components/forgot-password/forgot-password.component.ts`)
```typescript
// Rastreia solicitações de recuperação de senha
this.analyticsService.trackUserAction('password_reset_request', 'authentication');
```

### 9. AuthService (`src/app/services/auth.service.ts`)
```typescript
// Rastreia logout
this.analyticsService.trackLogout();
```

## Configuração no App

### 1. App Config (`src/app/app.config.ts`)
O interceptor foi adicionado aos providers:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AnalyticsInterceptor } from './services/analytics.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([AnalyticsInterceptor])),
    // ... outros providers
  ]
};
```

### 2. Rastreamento Automático de Rotas
O `AnalyticsService` automaticamente rastreia mudanças de rota através do `Router` do Angular.

## Eventos Rastreados

### Eventos Automáticos:
- **page_view** - Visualizações de página
- **api_call** - Chamadas de API
- **error** - Erros da aplicação

### Eventos Customizados:
- **login** - Logins de usuário
- **logout** - Logouts de usuário
- **sign_up** - Registros de usuário
- **user_action** - Ações gerais do usuário
- **calculator_used** - Uso de calculadoras
- **character_consultation** - Consultas de personagens
- **mastery_action** - Ações de maestria
- **simulation_used** - Uso de simulações
- **achievement_action** - Ações de conquistas
- **outfit_mount_action** - Ações de roupas/montarias
- **quest_action** - Ações de quests
- **gem_action** - Ações de gemas
- **form_submit** - Submissões de formulários
- **button_click** - Cliques em botões
- **search** - Buscas
- **time_on_page** - Tempo em páginas
- **engagement** - Engajamento

## Parâmetros dos Eventos

Cada evento pode incluir parâmetros específicos:

```typescript
// Exemplo de evento com parâmetros
this.analyticsService.trackEvent('calculator_used', {
  calculator_type: 'damage',
  parameters: JSON.stringify({level: 100, vocation: 'knight'}),
  user_level: 100
});
```

## Verificação da Implementação

### 1. Console do Navegador
Para verificar se os eventos estão sendo disparados, abra o console do navegador e procure por chamadas `gtag`.

### 2. Google Analytics Real-Time
Acesse o Google Analytics em tempo real para ver os eventos sendo disparados.

### 3. Debug Mode
Para debug, você pode adicionar logs no console:

```typescript
// No AnalyticsService
trackEvent(eventName: string, parameters?: { [key: string]: any }): void {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('GA Event:', eventName, parameters);
    window.gtag('event', eventName, parameters);
  }
}
```

## Próximos Passos

1. **Configurar Goals no Google Analytics** - Definir conversões importantes
2. **Criar Relatórios Customizados** - Para análises específicas
3. **Configurar Alertas** - Para monitorar erros e comportamento anômalo
4. **Implementar Enhanced Ecommerce** - Se necessário para funcionalidades de compra
5. **Configurar User Properties** - Para segmentação avançada

## Manutenção

- Verificar regularmente se os eventos estão sendo disparados corretamente
- Monitorar erros no console do navegador
- Atualizar parâmetros dos eventos conforme necessário
- Revisar relatórios no Google Analytics para insights 