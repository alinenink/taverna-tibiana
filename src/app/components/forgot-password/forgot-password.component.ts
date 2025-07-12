import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  carregando = false;
  sucesso = '';
  erro = '';
  emailEnviado = false;

  constructor(private router: Router, private authService: AuthService) {}

  recuperar() {
    this.carregando = true;
    this.erro = '';
    this.sucesso = '';
    this.emailEnviado = false;
    this.authService.resetPassword(this.email).subscribe({
      next: (res) => {
        if (res.success) {
          this.sucesso = '🍺 Um pergaminho mágico foi enviado ao teu email! Siga as instruções para restaurar teu juramento.';
          this.emailEnviado = true;
        } else {
          this.erro = res.message === 'Email não encontrado'
            ? '⚠️ Nenhum aventureiro foi encontrado com esse email mágico. Confere o endereço e tenta novamente!'
            : 'Não foi possível enviar o pergaminho de recuperação. Tente novamente mais tarde.';
          this.carregando = false;
        }
        this.carregando = false;
      },
      error: (err) => {
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
    this.router.navigate(['/login']);
  }
} 