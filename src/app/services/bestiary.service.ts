import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environments';
import { AVAILABLE_MONSTER_IMAGES, ImageMappingUtils } from './bestiary-image-config';

// Interfaces para as respostas da API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Interfaces para os monstros
export interface MonsterClass {
  id: number;
  name: string;
  image: string;
}

export interface MonsterResistance {
  type: string;
  value: number;
}

export interface MonsterCharmDetails {
  first_stage: number;
  second_stage: number;
  third_stage: number;
  charm_points: number;
}

export interface Monster {
  id: number;
  name: string;
  order: number;
  hitpoints: number;
  experience: number;
  speed: number;
  mitigation: string;
  armor: number;
  difficulty: string;
  occurrence: string;
  locations: string;
  image: string;
  class: MonsterClass;
  resistances: MonsterResistance[];
  charm_details: MonsterCharmDetails;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BestiaryFilters {
  search?: string;
  class?: MonsterClassType;
  difficulty?: MonsterDifficulty;
}

export interface BestiaryResponse {
  data: Monster[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    search: string | null;
    class: string | null;
    difficulty: string | null;
  };
  meta: {
    timestamp: string;
    version: string;
  };
}

// Tipos para as classes de monstros
export type MonsterClassType =
  | 'animal'
  | 'human'
  | 'undead'
  | 'demon'
  | 'dragon'
  | 'elemental'
  | 'construct'
  | 'plant'
  | 'slime'
  | 'amphibic'
  | 'aquatic'
  | 'bird'
  | 'bug'
  | 'fey'
  | 'goblinoid'
  | 'humanoid'
  | 'magical'
  | 'mammal'
  | 'reptile'
  | 'vermin';

// Tipos para as dificuldades
export type MonsterDifficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'extreme';

// Interface para parâmetros de busca
export interface BestiarySearchParams {
  page?: number;
  limit?: number;
  search?: string;
  class?: MonsterClassType;
  difficulty?: MonsterDifficulty;
  filter?: 'selected' | 'completed';
}

@Injectable({
  providedIn: 'root',
})
export class BestiaryService {
  private readonly baseUrl = `${environment.apiUrl}/bestiary`;
  private readonly backendBaseUrl = environment.apiUrl.replace('/api', '');

  constructor(private http: HttpClient) {}

