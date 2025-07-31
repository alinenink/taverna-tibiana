import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environments';

export interface UserMonster {
  id: number;
  name: string;
  progress: number;
  kills: number;
  is_selected: boolean;
  user_notes?: string;
  data_adicao?: string;
  ultima_atualizacao?: string;
}

export interface UserBestiaryConfig {
  mostrar_progresso: boolean;
  ordenar_por: string;
}

export interface UserBestiaryStats {
  total_selecionados: number;
  total_progresso: number;
  total_kills: number;
  ultima_atualizacao: string;
}

export interface UserBestiaryData {
  monstros_selecionados: UserMonster[];
  configuracoes: UserBestiaryConfig;
  estatisticas: UserBestiaryStats;
}

export interface UserBestiaryResponse {
  success: boolean;
  data: {
    bestiarios: UserBestiaryData;
  };
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserBestiaryService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiUrl || 'http://localhost:3000/api';

  /**
   * Buscar bestiário do usuário
   */
  getUserBestiary(): Observable<UserBestiaryData> {
    return this.http.get<UserBestiaryResponse>(`${this.apiBase}/user-bestiary`).pipe(
      map(response => {
        if (response.success && response.data?.bestiarios) {
          return response.data.bestiarios;
        }
        // Retornar estrutura padrão se não existir
        return this.getDefaultBestiaryData();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Atualizar bestiário do usuário (PUT)
   */
  saveUserBestiary(bestiarios: UserBestiaryData): Observable<UserBestiaryData> {
    return this.http
      .put<UserBestiaryResponse>(
        `${this.apiBase}/user-bestiary`,
        { bestiarios },
        {
          observe: 'response',
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        map(response => {
          // Se o status for 204, retornar os dados originais
          if (response.status === 204) {
            return bestiarios;
          }

          // Se há corpo na resposta
          if (response.body) {
            const body = response.body as UserBestiaryResponse;

            if (body.success && body.data?.bestiarios) {
              return body.data.bestiarios;
            }

            // Se success é false, tratar como erro HTTP 400
            const error = new Error(body.message || 'Erro ao atualizar bestiário');
            (error as any).status = 400;
            (error as any).error = {
              success: body.success,
              error: body.error,
              message: body.message,
            };
            throw error;
          }

          // Se não há corpo mas o status é de sucesso, retornar dados originais
          if (response.status >= 200 && response.status < 300) {
            return bestiarios;
          }

          throw new Error('Resposta inesperada do servidor');
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Deletar bestiário do usuário
   */
  deleteUserBestiary(): Observable<any> {
    return this.http.delete(`${this.apiBase}/user-bestiary`).pipe(catchError(this.handleError));
  }

  /**
   * Adicionar monstro ao bestiário
   */
  addMonster(monster: {
    id: number;
    name: string;
    charm_details: any;
  }): Observable<UserBestiaryData> {
    return this.getUserBestiary().pipe(
      map(currentData => {
        const newMonster: UserMonster = {
          id: monster.id,
          name: monster.name,
          progress: 0,
          kills: 0,
          is_selected: true,
          user_notes: '',
          data_adicao: new Date().toISOString(),
        };

        const updatedData = {
          ...currentData,
          monstros_selecionados: [...(currentData.monstros_selecionados || []), newMonster],
        };

        // Atualizar estatísticas
        updatedData.estatisticas = this.calculateStats(updatedData.monstros_selecionados);

        return updatedData;
      }),
      map(updatedData => {
        // Salvar no backend
        this.saveUserBestiary(updatedData).subscribe();
        return updatedData;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Atualizar progresso de um monstro específico (PUT)
   */
  updateMonsterProgress(
    monsterId: number,
    kills: number,
    progress?: number
  ): Observable<UserBestiaryData> {
    // Usar o novo endpoint PUT específico para monstro individual
    return this.http
      .put<UserBestiaryResponse>(
        `${this.apiBase}/user-bestiary/monster/${monsterId}`,
        {
          progress: progress !== undefined ? progress : Math.floor(kills / 10), // 10% = 1 kill
          kills,
          is_selected: kills > 0,
        },
        {
          observe: 'response',
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        switchMap(response => {
          if (response.body && response.body.success && response.body.data?.bestiarios) {
            return [response.body.data.bestiarios];
          }

          // Se não há resposta específica, atualizar localmente
          return this.getUserBestiary().pipe(
            map(currentData => {
              const updatedMonsters = (currentData.monstros_selecionados || []).map(monster => {
                if (monster.id === monsterId) {
                  return {
                    ...monster,
                    kills,
                    progress: progress !== undefined ? progress : monster.progress,
                    ultima_atualizacao: new Date().toISOString(),
                  };
                }
                return monster;
              });

              const updatedData = {
                ...currentData,
                monstros_selecionados: updatedMonsters,
              };

              // Atualizar estatísticas
              updatedData.estatisticas = this.calculateStats(updatedData.monstros_selecionados);

              return updatedData;
            })
          );
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Remover monstro do bestiário
   */
  removeMonster(monsterId: number): Observable<UserBestiaryData> {
    return this.getUserBestiary().pipe(
      map(currentData => {
        const updatedData = {
          ...currentData,
          monstros_selecionados: (currentData.monstros_selecionados || []).filter(
            m => m.id !== monsterId
          ),
        };

        // Atualizar estatísticas
        updatedData.estatisticas = this.calculateStats(updatedData.monstros_selecionados);

        return updatedData;
      }),
      map(updatedData => {
        // Salvar no backend
        this.saveUserBestiary(updatedData).subscribe();
        return updatedData;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Atualizar notas do usuário para um monstro (PUT)
   */
  updateMonsterNotes(monsterId: number, notes: string): Observable<UserBestiaryData> {
    // Usar o endpoint PUT específico para atualizar notas
    return this.http
      .put<UserBestiaryResponse>(
        `${this.apiBase}/user-bestiary/monster/${monsterId}/notes`,
        {
          user_notes: notes,
          updated_at: new Date().toISOString(),
        },
        {
          observe: 'response',
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        switchMap(response => {
          if (response.body && response.body.success && response.body.data?.bestiarios) {
            return [response.body.data.bestiarios];
          }

          // Se não há resposta específica, atualizar localmente
          return this.getUserBestiary().pipe(
            map(currentData => {
              const updatedMonsters = (currentData.monstros_selecionados || []).map(monster => {
                if (monster.id === monsterId) {
                  return {
                    ...monster,
                    user_notes: notes,
                    ultima_atualizacao: new Date().toISOString(),
                  };
                }
                return monster;
              });

              const updatedData = {
                ...currentData,
                monstros_selecionados: updatedMonsters,
              };

              return updatedData;
            })
          );
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Verificar se um monstro está no bestiário do usuário
   */
  isMonsterInUserBestiary(monsterId: number): Observable<boolean> {
    return this.getUserBestiary().pipe(
      map(data =>
        data.monstros_selecionados
          ? data.monstros_selecionados.some(m => m.id === monsterId)
          : false
      ),
      catchError(() => [false])
    );
  }

  /**
   * Obter dados de um monstro específico do bestiário do usuário
   */
  getMonsterFromUserBestiary(monsterId: number): Observable<UserMonster | null> {
    return this.getUserBestiary().pipe(
      map(data =>
        data.monstros_selecionados
          ? data.monstros_selecionados.find(m => m.id === monsterId) || null
          : null
      ),
      catchError(() => [null])
    );
  }

  /**
   * Atualizar configurações do usuário (PUT)
   */
  updateUserSettings(settings: {
    theme?: string;
    language?: string;
    notifications?: boolean;
    auto_save?: boolean;
  }): Observable<any> {
    return this.http
      .put(
        `${this.apiBase}/user/settings`,
        {
          theme: settings.theme || 'dark',
          language: settings.language || 'pt-BR',
          notifications: settings.notifications !== undefined ? settings.notifications : true,
          auto_save: settings.auto_save !== undefined ? settings.auto_save : true,
        },
        {
          observe: 'response',
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        map(response => {
          if (response.body) {
            return response.body;
          }
          return { success: true, message: 'Configurações atualizadas com sucesso' };
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Calcular estatísticas baseadas na lista de monstros
   */
  private calculateStats(monstros: UserMonster[]): UserBestiaryStats {
    return {
      total_selecionados: monstros.filter(m => m.is_selected).length,
      total_progresso: monstros.reduce((sum, m) => sum + m.progress, 0),
      total_kills: monstros.reduce((sum, m) => sum + m.kills, 0),
      ultima_atualizacao: new Date().toISOString(),
    };
  }

  /**
   * Obter estrutura padrão para novo bestiário
   */
  private getDefaultBestiaryData(): UserBestiaryData {
    return {
      monstros_selecionados: [],
      configuracoes: {
        mostrar_progresso: true,
        ordenar_por: 'progress',
      },
      estatisticas: {
        total_selecionados: 0,
        total_progresso: 0,
        total_kills: 0,
        ultima_atualizacao: new Date().toISOString(),
      },
    };
  }

  /**
   * Obter headers de autenticação
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * Tratamento de erros
   */
  private handleError(error: any): Observable<never> {
    console.error('Erro no UserBestiaryService:', error);

    // Se for um erro 204 (No Content), não é realmente um erro
    if (error.status === 204) {
      return throwError(() => new Error('Operação bem-sucedida'));
    }

    return throwError(() => new Error(error.message || 'Erro desconhecido'));
  }
}
