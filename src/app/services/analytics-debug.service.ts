import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsDebugService {

  constructor(private analyticsService: AnalyticsService) {}

  // Teste de inicialização do dataLayer
  testDataLayerInitialization(): boolean {
    if (typeof window !== 'undefined' && window.dataLayer) {
      console.log('✅ DataLayer inicializado:', window.dataLayer);
      return true;
    } else {
      console.error('❌ DataLayer não encontrado');
      return false;
    }
  }

  // Teste de eventos básicos
  testBasicEvents(): void {
    console.log('🧪 Testando eventos básicos...');
    
    // Teste page view
    this.analyticsService.trackPageView('/test-page');
    
    // Teste evento customizado
    this.analyticsService.trackEvent('test_event', {
      test_param: 'test_value',
      timestamp: new Date().toISOString()
    });
    
    // Teste ação do usuário
    this.analyticsService.trackUserAction('test_action', 'test_category', 'test_label', 100);
    
    console.log('✅ Eventos básicos testados');
  }

  // Teste de eventos de autenticação
  testAuthEvents(): void {
    console.log('🧪 Testando eventos de autenticação...');
    
    this.analyticsService.trackLogin('email');
    this.analyticsService.trackLogout();
    this.analyticsService.trackRegistration('email');
    
    console.log('✅ Eventos de autenticação testados');
  }

  // Teste de eventos de calculadora
  testCalculatorEvents(): void {
    console.log('🧪 Testando eventos de calculadora...');
    
    this.analyticsService.trackCalculatorUsage('exercise-weapons', {
      vocation: 'knight',
      skill: 'melee',
      currentSkill: 100,
      targetSkill: 110
    });
    
    this.analyticsService.trackCalculatorUsage('stamina', {
      currentStamina: 3600,
      targetStamina: 7200
    });
    
    this.analyticsService.trackCalculatorUsage('charm-damage', {
      averageDamage: 500,
      creatureHp: 1000,
      bonusResistance: 0
    });
    
    this.analyticsService.trackCalculatorUsage('loot-split', {
      session: 'test-session-123'
    });
    
    console.log('✅ Eventos de calculadora testados');
  }

  // Teste de eventos de consulta
  testConsultEvents(): void {
    console.log('🧪 Testando eventos de consulta...');
    
    this.analyticsService.trackCharacterConsultation('Aureleaf');
    this.analyticsService.trackCharacterConsultation('TestCharacter');
    
    console.log('✅ Eventos de consulta testados');
  }

  // Teste de eventos de mastery
  testMasteryEvents(): void {
    console.log('🧪 Testando eventos de mastery...');
    
    this.analyticsService.trackMasteryAction('select', 'Hard');
    this.analyticsService.trackMasteryAction('deselect', 'Easy');
    this.analyticsService.trackMasteryAction('upload', 'mastery-file.json');
    this.analyticsService.trackMasteryAction('save', 'selected_masteries');
    
    console.log('✅ Eventos de mastery testados');
  }

  // Teste de eventos de simulação
  testSimulationEvents(): void {
    console.log('🧪 Testando eventos de simulação...');
    
    this.analyticsService.trackSimulationUsage('tab_selection', { tab: 'achievements' });
    this.analyticsService.trackSimulationUsage('start', { 
      charName: 'TestChar',
      totalProgress: 75 
    });
    this.analyticsService.trackSimulationUsage('export_json', { 
      charName: 'TestChar',
      totalProgress: 80 
    });
    this.analyticsService.trackSimulationUsage('import_json', {});
    this.analyticsService.trackSimulationUsage('import_success', { charName: 'TestChar' });
    
    console.log('✅ Eventos de simulação testados');
  }

  // Teste de eventos de formulário
  testFormEvents(): void {
    console.log('🧪 Testando eventos de formulário...');
    
    this.analyticsService.trackFormSubmission('login', true);
    this.analyticsService.trackFormSubmission('login', false);
    this.analyticsService.trackFormSubmission('registration', true);
    this.analyticsService.trackFormSubmission('registration', false);
    this.analyticsService.trackFormSubmission('verification', true);
    this.analyticsService.trackFormSubmission('password_recovery', true);
    
    console.log('✅ Eventos de formulário testados');
  }

  // Teste de eventos de botão
  testButtonEvents(): void {
    console.log('🧪 Testando eventos de botão...');
    
    this.analyticsService.trackButtonClick('help_modal', 'home');
    this.analyticsService.trackButtonClick('navigate_simulation', 'home');
    this.analyticsService.trackButtonClick('submit_calculator', 'calculators');
    this.analyticsService.trackButtonClick('search_character', 'consult');
    
    console.log('✅ Eventos de botão testados');
  }

  // Teste de eventos de busca
  testSearchEvents(): void {
    console.log('🧪 Testando eventos de busca...');
    
    this.analyticsService.trackSearch('Aureleaf', 'character');
    this.analyticsService.trackSearch('Hard', 'mastery');
    this.analyticsService.trackSearch('knight', 'calculator');
    
    console.log('✅ Eventos de busca testados');
  }

  // Teste de eventos de erro
  testErrorEvents(): void {
    console.log('🧪 Testando eventos de erro...');
    
    this.analyticsService.trackError('api_error', 'Network Error', 'Error stack trace');
    this.analyticsService.trackError('validation_error', 'Invalid email format', 'Form validation');
    this.analyticsService.trackError('import_error', 'File format not supported', 'JSON import');
    
    console.log('✅ Eventos de erro testados');
  }

  // Teste de eventos de API
  testApiEvents(): void {
    console.log('🧪 Testando eventos de API...');
    
    this.analyticsService.trackApiCall('/auth/login', 'POST', 200, 1500);
    this.analyticsService.trackApiCall('/auction/Aureleaf', 'GET', 200, 800);
    this.analyticsService.trackApiCall('/calculators/exercise-weapons', 'POST', 200, 1200);
    this.analyticsService.trackApiCall('/auth/login', 'POST', 401, 500);
    this.analyticsService.trackApiCall('/auction/InvalidChar', 'GET', 404, 300);
    
    console.log('✅ Eventos de API testados');
  }

  // Teste de eventos de engajamento
  testEngagementEvents(): void {
    console.log('🧪 Testando eventos de engajamento...');
    
    this.analyticsService.trackEngagement('scroll', 'home_page');
    this.analyticsService.trackEngagement('click', 'calculator_button');
    this.analyticsService.trackEngagement('hover', 'mastery_item');
    
    console.log('✅ Eventos de engajamento testados');
  }

  // Teste completo de todos os eventos
  runAllTests(): void {
    console.log('🚀 Iniciando testes completos do Analytics...');
    
    // Verificar inicialização
    const dataLayerOk = this.testDataLayerInitialization();
    if (!dataLayerOk) {
      console.error('❌ Falha na inicialização do dataLayer');
      return;
    }
    
    // Executar todos os testes
    this.testBasicEvents();
    this.testAuthEvents();
    this.testCalculatorEvents();
    this.testConsultEvents();
    this.testMasteryEvents();
    this.testSimulationEvents();
    this.testFormEvents();
    this.testButtonEvents();
    this.testSearchEvents();
    this.testErrorEvents();
    this.testApiEvents();
    this.testEngagementEvents();
    
    console.log('🎉 Todos os testes concluídos!');
    console.log('📊 Verifique o dataLayer no console para confirmar os eventos:');
    console.log('window.dataLayer');
  }

  // Verificar eventos no dataLayer
  checkDataLayerEvents(): void {
    if (typeof window !== 'undefined' && window.dataLayer) {
      console.log('📊 Eventos no dataLayer:', window.dataLayer);
      console.log('📈 Total de eventos:', window.dataLayer.length);
      
      // Agrupar eventos por tipo
      const eventCounts: { [key: string]: number } = {};
      window.dataLayer.forEach((item: any) => {
        if (item.event) {
          eventCounts[item.event] = (eventCounts[item.event] || 0) + 1;
        }
      });
      
      console.log('📋 Contagem de eventos por tipo:', eventCounts);
    } else {
      console.error('❌ DataLayer não disponível');
    }
  }

  // Limpar dataLayer para testes
  clearDataLayer(): void {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer = [];
      console.log('🧹 DataLayer limpo para novos testes');
    }
  }
} 