// Script de Teste para Google Analytics - Charlovinho
// Execute este script no console do navegador para testar os disparos de eventos

console.log('🚀 Iniciando testes do Google Analytics...');

// Função para testar se o gtag está disponível
function testGtagAvailability() {
  console.log('📊 Verificando disponibilidade do gtag...');
  
  if (typeof window.gtag === 'function') {
    console.log('✅ gtag está disponível');
    return true;
  } else {
    console.log('❌ gtag não está disponível');
    return false;
  }
}

// Função para testar eventos básicos
function testBasicEvents() {
  console.log('\n🎯 Testando eventos básicos...');
  
  // Teste de evento customizado
  window.gtag('event', 'test_event', {
    'event_category': 'test',
    'event_label': 'basic_test',
    'value': 1
  });
  console.log('✅ Evento customizado disparado');
  
  // Teste de page_view
  window.gtag('event', 'page_view', {
    'page_title': 'Test Page',
    'page_location': window.location.href
  });
  console.log('✅ Page view disparado');
}

// Função para testar eventos de autenticação
function testAuthEvents() {
  console.log('\n🔐 Testando eventos de autenticação...');
  
  // Login
  window.gtag('event', 'login', {
    'method': 'email'
  });
  console.log('✅ Login disparado');
  
  // Logout
  window.gtag('event', 'logout');
  console.log('✅ Logout disparado');
  
  // Registro
  window.gtag('event', 'sign_up', {
    'method': 'email'
  });
  console.log('✅ Registro disparado');
}

// Função para testar eventos de calculadoras
function testCalculatorEvents() {
  console.log('\n🧮 Testando eventos de calculadoras...');
  
  // Exercise Weapons
  window.gtag('event', 'calculator_used', {
    'calculator_type': 'exercise-weapons',
    'parameters': JSON.stringify({
      'vocation': 'knight',
      'skill': 'melee',
      'current_level': 100,
      'target_level': 110
    })
  });
  console.log('✅ Calculadora Exercise Weapons disparada');
  
  // Stamina
  window.gtag('event', 'calculator_used', {
    'calculator_type': 'stamina',
    'parameters': JSON.stringify({
      'current_stamina': 42,
      'target_stamina': 50
    })
  });
  console.log('✅ Calculadora Stamina disparada');
  
  // Charm Damage
  window.gtag('event', 'calculator_used', {
    'calculator_type': 'charm-damage',
    'parameters': JSON.stringify({
      'damage': 1000,
      'creature_hp': 5000,
      'resistance': 0.5
    })
  });
  console.log('✅ Calculadora Charm Damage disparada');
  
  // Loot Split
  window.gtag('event', 'calculator_used', {
    'calculator_type': 'loot-split',
    'parameters': JSON.stringify({
      'session_value': 50000,
      'participants': 4
    })
  });
  console.log('✅ Calculadora Loot Split disparada');
}

// Função para testar eventos de consulta
function testConsultEvents() {
  console.log('\n👤 Testando eventos de consulta...');
  
  // Consulta de personagem
  window.gtag('event', 'character_consultation', {
    'character_id': 'Aureleaf'
  });
  console.log('✅ Consulta de personagem disparada');
  
  // Busca
  window.gtag('event', 'search', {
    'search_term': 'Aureleaf',
    'search_type': 'character'
  });
  console.log('✅ Busca disparada');
}

// Função para testar eventos de maestria
function testMasteryEvents() {
  console.log('\n⚔️ Testando eventos de maestria...');
  
  // Seleção de maestria
  window.gtag('event', 'mastery_action', {
    'action': 'select',
    'mastery_type': 'Hard'
  });
  console.log('✅ Seleção de maestria disparada');
  
  // Upload de arquivo
  window.gtag('event', 'mastery_action', {
    'action': 'upload',
    'mastery_type': 'file_upload'
  });
  console.log('✅ Upload de maestria disparado');
  
  // Salvamento
  window.gtag('event', 'mastery_action', {
    'action': 'save',
    'mastery_type': 'selection'
  });
  console.log('✅ Salvamento de maestria disparado');
}

