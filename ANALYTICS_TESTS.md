# Testes do Google Tag Manager - Taverna Tibiana

## Visão Geral

Este documento explica como executar testes para verificar se todos os eventos do Google Tag Manager estão sendo disparados corretamente.

## Métodos de Teste

### 1. Componente de Teste Visual

#### Acesso
- URL: `/analytics-test`
- Interface gráfica para executar testes
- Visualização em tempo real dos resultados

#### Funcionalidades
- ✅ Verificação do status do DataLayer
- ✅ Testes individuais por categoria
- ✅ Teste completo de todos os eventos
- ✅ Contagem de eventos em tempo real
- ✅ Limpeza do DataLayer

### 2. Serviço de Debug

#### Localização
- `src/app/services/analytics-debug.service.ts`
- Métodos para testar cada tipo de evento
- Logs detalhados no console

#### Métodos Disponíveis
```typescript
// Verificar inicialização
testDataLayerInitialization(): boolean

// Testes por categoria
testBasicEvents(): void
testAuthEvents(): void
testCalculatorEvents(): void
testConsultEvents(): void
testMasteryEvents(): void
testSimulationEvents(): void
testFormEvents(): void
testButtonEvents(): void
testSearchEvents(): void
testErrorEvents(): void
testApiEvents(): void
testEngagementEvents(): void

// Teste completo
runAllTests(): void

// Utilitários
checkDataLayerEvents(): void
clearDataLayer(): void
```

### 3. Script de Console

#### Localização
- `src/app/services/analytics-test-script.ts`
- Pode ser executado diretamente no console do navegador

#### Como Usar
1. Abra o console do navegador (F12)
2. Copie e cole o conteúdo do script
3. Pressione Enter para executar

## Executando os Testes

### Passo 1: Verificar Configuração

#### No Console do Navegador
```javascript
// Verificar se o GTM está carregado
console.log('GTM Status:', typeof window !== 'undefined' && window.dataLayer ? '✅ Ativo' : '❌ Inativo');

// Verificar dataLayer
console.log('DataLayer:', window.dataLayer);
```

#### No GTM
1. Acesse https://tagmanager.google.com/
2. Selecione o container `GTM-WZR6F9FM`
3. Clique em "Preview" para ativar o modo de debug

### Passo 2: Executar Testes

#### Opção A: Interface Visual
1. Navegue para `/analytics-test`
2. Clique em "Verificar DataLayer"
3. Execute testes individuais ou completos
4. Observe os resultados em tempo real

#### Opção B: Console
```javascript
// Executar script completo
// (copie o conteúdo de analytics-test-script.ts)

// Ou executar testes individuais
window.dataLayer.push({
  event: 'test_event',
  test_param: 'test_value'
});
```

#### Opção C: Serviço Programático
```typescript
// No componente Angular
constructor(private analyticsDebugService: AnalyticsDebugService) {}

// Executar teste completo
this.analyticsDebugService.runAllTests();

// Executar teste específico
this.analyticsDebugService.testCalculatorEvents();
```

### Passo 3: Verificar Resultados

#### No Console
```javascript
// Verificar total de eventos
console.log('Total de eventos:', window.dataLayer.length);

// Verificar eventos por tipo
const eventCounts = {};
window.dataLayer.forEach(item => {
  if (item.event) {
    eventCounts[item.event] = (eventCounts[item.event] || 0) + 1;
  }
});
console.log('Contagem por tipo:', eventCounts);
```

#### No GTM Preview Mode
1. Eventos aparecem em tempo real
2. Verificar se os triggers estão funcionando
3. Confirmar se as tags estão sendo disparadas

## Eventos Testados

### 📊 Eventos Básicos
- `page_view` - Visualização de página
- `test_event` - Evento de teste
- `user_action` - Ação do usuário

### 🔐 Eventos de Autenticação
- `login` - Login com método
- `logout` - Logout
- `sign_up` - Registro com método

### 🧮 Eventos de Calculadora
- `calculator_used` - Uso de calculadora com parâmetros
- Tipos: exercise-weapons, stamina, charm-damage, loot-split

