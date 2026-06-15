import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  mostrarSenha = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loader = await this.loadingCtrl.create({ message: 'Entrando…', spinner: 'crescent' });
    await loader.present();
    this.loading = true;

    const { email, senha } = this.loginForm.value;

    this.authService.login(email, senha).subscribe({
      next: async () => {
        await loader.dismiss();
        this.navCtrl.navigateRoot('/tabs/home', { animationDirection: 'forward' });
      },
      error: async (err) => {
        await loader.dismiss();
        this.loading = false;
        const msg = err?.error?.erro || 'Erro ao fazer login.';
        const toast = await this.toastCtrl.create({
          message: msg, duration: 3000, color: 'danger', position: 'top',
        });
        await toast.present();
      },
    });
  }

  goToCadastro(): void {
    this.navCtrl.navigateForward('/cadastro');
  }

  goToEsqueciSenha(): void {
    this.navCtrl.navigateForward('/esqueci-senha');
  }

  toggleSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  get emailCtrl() { return this.loginForm.get('email'); }
  get senhaCtrl() { return this.loginForm.get('senha'); }
}
