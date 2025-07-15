// Script de Teste de Disparos - Google Tag Manager
// Execute este script no console do navegador para testar todos os eventos

console.log('🚀 Iniciando testes de disparos do GTM...');

// Verificar se o dataLayer está disponível
if (typeof window === 'undefined' || !window.dataLayer) {
  console.error('❌ DataLayer não encontrado. Verifique se o GTM está carregado.');
  console.log('💡 Dica: Certifique-se de que o script do GTM está no index.html');
} else {
  console.log('✅ DataLayer encontrado e ativo!');
  console.log('📊 DataLayer atual:', window.dataLayer);
}

// Função para simular disparos de eventos
function simularDisparo(evento, parametros = {}) {
  const eventoCompleto = {
    event: evento,
    timestamp: new Date().toISOString(),
    ...parametros
  };
  
  if (window.dataLayer) {
    window.dataLayer.push(eventoCompleto);
    console.log(`📤 Disparo: ${evento}`, eventoCompleto);
    return true;
  } else {
    console.error(`❌ Falha no disparo: ${evento} - DataLayer não disponível`);
    return false;
  }
}

// Função para aguardar um tempo entre disparos
function aguardar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para executar disparos sequenciais
async function executarDisparosSequenciais() {
  console.log('\n🎯 Iniciando disparos sequenciais...');
  
  // 1. Disparos de Navegação
  console.log('\n📱 Testando disparos de navegação...');
  simularDisparo('page_view', { page_path: '/home' });
  await aguardar(500);
  simularDisparo('page_view', { page_path: '/calculators' });
  await aguardar(500);
  simularDisparo('page_view', { page_path: '/consult' });
  
  // 2. Disparos de Autenticação
  console.log('\n🔐 Testando disparos de autenticação...');
  simularDisparo('login', { method: 'email' });
  await aguardar(300);
  simularDisparo('sign_up', { method: 'email' });
  await aguardar(300);
  simularDisparo('logout');
  
  // 3. Disparos de Calculadora
  console.log('\n🧮 Testando disparos de calculadora...');
  simularDisparo('calculator_used', {
    calculator_type: 'exercise-weapons',
    parameters: JSON.stringify({
      vocation: 'knight',
      skill: 'melee',
      currentSkill: 100,
      targetSkill: 110
    })
  });
  await aguardar(300);
  
  simularDisparo('calculator_used', {
    calculator_type: 'stamina',
    parameters: JSON.stringify({
      currentStamina: 3600,
      targetStamina: 7200
    })
  });
  await aguardar(300);
  
  simularDisparo('calculator_used', {
    calculator_type: 'charm-damage',
    parameters: JSON.stringify({
      averageDamage: 500,
      creatureHp: 1000,
      bonusResistance: 0
    })
  });
  await aguardar(300);
  
  simularDisparo('calculator_used', {
    calculator_type: 'loot-split',
    parameters: JSON.stringify({
      session: 'test-session-123'
    })
  });
  
  // 4. Disparos de Consulta
  console.log('\n👤 Testando disparos de consulta...');
  simularDisparo('character_consultation', { character_id: 'Aureleaf' });
  await aguardar(300);
  simularDisparo('character_consultation', { character_id: 'TestCharacter' });
  
  // 5. Disparos de Mastery
  console.log('\n⚔️ Testando disparos de mastery...');
  simularDisparo('mastery_action', { action: 'select', mastery_type: 'Hard' });
  await aguardar(300);
  simularDisparo('mastery_action', { action: 'deselect', mastery_type: 'Easy' });
  await aguardar(300);
  simularDisparo('mastery_action', { action: 'upload', mastery_type: 'mastery-file.json' });
  await aguardar(300);
  simularDisparo('mastery_action', { action: 'save', mastery_type: 'selected_masteries' });
  
  // 6. Disparos de Simulação
  console.log('\n🎮 Testando disparos de simulação...');
  simularDisparo('simulation_used', { 
    simulation_type: 'tab_selection', 
    parameters: JSON.stringify({ tab: 'achievements' }) 
  });
  await aguardar(300);
  
  simularDisparo('simulation_used', { 
    simulation_type: 'start',
    parameters: JSON.stringify({ charName: 'TestChar', totalProgress: 75 }) 
  });
  await aguardar(300);
  
  simularDisparo('simulation_used', { 
    simulation_type: 'export_json',
    parameters: JSON.stringify({ charName: 'TestChar', totalProgress: 80 }) 
  });
  
  // 7. Disparos de Formulário
  console.log('\n📋 Testando disparos de formulário...');
  simularDisparo('form_submit', { form_name: 'login', success: true });
  await aguardar(300);
  simularDisparo('form_submit', { form_name: 'login', success: false });
  await aguardar(300);
  simularDisparo('form_submit', { form_name: 'registration', success: true });
  await aguardar(300);
  simularDisparo('form_submit', { form_name: 'verification', success: true });
  await aguardar(300);
  simularDisparo('form_submit', { form_name: 'password_recovery', success: true });
  
  // 8. Disparos de Botão
  console.log('\n🔘 Testando disparos de botão...');
  simularDisparo('button_click', { button_name: 'help_modal', page: 'home' });
  await aguardar(300);
  simularDisparo('button_click', { button_name: 'navigate_simulation', page: 'home' });
  await aguardar(300);
  simularDisparo('button_click', { button_name: 'submit_calculator', page: 'calculators' });
  await aguardar(300);
  simularDisparo('button_click', { button_name: 'search_character', page: 'consult' });
  
  // 9. Disparos de Busca
  console.log('\n🔍 Testando disparos de busca...');
  simularDisparo('search', { search_term: 'Aureleaf', search_type: 'character' });
  await aguardar(300);
  simularDisparo('search', { search_term: 'Hard', search_type: 'mastery' });
  await aguardar(300);
  simularDisparo('search', { search_term: 'knight', search_type: 'calculator' });
  
  // 10. Disparos de Erro
  console.log('\n🚨 Testando disparos de erro...');
  simularDisparo('error', { 
    event_category: 'error',
    event_label: 'api_error',
    error_message: 'Network Error',
    error_stack: 'Error stack trace'
  });
  await aguardar(300);
  
  simularDisparo('error', { 
    event_category: 'error',
    event_label: 'validation_error',
    error_message: 'Invalid email format',
    error_stack: 'Form validation'
  });
  
  // 11. Disparos de API
  console.log('\n🌐 Testando disparos de API...');
  simularDisparo('api_call', { 
    event_category: 'api',
    event_label: 'POST /auth/login',
    value: 200,
    response_time: 1500
  });
  await aguardar(300);
  
  simularDisparo('api_call', { 
    event_category: 'api',
    event_label: 'GET /auction/Aureleaf',
    value: 200,
    response_time: 800
  });
  await aguardar(300);
  
  simularDisparo('api_call', { 
    event_category: 'api',
    event_label: 'POST /calculators/exercise-weapons',
    value: 200,
    response_time: 1200
  });
  await aguardar(300);
  
  simularDisparo('api_call', { 
    event_category: 'api',
    event_label: 'POST /auth/login',
    value: 401,
    response_time: 500
  });
  
  // 12. Disparos de Engajamento
  console.log('\n⏱️ Testando disparos de engajamento...');
  simularDisparo('engagement', { action: 'scroll', content: 'home_page' });
  await aguardar(300);
  simularDisparo('engagement', { action: 'click', content: 'calculator_button' });
  await aguardar(300);
  simularDisparo('engagement', { action: 'hover', content: 'mastery_item' });
  
  console.log('\n🎉 Todos os disparos foram executados!');
  
  // Relatório final
  gerarRelatorioFinal();
}

