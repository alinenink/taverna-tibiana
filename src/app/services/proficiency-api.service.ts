import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { AuthService } from './auth.service';

interface ProficiencyData {
  weapon: {
    name: string;
    category: string;
    image_url?: string;
  };
  selectedPerks: Array<{
    level: number;
    selectedPerks: Array<{
      icons: string[];
      description: string;
      title: string;
    }>;
  }>;
  createdAt: string;
  version: string;
}

interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProficiencyApiService {
  private baseURL = environment.apiUrl;

  constructor(private authService: AuthService) {}

  private getHeaders(): { [key: string]: string } {
    const token = this.authService.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async save(data: ProficiencyData): Promise<APIResponse> {
    try {
      const response = await fetch(`${this.baseURL}/weapons?action=save-perks`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Se não for ok, mas temos dados da resposta, retornar os dados
        if (responseData) {
          return responseData;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('Erro ao salvar proficiência:', error);
      throw error;
    }
  }

  async get(weaponName: string, category: string): Promise<APIResponse> {
    try {
      const url = `${this.baseURL}/weapons?action=get-perks&weapon_name=${encodeURIComponent(weaponName)}&weapon_category=${category}`;
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar proficiência:', error);
      throw error;
    }
  }

  async list(category: string = '', page: number = 1, limit: number = 10): Promise<APIResponse> {
    try {
      const params = `action=list-perks&page=${page}&limit=${limit}${category ? `&weapon_category=${category}` : ''}`;
      const response = await fetch(`${this.baseURL}/weapons?${params}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar proficiências:', error);
      throw error;
    }
  }

  async delete(weaponName: string, category: string): Promise<APIResponse> {
    try {
      const url = `${this.baseURL}/weapons?action=delete-perks&weapon_name=${encodeURIComponent(weaponName)}&weapon_category=${category}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar proficiência:', error);
      throw error;
    }
  }
}
