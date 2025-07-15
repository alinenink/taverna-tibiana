# Configuração do Google Analytics no Charlovinho

Este documento descreve a configuração e implementação do Google Analytics (GA4) no projeto Charlovinho.

## Configuração Inicial

### 1. ID do Google Analytics
- **ID da Propriedade**: `G-G7E8VTW2XD`
- **Tipo**: Google Analytics 4 (GA4)

### 2. Script de Implementação

O script do Google Analytics foi implementado no arquivo `src/index.html`:

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

## Estrutura de Eventos

### Eventos Automáticos

O Google Analytics automaticamente rastreia:
- **page_view** - Visualizações de página
- **session_start** - Início de sessão
- **user_engagement** - Engajamento do usuário

### Eventos Customizados

Nossa implementação rastreia os seguintes eventos customizados:

#### Autenticação
- `login` - Login de usuário
- `logout` - Logout de usuário
- `sign_up` - Registro de usuário

#### Interações do Usuário
- `user_action` - Ações gerais do usuário
- `button_click` - Cliques em botões
- `form_submit` - Submissões de formulários
- `search` - Buscas realizadas

#### Funcionalidades Específicas
- `calculator_used` - Uso de calculadoras
- `character_consultation` - Consultas de personagens
- `mastery_action` - Ações de maestria
- `simulation_used` - Uso de simulações
- `achievement_action` - Ações de conquistas
- `outfit_mount_action` - Ações de roupas/montarias
- `quest_action` - Ações de quests
- `gem_action` - Ações de gemas

#### Performance e Erros
- `api_call` - Chamadas de API
- `error` - Erros da aplicação
- `time_on_page` - Tempo em páginas

## Configuração no Google Analytics

### 1. Acesso ao Google Analytics

1. Acesse [analytics.google.com](https://analytics.google.com)
2. Faça login com a conta Google associada ao projeto
3. Selecione a propriedade `G-G7E8VTW2XD`

### 2. Configuração de Eventos

#### Eventos Personalizados
No Google Analytics, vá para:
1. **Configure** > **Events** > **Custom Definitions**
2. Crie parâmetros personalizados para eventos importantes:

**Parâmetros Sugeridos:**
- `calculator_type` - Tipo de calculadora usada
- `character_id` - ID do personagem consultado
- `mastery_type` - Tipo de maestria
- `simulation_type` - Tipo de simulação
- `error_type` - Tipo de erro
- `api_endpoint` - Endpoint da API
- `response_time` - Tempo de resposta da API

### 3. Configuração de Conversões

#### Goals Sugeridos
1. **Registro de Usuário**
   - Evento: `sign_up`
   - Valor: 1

2. **Login de Usuário**
   - Evento: `login`
   - Valor: 1

3. **Uso de Calculadora**
   - Evento: `calculator_used`
   - Valor: 1

4. **Consulta de Personagem**
   - Evento: `character_consultation`
   - Valor: 1

### 4. Configuração de Relatórios

#### Relatórios Customizados Sugeridos

1. **Engajamento por Funcionalidade**
   - Métricas: Eventos por funcionalidade
   - Dimensões: Tipo de calculadora, tipo de maestria, etc.

2. **Performance de API**
   - Métricas: Tempo de resposta, taxa de erro
   - Dimensões: Endpoint, método HTTP

3. **Funnel de Usuário**
   - Registro → Login → Uso de funcionalidades

4. **Erros e Problemas**
   - Métricas: Contagem de erros
   - Dimensões: Tipo de erro, página

## Configuração de Alertas

### Alertas Sugeridos

1. **Taxa de Erro Alta**
   - Condição: Taxa de erro > 5%
   - Ação: Email de notificação

2. **Performance Degradada**
   - Condição: Tempo médio de resposta > 2s
   - Ação: Email de notificação

3. **Queda no Tráfego**
   - Condição: Usuários ativos < 50% da média
   - Ação: Email de notificação

## Configuração de Segmentação

### Segmentos Sugeridos

1. **Usuários Ativos**
   - Critério: Usuários que realizaram login nos últimos 30 dias

2. **Usuários de Calculadoras**
   - Critério: Usuários que usaram calculadoras

3. **Usuários de Consulta**
   - Critério: Usuários que consultaram personagens

4. **Usuários de Maestria**
   - Critério: Usuários que interagiram com maestrias

## Configuração de Privacidade

### 1. Consentimento de Cookies

Implementar banner de consentimento para GDPR:
```typescript
// Exemplo de implementação
if (userConsent) {
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
}
```

### 2. Anonimização de IP

Configurar anonimização de IP no Google Analytics:
```javascript
gtag('config', 'G-G7E8VTW2XD', {
  'anonymize_ip': true
});
```

### 3. Retenção de Dados

Configurar retenção de dados conforme necessário:
- Dados de usuário: 26 meses
- Dados de eventos: 14 meses

## Monitoramento e Debug

### 1. Debug Mode

Para desenvolvimento, ativar debug mode:
```javascript
gtag('config', 'G-G7E8VTW2XD', {
  'debug_mode': true
});
```

### 2. Google Analytics Debugger

Instalar extensão do Chrome para debug:
- [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)

### 3. Verificação de Eventos

No console do navegador:
```javascript
// Verificar se gtag está disponível
console.log(typeof window.gtag);

// Verificar eventos disparados
gtag('event', 'test_event', {
  'event_category': 'test',
  'event_label': 'debug'
});
```

## Configuração de Integrações

### 1. Google Search Console

Conectar Google Search Console para análise de SEO.

### 2. Google Ads

Conectar Google Ads para remarketing e conversões.

### 3. Google Data Studio

Criar dashboards personalizados no Data Studio.

## Manutenção

### 1. Verificações Regulares

- Monitorar eventos no Google Analytics Real-Time
- Verificar se todos os eventos estão sendo disparados
- Analisar relatórios de performance

### 2. Atualizações

- Manter documentação atualizada
- Revisar parâmetros dos eventos conforme necessário
- Atualizar configurações de privacidade

### 3. Backup

- Manter backup das configurações
- Documentar mudanças realizadas
- Versionar configurações importantes

## Troubleshooting

### Problemas Comuns

1. **Eventos não aparecem no GA**
   - Verificar se o script está carregado
   - Verificar se o ID está correto
   - Verificar console para erros

2. **Eventos duplicados**
   - Verificar se o serviço não está sendo chamado múltiplas vezes
   - Verificar se não há múltiplas instâncias do script

3. **Performance degradada**
   - Verificar se não há loops infinitos
   - Verificar se eventos não estão sendo disparados excessivamente

### Contatos

Para suporte técnico:
- Google Analytics Help Center
- Documentação oficial do GA4
- Comunidade do Google Analytics 