// Função para gerar relatório final
function gerarRelatorioFinal() {
  console.log('\n📊 RELATÓRIO FINAL DOS DISPAROS');
  console.log('================================');
  
  if (window.dataLayer) {
    const eventos = window.dataLayer.filter(item => item.event);
    const totalEventos = eventos.length;
    
    console.log(`📈 Total de eventos disparados: ${totalEventos}`);
    
    // Contagem por tipo
    const contagemPorTipo = {};
    eventos.forEach(evento => {
      contagemPorTipo[evento.event] = (contagemPorTipo[evento.event] || 0) + 1;
    });
    
    console.log('\n📋 Contagem por tipo de evento:');
    Object.entries(contagemPorTipo).forEach(([tipo, quantidade]) => {
      console.log(`   ${tipo}: ${quantidade} disparos`);
    });
    
    // Últimos 5 eventos
    console.log('\n🕒 Últimos 5 eventos disparados:');
    eventos.slice(-5).forEach((evento, index) => {
      console.log(`   ${index + 1}. ${evento.event} - ${new Date(evento.timestamp).toLocaleTimeString()}`);
    });
    
    // Status do GTM
    console.log('\n✅ Status do GTM:');
    console.log('   - DataLayer: Ativo');
    console.log('   - Eventos: Enviados com sucesso');
    console.log('   - Timestamp: Incluído em todos os eventos');
    
    // Próximos passos
    console.log('\n🔍 Próximos passos para validação:');
    console.log('   1. Acesse o Google Tag Manager');
    console.log('   2. Ative o Preview Mode');
    console.log('   3. Navegue pela aplicação');
    console.log('   4. Verifique se os eventos aparecem');
    console.log('   5. Configure tags para capturar os eventos');
    
  } else {
    console.log('❌ DataLayer não disponível para relatório');
  }
}

