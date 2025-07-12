import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../environments/environments';

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

  constructor(private http: HttpClient) {}

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
    return this.http.post<AuthResponse>(`${this.apiUrl}/authenticate`, secureCredentials);
  }

  registerUser(userData: RegisterRequest): Observable<AuthResponse> {
    return from(this.hashPassword(userData.password)).pipe(
      switchMap(hashedPassword => {
        return this.http.post<AuthResponse>(`${this.apiUrl}/registerUser`, {
          email: userData.email,
          password: hashedPassword,
          char: userData.char
        });
      })
    );
  }

  validateVerificationCode(validateData: ValidateCodeRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/validateVerificationCode`, validateData);
  }

  resetPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/resetPassword`, { email });
  }

  logout(): void {
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