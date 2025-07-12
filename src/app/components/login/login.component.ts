import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  carregando = false;
  erro = '';

  constructor(private router: Router) {}

  login() {
    this.carregando = true;
    this.erro = '';
    // Simulação de login (substituir por lógica real)
    setTimeout(() => {
      this.carregando = false;
      if (this.username === 'admin' && this.password === 'admin') {
        this.router.navigate(['/home']);
      } else {
        this.erro = 'Usuário ou senha inválidos.';
      }
    }, 1200);
  }
} 