### 👤 Eventos de Consulta
- `character_consultation` - Consulta de personagem

### ⚔️ Eventos de Mastery
- `mastery_action` - Ações de mastery (select, deselect, upload, save)

### 🎮 Eventos de Simulação
- `simulation_used` - Uso de simulação com tipos e parâmetros

### 📋 Eventos de Formulário
- `form_submit` - Submissão de formulário com sucesso/falha

### 🔘 Eventos de Botão
- `button_click` - Clique em botão com nome e página

### 🔍 Eventos de Busca
- `search` - Busca com termo e tipo

### 🚨 Eventos de Erro
- `error` - Erro com categoria, label e mensagem

### 🌐 Eventos de API
- `api_call` - Chamada de API com endpoint, método, status e tempo

### ⏱️ Eventos de Engajamento
- `engagement` - Engajamento com ação e conteúdo

## Validação no GTM

### 1. Configurar Preview Mode
1. No GTM, clique em "Preview"
2. Digite a URL da aplicação
3. Clique em "Start"

### 2. Verificar Triggers
- **Page View**: Deve disparar em cada navegação
- **Custom Events**: Deve disparar para cada evento específico
- **Form Events**: Deve disparar para submissões de formulário

### 3. Verificar Tags
- **Google Analytics 4**: Deve receber todos os eventos
- **Event Tags**: Deve disparar para eventos customizados
- **Conversion Tags**: Deve disparar para conversões

### 4. Verificar Variáveis
- **Data Layer Variables**: Deve extrair dados corretamente
- **Built-in Variables**: Deve funcionar normalmente

## Troubleshooting

### Problemas Comuns

#### DataLayer não encontrado
```javascript
// Verificar se o GTM está carregado
console.log('GTM Script:', document.querySelector('script[src*="googletagmanager"]'));

// Verificar se o dataLayer foi inicializado
console.log('DataLayer:', window.dataLayer);
```

#### Eventos não aparecem no GTM
1. Verificar se o Preview Mode está ativo
2. Confirmar se os triggers estão configurados
3. Verificar se as tags estão publicadas

#### Performance lenta
1. Verificar quantidade de eventos sendo enviados
2. Otimizar triggers para evitar disparos desnecessários
3. Usar tag firing rules para limitar execução

### Debug Avançado

#### Logs Detalhados
```javascript
// Interceptar todos os eventos
const originalPush = window.dataLayer.push;
window.dataLayer.push = function(...args) {
  console.log('📤 Evento enviado:', args);
  return originalPush.apply(this, args);
};
```

#### Monitoramento em Tempo Real
```javascript
// Monitorar mudanças no dataLayer
const observer = new MutationObserver(() => {
  console.log('DataLayer atualizado:', window.dataLayer);
});

observer.observe(document, {
  childList: true,
  subtree: true
});
```

## Relatórios de Teste

### Relatório Padrão
Após executar os testes, você deve ver:
- ✅ DataLayer inicializado
- ✅ 50+ eventos enviados
- ✅ Todos os tipos de evento testados
- ✅ Parâmetros corretos em cada evento

### Relatório Detalhado
```javascript
// Gerar relatório completo
function generateTestReport() {
  const events = window.dataLayer.filter(item => item.event);
  const report = {
    totalEvents: events.length,
    eventTypes: {},
    errors: [],
    warnings: []
  };
  
  events.forEach(event => {
    report.eventTypes[event.event] = (report.eventTypes[event.event] || 0) + 1;
  });
  
  console.log('📊 Relatório de Teste:', report);
  return report;
}
```

## Próximos Passos

1. **Configurar GTM**: Siga o guia em `GTM_CONFIGURATION.md`
2. **Validar Eventos**: Use os testes para confirmar funcionamento
3. **Configurar GA4**: Conecte o Google Analytics 4
4. **Configurar Conversões**: Defina eventos de conversão importantes
5. **Monitorar Performance**: Acompanhe métricas regularmente

## Suporte

Para problemas com testes:
1. Verifique o console do navegador
2. Confirme se o GTM está carregado
3. Use o Preview Mode do GTM
4. Consulte a documentação oficial do GTM 