import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService, Usuario } from '../../services/auth.service';
import { SeloesService }        from '../../services/selecoes.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  form!: FormGroup;
  usuario: Usuario | null = null;
  modoEdicao = false;
  salvando   = false;

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
    private authService:    AuthService,
    private selecoesSvc:    SeloesService,
    private fb:             FormBuilder,
    private navCtrl:        NavController,
    private alertCtrl:      AlertController,
    private loadingCtrl:    LoadingController,
    private toastCtrl:      ToastController,
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.usuario;
    this.form = this.fb.group({
      nome:          [this.usuario?.nome ?? '', [Validators.required, Validators.minLength(2)]],
      pais_favorito: [this.usuario?.pais_favorito ?? ''],
    });
  }

  getFlagFavorito(): string {
    const codigo = this.usuario?.pais_favorito ?? '';
    return this.selecoesSvc.getFlag(codigo);
  }

  getInitials(): string {
    return (this.usuario?.nome ?? 'U')
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  getNomeFavorito(): string {
    const s = this.selecoes.find(s => s.codigo === this.usuario?.pais_favorito);
    return s?.nome ?? 'Nenhuma seleção favorita';
  }

  toggleEdicao(): void {
    this.modoEdicao = !this.modoEdicao;
    if (!this.modoEdicao) {
      this.form.patchValue({
        nome:          this.usuario?.nome,
        pais_favorito: this.usuario?.pais_favorito,
      });
    }
  }

  async salvar(): Promise<void> {
    if (this.form.invalid || !this.usuario) { this.form.markAllAsTouched(); return; }

    const loader = await this.loadingCtrl.create({ message: 'Salvando…', spinner: 'crescent' });
    await loader.present();
    this.salvando = true;

    this.authService.atualizarPerfil(this.usuario.id, this.form.value).subscribe({
      next: async (res) => {
        this.usuario = res.usuario;
        this.modoEdicao = false;
        this.salvando   = false;
        await loader.dismiss();
        const t = await this.toastCtrl.create({
          message: '✅ Perfil atualizado!', duration: 2500, color: 'success', position: 'top',
        });
        t.present();
      },
      error: async (err) => {
        this.salvando = false;
        await loader.dismiss();
        const t = await this.toastCtrl.create({
          message: err?.error?.erro || 'Erro ao salvar.', duration: 3000, color: 'danger', position: 'top',
        });
        t.present();
      },
    });
  }

  async confirmarLogout(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Sair',
      message: 'Deseja sair da sua conta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sair', role: 'destructive',
          handler: () => {
            this.authService.logout();
            this.navCtrl.navigateRoot('/login');
          },
        },
      ],
    });
    await alert.present();
  }

  get nomeCtrl() { return this.form.get('nome'); }
}
