import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

function senhasIguais(ctrl: AbstractControl): ValidationErrors | null {
  const a = ctrl.get('novaSenha')?.value;
  const b = ctrl.get('confirmarSenha')?.value;
  return a === b ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.page.html',
  styleUrls: ['./esqueci-senha.page.scss'],
  standalone: false,
})
export class EsqueciSenhaPage implements OnInit {
  form!: FormGroup;
  loading = false;
  sucesso = false;
  mostrarSenha = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email:         ['', [Validators.required, Validators.email]],
      novaSenha:     ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha:['', Validators.required],
    }, { validators: senhasIguais });
  }

  async onSolicitar(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const loader = await this.loadingCtrl.create({ message: 'Atualizando…', spinner: 'crescent' });
    await loader.present();
    this.loading = true;

    const { email, novaSenha } = this.form.value;

    this.authService.solicitarNovaSenha(email, novaSenha).subscribe({
      next: async () => {
        await loader.dismiss();
        this.sucesso = true;
        const toast = await this.toastCtrl.create({
          message: '✅ Senha atualizada com sucesso!',
          duration: 3000, color: 'success', position: 'top',
        });
        await toast.present();
        setTimeout(() => this.navCtrl.navigateRoot('/login'), 2500);
      },
      error: async (err) => {
        await loader.dismiss();
        this.loading = false;
        const toast = await this.toastCtrl.create({
          message: err?.error?.erro || 'Erro ao redefinir senha.',
          duration: 3000, color: 'danger', position: 'top',
        });
        toast.present();
      },
    });
  }

  goToLogin(): void { this.navCtrl.navigateBack('/login'); }

  get emailCtrl()   { return this.form.get('email'); }
  get novaSenhaCtrl(){ return this.form.get('novaSenha'); }
  get confirmCtrl() { return this.form.get('confirmarSenha'); }
}
