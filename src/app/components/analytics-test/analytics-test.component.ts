import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDebugService } from '../../services/analytics-debug.service';

@Component({
  selector: 'app-analytics-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-test-container">
      <h2>🧪 Testes do Google Tag Manager</h2>
      
      <div class="test-section">
        <h3>Status do DataLayer</h3>
        <div class="status-indicator" [class.success]="dataLayerStatus" [class.error]="!dataLayerStatus">
          {{ dataLayerStatus ? '✅ DataLayer Ativo' : '❌ DataLayer Inativo' }}
        </div>
        <button (click)="checkDataLayer()" class="test-btn">Verificar DataLayer</button>
      </div>

      <div class="test-section">
        <h3>Testes Individuais</h3>
        <div class="test-buttons">
          <button (click)="runTest('basic')" class="test-btn">Eventos Básicos</button>
          <button (click)="runTest('auth')" class="test-btn">Autenticação</button>
          <button (click)="runTest('calculator')" class="test-btn">Calculadoras</button>
          <button (click)="runTest('consult')" class="test-btn">Consulta</button>
          <button (click)="runTest('mastery')" class="test-btn">Masteries</button>
          <button (click)="runTest('simulation')" class="test-btn">Simulação</button>
          <button (click)="runTest('form')" class="test-btn">Formulários</button>
          <button (click)="runTest('button')" class="test-btn">Botões</button>
          <button (click)="runTest('search')" class="test-btn">Busca</button>
          <button (click)="runTest('error')" class="test-btn">Erros</button>
          <button (click)="runTest('api')" class="test-btn">API</button>
          <button (click)="runTest('engagement')" class="test-btn">Engajamento</button>
        </div>
      </div>

      <div class="test-section">
        <h3>Teste Completo</h3>
        <button (click)="runAllTests()" class="test-btn primary">Executar Todos os Testes</button>
        <button (click)="clearDataLayer()" class="test-btn secondary">Limpar DataLayer</button>
      </div>

      <div class="test-section">
        <h3>Resultados</h3>
        <div class="results">
          <div class="result-item">
            <strong>Total de Eventos:</strong> {{ totalEvents }}
          </div>
          <div class="result-item">
            <strong>Último Teste:</strong> {{ lastTest }}
          </div>
          <div class="result-item">
            <strong>Status:</strong> {{ testStatus }}
          </div>
        </div>
        <button (click)="showEventCounts()" class="test-btn">Ver Contagem de Eventos</button>
      </div>

      <div class="test-section">
        <h3>Instruções</h3>
        <div class="instructions">
          <p>1. Abra o console do navegador (F12)</p>
          <p>2. Execute os testes desejados</p>
          <p>3. Verifique os eventos no console</p>
          <p>4. Use o Preview Mode do GTM para validar</p>
          <p>5. Verifique o dataLayer: <code>console.log(window.dataLayer)</code></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-test-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
      font-family: Arial, sans-serif;
    }

    h2 {
      color: #333;
      text-align: center;
      margin-bottom: 30px;
    }

    h3 {
      color: #555;
      margin-bottom: 15px;
      border-bottom: 2px solid #ddd;
      padding-bottom: 5px;
    }

    .test-section {
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .status-indicator {
      padding: 10px;
      border-radius: 4px;
      font-weight: bold;
      margin-bottom: 15px;
      text-align: center;
    }

    .status-indicator.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .status-indicator.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .test-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-bottom: 15px;
    }

    .test-btn {
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .test-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .test-btn.primary {
      background: #007bff;
      color: white;
    }

    .test-btn.primary:hover {
      background: #0056b3;
    }

    .test-btn.secondary {
      background: #6c757d;
      color: white;
    }

    .test-btn.secondary:hover {
      background: #545b62;
    }

    .test-btn:not(.primary):not(.secondary) {
      background: #28a745;
      color: white;
    }

    .test-btn:not(.primary):not(.secondary):hover {
      background: #1e7e34;
    }

    .results {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .result-item {
      margin-bottom: 8px;
    }

    .instructions {
      background: #e7f3ff;
      padding: 15px;
      border-radius: 4px;
      border-left: 4px solid #007bff;
    }

    .instructions p {
      margin: 5px 0;
      color: #333;
    }

    .instructions code {
      background: #f1f1f1;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }
  `]
})
export class AnalyticsTestComponent {
  dataLayerStatus = false;
  totalEvents = 0;
  lastTest = 'Nenhum';
  testStatus = 'Aguardando';

  constructor(private analyticsDebugService: AnalyticsDebugService) {
    this.checkDataLayer();
  }

  checkDataLayer(): void {
    this.dataLayerStatus = this.analyticsDebugService.testDataLayerInitialization();
    this.updateEventCount();
  }

  runTest(testType: string): void {
    this.lastTest = testType;
    this.testStatus = 'Executando...';

    switch (testType) {
      case 'basic':
        this.analyticsDebugService.testBasicEvents();
        break;
      case 'auth':
        this.analyticsDebugService.testAuthEvents();
        break;
      case 'calculator':
        this.analyticsDebugService.testCalculatorEvents();
        break;
      case 'consult':
        this.analyticsDebugService.testConsultEvents();
        break;
      case 'mastery':
        this.analyticsDebugService.testMasteryEvents();
        break;
      case 'simulation':
        this.analyticsDebugService.testSimulationEvents();
        break;
      case 'form':
        this.analyticsDebugService.testFormEvents();
        break;
      case 'button':
        this.analyticsDebugService.testButtonEvents();
        break;
      case 'search':
        this.analyticsDebugService.testSearchEvents();
        break;
      case 'error':
        this.analyticsDebugService.testErrorEvents();
        break;
      case 'api':
        this.analyticsDebugService.testApiEvents();
        break;
      case 'engagement':
        this.analyticsDebugService.testEngagementEvents();
        break;
    }

    this.testStatus = 'Concluído';
    this.updateEventCount();
  }

  runAllTests(): void {
    this.lastTest = 'Todos os Testes';
    this.testStatus = 'Executando...';
    
    this.analyticsDebugService.runAllTests();
    
    this.testStatus = 'Concluído';
    this.updateEventCount();
  }

  clearDataLayer(): void {
    this.analyticsDebugService.clearDataLayer();
    this.updateEventCount();
    this.testStatus = 'DataLayer Limpo';
  }

  showEventCounts(): void {
    this.analyticsDebugService.checkDataLayerEvents();
  }

  private updateEventCount(): void {
    if (typeof window !== 'undefined' && window.dataLayer) {
      this.totalEvents = window.dataLayer.length;
    } else {
      this.totalEvents = 0;
    }
  }
} 