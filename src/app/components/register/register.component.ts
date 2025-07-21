import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  verificationForm: FormGroup;
  carregando = false;
  showTermsModal = false;
  showVerification = false;
  showSuccessModal = false;
  registeredEmail = '';
  erro = '';
  verificacaoErro = '';
  teleportTimer = 5;
  teleportInterval: any;

  // Lista de domínios de email válidos
  private validEmailDomains = [
    'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'yahoo.com.br',
    'uol.com.br', 'bol.com.br', 'ig.com.br', 'terra.com.br', 'globo.com',
    'live.com', 'msn.com', 'protonmail.com', 'icloud.com', 'me.com',
    'aol.com', 'mail.com', 'yandex.com', 'zoho.com', 'gmx.com'
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private scrollService: ScrollService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.emailDomainValidator.bind(this)]],
      char: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });

    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    this.scrollService.scrollToTop();
  }

  // Validador personalizado para domínio de email
  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const email = control.value.toLowerCase();
    const domain = email.split('@')[1];
    
    if (!domain) return { invalidDomain: true };
    
    // Verificar se o domínio está na lista de domínios válidos
    if (!this.validEmailDomains.includes(domain)) {
      return { invalidDomain: true };
    }
    
    // Verificar domínios inválidos específicos
    const invalidDomains = ['teste.com', 'test.com', 'example.com', 'fake.com', 'invalid.com'];
    if (invalidDomains.includes(domain)) {
      return { invalidDomain: true };
    }
    
    return null;
  }

  // Validador para verificar se as senhas coincidem
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword && confirmPassword.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

  // Abrir modal de termos
  openTermsModal() {
    this.showTermsModal = true;
  }

  // Fechar modal de termos
  closeTermsModal() {
    this.showTermsModal = false;
  }

  // Aceitar termos (marca o checkbox automaticamente)
  acceptTerms() {
    this.registerForm.patchValue({ acceptTerms: true });
    this.closeTermsModal();
  }

  // Submeter formulário
  onSubmit() {
    if (this.registerForm.valid) {
      // Track registration attempt
      this.analyticsService.trackRegistration('email');
      
      this.carregando = true;
      this.erro = '';
      const formData = this.registerForm.value;
      this.authService.registerUser({
        email: formData.email,
        password: formData.password,
        char: formData.char
      }).subscribe({
        next: (response) => {
          if (response?.success) {
            this.registeredEmail = formData.email;
            this.showVerification = true;
            this.analyticsService.trackFormSubmission('registration', true);
          } else {
            this.erro = response.message || 'Erro no registro. Tente novamente.';
            this.analyticsService.trackFormSubmission('registration', false);
          }
          this.carregando = false;
        },
        error: (error) => {
          this.carregando = false;
          this.analyticsService.trackFormSubmission('registration', false);
          if (error.status === 400 && error.error?.message === 'Email já cadastrado') {
            this.erro = '🍺 Este email mágico já está registrado na taverna. Tente outro ou recupere seu juramento.';
          } else {
            this.erro = 'Erro ao registrar. Tente novamente.';
          }
        }
      });
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Validar código de verificação
  async onVerifyCode() {
    if (this.verificationForm.valid) {
      this.carregando = true;
      this.verificacaoErro = '';
      const formData = this.verificationForm.value;
      try {
        const response = await this.authService.validateVerificationCode({
          email: this.registeredEmail,
          code: formData.code
        }).toPromise();

        if (response?.success) {
          this.carregando = false;
          this.showSuccessModal = true;
          this.analyticsService.trackFormSubmission('verification', true);
          this.startTeleportTimer();
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
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.verificationForm.controls).forEach(key => {
        const control = this.verificationForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Iniciar timer de teleporte
  startTeleportTimer() {
    this.teleportTimer = 5;
    this.teleportInterval = setInterval(() => {
      this.teleportTimer--;
      if (this.teleportTimer <= 0) {
        this.teleportToLogin();
      }
    }, 1000);
  }

  // Teleportar para login
  teleportToLogin() {
    if (this.teleportInterval) {
      clearInterval(this.teleportInterval);
    }
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }

  // Teleportar agora (botão)
  teleportNow() {
    this.teleportToLogin();
  }

  // Voltar para o formulário de registro
  backToRegister() {
    this.showVerification = false;
    this.verificationForm.reset();
  }

  // Método legado para compatibilidade (pode ser removido se não for mais usado)
  register() {
    this.onSubmit();
  }

  goToLogin() {
    // Limpar session local antes de ir para login
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 