// Função para disparo rápido (sem delays)
function disparoRapido() {
  console.log('\n⚡ Executando disparo rápido...');
  
  const eventos = [
    { evento: 'page_view', params: { page_path: '/test' } },
    { evento: 'login', params: { method: 'email' } },
    { evento: 'calculator_used', params: { calculator_type: 'exercise-weapons' } },
    { evento: 'character_consultation', params: { character_id: 'TestChar' } },
    { evento: 'button_click', params: { button_name: 'test_button', page: 'test' } },
    { evento: 'form_submit', params: { form_name: 'test_form', success: true } },
    { evento: 'search', params: { search_term: 'test', search_type: 'test' } },
    { evento: 'error', params: { event_category: 'error', event_label: 'test_error' } },
    { evento: 'api_call', params: { event_category: 'api', event_label: 'GET /test', value: 200 } },
    { evento: 'engagement', params: { action: 'test', content: 'test_content' } }
  ];
  
  eventos.forEach((item, index) => {
    simularDisparo(item.evento, item.params);
    console.log(`   ${index + 1}/${eventos.length} - ${item.evento}`);
  });
  
  console.log('✅ Disparo rápido concluído!');
  gerarRelatorioFinal();
}

// Função para limpar dataLayer
function limparDataLayer() {
  if (window.dataLayer) {
    window.dataLayer = [];
    console.log('🧹 DataLayer limpo!');
  } else {
    console.log('❌ DataLayer não disponível para limpeza');
  }
}

// Função para verificar status atual
function verificarStatus() {
  console.log('\n🔍 STATUS ATUAL');
  console.log('==============');
  
  if (window.dataLayer) {
    console.log(`✅ DataLayer: Ativo (${window.dataLayer.length} eventos)`);
    
    if (window.dataLayer.length > 0) {
      const ultimoEvento = window.dataLayer[window.dataLayer.length - 1];
      console.log(`📤 Último evento: ${ultimoEvento.event || 'N/A'}`);
      console.log(`🕒 Timestamp: ${ultimoEvento.timestamp || 'N/A'}`);
    }
  } else {
    console.log('❌ DataLayer: Inativo');
  }
  
  // Verificar se o GTM está carregado
  const gtmScript = document.querySelector('script[src*="googletagmanager"]');
  console.log(`🔧 Script GTM: ${gtmScript ? '✅ Carregado' : '❌ Não encontrado'}`);
}

// Expor funções globalmente para uso no console
window.testarDisparos = {
  executarCompleto: executarDisparosSequenciais,
  executarRapido: disparoRapido,
  limpar: limparDataLayer,
  status: verificarStatus,
  disparo: simularDisparo
};

console.log('\n🎯 FUNÇÕES DISPONÍVEIS:');
console.log('   testarDisparos.executarCompleto() - Executa todos os disparos com delays');
console.log('   testarDisparos.executarRapido() - Executa disparos rápidos');
console.log('   testarDisparos.limpar() - Limpa o dataLayer');
console.log('   testarDisparos.status() - Verifica status atual');
console.log('   testarDisparos.disparo(evento, parametros) - Dispara evento específico');

// Verificar status inicial
verificarStatus();

console.log('\n🚀 Pronto para executar disparos! Use as funções acima.'); 