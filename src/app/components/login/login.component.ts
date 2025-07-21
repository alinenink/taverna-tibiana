import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  carregando = false;
  erro = '';

  constructor(
    private router: Router, 
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private scrollService: ScrollService
  ) {}

  ngOnInit() {
    this.scrollService.scrollToTop();
    // Verifica se existe token no localStorage ou sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      this.router.navigate(['/home']);
    }
  }

  entrarComoVisitante() {
    // Track guest login attempt
    this.analyticsService.trackLogin('guest');
    
    // Login real como visitante
    const credentials = {
      email: 'visitante@gmail.com',
      password: 'Visitante123*'
    };
    this.carregando = true;
    this.authService.authenticate(credentials).then(authObservable => {
      authObservable.subscribe({
        next: (response) => {
          if (response.success && response.token) {
            this.authService.setAuthData(
              response.token,
              response.user,
              response.user_id
            );
            this.analyticsService.trackFormSubmission('guest_login', true);
            this.router.navigate(['/home']);
          } else {
            this.erro =
              response.message ||
              'Erro ao entrar como visitante. Tente novamente.';
            this.carregando = false;
            this.analyticsService.trackFormSubmission('guest_login', false);
          }
        },
        error: (error) => {
          this.carregando = false;
          this.erro = 'Erro ao entrar como visitante. Tente novamente.';
          this.analyticsService.trackFormSubmission('guest_login', false);
        }
      });
    });
  }

  async login() {
    // Track login attempt
    this.analyticsService.trackLogin('email');
    
    this.carregando = true;
    this.erro = '';

    const credentials = {
      email: this.email.trim(),
      password: this.password.trim(),
    };

    try {
      const authObservable = await this.authService.authenticate(credentials);
      authObservable.subscribe({
        next: (response) => {
          if (response.success && response.token) {
            this.authService.setAuthData(
              response.token,
              response.user,
              response.user_id
            );
            this.carregando = false;
            this.analyticsService.trackFormSubmission('login', true);
            this.router.navigate(['/home']);
          } else {
            this.erro =
              response.message ||
              'Erro na autenticação. Verifique suas credenciais.';
            this.carregando = false;
            this.analyticsService.trackFormSubmission('login', false);
          }
        },
        error: (error) => {
          this.carregando = false;
          console.error('Erro na autenticação:', error);
          this.analyticsService.trackFormSubmission('login', false);
          if (error.status === 401) {
            this.erro = '🍺 Opa, nobre aventureiro! Tuas credenciais não foram reconhecidas pelo taberneiro. Confere teu email mágico e tua palavra-passe, e tenta novamente!';
          } else {
            this.erro = 'Erro ao conectar com o servidor. Tente novamente.';
          }
        },
      });
    } catch (error) {
      this.carregando = false;
      console.error('Erro ao processar autenticação:', error);
      this.analyticsService.trackFormSubmission('login', false);
      this.erro = 'Erro interno. Tente novamente.';
    }
  }
}