// Função para testar eventos de simulação
function testSimulationEvents() {
  console.log('\n🎮 Testando eventos de simulação...');
  
  // Início de simulação
  window.gtag('event', 'simulation_used', {
    'simulation_type': 'start',
    'parameters': JSON.stringify({
      'charName': 'Aureleaf',
      'totalProgress': 75
    })
  });
  console.log('✅ Início de simulação disparado');
  
  // Exportação
  window.gtag('event', 'simulation_used', {
    'simulation_type': 'export',
    'parameters': JSON.stringify({
      'format': 'json'
    })
  });
  console.log('✅ Exportação de simulação disparada');
  
  // Importação
  window.gtag('event', 'simulation_used', {
    'simulation_type': 'import',
    'parameters': JSON.stringify({
      'format': 'json',
      'success': true
    })
  });
  console.log('✅ Importação de simulação disparada');
}

// Função para testar eventos de formulários
function testFormEvents() {
  console.log('\n📋 Testando eventos de formulários...');
  
  // Submissão de formulário
  window.gtag('event', 'form_submit', {
    'form_name': 'login',
    'success': true
  });
  console.log('✅ Submissão de formulário disparada');
  
  // Erro de formulário
  window.gtag('event', 'form_submit', {
    'form_name': 'registration',
    'success': false
  });
  console.log('✅ Erro de formulário disparado');
}

// Função para testar eventos de botões
function testButtonEvents() {
  console.log('\n🔘 Testando eventos de botões...');
  
  // Clique em botão
  window.gtag('event', 'button_click', {
    'button_name': 'login_button',
    'page': '/login'
  });
  console.log('✅ Clique em botão disparado');
  
  // Clique em botão de navegação
  window.gtag('event', 'button_click', {
    'button_name': 'home_button',
    'page': '/home'
  });
  console.log('✅ Clique em botão de navegação disparado');
}

// Função para testar eventos de erro
function testErrorEvents() {
  console.log('\n🚨 Testando eventos de erro...');
  
  // Erro de API
  window.gtag('event', 'error', {
    'event_category': 'error',
    'event_label': 'api_error',
    'error_message': 'Network Error',
    'error_stack': 'Error: Network Error'
  });
  console.log('✅ Erro de API disparado');
  
  // Erro de validação
  window.gtag('event', 'error', {
    'event_category': 'error',
    'event_label': 'validation_error',
    'error_message': 'Invalid email format'
  });
  console.log('✅ Erro de validação disparado');
}

// Função para testar eventos de API
function testApiEvents() {
  console.log('\n🌐 Testando eventos de API...');
  
  // Chamada de API bem-sucedida
  window.gtag('event', 'api_call', {
    'event_category': 'api',
    'event_label': 'GET /auction/Aureleaf',
    'value': 200,
    'response_time': 1500
  });
  console.log('✅ Chamada de API bem-sucedida disparada');
  
  // Chamada de API com erro
  window.gtag('event', 'api_call', {
    'event_category': 'api',
    'event_label': 'POST /login',
    'value': 401,
    'response_time': 800
  });
  console.log('✅ Chamada de API com erro disparada');
}

// Função para testar eventos de engajamento
function testEngagementEvents() {
  console.log('\n💫 Testando eventos de engajamento...');
  
  // Tempo na página
  window.gtag('event', 'time_on_page', {
    'page': '/home',
    'time_spent': 300
  });
  console.log('✅ Tempo na página disparado');
  
  // Engajamento
  window.gtag('event', 'engagement', {
    'action': 'scroll',
    'content': 'home_page'
  });
  console.log('✅ Engajamento disparado');
}

