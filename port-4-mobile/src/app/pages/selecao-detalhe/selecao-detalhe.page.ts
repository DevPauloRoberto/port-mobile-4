import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { NavController }     from '@ionic/angular';
import { SeloesService, SelecaoDetalhe } from '../../services/selecoes.service';

@Component({
  selector: 'app-selecao-detalhe',
  templateUrl: './selecao-detalhe.page.html',
  styleUrls: ['./selecao-detalhe.page.scss'],
  standalone: false,
})
export class SelecaoDetalhePage implements OnInit {
  selecao:   SelecaoDetalhe | null = null;
  carregando = true;
  erro       = '';

  posicaoOrdem = ['Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Atacante'];

  constructor(
    private route:       ActivatedRoute,
    private selecoesSvc: SeloesService,
    private navCtrl:     NavController,
  ) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);
    this.carregarSelecao(id);
  }

  carregarSelecao(id: number): void {
    this.carregando = true;
    this.selecoesSvc.buscarPorId(id).subscribe({
      next: (s) => { this.selecao = s; this.carregando = false; },
      error: () => {
        this.carregando = false;
        this.erro = 'Seleção não encontrada.';
      },
    });
  }

  getFlag(): string {
    return this.selecao ? this.selecoesSvc.getFlag(this.selecao.codigo) : '';
  }

  jogadoresPorPosicao(pos: string) {
    return this.selecao?.jogadores.filter(j => j.posicao === pos) ?? [];
  }

  posicaoTemJogadores(pos: string): boolean {
    return this.jogadoresPorPosicao(pos).length > 0;
  }

  voltar(): void { this.navCtrl.back(); }
}