  /**
   * Busca todos os monstros com paginação e filtros opcionais
   */
  getMonsters(params: BestiarySearchParams = {}): Observable<BestiaryResponse> {
    const httpParams = this.buildHttpParams(params);

    // Adicionar timestamp para evitar cache
    const timestamp = new Date().getTime();
    const urlWithTimestamp = `${this.baseUrl}?_t=${timestamp}`;

    return this.http
      .get<BestiaryResponse>(urlWithTimestamp, {
        params: httpParams,
      })
      .pipe(
        tap(response => {
          // Log removido para manter Clean Code
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Busca monstros por nome
   */
  searchMonsters(
    searchTerm: string,
    params: Omit<BestiarySearchParams, 'search'> = {}
  ): Observable<BestiaryResponse> {
    return this.getMonsters({ ...params, search: searchTerm });
  }

  /**
   * Busca monstros por classe
   */
  getMonstersByClass(
    monsterClass: MonsterClassType,
    params: Omit<BestiarySearchParams, 'class'> = {}
  ): Observable<BestiaryResponse> {
    return this.getMonsters({ ...params, class: monsterClass });
  }

  /**
   * Busca monstros por dificuldade
   */
  getMonstersByDifficulty(
    difficulty: MonsterDifficulty,
    params: Omit<BestiarySearchParams, 'difficulty'> = {}
  ): Observable<BestiaryResponse> {
    return this.getMonsters({ ...params, difficulty });
  }

  /**
   * Busca um monstro específico por ID
   */
  getMonsterById(id: number): Observable<Monster> {
    // Adicionar timestamp para evitar cache
    const timestamp = new Date().getTime();
    const urlWithTimestamp = `${this.baseUrl}/${id}?_t=${timestamp}`;

    return this.http.get<Monster>(urlWithTimestamp).pipe(
      tap(monster => {
        // Log removido para manter Clean Code
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Busca todos os monstros (sem paginação)
   */
  getAllMonsters(): Observable<Monster[]> {
    return this.getMonsters({ limit: 1000 }).pipe(map(response => response.data));
  }

  /**
   * Obtém estatísticas dos monstros
   */
  getMonsterStats(): Observable<{
    totalMonsters: number;
    byClass: { [key in MonsterClassType]?: number };
    byDifficulty: { [key in MonsterDifficulty]?: number };
    avgHitpoints: number;
    avgExperience: number;
  }> {
    return this.getMonsters({ limit: 1000 }).pipe(
      map(response => {
        const monsters = response.data;
        const stats = {
          totalMonsters: monsters.length,
          byClass: {} as { [key in MonsterClassType]?: number },
          byDifficulty: {} as { [key in MonsterDifficulty]?: number },
          avgHitpoints: 0,
          avgExperience: 0,
        };

        // Contagem por classe
        monsters.forEach(monster => {
          const className = monster.class.name as MonsterClassType;
          stats.byClass[className] = (stats.byClass[className] || 0) + 1;
        });

        // Contagem por dificuldade
        monsters.forEach(monster => {
          const difficulty = monster.difficulty.toLowerCase() as MonsterDifficulty;
          stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;
        });

        // Médias
        if (monsters.length > 0) {
          stats.avgHitpoints =
            monsters.reduce((sum, monster) => sum + monster.hitpoints, 0) / monsters.length;
          stats.avgExperience =
            monsters.reduce((sum, monster) => sum + monster.experience, 0) / monsters.length;
        }

        return stats;
      })
    );
  }

  /**
   * Obtém a lista de classes disponíveis
   */
  getAvailableClasses(): MonsterClassType[] {
    return [
      'animal',
      'human',
      'undead',
      'demon',
      'dragon',
      'elemental',
      'construct',
      'plant',
      'slime',
      'amphibic',
      'aquatic',
      'bird',
      'bug',
      'fey',
      'goblinoid',
      'humanoid',
      'magical',
      'mammal',
      'reptile',
      'vermin',
    ];
  }

  /**
   * Obtém a lista de dificuldades disponíveis
   */
  getAvailableDifficulties(): MonsterDifficulty[] {
    return ['trivial', 'easy', 'medium', 'hard', 'extreme'];
  }

  /**
   * Obtém o nome de exibição para uma classe
   */
  getClassDisplayName(monsterClass: MonsterClassType): string {
    const displayNames: Record<MonsterClassType, string> = {
      animal: 'Animal',
      human: 'Humano',
      undead: 'Morto-vivo',
      demon: 'Demônio',
      dragon: 'Dragão',
      elemental: 'Elemental',
      construct: 'Constructo',
      plant: 'Planta',
      slime: 'Slime',
      amphibic: 'Anfíbio',
      aquatic: 'Aquático',
      bird: 'Ave',
      bug: 'Inseto',
      fey: 'Fada',
      goblinoid: 'Goblinóide',
      humanoid: 'Humanoide',
      magical: 'Mágico',
      mammal: 'Mamífero',
      reptile: 'Réptil',
      vermin: 'Verme',
    };

    return displayNames[monsterClass] || monsterClass;
  }

  /**
   * Obtém o nome de exibição para uma dificuldade
   */
  getDifficultyDisplayName(difficulty: MonsterDifficulty): string {
    const displayNames: Record<MonsterDifficulty, string> = {
      trivial: 'Trivial',
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil',
      extreme: 'Extremo',
    };

    return displayNames[difficulty] || difficulty;
  }

  /**
   * Obtém a cor CSS para uma dificuldade
   */
  getDifficultyColor(difficulty: MonsterDifficulty): string {
    const colors: Record<MonsterDifficulty, string> = {
      trivial: '#4CAF50',
      easy: '#8BC34A',
      medium: '#FFC107',
      hard: '#FF9800',
      extreme: '#F44336',
    };

    return colors[difficulty] || '#757575';
  }

  /**
   * Verifica se um monstro tem resistências significativas (> 100)
   */
  hasSignificantResistances(monster: Monster): boolean {
    return monster.resistances.some(resistance => resistance.value > 100);
  }

  /**
   * Obtém a resistência mais alta de um monstro
   */
  getHighestResistance(monster: Monster): { type: string; value: number } {
    return monster.resistances.reduce(
      (highest, resistance) => {
        return resistance.value > highest.value
          ? { type: resistance.type, value: resistance.value }
          : highest;
      },
      { type: '', value: 0 }
    );
  }

  /**
   * Constrói os parâmetros HTTP para a requisição
   */
  private buildHttpParams(params: BestiarySearchParams): HttpParams {
    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.limit !== undefined) {
      httpParams = httpParams.set('limit', Math.min(params.limit, 100).toString());
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    if (params.class) {
      httpParams = httpParams.set('class', params.class);
    }

    if (params.difficulty) {
      httpParams = httpParams.set('difficulty', params.difficulty);
    }

    if (params.filter) {
      httpParams = httpParams.set('filter', params.filter);
    }

    return httpParams;
  }

  /**
   * Trata erros da API
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado';

    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Parâmetros inválidos na requisição';
          break;
        case 429:
          errorMessage = 'Limite de requisições excedido. Tente novamente em alguns minutos';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }

    if (environment.debugMode) {
      console.error('Bestiary API Error:', error);
    }

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Obtém a URL da imagem do monstro
   */
  getMonsterImageUrl(imagePath: string): string {
    // Se a imagem já tem uma URL completa, retorna como está
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Mapear para imagem local em assets/monster-images
    const localImagePath = this.mapToLocalImage(imagePath);
    if (localImagePath) {
      return localImagePath;
    }

    // Fallback para URL do backend se não encontrar imagem local
    return this.getBackendImageUrl(imagePath);
  }

  /**
   * Verifica se uma imagem está disponível localmente
   */
  isLocalImageAvailable(imagePath: string): boolean {
    const fileName = this.extractFileNameFromPath(imagePath);
    return fileName ? ImageMappingUtils.isImageAvailable(fileName) : false;
  }

  /**
   * Obtém a URL base do backend para imagens
   */
  private getBackendImageUrl(imagePath: string): string {
    // Garantir que o caminho comece com /
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${this.backendBaseUrl}${normalizedPath}`;
  }

  /**
   * Mapeia o caminho da imagem do backend para o caminho local
   */
  private mapToLocalImage(backendPath: string): string | null {
    // Extrair o nome do arquivo do caminho do backend
    const fileName = this.extractFileNameFromPath(backendPath);
    if (!fileName) {
      return null;
    }

    // Verificar se a imagem existe localmente usando a configuração centralizada
    if (ImageMappingUtils.isImageAvailable(fileName)) {
      return ImageMappingUtils.getLocalPath(fileName);
    }

    // Se não encontrar, tentar mapear por ID do monstro
    const monsterId = this.extractMonsterIdFromFileName(fileName);
    if (monsterId) {
      const alternativeImages = ImageMappingUtils.findAlternativeImages(monsterId);
      if (alternativeImages.length > 0) {
        return ImageMappingUtils.getLocalPath(alternativeImages[0]);
      }
    }

    return null;
  }

  /**
   * Extrai o ID do monstro do nome do arquivo
   */
  private extractMonsterIdFromFileName(fileName: string): number | null {
    return ImageMappingUtils.extractMonsterId(fileName);
  }

  /**
   * Extrai o nome do arquivo do caminho do backend
   */
  private extractFileNameFromPath(backendPath: string): string | null {
    // Se já é apenas um nome de arquivo (sem caminho), retorna como está
    if (backendPath.includes('.') && !backendPath.includes('/')) {
      return backendPath;
    }

    // Exemplos de caminhos do backend:
    // "/monster-images/1_Rat.gif"
    // "/monster-images/123_Dragon.gif"
    // "19_Quara_Pincher.gif" (apenas nome do arquivo)

    // Remover barras iniciais e finais
    const cleanPath = backendPath.replace(/^\/+|\/+$/g, '');

    // Extrair o nome do arquivo (última parte após a última barra)
    const parts = cleanPath.split('/');
    const fileName = parts[parts.length - 1];

    // Verificar se é um arquivo válido
    if (fileName && fileName.includes('.')) {
      return fileName;
    }

    return null;
  }

  /**
   * Obtém o nome do arquivo de imagem baseado no ID e nome do monstro
   */
  getMonsterImageFileName(monsterId: number, monsterName: string): string {
    // Converter nome para formato de arquivo
    const formattedName = monsterName
      .replace(/[^a-zA-Z0-9]/g, '_') // Substituir caracteres especiais por underscore
      .replace(/_+/g, '_') // Remover underscores múltiplos
      .replace(/^_|_$/g, ''); // Remover underscores no início e fim

    return `${monsterId}_${formattedName}.gif`;
  }

  /**
   * Obtém estatísticas das imagens disponíveis localmente
   */
  getImageStats(): {
    total: number;
    byExtension: Record<string, number>;
    byMonsterId: Record<number, number>;
  } {
    return ImageMappingUtils.getImageStats();
  }

  /**
   * Verifica se uma imagem está disponível localmente
   */
  isImageAvailable(fileName: string): boolean {
    return ImageMappingUtils.isImageAvailable(fileName);
  }
}
