import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  carregando = false;
  erro = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  loginMock() {
    this.authService.setAuthData('mock-token', 'mock-user', 'mock-user-id');
    this.router.navigate(['/home']);
  }
  
  async login() {
    this.carregando = true;
    this.erro = '';

    const credentials = {
      email: this.email,
      password: this.password
    };

    try {
      const authObservable = await this.authService.authenticate(credentials);
      authObservable.subscribe({
        next: (response) => {
          if (response.success && response.token) {
            this.authService.setAuthData(response.token, response.user, response.user_id);
            this.carregando = false;
            this.router.navigate(['/home']);
          } else {
            this.erro = response.message || 'Erro na autenticação. Verifique suas credenciais.';
            this.carregando = false;
          }
        },
        error: (error) => {
          this.carregando = false;
          console.error('Erro na autenticação:', error);
          if (error.status === 401) {
            this.erro = '🍺 Opa, nobre aventureiro! Tuas credenciais não foram reconhecidas pelo taberneiro. Confere teu email mágico e tua palavra-passe, e tenta novamente!';
          } else {
            this.erro = 'Erro ao conectar com o servidor. Tente novamente.';
          }
        }
      });
    } catch (error) {
      this.carregando = false;
      console.error('Erro ao processar autenticação:', error);
      this.erro = 'Erro interno. Tente novamente.';
    }
  }
} 