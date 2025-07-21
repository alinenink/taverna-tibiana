import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email = '';
  carregando = false;
  sucesso = '';
  erro = '';
  emailEnviado = false;
  
  // Variáveis para validação de código
  showVerification = false;
  registeredEmail = '';
  verificationCode = '';
  verificacaoErro = '';

  constructor(
    private router: Router, 
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.scrollService.scrollToTop();
  }

  recuperar() {
    // Track password recovery attempt
    this.analyticsService.trackUserAction('password_recovery', 'authentication', this.email);
    
    this.carregando = true;
    this.erro = '';
    this.sucesso = '';
    this.emailEnviado = false;
    this.authService.resetPassword(this.email).subscribe({
      next: (res) => {
        if (res.success) {
          this.sucesso = '🍺 Um pergaminho mágico foi enviado ao teu email! Siga as instruções para restaurar teu juramento.';
          this.emailEnviado = true;
          this.analyticsService.trackFormSubmission('password_recovery', true);
        } else {
          this.erro = res.message === 'Email não encontrado'
            ? '⚠️ Nenhum aventureiro foi encontrado com esse email mágico. Confere o endereço e tenta novamente!'
            : 'Não foi possível enviar o pergaminho de recuperação. Tente novamente mais tarde.';
          this.carregando = false;
          this.analyticsService.trackFormSubmission('password_recovery', false);
        }
        this.carregando = false;
      },
      error: (err) => {
        this.analyticsService.trackFormSubmission('password_recovery', false);
        if (err.status === 400 && err.error?.message) {
          this.erro = '⚠️ O taberneiro não conseguiu enviar o pergaminho: ' + err.error.message;
        } else {
          this.erro = 'Erro inesperado na taverna. Tente novamente em alguns minutos.';
        }
        this.carregando = false;
      }
    });
  }

  goToHome() {
    // Limpar session local antes de ir para login
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Método para ir para validação de código
  goToVerification() {
    // Verificar se o email foi preenchido
    if (!this.email || this.email.trim() === '') {
      this.erro = '⚠️ Por favor, digite seu email antes de prosseguir para a validação do código.';
      return;
    }

    // Validar se o email é válido (formato básico)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.erro = '⚠️ Por favor, insira um email válido antes de prosseguir.';
      return;
    }

    // Limpar erro anterior
    this.erro = '';
    
    // Definir o email registrado e mostrar a tela de verificação
    this.registeredEmail = this.email;
    this.showVerification = true;
    
    // Track analytics
    this.analyticsService.trackUserAction('go_to_verification', 'password_recovery', this.email);
  }

  // Validar código de verificação
  async onVerifyCode() {
    if (!this.verificationCode || this.verificationCode.trim() === '') {
      this.verificacaoErro = '⚠️ Por favor, digite o código de verificação.';
      return;
    }

    this.carregando = true;
    this.verificacaoErro = '';
    
    try {
      const response = await this.authService.validateVerificationCode({
        email: this.registeredEmail,
        code: this.verificationCode
      }).toPromise();

      if (response?.success) {
        this.carregando = false;
        this.sucesso = '🍺 Código validado com sucesso! Você pode agora redefinir sua senha.';
        this.analyticsService.trackFormSubmission('verification', true);
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          this.goToHome();
        }, 3000);
      } else {
        if (response?.message === 'Código inválido') {
          this.verificacaoErro = '⚠️ O código mágico informado está incorreto. Confira o pergaminho enviado ao seu email e tente novamente!';
        } else {
          this.verificacaoErro = response?.message || 'Erro na validação do código.';
        }
        this.carregando = false;
        this.analyticsService.trackFormSubmission('verification', false);
      }
    } catch (error: any) {
      if (error?.status === 400 && error?.error?.message === 'Código inválido') {
        this.verificacaoErro = '⚠️ O código mágico informado está incorreto. Confira o pergaminho enviado ao seu email e tente novamente!';
      } else {
        this.verificacaoErro = 'Erro ao validar o código. Tente novamente.';
      }
      this.carregando = false;
      this.analyticsService.trackFormSubmission('verification', false);
    }
  }

  // Voltar para a tela de recuperação de senha
  backToRecovery() {
    this.showVerification = false;
    this.verificationCode = '';
    this.verificacaoErro = '';
    this.registeredEmail = '';
  }
} 