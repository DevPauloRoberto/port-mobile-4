import { Component, OnInit } from '@angular/core';
import { PartidasService, Partida } from '../../services/partidas.service';
import { SeloesService }     from '../../services/selecoes.service';

@Component({
  selector: 'app-partidas',
  templateUrl: './partidas.page.html',
  styleUrls: ['./partidas.page.scss'],
  standalone: false,
})
export class PartidasPage implements OnInit {
  partidas:    Partida[]  = [];
  filtradas:   Partida[]  = [];
  carregando   = true;
  grupoFiltro  = 'Todos';

  grupos = ['Todos', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  constructor(
    private partidasSvc: PartidasService,
    private selecoesSvc: SeloesService,
  ) {}

  ngOnInit(): void { this.carregar(); }

  carregar(event?: any): void {
    this.carregando = true;
    this.partidasSvc.listar().subscribe({
      next: (p) => {
        this.partidas = p;
        this.filtrar();
        this.carregando = false;
        event?.target?.complete();
      },
      error: () => {
        this.carregando = false;
        event?.target?.complete();
      },
    });
  }

  filtrar(): void {
    this.filtradas = this.grupoFiltro === 'Todos'
      ? this.partidas
      : this.partidas.filter(p => p.grupo === this.grupoFiltro);
  }

  setFiltro(g: string): void {
    this.grupoFiltro = g;
    this.filtrar();
  }

  getFlag(c: string):    string { return this.selecoesSvc.getFlag(c); }
  formatarData(dh: string): string { return this.partidasSvc.formatarData(dh); }
  formatarHora(dh: string): string { return this.partidasSvc.formatarHora(dh); }

  getStatusClass(s: string): string {
    return { agendada: 'tag-agendada', 'ao vivo': 'tag-live', encerrada: 'tag-enc' }[s] ?? 'tag-agendada';
  }
  getStatusLabel(s: string): string {
    return { agendada: 'Agendada', 'ao vivo': '🔴 Ao Vivo', encerrada: 'Encerrada' }[s] ?? s;
  }
}
