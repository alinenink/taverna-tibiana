import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../environments/environments';
import { AnalyticsService } from './analytics.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  char: string;
}

export interface ValidateCodeRequest {
  email: string;
  code: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
  user_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private analyticsService: AnalyticsService
  ) {}

  // Função para fazer hash da senha usando SHA-256
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  async authenticate(credentials: LoginRequest): Promise<Observable<AuthResponse>> {
    const hashedPassword = await this.hashPassword(credentials.password);
    const secureCredentials = {
      email: credentials.email,
      password: hashedPassword
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth?action=login`, secureCredentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  registerUser(userData: RegisterRequest): Observable<AuthResponse> {
    return from(this.hashPassword(userData.password)).pipe(
      switchMap(hashedPassword => {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth?action=register`, {
          email: userData.email,
          password: hashedPassword,
          char: userData.char
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      })
    );
  }

  sendVerificationCode(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth?action=send-code`, { email }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  validateVerificationCode(validateData: ValidateCodeRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth?action=validate-code`, validateData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  resetPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth?action=reset-password`, { email }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  logout(): void {
    // Track logout
    this.analyticsService.trackLogout();
    
    // Limpar dados de autenticação do localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  setAuthData(token: string, user: any, userId?: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }
} 