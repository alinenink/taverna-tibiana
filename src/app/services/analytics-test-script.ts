// Script de teste do Google Tag Manager - Taverna Tibiana
// Execute este script no console do navegador para testar todos os eventos

(function() {
  console.log('🚀 Iniciando testes do Google Tag Manager...');
  
  // Verificar se o dataLayer está disponível
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.error('❌ DataLayer não encontrado. Verifique se o GTM está carregado.');
    return;
  }
  
  console.log('✅ DataLayer encontrado:', window.dataLayer);
  
  // Função para simular eventos do AnalyticsService
  function pushToDataLayer(event: string, parameters?: any) {
    const eventData = {
      event: event,
      ...parameters
    };
    window.dataLayer.push(eventData);
    console.log('📤 Evento enviado:', eventData);
  }
  
  // Teste 1: Eventos básicos
  console.log('\n🧪 Teste 1: Eventos básicos');
  pushToDataLayer('page_view', { page_path: '/test-page' });
  pushToDataLayer('test_event', { test_param: 'test_value', timestamp: new Date().toISOString() });
  pushToDataLayer('user_action', { event_category: 'test_category', event_label: 'test_label', value: 100, action: 'test_action' });
  
  // Teste 2: Eventos de autenticação
  console.log('\n🧪 Teste 2: Eventos de autenticação');
  pushToDataLayer('login', { method: 'email' });
  pushToDataLayer('logout');
  pushToDataLayer('sign_up', { method: 'email' });
  
  // Teste 3: Eventos de calculadora
  console.log('\n🧪 Teste 3: Eventos de calculadora');
  pushToDataLayer('calculator_used', { 
    calculator_type: 'exercise-weapons',
    parameters: JSON.stringify({
      vocation: 'knight',
      skill: 'melee',
      currentSkill: 100,
      targetSkill: 110
    })
  });
  pushToDataLayer('calculator_used', { 
    calculator_type: 'stamina',
    parameters: JSON.stringify({
      currentStamina: 3600,
      targetStamina: 7200
    })
  });
  pushToDataLayer('calculator_used', { 
    calculator_type: 'charm-damage',
    parameters: JSON.stringify({
      averageDamage: 500,
      creatureHp: 1000,
      bonusResistance: 0
    })
  });
  pushToDataLayer('calculator_used', { 
    calculator_type: 'loot-split',
    parameters: JSON.stringify({
      session: 'test-session-123'
    })
  });
  
  // Teste 4: Eventos de consulta
  console.log('\n🧪 Teste 4: Eventos de consulta');
  pushToDataLayer('character_consultation', { character_id: 'Aureleaf' });
  pushToDataLayer('character_consultation', { character_id: 'TestCharacter' });
  
  // Teste 5: Eventos de mastery
  console.log('\n🧪 Teste 5: Eventos de mastery');
  pushToDataLayer('mastery_action', { action: 'select', mastery_type: 'Hard' });
  pushToDataLayer('mastery_action', { action: 'deselect', mastery_type: 'Easy' });
  pushToDataLayer('mastery_action', { action: 'upload', mastery_type: 'mastery-file.json' });
  pushToDataLayer('mastery_action', { action: 'save', mastery_type: 'selected_masteries' });
  
  // Teste 6: Eventos de simulação
  console.log('\n🧪 Teste 6: Eventos de simulação');
  pushToDataLayer('simulation_used', { simulation_type: 'tab_selection', parameters: JSON.stringify({ tab: 'achievements' }) });
  pushToDataLayer('simulation_used', { 
    simulation_type: 'start',
    parameters: JSON.stringify({ charName: 'TestChar', totalProgress: 75 })
  });
  pushToDataLayer('simulation_used', { 
    simulation_type: 'export_json',
    parameters: JSON.stringify({ charName: 'TestChar', totalProgress: 80 })
  });
  pushToDataLayer('simulation_used', { simulation_type: 'import_json', parameters: JSON.stringify({}) });
  pushToDataLayer('simulation_used', { simulation_type: 'import_success', parameters: JSON.stringify({ charName: 'TestChar' }) });
  
  // Teste 7: Eventos de formulário
  console.log('\n🧪 Teste 7: Eventos de formulário');
  pushToDataLayer('form_submit', { form_name: 'login', success: true });
  pushToDataLayer('form_submit', { form_name: 'login', success: false });
  pushToDataLayer('form_submit', { form_name: 'registration', success: true });
  pushToDataLayer('form_submit', { form_name: 'registration', success: false });
  pushToDataLayer('form_submit', { form_name: 'verification', success: true });
  pushToDataLayer('form_submit', { form_name: 'password_recovery', success: true });
  
  // Teste 8: Eventos de botão
  console.log('\n🧪 Teste 8: Eventos de botão');
  pushToDataLayer('button_click', { button_name: 'help_modal', page: 'home' });
  pushToDataLayer('button_click', { button_name: 'navigate_simulation', page: 'home' });
  pushToDataLayer('button_click', { button_name: 'submit_calculator', page: 'calculators' });
  pushToDataLayer('button_click', { button_name: 'search_character', page: 'consult' });
  
  // Teste 9: Eventos de busca
  console.log('\n🧪 Teste 9: Eventos de busca');
  pushToDataLayer('search', { search_term: 'Aureleaf', search_type: 'character' });
  pushToDataLayer('search', { search_term: 'Hard', search_type: 'mastery' });
  pushToDataLayer('search', { search_term: 'knight', search_type: 'calculator' });
  
  // Teste 10: Eventos de erro
  console.log('\n🧪 Teste 10: Eventos de erro');
  pushToDataLayer('error', { 
    event_category: 'error',
    event_label: 'api_error',
    error_message: 'Network Error',
    error_stack: 'Error stack trace'
  });
  pushToDataLayer('error', { 
    event_category: 'error',
    event_label: 'validation_error',
    error_message: 'Invalid email format',
    error_stack: 'Form validation'
  });
  pushToDataLayer('error', { 
    event_category: 'error',
    event_label: 'import_error',
    error_message: 'File format not supported',
    error_stack: 'JSON import'
  });
  
  // Teste 11: Eventos de API
  console.log('\n🧪 Teste 11: Eventos de API');
  pushToDataLayer('api_call', { 
    event_category: 'api',
    event_label: 'POST /auth/login',
    value: 200,
    response_time: 1500
  });
  pushToDataLayer('api_call', { 
    event_category: 'api',
    event_label: 'GET /auction/Aureleaf',
    value: 200,
    response_time: 800
  });
  pushToDataLayer('api_call', { 
    event_category: 'api',
    event_label: 'POST /calculators/exercise-weapons',
    value: 200,
    response_time: 1200
  });
  pushToDataLayer('api_call', { 
    event_category: 'api',
    event_label: 'POST /auth/login',
    value: 401,
    response_time: 500
  });
  pushToDataLayer('api_call', { 
    event_category: 'api',
    event_label: 'GET /auction/InvalidChar',
    value: 404,
    response_time: 300
  });
  
  // Teste 12: Eventos de engajamento
  console.log('\n🧪 Teste 12: Eventos de engajamento');
  pushToDataLayer('engagement', { action: 'scroll', content: 'home_page' });
  pushToDataLayer('engagement', { action: 'click', content: 'calculator_button' });
  pushToDataLayer('engagement', { action: 'hover', content: 'mastery_item' });
  
  // Resumo final
  console.log('\n🎉 Todos os testes concluídos!');
  console.log('📊 Total de eventos no dataLayer:', window.dataLayer.length);
  
  // Contagem de eventos por tipo
  const eventCounts: { [key: string]: number } = {};
  window.dataLayer.forEach((item: any) => {
    if (item.event) {
      eventCounts[item.event] = (eventCounts[item.event] || 0) + 1;
    }
  });
  
  console.log('📋 Contagem de eventos por tipo:', eventCounts);
  console.log('\n🔍 Para verificar no GTM:');
  console.log('1. Acesse o Google Tag Manager');
  console.log('2. Use o Preview Mode');
  console.log('3. Navegue pela aplicação');
  console.log('4. Verifique se os eventos estão sendo capturados');
  
})(); 