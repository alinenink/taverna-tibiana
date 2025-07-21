import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environments';

// Interfaces para as respostas da API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  categories_count?: number;
}

export interface WeaponCategory {
  id: string;
  name: string;
  weapons_endpoint: string;
  detail_endpoint: string;
}

export interface WeaponBasic {
  name: string;
  atk: number;
  def: number;
  level: number;
  vocation: string;
  hands: string;
  tier: number;
  image_url?: string;
  category?: {
    id: string;
    name: string;
  };
  detail_endpoint?: string;
}

export interface ProficiencyLevel {
  level: number;
  perks: Array<{
    icons: string[];
    description: string;
    title: string;
  }>;
}

export interface WeaponProficiency {
  levels: ProficiencyLevel[];
}

export interface WeaponDetailed {
  name: string;
  proficiency: WeaponProficiency;
}

export interface WeaponsListResponse {
  success: boolean;
  message?: string;
  category: {
    id: string;
    name: string;
  };
  data: WeaponBasic[];
  total: number;
}

export interface WeaponDetailsResponse {
  success: boolean;
  message?: string;
  category: {
    id: string;
    name: string;
  };
  weapon: WeaponDetailed;
}

export interface AllWeaponsResponse {
  success: boolean;
  data: WeaponBasic[];
  total: number;
  categories_count: number;
  message: string;
}

export interface CategoriesResponse {
  success: boolean;
  message?: string;
  data: WeaponCategory[];
  total: number;
}

// Tipos para as categorias de armas
export type WeaponCategoryType = 
  | 'swords' 
  | 'axes' 
  | 'clavas' 
  | 'ranged' 
  | 'rods' 
  | 'wands' 
  | 'fist';

@Injectable({
  providedIn: 'root'
})
export class WeaponsService {
  private readonly baseUrl = environment.apiUrl + '/weapons';

  constructor(private http: HttpClient) {}

