import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mastery, MasteryService } from '../../services/animous.service';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-animous-mastery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [MasteryService],
  templateUrl: './animous-mastery.component.html',
  styleUrls: ['./animous-mastery.component.scss']
})
export class AnimousMasteryComponent implements OnInit {
  filtros = { nome: '', dificuldade: '', classe: '' };
  criterioOrdenacao: 'name' | 'difficulty' | 'class.name' = 'name';
  isMobile = window.innerWidth <= 768;
  exibirModalExportar = false;
  ordenarPorDificuldade = false;
  ordenarPorAlfabetica = false;
  carregando: boolean = true;

  // Modal visitante
  exibirModalVisitante = false;
  mensagemVisitante = '';

  constructor(
    public service: MasteryService, 
    private router: Router, 
    private authService: AuthService,
    private analyticsService: AnalyticsService
  ) {
    // Carregar masteries do usuário ao inicializar
    this.carregando = true;
    this.service.carregarMasteriesUsuario(() => {
      this.carregando = false;
    });

    // Observar mudanças no signal do serviço para mostrar o modal
    effect(() => {
      if (this.service.showVisitorModal()) {
        this.mensagemVisitante = 'Percebi que você está tentando importar seus pergaminhos lendários como visitante! Se você quer desfrutar de todas as funcionalidades da Taverna, é preciso se registrar!';
        this.exibirModalVisitante = true;
        this.service.showVisitorModal.set(false); // Reset do signal
      }
    });
  }

  // classOptions: { id: number, name: string }[] = [];

  ordenacoes: { [key: string]: boolean } = {
    name: true,
    difficulty: true,
    'class.name': true,
  };

  ngOnInit() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }

  // getUniqueClasses(): { id: number, name: string }[] {
  //   const seen = new Map<number, string>();
  //   (bestData as any[]).forEach((item) => {
  //     if (item.class && !seen.has(item.class.id)) {
  //       seen.set(item.class.id, item.class.name);
  //     }
  //   });
  //   return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  // }

  abrirModalExportar() {
    this.exibirModalExportar = true;
  }
  
  fecharModalExportar() {
    this.exibirModalExportar = false;
    this.ordenarPorDificuldade = false;
    this.ordenarPorAlfabetica = false;
  }
  
  confirmarExportacaoPdf() {
    const dificuldadeMap: Record<string, number> = {
      Harmless: 0,
      Easy: 1,
      Medium: 2,
      Hard: 3,
      Challenging: 4,
      Rare: 5,
    };
  
    const selecionados = [...this.service.selecionados()];
  
    if (this.ordenarPorDificuldade) {
      selecionados.sort((a, b) => {
        const dA = dificuldadeMap[a.difficulty?.trim()] ?? 999;
        const dB = dificuldadeMap[b.difficulty?.trim()] ?? 999;
        return dA - dB;
      });
    } else if (this.ordenarPorAlfabetica) {
      selecionados.sort((a, b) => a.name.localeCompare(b.name));
    }
  
    this.service.exportarPdf(selecionados);
    this.fecharModalExportar();
  }
  

  ordenarPor(campo: 'name' | 'difficulty' | 'class.name') {
    this.ordenacoes[campo] = !this.ordenacoes[campo];
    this.service.ordenarDados(campo, this.ordenacoes[campo]);
  }

  buscar(event?: Event) {
    event?.preventDefault();
    // Track search action
    this.analyticsService.trackSearch(this.filtros.nome, 'mastery');
    
    this.carregando = true;
    this.service.buscar(this.filtros, 1, () => {
      this.carregando = false;
    });
  }

  paginaAnterior() {
    const novaPagina = this.service.paginaAtual() - 1;
    if (novaPagina >= 1) {
      this.carregando = true;
      this.service.buscar(this.filtros, novaPagina, () => {
        this.carregando = false;
      });
    }
  }

  proximaPagina() {
    const novaPagina = this.service.paginaAtual() + 1;
    if (novaPagina <= this.service.totalPaginas()) {
      this.carregando = true;
      this.service.buscar(this.filtros, novaPagina, () => {
        this.carregando = false;
      });
    }
  }

  selecionar(event: any, mastery: any) {
    const checked = event.target.checked;
    this.service.alternarSelecao(mastery, checked);
    
    // Track mastery selection
    this.analyticsService.trackMasteryAction(checked ? 'select' : 'deselect', mastery.difficulty);
  }

  isSelecionado(id: number): boolean {
    return this.service.selecionados().some((m) => m.id === id);
  }

  limparSelecao() {
    this.service.selecionados.set([]);
  }

  onUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Track file upload
      this.analyticsService.trackMasteryAction('upload', file.name);
      
      this.carregando = true;
      this.service.importarJson(file, () => {
        this.carregando = false;
      });
    }
  }

  toggleSelecao(item: Mastery) {
    const isSelected = this.isSelecionado(item.id);
    this.service.alternarSelecao(item, !isSelected);
  }

  salvarSelecionados() {
    // Track save action
    this.analyticsService.trackMasteryAction('save', 'selected_masteries');
    
    this.service.salvarSelecionados().then((errorMsg) => {
      if (
        errorMsg &&
        (errorMsg.includes('Usuário não cadastrado') || 
         errorMsg.toLowerCase().includes('usuário não cadastrado') ||
         errorMsg.includes('nao cadastrado') ||
         errorMsg.toLowerCase().includes('nao cadastrado'))
      ) {
        this.mensagemVisitante =
          'Percebi que você está tentando salvar seus pergaminhos lendários como visitante! Se você quer desfrutar de todas as funcionalidades da Taverna, é preciso se registrar!';
        this.exibirModalVisitante = true;
        this.service.showVisitorModal.set(true);
      }
    });
  }

  salvarComo(item: Mastery, event: Event): void {
    // Prevenir que o click do botão acione o toggleSelecao do card
    event.stopPropagation();

    // Criar objeto com dados do animous mastery
    const animousMasteryData = {
      animous: {
        id: item.id,
        name: item.name,
        difficulty: item.difficulty,
        class: {
          id: item.class.id,
          name: item.class.name,
          image: item.class.image
        },
        occurrence: item.occurrence
      },
      createdAt: new Date().toISOString(),
      version: '1.0'
    };

    // Gerar e baixar arquivo JSON
    const jsonString = JSON.stringify(animousMasteryData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.name.replace(/\s+/g, '_')}_animous.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);

    console.log('Animous Mastery salvo:', animousMasteryData);
  }

  fecharModalVisitante() {
    this.exibirModalVisitante = false;
    this.service.showVisitorModal.set(false);
  }

  irParaRegister() {
    this.fecharModalVisitante();
    // Limpar session local antes de ir para register
    this.authService.logout();
    this.router.navigate(['/register']);
  }
}
