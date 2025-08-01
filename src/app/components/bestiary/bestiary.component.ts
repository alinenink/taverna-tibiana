import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { medievalFontBase64 } from '../../services/medievalfont.js';

import {
  BestiaryService,
  Monster,
  BestiaryResponse,
  BestiarySearchParams,
} from '../../services/bestiary.service';
import {
  UserBestiaryService,
  UserMonster,
  UserBestiaryData,
} from '../../services/user-bestiary.service';
import { AnalyticsService } from '../../services/analytics.service';
import { environment } from '../../environments/environments';
import {
  getClassDisplayName,
  getDifficultyDisplayName,
  getDifficultyColor,
  getDifficultyStars,
  getAvailableClasses,
  getAvailableDifficulties,
} from '../../models/bestiary-mappings';

@Component({
  selector: 'app-bestiary',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './bestiary.component.html',
  styleUrl: './bestiary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestiaryComponent implements OnInit {
  private readonly bestiaryService = inject(BestiaryService);
  private readonly userBestiaryService = inject(UserBestiaryService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject$ = new Subject<string>();
  private readonly autoSaveSubject$ = new Subject<number>();

  // Signals para estado reativo
  readonly monsters = signal<Monster[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly pagination = signal({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Signals para bestiário do usuário
  readonly userBestiary = signal<UserBestiaryData | null>(null);
  readonly userBestiaryLoading = signal(false);
  readonly userBestiaryError = signal<string | null>(null);

  // Formulário de filtros
  filterForm!: FormGroup;

  // Computed values
  readonly hasMonsters = computed(() => this.monsters().length > 0);
  readonly hasError = computed(() => this.error() !== null);
  readonly isLoading = computed(() => this.loading());

  // Monstros filtrados baseado nos filtros ativos
  // Agora os filtros são aplicados no servidor, então usamos diretamente monsters()
  readonly filteredMonsters = computed(() => this.monsters());

  // Opções para filtros
  readonly availableClasses = getAvailableClasses();
  readonly availableDifficulties = getAvailableDifficulties();

  // Controle do popup de localizações
  readonly openLocationPopupId = signal<number | null>(null);
  readonly popupPosition = signal<{ top: number; left: number } | null>(null);

  // Controle de kills de charm por monstro
  readonly charmKills = signal<Record<number, number>>({});

  // Controle de monstro selecionado
  readonly selectedMonsterIds = signal<Set<number>>(new Set());

  // Controle de caça completa por monstro
  readonly completeHuntMonsters = signal<Set<number>>(new Set());

  // Modal de visitante
  readonly showVisitorModal = signal<boolean>(false);
  readonly visitorMessage = signal<string>('');

  // Filtros para a lista
  readonly filterSelected = signal<boolean>(false);
  readonly filterCompleted = signal<boolean>(false);

  // Total fixo de charm points calculado uma única vez
  readonly totalCharmPoints = signal<number>(0);

  // Todos os monstros para cálculo de charm points (independente da paginação)
  readonly allMonsters = signal<Monster[]>([]);

  // Getter para localizações do popup
  get popupLocations(): string[] {
    const monster = this.monsters().find(m => m.id === this.openLocationPopupId());
    if (!monster || !monster.locations) return [];
    return monster.locations.split(',').map(loc => loc.trim());
  }

  // Métodos para gerenciar kills de charm
  getCharmKills(monsterId: number): number {
    const currentKills = this.charmKills()[monsterId] || 0;
    const isCompleteHunt = this.completeHuntMonsters().has(monsterId);

    if (isCompleteHunt) {
      const monster = this.monsters().find(m => m.id === monsterId);
      return monster ? monster.charm_details.third_stage : currentKills;
    }

    return currentKills;
  }

  updateCharmKills(monsterId: number, event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value);
    const currentKills = this.charmKills();
    const updatedKills: Record<number, number> = { ...currentKills };
    updatedKills[monsterId] = value;
    this.charmKills.set(updatedKills);

    // Verificar se chegou ao máximo para marcar como caça completa
    const monster = this.monsters().find(m => m.id === monsterId);
    if (monster && value >= monster.charm_details.third_stage) {
      // Marcar como caça completa automaticamente
      this.completeHuntMonsters.update(completeHuntSet => {
        const newSet = new Set(completeHuntSet);
        newSet.add(monsterId);
        return newSet;
      });
    } else if (monster && value < monster.charm_details.third_stage) {
      // Se não está no máximo, desmarcar caça completa
      this.completeHuntMonsters.update(completeHuntSet => {
        const newSet = new Set(completeHuntSet);
        newSet.delete(monsterId);
        return newSet;
      });
    }

    // Track charm kills update
    this.analyticsService.trackEvent('bestiary_charm_kills_update', {
      monster_id: monsterId,
      monster_name: monster?.name || 'Unknown',
      kills_value: value,
      is_complete: value >= (monster?.charm_details.third_stage || 0),
      charm_points: monster?.charm_details.charm_points || 0,
    });

    // Recalcular total de charm points após mudança nos kills
    this.calculateTotalCharmPoints();
  }

  // Métodos para gerenciar caça completa
  toggleCompleteHunt(monsterId: number): void {
    const monster = this.monsters().find(m => m.id === monsterId);
    const isCurrentlyComplete = this.completeHuntMonsters().has(monsterId);

    this.completeHuntMonsters.update(completeHuntSet => {
      const newSet = new Set(completeHuntSet);
      if (newSet.has(monsterId)) {
        newSet.delete(monsterId);
      } else {
        newSet.add(monsterId);
      }
      return newSet;
    });

    // Track complete hunt toggle
    this.analyticsService.trackEvent('bestiary_complete_hunt_toggle', {
      monster_id: monsterId,
      monster_name: monster?.name || 'Unknown',
      action: isCurrentlyComplete ? 'unmarked' : 'marked',
      charm_points: monster?.charm_details.charm_points || 0,
    });

    // Recalcular total de charm points após mudança no status de caça completa
    this.calculateTotalCharmPoints();

    // Salvamento automático quando o usuário ativa/desativa caça completa
    if (this.isMonsterSelected(monsterId)) {
      this.autoSaveMonster(monsterId);
    }
  }

  isCompleteHunt(monsterId: number): boolean {
    return this.completeHuntMonsters().has(monsterId);
  }

  /**
   * Verificar e marcar automaticamente caça completa para monstros com kills completas
   */
  private checkAndMarkCompleteHunts(): void {
    const updatedCompleteHuntSet = new Set(this.completeHuntMonsters());
    let hasChanges = false;

    // Verificar todos os monstros carregados
    this.monsters().forEach(monster => {
      const kills = this.getCharmKills(monster.id);
      const isComplete = kills >= monster.charm_details.third_stage;
      const isCurrentlyMarked = updatedCompleteHuntSet.has(monster.id);

      if (isComplete && !isCurrentlyMarked) {
        // Marcar como caça completa
        updatedCompleteHuntSet.add(monster.id);
        hasChanges = true;
      } else if (!isComplete && isCurrentlyMarked) {
        // Desmarcar caça completa
        updatedCompleteHuntSet.delete(monster.id);
        hasChanges = true;
      }
    });

    // Atualizar apenas se houve mudanças
    if (hasChanges) {
      this.completeHuntMonsters.set(updatedCompleteHuntSet);
    }
  }

  /**
   * Salvar alterações pendentes automaticamente
   */
  private savePendingChanges(): void {
    // Verificar se há monstros selecionados para salvar
    const selectedMonsters = this.selectedMonsterIds();
    if (selectedMonsters.size === 0) {
      return;
    }

    // Verificar se o usuário está logado
    if (!this.userBestiary()) {
      return;
    }

    // Verificar se há alterações pendentes
    const hasPendingChanges = Array.from(selectedMonsters).some(monsterId => {
      const userMonster = this.getUserMonsterData(monsterId);
      const currentKills = this.getCharmKills(monsterId);
      const isCompleteHunt = this.isCompleteHunt(monsterId);

      // Verificar se há diferenças nos kills ou no status de caça completa
      if (userMonster) {
        return (
          userMonster.kills !== currentKills ||
          (isCompleteHunt && currentKills < this.getMonsterMaxKills(monsterId)) ||
          (!isCompleteHunt && currentKills >= this.getMonsterMaxKills(monsterId))
        );
      }
      return true; // Novo monstro selecionado
    });

    if (hasPendingChanges) {
      this.saveAllSelectedMonsters();
    }
  }

  /**
   * Obter o número máximo de kills para um monstro
   */
  private getMonsterMaxKills(monsterId: number): number {
    const monster = this.monsters().find(m => m.id === monsterId);
    return monster ? monster.charm_details.third_stage : 0;
  }

  /**
   * Calcular total de pontos de charm das criaturas completas
   */
  getTotalCharmPoints(): number {
    return this.totalCharmPoints();
  }

  /**
   * Calcular total de charm points baseado nos kills atuais
   */
  private calculateTotalCharmPoints(): void {
    const userData = this.userBestiary();
    if (!userData || !userData.monstros_selecionados) {
      this.totalCharmPoints.set(0);
      return;
    }

    let totalPoints = 0;
    userData.monstros_selecionados.forEach(userMonster => {
      // Verificar se o monstro está completo (kills >= terceiro estágio)
      // Usar o array de todos os monstros para obter os detalhes do charm
      const monster = this.allMonsters().find(m => m.id === userMonster.id);
      if (monster) {
        // Usar os kills atuais (que podem ter sido modificados pelo usuário)
        const currentKills = this.charmKills()[userMonster.id] || userMonster.kills;
        if (currentKills >= monster.charm_details.third_stage) {
          totalPoints += monster.charm_details.charm_points;
        }
      }
    });

    this.totalCharmPoints.set(totalPoints);
  }

  /**
   * Contar criaturas completas
   */
  getCompletedMonstersCount(): number {
    return Array.from(this.selectedMonsterIds()).filter(monsterId => this.isCompleteHunt(monsterId))
      .length;
  }

  /**
   * Exportar para PDF
   */
  exportToPdf(): void {
    if (this.getSelectedCount() === 0) {
      return;
    }

    const selectedMonsters = this.monsters().filter(monster =>
      this.selectedMonsterIds().has(monster.id)
    );

    if (selectedMonsters.length === 0) {
      alert('Nenhuma criatura selecionada para exportar!');
      return;
    }

    // Track PDF export
    this.analyticsService.trackEvent('bestiary_export', {
      export_type: 'pdf',
      monsters_count: selectedMonsters.length,
      selected_monsters: selectedMonsters.map(m => m.name).join(', '),
    });

    const doc = new jsPDF();

    // Registra a fonte medieval
    doc.addFileToVFS('MedievalSharp-Book.ttf', medievalFontBase64);
    doc.addFont('MedievalSharp-Book.ttf', 'MedievalSharp', 'normal');
    doc.setFont('MedievalSharp', 'normal');

    doc.setFontSize(16);
    doc.text('Meu Bestiário – Registro de Caçadas', 105, 20, { align: 'center' });

    // Adicionar informações gerais com as descrições solicitadas
    doc.setFontSize(12);
    doc.text(`Criaturas Escolhidas: ${selectedMonsters.length}`, 20, 35);
    doc.text(`Pontos de Charm Acumulados: ${this.getTotalCharmPoints()}`, 20, 45);
    doc.text(`Feras Derrotadas Completamente: ${this.getCompletedMonstersCount()}`, 20, 55);

    // Criar tabela com as criaturas
    const tableData = selectedMonsters.map(monster => [
      monster.name,
      monster.difficulty,
      monster.class.name,
      this.isCompleteHunt(monster.id) ? 'Completa' : 'Incompleta',
      this.getCharmKills(monster.id).toString(),
      monster.charm_details.charm_points.toString(),
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Nome', 'Dificuldade', 'Classe', 'Status', 'Kills', 'Pontos']],
      body: tableData,
      theme: 'grid',
      styles: {
        font: 'MedievalSharp',
        fontSize: 10,
        textColor: [60, 40, 20],
        lineColor: [160, 120, 70],
      },
      headStyles: {
        fillColor: [232, 217, 165],
        textColor: [60, 40, 20],
        lineWidth: 0.5,
        lineColor: [160, 120, 70],
      },
      alternateRowStyles: {
        fillColor: [253, 248, 228],
      },
      tableLineColor: [160, 120, 70],
      tableLineWidth: 0.5,
    });

    doc.save('meu-bestiario.pdf');
  }

  /**
   * Exportar para Excel usando biblioteca xlsx
   */
  exportToExcel(): void {
    if (this.getSelectedCount() === 0) {
      return;
    }

    const selectedMonsters = this.monsters().filter(monster =>
      this.selectedMonsterIds().has(monster.id)
    );

    if (selectedMonsters.length === 0) {
      alert('Nenhuma criatura selecionada para exportar!');
      return;
    }

    // Track Excel export
    this.analyticsService.trackEvent('bestiary_export', {
      export_type: 'excel',
      monsters_count: selectedMonsters.length,
      selected_monsters: selectedMonsters.map(m => m.name).join(', '),
    });

    // Extrai os dados desejados seguindo a lógica do best.js
    const dataToExport = selectedMonsters.map(monster => ({
      Nome: monster.name,
      Dificuldade: monster.difficulty,
      Classe: monster.class.name,
      Status: this.isCompleteHunt(monster.id) ? 'Completa' : 'Incompleta',
      Kills_Atual: this.getCharmKills(monster.id),
      Kills_Necessarias: monster.charm_details.third_stage,
      Pontos_Charm: monster.charm_details.charm_points,
    }));

    // Cria a planilha usando a biblioteca xlsx
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Meu Bestiário');

    // Configurar largura das colunas
    const columnWidths = [
      { wch: 20 }, // Nome
      { wch: 12 }, // Dificuldade
      { wch: 12 }, // Classe
      { wch: 10 }, // Status
      { wch: 12 }, // Kills_Atual
      { wch: 15 }, // Kills_Necessarias
      { wch: 12 }, // Pontos_Charm
    ];
    worksheet['!cols'] = columnWidths;

    // Salva o arquivo Excel
    const outputFileName = 'meu-bestiario.xlsx';
    XLSX.writeFile(workbook, outputFileName);
  }

  /**
   * Obter string de resistências para exportação
   */
  private getResistancesString(monster: Monster): string {
    const resistances = this.getResistancesArray(monster);
    return resistances.map(res => `${res.type}: ${res.value}%`).join('; ');
  }

  /**
   * Salva automaticamente um monstro específico no bestiário do usuário
   */
  private autoSaveMonster(monsterId: number): void {
    // Emitir o ID do monstro para o subject de auto-save
    this.autoSaveSubject$.next(monsterId);
  }

  /**
   * Configura a subscription para auto-save com debounce
   */
  private setupAutoSaveSubscription(): void {
    this.autoSaveSubject$
      .pipe(
        debounceTime(1000), // Aguarda 1 segundo após a última mudança
        distinctUntilChanged(), // Só executa se o valor mudou
        takeUntil(this.destroy$)
      )
      .subscribe(monsterId => {
        this.performAutoSave(monsterId);
      });
  }

  /**
   * Executa o salvamento real do monstro
   */
  /**
   * Recarrega os dados do bestiário do usuário do servidor
   */
  private reloadUserBestiaryData(): void {
    this.userBestiaryService
      .getUserBestiary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.userBestiary.set(data);
          this.syncUserBestiaryWithLocal();
          this.calculateTotalCharmPoints();
        },
        error: error => {
          console.error('Erro ao recarregar dados do bestiário:', error);
        },
      });
  }

  private performAutoSave(monsterId: number): void {
    // Verificar se o usuário está logado
    if (!this.userBestiary()) {
      return;
    }

    const monster = this.monsters().find(m => m.id === monsterId);
    if (!monster) {
      return;
    }

    const kills = this.getCharmKills(monsterId);
    const isCurrentlySelected = this.selectedMonsterIds().has(monsterId);
    const currentData = this.userBestiary()!;
    const updatedMonsters = [...(currentData.monstros_selecionados || [])];

    const existingIndex = updatedMonsters.findIndex(m => m.id === monsterId);

    if (isCurrentlySelected) {
      // Monstro está selecionado - adicionar ou atualizar
      if (existingIndex >= 0) {
        // Atualizar monstro existente
        updatedMonsters[existingIndex] = {
          ...updatedMonsters[existingIndex],
          kills,
          is_selected: true,
          completed: this.isCompleteHunt(monsterId),
          ultima_atualizacao: new Date().toISOString(),
        };
      } else {
        // Adicionar novo monstro
        updatedMonsters.push({
          id: monsterId,
          name: monster.name,
          progress: 0,
          kills,
          is_selected: true,
          completed: this.isCompleteHunt(monsterId),
          user_notes: '',
          data_adicao: new Date().toISOString(),
          ultima_atualizacao: new Date().toISOString(),
        });
      }
    } else {
      // Monstro foi desselecionado - remover do array
      if (existingIndex >= 0) {
        updatedMonsters.splice(existingIndex, 1);
      }
    }

    // Atualizar estatísticas
    const updatedData = {
      ...currentData,
      monstros_selecionados: updatedMonsters,
      estatisticas: {
        total_selecionados: updatedMonsters.filter(m => m.is_selected).length,
        total_progresso: updatedMonsters.reduce((sum, m) => sum + m.progress, 0),
        total_kills: updatedMonsters.reduce((sum, m) => sum + m.kills, 0),
        ultima_atualizacao: new Date().toISOString(),
      },
    };

    // Salvar no backend
    this.userBestiaryService
      .saveUserBestiary(updatedData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: savedData => {
          this.userBestiary.set(savedData);
          // Recalcular charms adquiridos após salvamento bem-sucedido
          this.calculateTotalCharmPoints();
          // Fazer novo GET para buscar dados atualizados do servidor
          this.reloadUserBestiaryData();
        },
        error: error => {
          console.error('Erro ao salvar automaticamente:', error);
          // Não mostrar erro para o usuário em salvamento automático
          // Apenas logar para debug
        },
      });
  }

  // Métodos para seleção múltipla de monstros
  toggleMonsterSelection(monsterId: number): void {
    const monster = this.monsters().find(m => m.id === monsterId);
    const isCurrentlySelected = this.selectedMonsterIds().has(monsterId);

    this.selectedMonsterIds.update(selectedIds => {
      const newSet = new Set(selectedIds);
      if (newSet.has(monsterId)) {
        newSet.delete(monsterId);
      } else {
        newSet.add(monsterId);
      }
      return newSet;
    });

    // Track monster selection
    this.analyticsService.trackEvent('bestiary_monster_selection', {
      monster_id: monsterId,
      monster_name: monster?.name || 'Unknown',
      action: isCurrentlySelected ? 'deselected' : 'selected',
      total_selected: this.selectedMonsterIds().size,
    });
  }

  isMonsterSelected(monsterId: number): boolean {
    return this.selectedMonsterIds().has(monsterId);
  }

  getSelectedCount(): number {
    return this.selectedMonsterIds().size;
  }

  // Métodos para controlar filtros
  toggleFilterSelected(): void {
    const newValue = !this.filterSelected();
    this.filterSelected.set(newValue);

    // Se este filtro foi ativado, desativar o outro
    if (newValue) {
      this.filterCompleted.set(false);
    }

    // Track filter usage
    this.analyticsService.trackEvent('bestiary_filter_used', {
      filter_type: 'selected',
      filter_active: newValue,
    });

    // Resetar para a primeira página e recarregar
    this.pagination.update(p => ({ ...p, currentPage: 1 }));
    this.loadMonsters();
  }

  toggleFilterCompleted(): void {
    const newValue = !this.filterCompleted();
    this.filterCompleted.set(newValue);

    // Se este filtro foi ativado, desativar o outro
    if (newValue) {
      this.filterSelected.set(false);
    }

    // Track filter usage
    this.analyticsService.trackEvent('bestiary_filter_used', {
      filter_type: 'completed',
      filter_active: newValue,
    });

    // Resetar para a primeira página e recarregar
    this.pagination.update(p => ({ ...p, currentPage: 1 }));
    this.loadMonsters();
  }

  clearListFilters(): void {
    this.filterSelected.set(false);
    this.filterCompleted.set(false);
    // Resetar para a primeira página e recarregar
    this.pagination.update(p => ({ ...p, currentPage: 1 }));
    this.loadMonsters();
  }

  openLocationPopup(monsterId: number, event: MouseEvent) {
    event.stopPropagation();
    this.openLocationPopupId.set(monsterId);
    // Posição do popup (opcional, pode ser melhorado para mobile)
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.popupPosition.set({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    });
  }

  closeLocationPopup() {
    this.openLocationPopupId.set(null);
    this.popupPosition.set(null);
  }

  ngOnInit(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.analyticsService.trackEvent('page_view', {
        page_title: 'Bestiary',
        page_location: '/bestiary',
      });

      this.initializeForm();
      this.setupSearchSubscription();
      this.setupAutoSaveSubscription();
      this.loadUserBestiaryAndThenMonsters();
    }, 500);
    // Track page view
  }

  ngOnDestroy(): void {
    // Salvar automaticamente alterações pendentes antes de sair
    this.savePendingChanges();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carregar bestiário do usuário e depois os monstros
   */
  private loadUserBestiaryAndThenMonsters(): void {
    this.userBestiaryLoading.set(true);
    this.userBestiaryError.set(null);

    this.userBestiaryService
      .getUserBestiary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.userBestiary.set(data);
          this.syncUserBestiaryWithLocal();
          this.userBestiaryLoading.set(false);

          // Após carregar o bestiário do usuário, carregar todos os monstros e depois os paginados
          this.loadAllMonstersAndThenPaginated();
        },
        error: error => {
          console.error('Erro ao carregar bestiário do usuário:', error);
          this.userBestiaryError.set('Erro ao carregar bestiário pessoal');
          this.userBestiaryLoading.set(false);

          // Mesmo com erro, carregar os monstros
          this.loadAllMonstersAndThenPaginated();
        },
      });
  }

  /**
   * Carregar todos os monstros e depois os monstros paginados
   */
  private loadAllMonstersAndThenPaginated(): void {
    // Primeiro carregar todos os monstros para cálculo de charm points
    this.bestiaryService
      .getAllMonsters()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: allMonsters => {
          this.allMonsters.set(allMonsters);
          // Calcular total de charm points após carregar todos os monstros
          this.calculateTotalCharmPoints();
          // Depois carregar monstros paginados para exibição
          this.loading.set(true);
          this.loadMonsters();
        },
        error: error => {
          console.error('Erro ao carregar todos os monstros:', error);
          // Continuar com carregamento paginado mesmo com erro
          this.loading.set(true);
          this.loadMonsters();
        },
      });
  }

  /**
   * Carregar bestiário do usuário (método original mantido para compatibilidade)
   */
  private loadUserBestiary(): void {
    this.userBestiaryLoading.set(true);
    this.userBestiaryError.set(null);

    this.userBestiaryService
      .getUserBestiary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.userBestiary.set(data);
          this.syncUserBestiaryWithLocal();
          this.userBestiaryLoading.set(false);
        },
        error: error => {
          console.error('Erro ao carregar bestiário do usuário:', error);
          this.userBestiaryError.set('Erro ao carregar bestiário pessoal');
          this.userBestiaryLoading.set(false);
        },
      });
  }

  /**
   * Sincronizar bestiário do usuário com dados locais
   */
  private syncUserBestiaryWithLocal(): void {
    const userData = this.userBestiary();
    if (!userData || !userData.monstros_selecionados) {
      // Se não há dados do usuário, limpar seleções
      this.selectedMonsterIds.set(new Set());
      this.totalCharmPoints.set(0);
      return;
    }

    // Sincronizar kills de charm com dados do usuário
    const updatedKills: Record<number, number> = { ...this.charmKills() };
    let hasChanges = false;

    userData.monstros_selecionados.forEach(userMonster => {
      const localKills = this.charmKills()[userMonster.id] || 0;
      if (userMonster.kills !== localKills) {
        updatedKills[userMonster.id] = userMonster.kills;
        hasChanges = true;
      }
    });

    // Atualizar kills apenas se houve mudanças
    if (hasChanges) {
      this.charmKills.set(updatedKills);
    }

    // Verificar e marcar caça completa para monstros com kills completas
    this.checkAndMarkCompleteHunts();

    // Preencher automaticamente os monstros selecionados
    this.populateSelectedMonsters();
  }

  /**
   * Preencher automaticamente os monstros selecionados do bestiário do usuário
   */
  private populateSelectedMonsters(): void {
    const userData = this.userBestiary();
    if (!userData || !userData.monstros_selecionados) {
      // Se não há dados do usuário, limpar seleções
      this.selectedMonsterIds.set(new Set());
      return;
    }

    // Criar um Set com os IDs dos monstros selecionados no bestiário do usuário
    const selectedMonsterIds = new Set<number>();

    userData.monstros_selecionados.forEach(userMonster => {
      if (userMonster.is_selected) {
        selectedMonsterIds.add(userMonster.id);
      }
    });

    // Atualizar o signal de monstros selecionados
    this.selectedMonsterIds.set(selectedMonsterIds);
  }

  /**
   * Verificar se um monstro está no bestiário do usuário
   */
  isMonsterInUserBestiary(monsterId: number): boolean {
    const userData = this.userBestiary();
    return userData && userData.monstros_selecionados
      ? userData.monstros_selecionados.some(m => m.id === monsterId)
      : false;
  }

  /**
   * Obter dados de um monstro do bestiário do usuário
   */
  getUserMonsterData(monsterId: number): UserMonster | null {
    const userData = this.userBestiary();
    return userData && userData.monstros_selecionados
      ? userData.monstros_selecionados.find(m => m.id === monsterId) || null
      : null;
  }

  /**
   * Obter estatísticas do bestiário do usuário
   */
  getUserBestiaryStats() {
    const userData = this.userBestiary();
    return userData && userData.estatisticas ? userData.estatisticas : null;
  }

  /**
   * Salvar todos os monstros selecionados no bestiário do usuário
   */
  saveAllSelectedMonsters(): void {
    if (this.userBestiaryLoading()) {
      return;
    }

    const selectedIds = Array.from(this.selectedMonsterIds());

    // Track save action
    this.analyticsService.trackEvent('bestiary_save', {
      monsters_count: selectedIds.length,
      selected_monsters: selectedIds.join(', '),
    });

    this.userBestiaryLoading.set(true);
    this.userBestiaryError.set(null);

    // Buscar dados atuais do bestiário
    this.userBestiaryService
      .getUserBestiary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: currentData => {
          const updatedMonsters = [...(currentData.monstros_selecionados || [])];

          // Obter todos os monstros que estavam no bestiário do usuário
          const allUserMonsterIds = new Set(
            currentData.monstros_selecionados?.map(m => m.id) || []
          );

          // Processar monstros selecionados atualmente
          selectedIds.forEach(monsterId => {
            const monster = this.monsters().find(m => m.id === monsterId);
            if (!monster) return;

            const existingIndex = updatedMonsters.findIndex(m => m.id === monsterId);
            const kills = this.getCharmKills(monsterId);

            if (existingIndex >= 0) {
              // Atualizar monstro existente
              updatedMonsters[existingIndex] = {
                ...updatedMonsters[existingIndex],
                kills,
                is_selected: true,
                completed: this.isCompleteHunt(monsterId),
                ultima_atualizacao: new Date().toISOString(),
              };
            } else {
              // Adicionar novo monstro
              updatedMonsters.push({
                id: monsterId,
                name: monster.name,
                progress: 0,
                kills,
                is_selected: true,
                completed: this.isCompleteHunt(monsterId),
                user_notes: '',
                data_adicao: new Date().toISOString(),
                ultima_atualizacao: new Date().toISOString(),
              });
            }
          });

          // Remover monstros que foram desselecionados
          allUserMonsterIds.forEach(monsterId => {
            if (!selectedIds.includes(monsterId)) {
              const existingIndex = updatedMonsters.findIndex(m => m.id === monsterId);
              if (existingIndex >= 0) {
                updatedMonsters.splice(existingIndex, 1);
              }
            }
          });

          // Atualizar estatísticas
          const updatedData = {
            ...currentData,
            monstros_selecionados: updatedMonsters,
            estatisticas: {
              total_selecionados: updatedMonsters.filter(m => m.is_selected).length,
              total_progresso: updatedMonsters.reduce((sum, m) => sum + m.progress, 0),
              total_kills: updatedMonsters.reduce((sum, m) => sum + m.kills, 0),
              ultima_atualizacao: new Date().toISOString(),
            },
          };

          // Salvar no backend
          this.userBestiaryService
            .saveUserBestiary(updatedData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: savedData => {
                this.userBestiary.set(savedData);
                // Recalcular charms adquiridos após salvamento bem-sucedido
                this.calculateTotalCharmPoints();
                // Fazer novo GET para buscar dados atualizados do servidor
                this.reloadUserBestiaryData();
                this.userBestiaryLoading.set(false);
              },
              error: error => {
                console.error('Erro ao salvar bestiário:', error);

                // Usar o método auxiliar para tratar o erro
                this.handleVisitorError(error);

                // Se não for erro de visitante, mostrar erro genérico
                if (!this.showVisitorModal()) {
                  this.userBestiaryError.set('Erro ao salvar bestiário');
                }

                this.userBestiaryLoading.set(false);
              },
            });
        },
        error: error => {
          console.error('Erro ao carregar bestiário atual:', error);

          // Verificar se é erro de visitante também
          this.handleVisitorError(error);

          if (!this.showVisitorModal()) {
            this.userBestiaryError.set('Erro ao carregar bestiário');
          }

          this.userBestiaryLoading.set(false);
        },
      });
  }

  /**
   * Inicializa o formulário de filtros
   */
  private initializeForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      class: [''],
      difficulty: [''],
    });

    // Observa mudanças nos filtros
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.pagination.update(p => ({ ...p, currentPage: 1 }));
        this.loadMonsters();
      });
  }

  /**
   * Configura a subscription para busca com debounce
   */
  private setupSearchSubscription(): void {
    this.loading.set(true);
    this.searchSubject$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(searchTerm => {
          // Track search
          if (searchTerm && searchTerm.trim().length > 0) {
            this.analyticsService.trackSearch(searchTerm, 'bestiary');
          }

          this.loading.set(false);
          this.error.set(null);
          return this.bestiaryService.searchMonsters(searchTerm, {
            page: this.pagination().currentPage,
            limit: this.pagination().itemsPerPage,
          });
        })
      )
      .subscribe({
        next: response => this.handleResponse(response),
        error: error => this.handleError(error),
      });
  }

  /**
   * Carrega os monstros com os filtros atuais
   */
  loadMonsters(): void {
    const formValue = this.filterForm.value;
    const params: BestiarySearchParams = {
      page: this.pagination().currentPage,
      limit: this.pagination().itemsPerPage,
    };

    if (formValue.search) {
      params.search = formValue.search;
    }
    if (formValue.class) {
      params.class = formValue.class;
    }
    if (formValue.difficulty) {
      params.difficulty = formValue.difficulty;
    }

    // Adicionar filtro baseado nos checkboxes
    if (this.filterSelected()) {
      params.filter = 'selected';
    } else if (this.filterCompleted()) {
      params.filter = 'completed';
    }

    this.error.set(null);

    this.bestiaryService
      .getMonsters(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => this.handleResponse(response),
        error: error => this.handleError(error),
      });
  }

  /**
   * Trata a resposta da API
   */
  private handleResponse(response: BestiaryResponse): void {
    this.monsters.set(response.data);
    this.pagination.set({
      currentPage: response.pagination.page,
      totalPages: response.pagination.totalPages,
      totalItems: response.pagination.totalItems,
      itemsPerPage: response.pagination.limit,
      hasNextPage: response.pagination.hasNext,
      hasPreviousPage: response.pagination.hasPrev,
    });
    this.loading.set(false);

    // Após carregar os monstros, sincronizar dados do usuário e preencher seleções
    this.syncUserBestiaryWithLocal();
  }

  /**
   * Trata erros da API
   */
  private handleError(error: any): void {
    this.error.set(error.message || 'Erro ao carregar monstros');
    this.loading.set(false);
    this.monsters.set([]);

    console.error('Bestiary error:', error);
  }

  /**
   * Limpa todos os filtros
   */
  clearFilters(): void {
    this.filterForm.reset();
    this.filterSelected.set(false);
    this.filterCompleted.set(false);
    // Resetar para a primeira página e recarregar
    this.pagination.update(p => ({ ...p, currentPage: 1 }));
    this.loadMonsters();
  }

  /**
   * Trata mudança de página
   */
  onPageChange(pageIndex: number, pageSize: number): void {
    if (pageIndex === this.pagination().currentPage) return;

    // Track pagination
    this.analyticsService.trackEvent('bestiary_pagination', {
      page_number: pageIndex,
      page_size: pageSize,
      total_pages: this.pagination().totalPages,
    });

    this.pagination.update(p => ({
      ...p,
      currentPage: pageIndex,
    }));
    this.loadMonsters();
  }

  /**
   * Obtém o nome de exibição para uma classe
   */
  getClassDisplayName(monsterClass: string): string {
    return getClassDisplayName(monsterClass);
  }

  /**
   * Obtém o nome de exibição para uma dificuldade
   */
  getDifficultyDisplayName(difficulty: string): string {
    return getDifficultyDisplayName(difficulty);
  }

  /**
   * Obtém a cor para uma dificuldade
   */
  getDifficultyColor(difficulty: string): string {
    return getDifficultyColor(difficulty);
  }

  /**
   * Verifica se um monstro tem resistências significativas
   */
  hasSignificantResistances(monster: Monster): boolean {
    return this.bestiaryService.hasSignificantResistances(monster);
  }

  /**
   * Obtém a resistência mais alta de um monstro
   */
  getHighestResistance(monster: Monster): { type: string; value: number } {
    return this.bestiaryService.getHighestResistance(monster);
  }

  /**
   * Formata um número com separadores de milhares
   */
  formatNumber(value: number): string {
    return value.toLocaleString('pt-BR');
  }

  /**
   * Obtém a URL da imagem do monstro
   */
  getMonsterImageUrl(imagePath: string): string {
    const url = this.bestiaryService.getMonsterImageUrl(imagePath);

    // Adiciona parâmetro de cache-busting simples baseado na página
    const cacheBuster = `?page=${this.pagination().currentPage}`;
    const finalUrl = url.includes('?')
      ? `${url}&${cacheBuster.substring(1)}`
      : `${url}${cacheBuster}`;

    return finalUrl;
  }

  /**
   * Obtém array de resistências para exibição
   */
  getResistancesArray(monster: Monster): Array<{ type: string; value: number }> {
    return monster.resistances.map(resistance => ({
      type: this.getResistanceDisplayName(resistance.type),
      value: resistance.value,
    }));
  }

  /**
   * Obtém nome de exibição para tipo de resistência
   */
  getResistanceDisplayName(type: string): string {
    const displayNames: Record<string, string> = {
      physical: 'Físico',
      fire: 'Fogo',
      ice: 'Gelo',
      energy: 'Energia',
      death: 'Morte',
      holy: 'Sagrado',
      earth: 'Terra',
    };
    return displayNames[type] || type;
  }

  /**
   * TrackBy function para otimização de performance
   */
  trackByMonsterId(index: number, monster: Monster): number {
    return monster.id;
  }

  /**
   * Trata erro de carregamento de imagem
   */
  onImageError(event: any, monster: Monster): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const container = img.parentElement;
    if (container) {
      container.innerHTML = `
        <div class="monster-placeholder">
          <span class="monster-emoji">🐉</span>
          <span class="placeholder-text">Erro ao carregar</span>
        </div>
      `;
    }
  }

  /**
   * Trata carregamento bem-sucedido de imagem
   */
  onImageLoad(event: any, monster: Monster): void {
    const img = event.target as HTMLImageElement;
    img.style.opacity = '1';
  }

  /**
   * Referência para Math.min no template
   */
  readonly Math = Math;

  /**
   * Verifica se o monstro tem imagem
   */
  hasMonsterImage(monster: Monster): boolean {
    return !!monster.image;
  }

  /**
   * Verifica se a imagem está disponível localmente
   */
  isLocalImageAvailable(imagePath: string): boolean {
    return this.bestiaryService.isLocalImageAvailable(imagePath);
  }

  /**
   * Exemplo de uso do mapeamento de imagens
   */
  demonstrateImageMapping(): void {
    // Método para demonstração do mapeamento de imagens
    const localImage = this.getMonsterImageUrl('/monster-images/532_Rotworm.gif');
    const backendImage = this.getMonsterImageUrl('/monster-images/999_NonExistent.gif');
    const absoluteUrl = this.getMonsterImageUrl('https://example.com/image.gif');
    const fileName = this.bestiaryService.getMonsterImageFileName(532, 'Rotworm');
  }

  /**
   * Obtém ícone para tipo de resistência
   */
  getResistanceIcon(type: string): string {
    const icons: Record<string, string> = {
      physical: '👊',
      fire: '🔥',
      ice: '❄️',
      energy: '⚡',
      death: '💀',
      holy: '✨',
      earth: '🌍',
    };
    return icons[type] || '⚔️';
  }

  /**
   * Obtém tooltip para tipo de resistência
   */
  getResistanceTooltip(type: string, value: number): string {
    const descriptions: Record<string, string> = {
      physical: 'Resistência a dano físico (espadas, machados, etc.)',
      fire: 'Resistência a dano de fogo (magias de fogo, lava, etc.)',
      ice: 'Resistência a dano de gelo (magias de gelo, frio, etc.)',
      energy: 'Resistência a dano de energia (magias elétricas, etc.)',
      death: 'Resistência a dano de morte (magias de morte, veneno, etc.)',
      holy: 'Resistência a dano sagrado (magias sagradas, etc.)',
      earth: 'Resistência a dano de terra (magias de terra, etc.)',
    };

    const description = descriptions[type] || `Resistência a ${type}`;
    const status = value > 100 ? 'forte' : value < 100 ? 'fraca' : 'normal';

    return `${description}\n${value}% - Resistência ${status}`;
  }

  /**
   * Obtém número de estrelas para dificuldade
   */
  getDifficultyStars(difficulty: string): number {
    return getDifficultyStars(difficulty);
  }

  /**
   * Obtém contagem de localizações
   */
  getLocationCount(locations: string): number {
    if (!locations) return 0;
    return locations.split(',').length;
  }

  // ====================================
  // Métodos para modal de visitante
  // ====================================

  /**
   * Fechar modal de visitante
   */
  closeVisitorModal(): void {
    this.showVisitorModal.set(false);
    this.visitorMessage.set('');
  }

  /**
   * Ir para página de registro
   */
  goToRegister(): void {
    this.closeVisitorModal();
    // Limpar session local antes de ir para register
    localStorage.removeItem('user_token');
    sessionStorage.removeItem('user_token');
    // Redirecionar para register
    window.location.href = '/register';
  }

  /**
   * Método auxiliar para tratar erro de visitante
   */
  private handleVisitorError(error: any): void {
    let isVisitorError = false;

    // Verificar se é erro HTTP 400 ou se tem a estrutura específica
    const isHttp400 = error.status === 400;
    const hasErrorStructure = error.error && typeof error.error === 'object';

    // Verificar diferentes estruturas de erro
    if (isHttp400 || hasErrorStructure) {
      // 1. Verificar error.error.message (estrutura: {error: "msg", message: "msg"})
      if (
        error.error?.message &&
        (error.error.message.includes('Usuário visitante não pode acessar') ||
          error.error.message.includes('Realize o cadastro') ||
          error.error.message.includes('Usuário não cadastrado') ||
          error.error.message.toLowerCase().includes('usuário não cadastrado') ||
          error.error.message.includes('nao cadastrado') ||
          error.error.message.toLowerCase().includes('nao cadastrado'))
      ) {
        isVisitorError = true;
      }

      // 2. Verificar error.error.error (estrutura: {error: "msg", message: "msg"})
      if (
        error.error?.error &&
        (error.error.error.includes('Usuário visitante não pode acessar') ||
          error.error.error.includes('Realize o cadastro') ||
          error.error.error.includes('Usuário não cadastrado') ||
          error.error.error.toLowerCase().includes('usuário não cadastrado') ||
          error.error.error.includes('nao cadastrado') ||
          error.error.error.toLowerCase().includes('nao cadastrado'))
      ) {
        isVisitorError = true;
      }

      // 3. Verificar error.message diretamente
      if (
        error.message &&
        (error.message.includes('Usuário visitante não pode acessar') ||
          error.message.includes('Realize o cadastro') ||
          error.message.includes('Usuário não cadastrado') ||
          error.message.toLowerCase().includes('usuário não cadastrado') ||
          error.message.includes('nao cadastrado') ||
          error.message.toLowerCase().includes('nao cadastrado'))
      ) {
        isVisitorError = true;
      }

      // 4. Verificar se a resposta tem success: false (caso especial)
      if (
        error.error?.success === false &&
        (error.error.error?.includes('Usuário visitante não pode acessar') ||
          error.error.message?.includes('Realize o cadastro'))
      ) {
        isVisitorError = true;
      }
    }

    // 5. Verificar se é um HttpErrorResponse do Angular
    if (error.name === 'HttpErrorResponse' || error.constructor.name === 'HttpErrorResponse') {
      // Verificar se tem a propriedade error com a estrutura correta
      if (error.error && typeof error.error === 'object') {
        if (
          error.error.error?.includes('Usuário visitante não pode acessar') ||
          error.error.message?.includes('Realize o cadastro')
        ) {
          isVisitorError = true;
        }
      }
    }

    // 6. Verificar se a mensagem contém "400 Bad Request" (fallback)
    if (error.message && error.message.includes('400 Bad Request')) {
      // Se a mensagem contém 400, verificar se é erro de visitante
      if (error.message.includes('user-bestiary')) {
        isVisitorError = true;
      }
    }

    if (isVisitorError) {
      this.visitorMessage.set(
        'Percebi que você está tentando salvar seu bestiário pessoal como visitante! Se você quer desfrutar de todas as funcionalidades da Taverna, é preciso se registrar!'
      );
      this.showVisitorModal.set(true);
    }
  }
}
