import { Component, OnInit } from '@angular/core';
import { NavController }     from '@ionic/angular';
import { GruposService, Classificacao } from '../../services/grupos.service';
import { SeloesService }     from '../../services/selecoes.service';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
  standalone: false,
})
export class GruposPage implements OnInit {
  grupos = ['A','B','C','D','E','F','G','H'];
  grupoSelecionado = 'A';
  classificacao: Classificacao[] = [];
  todosGrupos: Record<string, Classificacao[]> = {};
  carregando = true;

  constructor(
    private gruposSvc: GruposService,
    private selecoesSvc: SeloesService,
    private navCtrl: NavController,
  ) {}

  ngOnInit(): void {
    this.carregarTodos();
  }

  carregarTodos(event?: any): void {
    this.carregando = true;
    this.gruposSvc.listar().subscribe({
      next: (dados) => {
        this.todosGrupos = {};
        for (const g of this.grupos) {
          this.todosGrupos[g] = dados.filter(d => d.grupo === g);
        }
        this.classificacao = this.todosGrupos[this.grupoSelecionado] ?? [];
        this.carregando = false;
        event?.target?.complete();
      },
      error: () => {
        this.carregando = false;
        event?.target?.complete();
      },
    });
  }

  selecionarGrupo(g: string): void {
    this.grupoSelecionado = g;
    this.classificacao = this.todosGrupos[g] ?? [];
  }

  getFlag(codigo: string): string {
    return this.selecoesSvc.getFlag(codigo);
  }

  irParaSelecao(id: number): void {
    this.navCtrl.navigateForward(`/selecao/${id}`);
  }
}
