# Configuração do Google Tag Manager - Taverna Tibiana

## Visão Geral

Este documento fornece instruções detalhadas para configurar o Google Tag Manager (GTM) para capturar todos os eventos da aplicação Taverna Tibiana.

## Acesso ao GTM

- **Container ID**: `GTM-WZR6F9FM`
- **URL**: https://tagmanager.google.com/
- **Conta**: Acesse com a conta Google associada ao projeto

## Configuração Inicial

### 1. Configurar Google Analytics 4

#### Criar Tag GA4
1. Vá para **Tags** → **New**
2. **Tag Type**: Google Analytics: GA4 Configuration
3. **Measurement ID**: Insira o ID do GA4 (ex: G-XXXXXXXXXX)
4. **Trigger**: All Pages
5. **Nome**: GA4 - Configuration

#### Configurar Eventos Customizados
1. **Tags** → **New**
2. **Tag Type**: Google Analytics: GA4 Event
3. **Configuration Tag**: Selecione a tag GA4 criada acima
4. **Event Name**: Use os nomes dos eventos enviados pelo dataLayer
5. **Trigger**: Custom Event (baseado nos eventos do dataLayer)

### 2. Eventos Disponíveis no DataLayer

#### Eventos de Navegação
```javascript
{
  event: 'page_view',
  page_path: '/home'
}
```

#### Eventos de Autenticação
```javascript
{
  event: 'login',
  method: 'email'
}

{
  event: 'logout'
}

{
  event: 'sign_up',
  method: 'email'
}
```

#### Eventos de Calculadora
```javascript
{
  event: 'calculator_used',
  calculator_type: 'exercise-weapons',
  parameters: '{"vocation":"knight","skill":"melee"}'
}
```

#### Eventos de Consulta
```javascript
{
  event: 'character_consultation',
  character_id: 'Aureleaf'
}
```

#### Eventos de Mastery
```javascript
{
  event: 'mastery_action',
  action: 'select',
  mastery_type: 'Hard'
}
```

#### Eventos de Simulação
```javascript
{
  event: 'simulation_used',
  simulation_type: 'start',
  parameters: '{"charName":"Aureleaf","totalProgress":75}'
}
```

#### Eventos de Formulário
```javascript
{
  event: 'form_submit',
  form_name: 'login',
  success: true
}
```

#### Eventos de API
```javascript
{
  event: 'api_call',
  event_category: 'api',
  event_label: 'GET /auction/Aureleaf',
  value: 200,
  response_time: 1500
}
```

#### Eventos de Erro
```javascript
{
  event: 'error',
  event_category: 'error',
  event_label: 'api_error',
  error_message: 'Network Error'
}
```

## Configuração de Triggers

### 1. Triggers para Eventos Específicos

#### Login Events
- **Trigger Type**: Custom Event
- **Event Name**: login
- **Fire On**: All Custom Events

#### Calculator Events
- **Trigger Type**: Custom Event
- **Event Name**: calculator_used
- **Fire On**: All Custom Events

#### API Error Events
- **Trigger Type**: Custom Event
- **Event Name**: error
- **Fire On**: All Custom Events
- **Additional Conditions**: event_category equals error

### 2. Triggers para Páginas Específicas

#### Home Page
- **Trigger Type**: Page View
- **Page Path**: equals /home

#### Calculators Page
- **Trigger Type**: Page View
- **Page Path**: equals /calculators

## Configuração de Variáveis

### 1. Data Layer Variables

#### Event Name
- **Variable Type**: Data Layer Variable
- **Data Layer Variable Name**: event

#### Calculator Type
- **Variable Type**: Data Layer Variable
- **Data Layer Variable Name**: calculator_type

#### Character ID
- **Variable Type**: Data Layer Variable
- **Data Layer Variable Name**: character_id

#### Form Name
- **Variable Type**: Data Layer Variable
- **Data Layer Variable Name**: form_name

### 2. Built-in Variables

#### Page Path
- **Variable Type**: Built-in Variable
- **Variable**: Page Path

#### Page URL
- **Variable Type**: Built-in Variable
- **Variable**: Page URL

## Tags Recomendadas

### 1. Google Analytics 4
- **Configuration Tag**: Para tracking básico
- **Event Tags**: Para eventos customizados

### 2. Enhanced Ecommerce (Opcional)
- **Tag Type**: Google Analytics: GA4 Ecommerce
- **Use**: Para tracking de conversões específicas

### 3. Facebook Pixel (Opcional)
- **Tag Type**: Facebook Pixel
- **Use**: Para marketing e remarketing

### 4. Hotjar (Opcional)
- **Tag Type**: Custom HTML
- **Use**: Para análise de comportamento do usuário

## Configuração de Conversões

### 1. Eventos de Conversão

#### Registro Completo
- **Trigger**: form_submit event com form_name = 'registration' e success = true
- **Tag**: GA4 Event com event_name = 'sign_up'

#### Login Bem-sucedido
- **Trigger**: form_submit event com form_name = 'login' e success = true
- **Tag**: GA4 Event com event_name = 'login'

#### Uso de Calculadora
- **Trigger**: calculator_used event
- **Tag**: GA4 Event com event_name = 'calculator_used'

### 2. Funnels de Conversão

#### Funnel de Registro
1. Page View → /register
2. Form Submit → registration (success = false)
3. Form Submit → verification (success = true)
4. Page View → /home

#### Funnel de Calculadora
1. Page View → /calculators
2. Calculator Used → calculator_used
3. Form Submit → calculator_form (success = true)

## Debugging e Teste

### 1. Preview Mode
1. Clique em **Preview** no GTM
2. Acesse a aplicação
3. Verifique se os eventos estão sendo disparados

### 2. Data Layer Debug
```javascript
// No console do navegador
console.log(window.dataLayer);
```

### 3. Google Analytics Debug
1. Instale a extensão "Google Analytics Debugger"
2. Ative o debug mode
3. Verifique os eventos no console

## Monitoramento

### 1. Relatórios Importantes
- **Real-time**: Para verificar se os eventos estão funcionando
- **Events**: Para analisar eventos customizados
- **Conversions**: Para acompanhar conversões
- **User Engagement**: Para entender comportamento

### 2. Alertas Recomendados
- **Erro de API**: Quando event_category = 'error'
- **Falha de Login**: Quando form_submit com success = false
- **Falha de Registro**: Quando form_submit com success = false

## Manutenção

### 1. Verificações Regulares
- Teste eventos após deploy
- Verifique se novos eventos estão sendo capturados
- Monitore performance das tags

### 2. Atualizações
- Mantenha o GTM atualizado
- Revise configurações periodicamente
- Otimize tags para performance

## Troubleshooting

### Problemas Comuns

#### Eventos não aparecem no GA4
1. Verifique se a tag GA4 está configurada corretamente
2. Confirme se o Measurement ID está correto
3. Verifique se os triggers estão funcionando

#### DataLayer não está sendo populado
1. Verifique se o script GTM está carregado
2. Confirme se o AnalyticsService está funcionando
3. Verifique console para erros JavaScript

#### Performance lenta
1. Revise quantidade de tags
2. Otimize triggers
3. Use tag firing rules para limitar execução

## Suporte

Para dúvidas sobre configuração:
1. Consulte a documentação oficial do GTM
2. Verifique logs de debug
3. Teste em ambiente de desenvolvimento
4. Use o Preview Mode para validação 