  /**
   * Lista todas as categorias de armas disponíveis
   * @returns Observable com as categorias de armas
   */
  getCategories(): Observable<WeaponCategory[]> {
    const params = new HttpParams().set('action', 'categories');
    
    return this.http.get<CategoriesResponse>(`${this.baseUrl}?${params.toString()}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Erro ao buscar categorias');
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Lista todas as armas de todas as categorias
   * @returns Observable com a lista de todas as armas
   */
  getAllWeapons(): Observable<WeaponBasic[]> {
    const params = new HttpParams().set('action', 'all');
    
    return this.http.get<AllWeaponsResponse>(`${this.baseUrl}?${params.toString()}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Erro ao buscar todas as armas');
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Lista armas por categoria
   * @param category - Categoria da arma
   * @returns Observable com a lista de armas da categoria
   */
  getWeaponsByCategory(category: WeaponCategoryType): Observable<WeaponsListResponse> {
    const params = new HttpParams()
      .set('action', 'list')
      .set('category', category);
    
    return this.http.get<WeaponsListResponse>(`${this.baseUrl}?${params.toString()}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response;
          }
          throw new Error(response.message || 'Erro ao buscar armas da categoria');
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtém detalhes de uma arma específica (incluindo proficiências)
   * @param category - Categoria da arma
   * @param name - Nome da arma (suporta busca parcial)
   * @returns Observable com os detalhes da arma
   */
  getWeaponDetails(category: WeaponCategoryType, name: string): Observable<WeaponDetailsResponse> {
    // Validação dos parâmetros
    if (!category || !name) {
      return throwError(() => new Error('Categoria e nome da arma são obrigatórios'));
    }
    
    const params = new HttpParams()
      .set('action', 'weapon')
      .set('category', category)
      .set('name', name);
    
    const url = `${this.baseUrl}?${params.toString()}`;
    
    return this.http.get<WeaponDetailsResponse>(url)
      .pipe(
        map(response => {
          
          if (response.success) {
            return response;
          }
          throw new Error(response.message || 'Erro ao buscar detalhes da arma');
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Busca armas por termo de pesquisa
   * @param category - Categoria da arma
   * @param searchTerm - Termo de pesquisa
   * @returns Observable com a lista de armas encontradas
   */
  searchWeapons(category: WeaponCategoryType, searchTerm: string): Observable<WeaponsListResponse> {
    const params = new HttpParams()
      .set('action', 'list')
      .set('category', category)
      .set('search', searchTerm);
    
    return this.http.get<WeaponsListResponse>(`${this.baseUrl}?${params.toString()}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response;
          }
          throw new Error(response.message || 'Erro ao buscar armas');
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtém estatísticas de uma categoria
   * @param category - Categoria da arma
   * @returns Observable com as estatísticas da categoria
   */
  getCategoryStats(category: WeaponCategoryType): Observable<{
    total: number;
    byVocation: { [key: string]: number };
    byTier: { [key: number]: number };
    avgAtk: number;
    avgDef: number;
  }> {
    return this.getWeaponsByCategory(category).pipe(
      map(response => {
        const weapons = response.data;
        const total = weapons.length;
        
        // Calcular estatísticas
        const byVocation: { [key: string]: number } = {};
        const byTier: { [key: number]: number } = {};
        let totalAtk = 0;
        let totalDef = 0;
        
        weapons.forEach(weapon => {
          // Contagem por vocação
          byVocation[weapon.vocation] = (byVocation[weapon.vocation] || 0) + 1;
          
          // Contagem por tier
          byTier[weapon.tier] = (byTier[weapon.tier] || 0) + 1;
          
          // Soma para médias
          totalAtk += weapon.atk;
          totalDef += weapon.def;
        });
        
        return {
          total,
          byVocation,
          byTier,
          avgAtk: total > 0 ? totalAtk / total : 0,
          avgDef: total > 0 ? totalDef / total : 0
        };
      })
    );
  }

  /**
   * Verifica se uma arma tem dano elemental
   * @param weapon - Arma detalhada
   * @returns true se a arma tem dano elemental
   */
  hasElementalDamage(weapon: WeaponDetailed): boolean {
    // Como a nova API não retorna elemental_damage diretamente,
    // vamos verificar se há proficiências relacionadas a elementos
    return weapon.proficiency?.levels?.some(level => 
      level.perks?.some(perk => 
        perk.description.toLowerCase().includes('fire') ||
        perk.description.toLowerCase().includes('ice') ||
        perk.description.toLowerCase().includes('energy') ||
        perk.description.toLowerCase().includes('earth') ||
        perk.description.toLowerCase().includes('death') ||
        perk.description.toLowerCase().includes('holy')
      )
    ) || false;
  }

  /**
   * Obtém o tipo elemental primário de uma arma
   * @param weapon - Arma detalhada
   * @returns Tipo elemental primário ou null
   */
  getPrimaryElementalType(weapon: WeaponDetailed): string | null {
    if (!weapon.proficiency?.levels) return null;
    
    const elementalTypes = ['fire', 'ice', 'energy', 'earth', 'death', 'holy'];
    
    for (const level of weapon.proficiency.levels) {
      for (const perk of level.perks || []) {
        for (const type of elementalTypes) {
          if (perk.description.toLowerCase().includes(type)) {
            return type;
          }
        }
      }
    }
    
    return null;
  }

  /**
   * Obtém o nome de exibição de uma categoria
   * @param category - Tipo da categoria
   * @returns Nome de exibição da categoria
   */
  getCategoryDisplayName(category: WeaponCategoryType): string {
    const displayNames: { [key in WeaponCategoryType]: string } = {
      swords: 'Espadas',
      axes: 'Machados',
      clavas: 'Clavas',
      ranged: 'Armas de Longo Alcance',
      rods: 'Rods',
      wands: 'Wands',
      fist: 'Armas de Punho'
    };
    
    return displayNames[category] || category;
  }

  /**
   * Converte nomes de ícones vindos do backend para caminhos dos assets
   * @param iconName - Nome do ícone vindo do backend
   * @returns Caminho completo para o asset
   */
  getIconAssetPath(iconName: string): string {
    if (iconName.startsWith('assets/') || iconName.startsWith('http')) {
      return iconName;
    }
    if (iconName.startsWith('icons/')) {
      return `assets/${iconName}`;
    }
    return 'assets/icons/32_11345f84.png';
  }

  /**
   * Trata erros das requisições HTTP
   * @param error - Erro capturado
   * @returns Observable que emite erro
   */
  private handleError(error: any): Observable<never> {
    console.error('Erro na requisição HTTP:', error);
    
    let errorMessage = 'Erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      errorMessage = error.error?.message || error.message || `Código de erro: ${error.status}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
} 