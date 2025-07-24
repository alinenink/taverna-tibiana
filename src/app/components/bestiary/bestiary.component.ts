import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';

import { BestiaryService, Monster, BestiaryResponse, MonsterClassType, MonsterDifficulty, BestiarySearchParams } from '../../services/bestiary.service';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-bestiary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './bestiary.component.html',
  styleUrls: ['./bestiary.component.scss']
})
export class BestiaryComponent implements OnInit {
  private readonly bestiaryService = inject(BestiaryService);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject$ = new Subject<string>();

  // Signals para estado reativo
  readonly monsters = signal<Monster[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly pagination = signal({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPreviousPage: false
  });

  // Formulário de filtros
  filterForm!: FormGroup;

  // Computed values
  readonly hasMonsters = computed(() => this.monsters().length > 0);
  readonly hasError = computed(() => this.error() !== null);
  readonly isLoading = computed(() => this.loading());

  // Opções para filtros
  readonly availableClasses = this.bestiaryService.getAvailableClasses();
  readonly availableDifficulties = this.bestiaryService.getAvailableDifficulties();

  // Controle do popup de localizações
  readonly openLocationPopupId = signal<number | null>(null);
  readonly popupPosition = signal<{top: number, left: number} | null>(null);

  // Controle de kills de charm por monstro
  readonly charmKills = signal<Record<number, number>>({});

  // Controle de monstro selecionado
  readonly selectedMonsterId = signal<number | null>(null);

  // Getter para localizações do popup
  get popupLocations(): string[] {
    const monster = this.monsters().find(m => m.id === this.openLocationPopupId());
    if (!monster || !monster.locations) return [];
    return monster.locations.split(',').map(loc => loc.trim());
  }

  // Métodos para gerenciar kills de charm
  getCharmKills(monsterId: number): number {
    return this.charmKills()[monsterId] || 0;
  }

  updateCharmKills(monsterId: number, event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value);
    this.charmKills.update(kills => ({
      ...kills,
      [monsterId]: value
    }));
  }

  // Métodos para seleção de monstros
  selectMonster(monsterId: number): void {
    this.selectedMonsterId.set(monsterId);
  }

  isMonsterSelected(monsterId: number): boolean {
    return this.selectedMonsterId() === monsterId;
  }

  openLocationPopup(monsterId: number, event: MouseEvent) {
    event.stopPropagation();
    this.openLocationPopupId.set(monsterId);
    // Posição do popup (opcional, pode ser melhorado para mobile)
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.popupPosition.set({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX
    });
  }

  closeLocationPopup() {
    this.openLocationPopupId.set(null);
    this.popupPosition.set(null);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupSearchSubscription();
    this.loadMonsters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa o formulário de filtros
   */
  private initializeForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      class: [''],
      difficulty: ['']
    });

    // Observa mudanças nos filtros
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pagination.update(p => ({ ...p, currentPage: 1 }));
        this.loadMonsters();
      });
  }

  /**
   * Configura a subscription para busca com debounce
   */
  private setupSearchSubscription(): void {
    this.searchSubject$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(searchTerm => {
          this.loading.set(true);
          this.error.set(null);
          return this.bestiaryService.searchMonsters(searchTerm, {
            page: this.pagination().currentPage,
            limit: this.pagination().itemsPerPage
          });
        })
      )
      .subscribe({
        next: (response) => this.handleResponse(response),
        error: (error) => this.handleError(error)
      });
  }

  /**
   * Carrega os monstros com os filtros atuais
   */
  loadMonsters(): void {
    const formValue = this.filterForm.value;
    const params: BestiarySearchParams = {
      page: this.pagination().currentPage,
      limit: this.pagination().itemsPerPage
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

    this.loading.set(true);
    this.error.set(null);

    this.bestiaryService.getMonsters(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleResponse(response),
        error: (error) => this.handleError(error)
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
      hasPreviousPage: response.pagination.hasPrev
    });
    this.loading.set(false);
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
    this.pagination.update(p => ({ ...p, currentPage: 1 }));
    this.loadMonsters();
  }

  /**
   * Trata mudança de página
   */
  onPageChange(pageIndex: number, pageSize: number): void {
    this.pagination.update(p => ({
      ...p,
      currentPage: pageIndex + 1,
      itemsPerPage: pageSize
    }));
    this.loadMonsters();
  }

  /**
   * Obtém o nome de exibição para uma classe
   */
  getClassDisplayName(monsterClass: string): string {
    return this.bestiaryService.getClassDisplayName(monsterClass as MonsterClassType);
  }

  /**
   * Obtém o nome de exibição para uma dificuldade
   */
  getDifficultyDisplayName(difficulty: MonsterDifficulty): string {
    return this.bestiaryService.getDifficultyDisplayName(difficulty);
  }

  /**
   * Obtém a cor para uma dificuldade
   */
  getDifficultyColor(difficulty: MonsterDifficulty): string {
    return this.bestiaryService.getDifficultyColor(difficulty);
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
    
    // Debug: log das URLs das imagens
    if (environment.debugMode) {
      console.log(`Monster image URL: ${imagePath} → ${url}`);
    }
    
    return url;
  }

  /**
   * Obtém array de resistências para exibição
   */
  getResistancesArray(monster: Monster): Array<{ type: string; value: number }> {
    return monster.resistances.map(resistance => ({
      type: this.getResistanceDisplayName(resistance.type),
      value: resistance.value
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
      earth: 'Terra'
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
    console.log('=== Demonstração do Mapeamento de Imagens ===');
    
    // Exemplo 1: Imagem disponível localmente
    const localImage = this.getMonsterImageUrl('/monster-images/532_Rotworm.gif');
    console.log('Imagem local:', localImage);
    
    // Exemplo 2: Imagem não disponível localmente
    const backendImage = this.getMonsterImageUrl('/monster-images/999_NonExistent.gif');
    console.log('Imagem do backend:', backendImage);
    
    // Exemplo 3: URL absoluta
    const absoluteUrl = this.getMonsterImageUrl('https://example.com/image.gif');
    console.log('URL absoluta:', absoluteUrl);
    
    // Exemplo 4: Gerar nome de arquivo
    const fileName = this.bestiaryService.getMonsterImageFileName(532, 'Rotworm');
    console.log('Nome do arquivo gerado:', fileName);
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
      earth: '🌍'
    };
    return icons[type] || '⚔️';
  }

  /**
   * Obtém número de estrelas para dificuldade
   */
  getDifficultyStars(difficulty: string): number {
    switch (difficulty.toLowerCase()) {
      case 'trivial':
      case 'harmless':
        return 1;
      case 'easy':
        return 2;
      case 'medium':
        return 3;
      case 'hard':
        return 4;
      case 'challenge':
        return 5;
      default:
        return 1;
    }
  }

  /**
   * Obtém contagem de localizações
   */
  getLocationCount(locations: string): number {
    if (!locations) return 0;
    return locations.split(',').length;
  }
} 