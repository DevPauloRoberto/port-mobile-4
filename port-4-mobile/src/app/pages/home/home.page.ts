import { Component, OnInit } from '@angular/core';
import { NavController }     from '@ionic/angular';
import { AuthService }       from '../../services/auth.service';
import { PartidasService, Partida } from '../../services/partidas.service';
import { SeloesService, Selecao }   from '../../services/selecoes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  nomeUsuario = '';
  partidas:  Partida[]  = [];
  selecoes:  Selecao[]  = [];
  carregando = true;

  stats = { selecoes: 32, grupos: 8, partidas: 104, estadios: 16 };

  constructor(
    private authService:    AuthService,
    private partidasSvc:    PartidasService,
    private selecoesSvc:    SeloesService,
    private navCtrl:        NavController,
  ) {}

  ngOnInit(): void {
    this.nomeUsuario = this.authService.usuario?.nome ?? 'Torcedor';
    this.carregarDados();
  }

  carregarDados(event?: any): void {
    this.carregando = true;

    this.partidasSvc.listar().subscribe({
      next: (p) => {
        this.partidas = p.slice(0, 4);
        this.carregando = false;
        event?.target?.complete();
      },
      error: () => {
        this.carregando = false;
        event?.target?.complete();
      },
    });

    this.selecoesSvc.listar().subscribe({
      next: (s) => { this.selecoes = s.slice(0, 8); },
    });
  }

  getFlag(codigo: string): string {
    return this.selecoesSvc.getFlag(codigo);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      agendada:  'status-agendada',
      'ao vivo': 'status-live',
      encerrada: 'status-encerrada',
    };
    return map[status] ?? 'status-agendada';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      agendada:  'Agendada',
      'ao vivo': '🔴 Ao Vivo',
      encerrada: 'Encerrada',
    };
    return map[status] ?? status;
  }

  formatarData(dh: string): string { return this.partidasSvc.formatarData(dh); }
  formatarHora(dh: string): string { return this.partidasSvc.formatarHora(dh); }

  irParaSelecao(id: number): void {
    this.navCtrl.navigateForward(`/selecao/${id}`);
  }
}