// Função para testar eventos de conquistas
function testAchievementEvents() {
  console.log('\n🏆 Testando eventos de conquistas...');
  
  // Visualização de conquista
  window.gtag('event', 'achievement_action', {
    'action': 'view',
    'achievement_type': 'rare'
  });
  console.log('✅ Visualização de conquista disparada');
  
  // Busca de conquista
  window.gtag('event', 'achievement_action', {
    'action': 'search',
    'achievement_type': 'quest'
  });
  console.log('✅ Busca de conquista disparada');
}

// Função para testar eventos de roupas/montarias
function testOutfitMountEvents() {
  console.log('\n👕 Testando eventos de roupas/montarias...');
  
  // Visualização de roupa
  window.gtag('event', 'outfit_mount_action', {
    'action': 'view',
    'item_type': 'outfit',
    'item_name': 'Knight Outfit'
  });
  console.log('✅ Visualização de roupa disparada');
  
  // Visualização de montaria
  window.gtag('event', 'outfit_mount_action', {
    'action': 'view',
    'item_type': 'mount',
    'item_name': 'War Horse'
  });
  console.log('✅ Visualização de montaria disparada');
}

// Função para testar eventos de quests
function testQuestEvents() {
  console.log('\n📜 Testando eventos de quests...');
  
  // Visualização de quest
  window.gtag('event', 'quest_action', {
    'action': 'view',
    'quest_name': 'The Ancient Tomes'
  });
  console.log('✅ Visualização de quest disparada');
  
  // Busca de quest
  window.gtag('event', 'quest_action', {
    'action': 'search',
    'quest_name': 'dragon'
  });
  console.log('✅ Busca de quest disparada');
}

// Função para testar eventos de gemas
function testGemEvents() {
  console.log('\n💎 Testando eventos de gemas...');
  
  // Visualização de gema
  window.gtag('event', 'gem_action', {
    'action': 'view',
    'gem_type': 'damage'
  });
  console.log('✅ Visualização de gema disparada');
  
  // Busca de gema
  window.gtag('event', 'gem_action', {
    'action': 'search',
    'gem_type': 'healing'
  });
  console.log('✅ Busca de gema disparada');
}

// Função principal para executar todos os testes
function runAllTests() {
  console.log('🎯 Iniciando todos os testes do Google Analytics...\n');
  
  if (!testGtagAvailability()) {
    console.log('❌ Testes interrompidos - gtag não disponível');
    return;
  }
  
  testBasicEvents();
  testAuthEvents();
  testCalculatorEvents();
  testConsultEvents();
  testMasteryEvents();
  testSimulationEvents();
  testFormEvents();
  testButtonEvents();
  testErrorEvents();
  testApiEvents();
  testEngagementEvents();
  testAchievementEvents();
  testOutfitMountEvents();
  testQuestEvents();
  testGemEvents();
  
  console.log('\n🎉 Todos os testes foram executados!');
  console.log('📊 Verifique o Google Analytics Real-Time para confirmar os eventos.');
}

// Função para testar eventos específicos
function testSpecificEvent(eventName, parameters = {}) {
  console.log(`🎯 Testando evento específico: ${eventName}`);
  
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, parameters);
    console.log('✅ Evento disparado com sucesso');
    console.log('📊 Parâmetros:', parameters);
  } else {
    console.log('❌ gtag não disponível');
  }
}

// Expor funções para uso no console
window.analyticsTests = {
  runAllTests,
  testSpecificEvent,
  testGtagAvailability,
  testBasicEvents,
  testAuthEvents,
  testCalculatorEvents,
  testConsultEvents,
  testMasteryEvents,
  testSimulationEvents,
  testFormEvents,
  testButtonEvents,
  testErrorEvents,
  testApiEvents,
  testEngagementEvents,
  testAchievementEvents,
  testOutfitMountEvents,
  testQuestEvents,
  testGemEvents
};

console.log('📚 Funções de teste disponíveis em window.analyticsTests');
console.log('🚀 Execute window.analyticsTests.runAllTests() para testar todos os eventos');
console.log('🎯 Execute window.analyticsTests.testSpecificEvent("event_name", {param: "value"}) para testar evento específico'); 