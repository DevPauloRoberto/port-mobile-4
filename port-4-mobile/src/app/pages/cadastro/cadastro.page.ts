import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

function senhasIguais(ctrl: AbstractControl): ValidationErrors | null {
  const senha   = ctrl.get('senha')?.value;
  const confirm = ctrl.get('confirmarSenha')?.value;
  return senha === confirm ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: false,
})
export class CadastroPage implements OnInit {
  form!: FormGroup;
  loading = false;
  mostrarSenha = false;

  selecoes = [
    { nome: '🇧🇷 Brasil',     codigo: 'BRA' }, { nome: '🇦🇷 Argentina', codigo: 'ARG' },
    { nome: '🇫🇷 França',     codigo: 'FRA' }, { nome: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra', codigo: 'ENG' },
    { nome: '🇪🇸 Espanha',    codigo: 'ESP' }, { nome: '🇵🇹 Portugal',  codigo: 'POR' },
    { nome: '🇩🇪 Alemanha',   codigo: 'GER' }, { nome: '🇳🇱 Holanda',   codigo: 'NED' },
    { nome: '🇺🇾 Uruguai',    codigo: 'URU' }, { nome: '🇨🇴 Colômbia',  codigo: 'COL' },
    { nome: '🇲🇽 México',     codigo: 'MEX' }, { nome: '🇺🇸 EUA',       codigo: 'USA' },
    { nome: '🇯🇵 Japão',      codigo: 'JPN' }, { nome: '🇲🇦 Marrocos',  codigo: 'MAR' },
    { nome: '🇸🇳 Senegal',    codigo: 'SEN' }, { nome: '🇦🇺 Austrália', codigo: 'AUS' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome:          ['', [Validators.required, Validators.minLength(2)]],
      email:         ['', [Validators.required, Validators.email]],
      senha:         ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha:['', Validators.required],
      pais_favorito: [''],
    }, { validators: senhasIguais });
  }

  async onCadastro(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const loader = await this.loadingCtrl.create({ message: 'Criando conta…', spinner: 'crescent' });
    await loader.present();
    this.loading = true;

    const { nome, email, senha, pais_favorito } = this.form.value;

    this.authService.cadastro({ nome, email, senha, pais_favorito: pais_favorito || null }).subscribe({
      next: async () => {
        await loader.dismiss();
        this.navCtrl.navigateRoot('/tabs/home', { animationDirection: 'forward' });
      },
      error: async (err) => {
        await loader.dismiss();
        this.loading = false;
        const toast = await this.toastCtrl.create({
          message: err?.error?.erro || 'Erro ao criar conta.',
          duration: 3000, color: 'danger', position: 'top',
        });
        toast.present();
      },
    });
  }

  goToLogin(): void { this.navCtrl.navigateBack('/login'); }

  get nomeCtrl()  { return this.form.get('nome');  }
  get emailCtrl() { return this.form.get('email'); }
  get senhaCtrl() { return this.form.get('senha'); }
  get confirmCtrl(){ return this.form.get('confirmarSenha'); }
}
