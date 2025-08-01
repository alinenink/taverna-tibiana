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
import { RouterModule, Router, NavigationStart } from '@angular/router';
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
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  // Removido autosave - será implementado aviso de saída

  // Lista completa de todos os monstros (780) - carregada uma única vez
  // Estado de carregamento e erro
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Paginação baseada na lista completa
  readonly pagination = signal({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6, // 6 itens por página como solicitado
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Filtros aplicados
  readonly appliedFilters = signal<{
    search: string;
    class: string;
    difficulty: string;
    selected: boolean;
    completed: boolean;
  }>({
    search: '',
    class: '',
    difficulty: '',
    selected: false,
    completed: false,
  });

  // Lista filtrada (sem paginação)
  readonly filteredMonsters = computed(() => {
    const allMonsters = this.allMonstersStore();
    const filters = this.appliedFilters();

    if (!allMonsters || allMonsters.length === 0) {
      return [];
    }

    let filtered = allMonsters;

    // Filtro por busca
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        monster =>
          monster.name.toLowerCase().includes(searchTerm) ||
          monster.class.name.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por classe
    if (filters.class) {
      filtered = filtered.filter(
        monster => monster.class.name.toLowerCase() === filters.class.toLowerCase()
      );
    }

    // Filtro por dificuldade
    if (filters.difficulty) {
      filtered = filtered.filter(monster => monster.difficulty === filters.difficulty);
    }

    // Filtro por selecionados
    if (filters.selected) {
      filtered = filtered.filter(monster => this.isMonsterSelected(monster.id));
    }

    // Filtro por completados
    if (filters.completed) {
      filtered = filtered.filter(monster => this.isCompleteHunt(monster.id));
    }

    return filtered;
  });

  // Monstros paginados para exibição
  readonly monsters = computed(() => {
    const filtered = this.filteredMonsters();
    const pagination = this.pagination();

    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;

    return filtered.slice(startIndex, endIndex);
  });

  // Store completa de todos os monstros (780 monstros)
  private readonly _allMonstersStore = signal<Monster[]>([]);
  readonly allMonstersStore = this._allMonstersStore.asReadonly();

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

  // Opções para filtros (serão carregadas dinamicamente)
  private readonly _availableClasses = signal<string[]>([]);
  private readonly _availableDifficulties = signal<string[]>([]);
  readonly availableClasses = computed(() => this._availableClasses());
  readonly availableDifficulties = computed(() => this._availableDifficulties());
  readonly filterStats = signal<{
    total_monsters: number;
    total_classes: number;
    total_difficulties: number;
    average_level: number;
    min_level: number;
    max_level: number;
  } | null>(null);

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

  // Controle de modificações não salvas
  readonly hasUnsavedChanges = signal<boolean>(false);

  // Estado original do bestiário (para comparação)
  private readonly originalBestiaryState = signal<UserBestiaryData | null>(null);

  // Estado original das modificações locais
  private readonly originalLocalState = signal<{
    charmKills: Record<number, number>;
    selectedMonsters: Set<number>;
    completeHunts: Set<number>;
  }>({
    charmKills: {},
    selectedMonsters: new Set(),
    completeHunts: new Set(),
  });

  // Estado atual das modificações
  private readonly currentModifications = signal<{
    charmKills: Record<number, number>;
    selectedMonsters: Set<number>;
    completeHunts: Set<number>;
  }>({
    charmKills: {},
    selectedMonsters: new Set(),
    completeHunts: new Set(),
  });

  // Cache de todas as seleções/desseleções do usuário
  private readonly selectionCache = signal<Record<number, boolean>>({});

  // Controle do modal de saída
  readonly showExitModalSignal = signal<boolean>(false);

  // Controle de loading do modal de saída
  readonly exitModalLoading = signal<boolean>(false);

  // Flag para indicar se o modal foi acionado por popstate
  private readonly modalTriggeredByPopstate = signal<boolean>(false);

  // Handler para beforeunload
  private beforeUnloadHandler: ((event: BeforeUnloadEvent) => void) | null = null;

  // Handler para popstate (botão voltar do navegador)
  private popstateHandler: ((event: PopStateEvent) => void) | null = null;

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
    const value = parseInt((event.target as HTMLInputElement).value, 10);
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

    // Atualizar estado das modificações
    this.updateCurrentModifications();
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

    // Atualizar estado das modificações
    this.updateCurrentModifications();
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
      // Recalcular total de charm points quando há mudanças no status de caça completa
      this.calculateTotalCharmPoints();
    }
  }

  /**
   * Salvar alterações pendentes automaticamente
   */
  // Método savePendingChanges removido - será implementado aviso de saída

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
      const monster = this.allMonstersStore().find(m => m.id === userMonster.id);
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

    // Usar getAllSelectedMonsters() para obter todos os monstros selecionados
    // independente da página atual
    const selectedMonstersData = this.getAllSelectedMonsters();

    if (selectedMonstersData.length === 0) {
      alert('Nenhuma criatura selecionada para exportar!');
      return;
    }

    // Obter os objetos Monster completos do allMonstersStore
    const selectedMonsters = selectedMonstersData
      .map(selectedData => this.allMonstersStore().find(monster => monster.id === selectedData.id))
      .filter(monster => monster !== undefined) as Monster[];

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

    // Usar getAllSelectedMonsters() para obter todos os monstros selecionados
    // independente da página atual
    const selectedMonstersData = this.getAllSelectedMonsters();

    if (selectedMonstersData.length === 0) {
      alert('Nenhuma criatura selecionada para exportar!');
      return;
    }

    // Obter os objetos Monster completos do allMonstersStore
    const selectedMonsters = selectedMonstersData
      .map(selectedData => this.allMonstersStore().find(monster => monster.id === selectedData.id))
      .filter(monster => monster !== undefined) as Monster[];

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

  // Métodos de autosave removidos - será implementado aviso de saída
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

  // Método performAutoSave removido - será implementado aviso de saída

  // Métodos para seleção múltipla de monstros
  toggleMonsterSelection(monsterId: number): void {
    const monster = this.monsters().find(m => m.id === monsterId);
    const isCurrentlySelected = this.isMonsterSelected(monsterId);
    const newSelectionState = !isCurrentlySelected;

    // Atualizar cache de seleções
    this.selectionCache.update(cache => ({
      ...cache,
      [monsterId]: newSelectionState,
    }));

    // Track monster selection
    this.analyticsService.trackEvent('bestiary_monster_selection', {
      monster_id: monsterId,
      monster_name: monster?.name || 'Unknown',
      action: newSelectionState ? 'selected' : 'deselected',
      total_selected: this.getSelectedCount(),
    });

    console.log(
      `🔄 Cache atualizado - ${monster?.name} (ID: ${monsterId}): ${newSelectionState ? 'selected' : 'deselected'}`
    );
    console.log('📊 Cache atual:', this.selectionCache());

    // Atualizar estado das modificações
    this.updateCurrentModifications();
  }

  isMonsterSelected(monsterId: number): boolean {
    // Usar o cache para verificar se o monstro está selecionado
    const cache = this.selectionCache();
    return cache[monsterId] === true;
  }

  // Computed signal para o count de selecionados (sem escrita em signals)
  readonly selectedCount = computed(() => {
    return this.getAllSelectedMonsters().length;
  });

  getSelectedCount(): number {
    return this.selectedCount();
  }

  /**
   * Verificar e limpar IDs inválidos do cache (fora do computed)
   */
  private checkAndCleanInvalidIds(): void {
    const cache = this.selectionCache();
    const allMonsters = this.allMonstersStore();
    const invalidIds: number[] = [];

    // Verificar IDs inválidos
    Object.entries(cache).forEach(([monsterIdStr, isSelected]) => {
      if (isSelected) {
        const monsterId = parseInt(monsterIdStr);
        const monster = allMonsters.find(m => m.id === monsterId);
        if (!monster) {
          invalidIds.push(monsterId);
        }
      }
    });

    // Limpar IDs inválidos se encontrados
    if (invalidIds.length > 0) {
      console.log('🧹 Limpando IDs inválidos do cache:', invalidIds);
      this.cleanInvalidIdsFromCache(invalidIds);
    }
  }

  /**
   * Obter todos os monstros selecionados (cache + originais não modificados)
   */
  private getAllSelectedMonsters(): Array<{ id: number; name: string; kills: number }> {
    const cache = this.selectionCache();
    const original = this.originalLocalState();
    const allMonsters = this.allMonstersStore();

    const selectedMonsters: Array<{ id: number; name: string; kills: number }> = [];

    // 1. Adicionar monstros do cache (modificados pelo usuário)
    Object.entries(cache).forEach(([monsterIdStr, isSelected]) => {
      if (isSelected) {
        const monsterId = parseInt(monsterIdStr);
        const monster = allMonsters.find(m => m.id === monsterId);
        if (monster) {
          selectedMonsters.push({
            id: monsterId,
            name: monster.name,
            kills: this.getCharmKills(monsterId),
          });
        }
        // IDs inválidos são tratados em checkAndCleanInvalidIds()
      }
    });

    // 2. Adicionar monstros originais que não foram modificados
    if (original) {
      original.selectedMonsters.forEach(monsterId => {
        // Só adicionar se não está no cache (não foi modificado)
        if (!(monsterId in cache)) {
          const monster = allMonsters.find(m => m.id === monsterId);
          if (monster) {
            selectedMonsters.push({
              id: monsterId,
              name: monster.name,
              kills: this.getCharmKills(monsterId),
            });
          }
          // IDs inválidos são tratados em checkAndCleanInvalidIds()
        }
      });
    }

    return selectedMonsters;
  }

  /**
   * Limpar IDs inválidos do cache
   */
  private cleanInvalidIdsFromCache(invalidIds: number[]): void {
    const cache = this.selectionCache();
    const allMonsters = this.allMonstersStore();

    // Criar novo cache sem os IDs inválidos
    const cleanedCache: Record<number, boolean> = {};

    Object.entries(cache).forEach(([monsterIdStr, isSelected]) => {
      const monsterId = parseInt(monsterIdStr);

      // Só manter se o ID é válido (existe em allMonsters)
      if (!invalidIds.includes(monsterId) && allMonsters.some(m => m.id === monsterId)) {
        cleanedCache[monsterId] = isSelected;
      }
    });

    // Atualizar cache limpo
    this.selectionCache.set(cleanedCache);

    console.log('✅ Cache limpo. IDs removidos:', invalidIds);
    console.log('📊 Cache antes:', Object.keys(cache).length, 'IDs');
    console.log('📊 Cache depois:', Object.keys(cleanedCache).length, 'IDs');
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
    // Inicializar formulário imediatamente
    this.initializeForm();

    // Adicionar listener para beforeunload
    this.setupBeforeUnloadListener();

    // Adicionar listener para popstate (botão voltar do navegador)
    this.setupPopstateListener();

    // Adicionar listener para navegação do Router
    this.setupRouterNavigationListener();

    setTimeout(() => {
      this.loading.set(false);
      this.analyticsService.trackEvent('page_view', {
        page_title: 'Bestiary',
        page_location: '/bestiary',
      });

      this.loadFiltersAndThenData();
    }, 500);
  }

  ngOnDestroy(): void {
    // Remover listener do beforeunload
    this.removeBeforeUnloadListener();

    // Remover listener do popstate
    this.removePopstateListener();

    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Configurar listener para beforeunload
   */
  private setupBeforeUnloadListener(): void {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (this.hasUnsavedChanges()) {
        // Para beforeunload, só podemos mostrar o alerta padrão do navegador
        // Não podemos mostrar um modal customizado
        event.preventDefault();
        event.returnValue = 'Tens modificações não salvas. Desejas realmente sair?';

        // Retornar mensagem personalizada (pode não funcionar em todos os navegadores)
        return 'Tens modificações não salvas. Desejas realmente sair?';
      }
      // Retornar undefined se não há modificações não salvas
      return undefined;
    };

    // Adicionar listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Armazenar referência para remoção
    this.beforeUnloadHandler = handleBeforeUnload;
  }

  /**
   * Remover listener do beforeunload
   */
  private removeBeforeUnloadListener(): void {
    if (this.beforeUnloadHandler) {
      window.removeEventListener('beforeunload', this.beforeUnloadHandler);
      this.beforeUnloadHandler = null;
    }
  }

  /**
   * Configurar listener para popstate (botão voltar do navegador)
   */
  private setupPopstateListener(): void {
    const handlePopstate = (event: PopStateEvent) => {
      // Atualizar estado atual antes de verificar
      this.updateCurrentModifications();

      if (this.hasUnsavedChanges()) {
        console.log('⚠️ Popstate interceptado - modificações não salvas detectadas');

        // Marcar que o modal foi acionado por popstate
        this.modalTriggeredByPopstate.set(true);

        // Mostrar modal de saída
        this.showExitModalSignal.set(true);

        // Prevenir a navegação voltando para a página atual
        window.history.pushState(null, '', window.location.href);

        return;
      }
    };

    // Adicionar listener
    window.addEventListener('popstate', handlePopstate);

    // Armazenar referência para remoção
    this.popstateHandler = handlePopstate;
  }

  /**
   * Remover listener do popstate
   */
  private removePopstateListener(): void {
    if (this.popstateHandler) {
      window.removeEventListener('popstate', this.popstateHandler);
      this.popstateHandler = null;
    }
  }

  /**
   * Configurar listener para navegação do Router
   */
  private setupRouterNavigationListener(): void {
    // Interceptar navegação do Router
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event instanceof NavigationStart) {
        // Atualizar estado atual antes de verificar
        this.updateCurrentModifications();

        if (this.hasUnsavedChanges()) {
          console.log('⚠️ Navegação interceptada - modificações não salvas detectadas');

          // Mostrar modal de saída
          this.showExitModalSignal.set(true);

          // Não podemos prevenir NavigationStart diretamente, mas o modal irá interromper a navegação
          // O usuário terá que escolher uma opção no modal
          return;
        }
      }
    });
  }

  /**
   * Carregar filtros disponíveis e depois os dados
   */
  private loadFiltersAndThenData(): void {
    // Usar diretamente os dados estáticos sem fazer chamada para o backend
    this._availableClasses.set(this.bestiaryService.getAvailableClasses());
    this._availableDifficulties.set(this.bestiaryService.getAvailableDifficulties());

    // Definir estatísticas padrão
    this.filterStats.set({
      total_monsters: 0,
      total_classes: this._availableClasses().length,
      total_difficulties: this._availableDifficulties().length,
      average_level: 0,
      min_level: 0,
      max_level: 0,
    });

    // Carregar o bestiário do usuário e depois os monstros
    this.loadUserBestiaryAndThenMonsters();
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
    // Carregar dados do usuário primeiro
    this.loadUserBestiary();

    // Carregar todos os monstros na store
    this.loadAllMonstersToStore();
  }

  /**
   * Carrega todos os 780 monstros na store para paginação local
   */
  private loadAllMonstersToStore(): void {
    this.error.set(null);

    this.bestiaryService
      .getAllMonsters()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: allMonsters => {
          // Salvar todos os monstros na store
          this._allMonstersStore.set(allMonsters);
          console.log('✅ Todos os 780 monstros carregados na store:', allMonsters.length);

          // Limpar IDs inválidos
          this.checkAndCleanInvalidIds();

          // Calcular total de charm points
          this.calculateTotalCharmPoints();

          // Atualizar paginação baseada na store completa
          this.updatePaginationFromStore();

          this.loading.set(false);
        },
        error: error => {
          console.error('Erro ao carregar todos os monstros:', error);
          this.handleError(error);
        },
      });
  }

  /**
   * Atualiza paginação baseada na store completa
   */
  private updatePaginationFromStore(): void {
    const filteredMonsters = this.filteredMonsters();
    const itemsPerPage = this.pagination().itemsPerPage;
    const totalItems = filteredMonsters.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = Math.min(this.pagination().currentPage, totalPages || 1);

    this.pagination.set({
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    });

    console.log('📊 Paginação atualizada da store:', {
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage,
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

          // Salvar estado original para comparação
          this.saveOriginalState(data);

          this.userBestiaryLoading.set(false);
        },
        error: error => {
          console.error('❌ Erro ao carregar bestiário do usuário:', error);
          console.log('🔍 Estrutura do erro:', {
            status: error.status,
            error: error.error,
            message: error.message,
            name: error.name,
          });

          // Não mostrar modal de visitante no GET, apenas no PUT
          // O modal de visitante só deve aparecer quando o usuário tentar salvar
          console.log('ℹ️ Erro no GET - Modal de visitante não será exibido');

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

    // Recalcular total de charm points após verificar caças completas
    this.calculateTotalCharmPoints();

    // Preencher automaticamente os monstros selecionados apenas na primeira vez
    // ou se o cache estiver vazio
    if (Object.keys(this.selectionCache()).length === 0) {
      this.populateSelectedMonsters();
    }

    // Salvar estado original após sincronização
    this.saveOriginalState(userData);

    // Limpar IDs inválidos após sincronizar dados do usuário
    this.checkAndCleanInvalidIds();
  }

  /**
   * Preencher automaticamente os monstros selecionados do bestiário do usuário
   */
  private populateSelectedMonsters(): void {
    const userData = this.userBestiary();
    if (!userData || !userData.monstros_selecionados) {
      // Se não há dados do usuário, limpar seleções
      this.selectedMonsterIds.set(new Set());
      this.selectionCache.set({});
      return;
    }

    // Verificar se já existe cache com modificações
    const currentCache = this.selectionCache();
    const hasExistingCache = Object.keys(currentCache).length > 0;

    if (hasExistingCache) {
      console.log('📊 Cache já existe, não sobrescrevendo:', currentCache);
      return;
    }

    // Criar um Set com os IDs dos monstros selecionados no bestiário do usuário
    const selectedMonsterIds = new Set<number>();
    const initialCache: Record<number, boolean> = {};

    userData.monstros_selecionados.forEach(userMonster => {
      initialCache[userMonster.id] = userMonster.is_selected;
      if (userMonster.is_selected) {
        selectedMonsterIds.add(userMonster.id);
      }
    });

    // Atualizar o signal de monstros selecionados
    this.selectedMonsterIds.set(selectedMonsterIds);

    // Inicializar cache com dados originais
    this.selectionCache.set(initialCache);

    console.log('📊 Cache inicializado com dados do usuário:', initialCache);
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
    this.loading.set(true);
    if (this.userBestiaryLoading()) {
      return;
    }

    // Verificar se allMonstersStore foi carregado
    if (this.allMonstersStore().length === 0) {
      console.error('❌ AllMonstersStore não foi carregado. Tentando carregar novamente...');
      this.loadAllMonstersAndThenPaginated();
      return;
    }

    const selectionCache = this.selectionCache();

    // Obter todos os monstros selecionados (do cache + originais não modificados)
    const allSelectedMonsters = this.getAllSelectedMonsters();
    const selectedIds = allSelectedMonsters.map(monster => monster.id);

    // Debug: Log dos monstros selecionados
    console.log('🔍 Salvando bestiário - Cache completo:', selectionCache);
    console.log('🔍 Monstros selecionados:', selectedIds);
    console.log('🔍 Página atual:', this.pagination().currentPage);
    console.log('🔍 Total de monstros selecionados:', selectedIds.length);
    console.log('🔍 Cache vs Total:', Object.keys(selectionCache).length, 'vs', selectedIds.length);
    console.log('🔍 AllMonstersStore carregados:', this.allMonstersStore().length, 'monstros');
    console.log(
      '🔍 IDs no cache:',
      Object.keys(selectionCache)
        .map(id => parseInt(id))
        .sort((a, b) => a - b)
    );

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

          // Processar todos os monstros selecionados
          console.log('🔍 Processando todos os monstros selecionados...');

          // Processar todos os monstros selecionados (cache + originais)
          allSelectedMonsters.forEach(selectedMonster => {
            const monsterId = selectedMonster.id;
            const monster = this.allMonstersStore().find(m => m.id === monsterId);

            if (!monster) {
              console.log(`⚠️ Monstro ID ${monsterId} não encontrado em allMonstersStore`);
              return;
            }

            const existingIndex = updatedMonsters.findIndex(m => m.id === monsterId);
            const kills = selectedMonster.kills;

            console.log(`✅ Processando: ${monster.name} (ID: ${monsterId}) - Kills: ${kills}`);

            if (existingIndex >= 0) {
              // Atualizar monstro existente
              updatedMonsters[existingIndex] = {
                ...updatedMonsters[existingIndex],
                kills,
                is_selected: true,
                completed: this.isCompleteHunt(monsterId),
                ultima_atualizacao: new Date().toISOString(),
              };
              console.log(`🔄 Atualizado monstro existente: ${monster.name}`);
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
              console.log(`➕ Adicionado novo monstro: ${monster.name}`);
            }
          });

          // Remover monstros que não estão na lista de selecionados
          const selectedMonsterIds = new Set(allSelectedMonsters.map(m => m.id));
          allUserMonsterIds.forEach(monsterId => {
            // Remover se não está na lista de selecionados
            if (!selectedMonsterIds.has(monsterId)) {
              const existingIndex = updatedMonsters.findIndex(m => m.id === monsterId);
              if (existingIndex >= 0) {
                const monsterName = updatedMonsters[existingIndex].name;
                updatedMonsters.splice(existingIndex, 1);
                console.log(
                  `🗑️ Removido monstro: ${monsterName} (ID: ${monsterId}) - Não está na lista de selecionados`
                );
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

          console.log('🎯 Resultado final do salvamento:');
          console.log('📊 Total de monstros no bestiário:', updatedMonsters.length);
          console.log(
            '📊 Monstros selecionados:',
            updatedMonsters.filter(m => m.is_selected).length
          );
          console.log(
            '📊 Total de kills:',
            updatedMonsters.reduce((sum, m) => sum + m.kills, 0)
          );
          console.log(
            '📊 Monstros salvos:',
            updatedMonsters.map(m => `${m.name} (ID: ${m.id})`)
          );

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

                // Atualizar estado original após salvamento bem-sucedido
                this.saveOriginalState(savedData);

                // Limpar flag de modificações não salvas
                this.hasUnsavedChanges.set(false);

                // Resetar filtros e seleções após salvamento bem-sucedido
                this.resetFiltersAndSelections();

                // Se foi chamado do modal de saída, navegar após salvar
                if (this.exitModalLoading()) {
                  this.exitModalLoading.set(false);
                  this.showExitModalSignal.set(false);
                  this.modalTriggeredByPopstate.set(false);
                  this.router.navigate(['/grimorio']);
                }
                this.loading.set(false);
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

                // Se foi chamado do modal de saída, desativar loader
                if (this.exitModalLoading()) {
                  this.exitModalLoading.set(false);
                }

                this.loading.set(false);
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
      .pipe(takeUntil(this.destroy$), debounceTime(300))
      .subscribe(formValue => {
        // Sempre carregar monstros quando há mudança nos filtros
        // Se não há filtros ativos, carregará todos os monstros
        this.pagination.update(p => ({ ...p, currentPage: 1 }));
        this.loadMonsters();
      });
  }

  /**
   * Carrega os monstros com os filtros atuais
   */
  /**
   * Carrega os monstros com base nos filtros ativos
   * Agora usa a store local para paginação sem requisições ao backend
   */
  loadMonsters(): void {
    // Se a store está vazia, carregar todos os monstros primeiro
    if (this.allMonstersStore().length === 0) {
      this.loadAllMonstersToStore();
      return;
    }

    // Aplicar filtros e atualizar paginação local
    this.applyFilters();
    this.updatePaginationFromStore();
  }

  /**
   * Aplica filtros do formulário aos filtros internos
   */
  private applyFilters(): void {
    const formValue = this.filterForm.value;

    this.appliedFilters.set({
      search: formValue.search || '',
      class: formValue.class || '',
      difficulty: formValue.difficulty || '',
      selected: this.filterSelected(),
      completed: this.filterCompleted(),
    });
  }

  /**
   * Trata erros da API
   */
  private handleError(error: any): void {
    this.error.set(error.message || 'Erro ao carregar monstros');
    this.loading.set(false);

    console.error('Bestiary error:', error);
  }

  /**
   * Verifica se há valores reais nos filtros
   */
  private hasRealFilters(formValue: any): boolean {
    // Verificar se há busca por texto
    if (formValue.search && formValue.search.trim().length > 0) {
      return true;
    }

    // Verificar se há filtro por classe
    if (formValue.class && formValue.class.trim().length > 0) {
      return true;
    }

    // Verificar se há filtro por dificuldade
    if (formValue.difficulty && formValue.difficulty.trim().length > 0) {
      return true;
    }

    // Verificar se há filtros especiais ativos
    if (this.filterSelected() || this.filterCompleted()) {
      return true;
    }

    return false;
  }

  /**
   * Limpa todos os filtros
   */
  clearFilters(): void {
    // Track clear filters action
    this.analyticsService.trackEvent('bestiary_clear_filters', {
      action: 'clear_all_filters',
      current_page: this.pagination().currentPage,
    });

    this.filterForm.reset();
    this.filterSelected.set(false);
    this.filterCompleted.set(false);

    // Aplicar filtros limpos e atualizar paginação local
    this.applyFilters();
    this.pagination.update(p => ({ ...p, currentPage: 1 }));
    this.updatePaginationFromStore();
  }

  /**
   * Trata mudança de página (agora local, sem requisições ao backend)
   */
  onPageChange(pageIndex: number, pageSize: number): void {
    if (pageIndex === this.pagination().currentPage) return;

    // Track pagination
    this.analyticsService.trackEvent('bestiary_pagination', {
      page_number: pageIndex,
      page_size: pageSize,
      total_pages: this.pagination().totalPages,
    });

    // Atualizar apenas a página atual (paginação local)
    this.pagination.update(p => ({
      ...p,
      currentPage: pageIndex,
      hasNextPage: pageIndex < p.totalPages,
      hasPreviousPage: pageIndex > 1,
    }));

    console.log(`📄 Mudança para página ${pageIndex} (local)`);
  }

  /**
   * Obtém o nome de exibição para uma classe
   */
  getClassDisplayName(monsterClass: string): string {
    return this.bestiaryService.getClassDisplayName(monsterClass as any);
  }

  /**
   * Obtém o nome de exibição para uma dificuldade
   */
  getDifficultyDisplayName(difficulty: string): string {
    return this.bestiaryService.getDifficultyDisplayName(difficulty as any);
  }

  /**
   * Obtém a cor para uma dificuldade
   */
  getDifficultyColor(difficulty: string): string {
    return this.bestiaryService.getDifficultyColor(difficulty as any);
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
    return this.bestiaryService.getMonsterImageUrl(imagePath);
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
      // Verificar se já existe um placeholder para evitar duplicação
      const existingPlaceholder = container.querySelector('.monster-placeholder');
      if (!existingPlaceholder) {
        container.innerHTML = `
          <div class="monster-placeholder">
            <span class="monster-emoji">🐉</span>
            <span class="placeholder-text">Sem imagem</span>
          </div>
        `;
      }
    }

    // Log para debug
    console.warn(
      `⚠️ Erro ao carregar imagem para ${monster.name} (ID: ${monster.id}): ${monster.image}`
    );
  }

  /**
   * Trata carregamento bem-sucedido de imagem
   */
  onImageLoad(event: any, monster: Monster): void {
    const img = event.target as HTMLImageElement;
    img.style.opacity = '1';
    img.style.display = 'block';

    // Remover placeholder se existir
    const container = img.parentElement;
    if (container) {
      const placeholder = container.querySelector('.monster-placeholder');
      if (placeholder) {
        placeholder.remove();
      }
    }
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
    console.log('🔍 Analisando erro para modal de visitante:', error);

    let isVisitorError = false;

    // Verificar se é erro HTTP 400 ou se tem a estrutura específica
    const isHttp400 = error.status === 400;
    const hasErrorStructure = error.error && typeof error.error === 'object';

    console.log('🔍 Status:', error.status, 'isHttp400:', isHttp400);
    console.log('🔍 Error structure:', hasErrorStructure);

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
        console.log('✅ Erro de visitante detectado em error.error.message');
        isVisitorError = true;
      }

      // 1.5. Verificar error.error.error (estrutura específica do seu erro)
      if (
        error.error?.error &&
        (error.error.error.includes('Usuário visitante não pode acessar') ||
          error.error.error.includes('Realize o cadastro') ||
          error.error.error.includes('Usuário não cadastrado') ||
          error.error.error.toLowerCase().includes('usuário não cadastrado') ||
          error.error.error.includes('nao cadastrado') ||
          error.error.error.toLowerCase().includes('nao cadastrado'))
      ) {
        console.log('✅ Erro de visitante detectado em error.error.error');
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
        console.log('✅ Erro de visitante detectado em error.error.error');
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
        console.log('✅ Erro de visitante detectado em error.message');
        isVisitorError = true;
      }

      // 4. Verificar se a resposta tem success: false (caso especial)
      if (
        error.error?.success === false &&
        (error.error.error?.includes('Usuário visitante não pode acessar') ||
          error.error.message?.includes('Realize o cadastro') ||
          error.error.error?.includes('Realize o cadastro'))
      ) {
        console.log('✅ Erro de visitante detectado em success: false');
        isVisitorError = true;
      }

      // 5. Verificar estrutura específica do erro que você forneceu
      if (
        error.error?.success === false &&
        error.error?.error === 'Usuário visitante não pode acessar este endpoint' &&
        error.error?.message === 'Realize o cadastro para acessar o bestiário pessoal'
      ) {
        console.log('✅ Erro de visitante detectado em estrutura específica');
        isVisitorError = true;
      }

      // 5.5. Verificar estrutura exata do erro fornecido
      if (
        error.error?.success === false &&
        error.error?.error === 'Usuário visitante não pode acessar este endpoint'
      ) {
        console.log('✅ Erro de visitante detectado em estrutura exata');
        isVisitorError = true;
      }

      // 5.6. Verificar apenas success: false com mensagem de visitante
      if (
        error.error?.success === false &&
        (error.error?.error?.includes('visitante') || error.error?.message?.includes('cadastro'))
      ) {
        console.log('✅ Erro de visitante detectado em success: false com mensagem de visitante');
        isVisitorError = true;
      }
    }

    // 6. Verificar se é um HttpErrorResponse do Angular
    if (error.name === 'HttpErrorResponse' || error.constructor.name === 'HttpErrorResponse') {
      console.log('✅ HttpErrorResponse detectado');
      // Verificar se tem a propriedade error com a estrutura correta
      if (error.error && typeof error.error === 'object') {
        if (
          error.error.error?.includes('Usuário visitante não pode acessar') ||
          error.error.message?.includes('Realize o cadastro')
        ) {
          console.log('✅ Erro de visitante detectado em HttpErrorResponse');
          isVisitorError = true;
        }
      }
    }

    // 7. Verificar se a mensagem contém "400 Bad Request" (fallback)
    if (error.message && error.message.includes('400 Bad Request')) {
      console.log('✅ 400 Bad Request detectado');
      // Se a mensagem contém 400, verificar se é erro de visitante
      if (error.message.includes('user-bestiary')) {
        console.log('✅ Erro de visitante detectado em 400 Bad Request');
        isVisitorError = true;
      }
    }

    // 8. Verificar se é erro 401 (Unauthorized) - pode ser visitante
    if (error.status === 401) {
      console.log('✅ 401 Unauthorized detectado - provavelmente visitante');
      isVisitorError = true;
    }

    // 9. Verificar se é erro 403 (Forbidden) - pode ser visitante
    if (error.status === 403) {
      console.log('✅ 403 Forbidden detectado - provavelmente visitante');
      isVisitorError = true;
    }

    console.log('🔍 isVisitorError final:', isVisitorError);

    if (isVisitorError) {
      console.log('🎯 Mostrando modal de visitante');
      this.visitorMessage.set(
        'Percebi que você está tentando acessar funcionalidades exclusivas como visitante! Se você quer desfrutar de todas as funcionalidades da Taverna, é preciso se registrar!'
      );
      this.showVisitorModal.set(true);
      // Parar o loader quando o modal de visitante aparecer
      this.loading.set(false);
      this.userBestiaryLoading.set(false);
      console.log('✅ Modal de visitante exibido com sucesso');
    } else {
      console.log('❌ Erro não foi identificado como erro de visitante');
    }
  }

  closeExitModal(): void {
    // Track modal close action
    this.analyticsService.trackEvent('bestiary_exit_modal', {
      action: 'close_modal',
      triggered_by: this.modalTriggeredByPopstate() ? 'popstate' : 'button',
      has_unsaved_changes: this.hasUnsavedChanges(),
    });

    this.showExitModalSignal.set(false);
    this.modalTriggeredByPopstate.set(false);
  }

  confirmExit(): void {
    // Track exit without saving
    this.analyticsService.trackEvent('bestiary_exit_modal', {
      action: 'exit_without_saving',
      triggered_by: this.modalTriggeredByPopstate() ? 'popstate' : 'button',
      has_unsaved_changes: this.hasUnsavedChanges(),
    });

    // Sair sem salvar - limpar flag e navegar
    this.hasUnsavedChanges.set(false);
    this.showExitModalSignal.set(false);

    // Restaurar estado original
    const original = this.originalLocalState();
    if (original) {
      this.charmKills.set(original.charmKills);
      this.completeHuntMonsters.set(original.completeHunts);

      // Restaurar cache de seleções com dados originais
      const originalCache: Record<number, boolean> = {};
      original.selectedMonsters.forEach(monsterId => {
        originalCache[monsterId] = true;
      });
      this.selectionCache.set(originalCache);

      this.currentModifications.set({
        charmKills: { ...original.charmKills },
        selectedMonsters: new Set(original.selectedMonsters),
        completeHunts: new Set(original.completeHunts),
      });
    }

    console.log('✅ Saindo sem salvar - estado restaurado');

    // Verificar se foi acionado por popstate
    const wasTriggeredByPopstate = this.modalTriggeredByPopstate();

    if (wasTriggeredByPopstate) {
      // Se foi acionado por popstate, usar window.history.back()
      console.log('🔄 Navegando com window.history.back() (popstate)');
      window.history.back();
    } else {
      // Caso contrário, usar router.navigate
      console.log('🔄 Navegando com router.navigate (botão voltar)');
      this.router.navigate(['/grimorio']);
    }

    // Limpar flag de popstate
    this.modalTriggeredByPopstate.set(false);
  }

  saveAndExit(): void {
    // Track save and exit action
    this.analyticsService.trackEvent('bestiary_exit_modal', {
      action: 'save_and_exit',
      triggered_by: this.modalTriggeredByPopstate() ? 'popstate' : 'button',
      has_unsaved_changes: this.hasUnsavedChanges(),
    });

    // Ativar loader
    this.exitModalLoading.set(true);

    // Salvar e depois sair
    this.saveAllSelectedMonsters();

    // O salvamento já limpa o flag hasUnsavedChanges
    // A navegação será feita no callback de sucesso do saveAllSelectedMonsters
    // A flag de popstate será limpa no callback de sucesso
  }

  /**
   * Método de teste para simular modificações não salvas
   */

  /**
   * Salvar estado original do bestiário para comparação
   */
  private saveOriginalState(data: UserBestiaryData): void {
    this.originalBestiaryState.set(data);

    // Inicializar estado original com os dados carregados
    const originalKills: Record<number, number> = {};
    const originalSelected = new Set<number>();
    const originalComplete = new Set<number>();

    data.monstros_selecionados?.forEach(monster => {
      originalKills[monster.id] = monster.kills || 0;
      if (monster.is_selected) {
        originalSelected.add(monster.id);
      }
      if (monster.completed) {
        originalComplete.add(monster.id);
      }
    });

    // Salvar estado original
    this.originalLocalState.set({
      charmKills: originalKills,
      selectedMonsters: originalSelected,
      completeHunts: originalComplete,
    });

    // Inicializar estado atual com os dados originais
    this.currentModifications.set({
      charmKills: { ...originalKills },
      selectedMonsters: new Set(originalSelected),
      completeHunts: new Set(originalComplete),
    });

    // Limpar flag de modificações não salvas
    this.hasUnsavedChanges.set(false);
  }

  /**
   * Verificar se há modificações não salvas comparando estados
   */
  private checkForUnsavedChanges(): boolean {
    const original = this.originalLocalState();
    const current = this.currentModifications();

    if (!original) return false;

    // Verificar mudanças nos kills de charm
    for (const [monsterId, kills] of Object.entries(current.charmKills)) {
      const originalKills = original.charmKills[parseInt(monsterId)] || 0;
      if (originalKills !== kills) {
        return true;
      }
    }

    // Verificar se há kills no estado atual que não existiam no original
    for (const [monsterId, kills] of Object.entries(original.charmKills)) {
      const currentKills = current.charmKills[parseInt(monsterId)] || 0;
      if (kills !== currentKills) {
        return true;
      }
    }

    // Verificar mudanças na seleção de monstros
    if (!this.setsAreEqual(original.selectedMonsters, current.selectedMonsters)) {
      return true;
    }

    // Verificar mudanças no status de caça completa
    if (!this.setsAreEqual(original.completeHunts, current.completeHunts)) {
      return true;
    }

    return false;
  }

  /**
   * Comparar se dois Sets são iguais
   */
  private setsAreEqual(set1: Set<number>, set2: Set<number>): boolean {
    if (set1.size !== set2.size) return false;
    for (const item of set1) {
      if (!set2.has(item)) return false;
    }
    return true;
  }

  /**
   * Atualizar estado atual das modificações
   */
  private updateCurrentModifications(): void {
    // Atualizar kills de charm
    const updatedKills = { ...this.charmKills() };

    // Atualizar monstros selecionados do cache
    const cache = this.selectionCache();
    const updatedSelected = new Set<number>();
    Object.entries(cache).forEach(([monsterId, isSelected]) => {
      if (isSelected) {
        updatedSelected.add(parseInt(monsterId));
      }
    });

    // Atualizar caças completas
    const updatedComplete = new Set(this.completeHuntMonsters());

    this.currentModifications.set({
      charmKills: updatedKills,
      selectedMonsters: updatedSelected,
      completeHunts: updatedComplete,
    });

    // Verificar se há modificações não salvas
    const hasChanges = this.checkForUnsavedChanges();
    this.hasUnsavedChanges.set(hasChanges);

    console.log('🔄 Estado atualizado - Modificações não salvas:', hasChanges);
  }

  /**
   * Resetar filtros e seleções após salvamento bem-sucedido
   */
  private resetFiltersAndSelections(): void {
    // Resetar formulário de filtros
    if (this.filterForm) {
      this.filterForm.patchValue({
        search: '',
        class: '',
        difficulty: '',
      });
    }

    // Resetar filtros especiais
    this.filterSelected.set(false);
    this.filterCompleted.set(false);

    // Resetar paginação para primeira página
    this.pagination.update(p => ({
      ...p,
      currentPage: 1,
    }));

    // NÃO limpar o cache de seleções - manter as seleções do usuário
    // O cache será atualizado quando os dados forem recarregados do servidor

    // Recarregar monstros com filtros resetados
    this.loadMonsters();

    console.log('🔄 Filtros resetados após salvamento (cache mantido)');
  }

  /**
   * Método simples para verificar modificações e mostrar modal
   */
  voltarComVerificacao(): void {
    // Atualizar estado atual antes de verificar
    this.updateCurrentModifications();

    console.log('🔍 Verificando modificações não salvas...');
    console.log('📊 Estado original:', this.originalLocalState());
    console.log('📊 Estado atual:', this.currentModifications());
    console.log('📊 Tem modificações não salvas:', this.hasUnsavedChanges());

    if (this.hasUnsavedChanges()) {
      console.log('⚠️ Modificações não salvas detectadas - mostrando modal');

      // Track modal triggered by back button
      this.analyticsService.trackEvent('bestiary_exit_modal', {
        action: 'modal_triggered',
        triggered_by: 'back_button',
        has_unsaved_changes: true,
      });

      // Marcar que o modal foi acionado pelo botão voltar (não popstate)
      this.modalTriggeredByPopstate.set(false);

      this.showExitModalSignal.set(true);
    } else {
      console.log('✅ Nenhuma modificação não salva - navegando');

      // Track direct navigation (no unsaved changes)
      this.analyticsService.trackEvent('bestiary_navigation', {
        action: 'direct_navigation',
        destination: '/grimorio',
        has_unsaved_changes: false,
      });

      this.router.navigate(['/grimorio']);
    }
  }

  /**
   * Atualizar paginação baseada na lista filtrada
   */
  private updatePagination(): void {
    const filteredCount = this.filteredMonsters().length;
    const itemsPerPage = this.pagination().itemsPerPage;
    const totalPages = Math.ceil(filteredCount / itemsPerPage);
    const currentPage = Math.min(this.pagination().currentPage, totalPages || 1);

    this.pagination.set({
      currentPage,
      totalPages,
      totalItems: filteredCount,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    });

    console.log('📊 Paginação atualizada:', {
      totalItems: filteredCount,
      totalPages,
      currentPage,
      itemsPerPage,
    });
  }

  /**
   * Forçar recarregamento de todos os monstros (limpa cache)
   */
  forceReloadAllMonsters(): void {
    this.bestiaryService.clearAllMonstersCache();
    this.loadAllMonstersAndThenPaginated();
  }
}
