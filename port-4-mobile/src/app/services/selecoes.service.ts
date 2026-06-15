import { Injectable }  from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Selecao {
  id:           number;
  nome:         string;
  codigo:       string;
  grupo:        string;
  confederacao: string;
  treinador:    string;
  ranking_fifa: number;
}

export interface Jogador {
  id:         number;
  nome:       string;
  posicao:    string;
  numero:     number | null;
  idade:      number;
  clube:      string;
  selecao_id: number;
}

export interface SelecaoDetalhe extends Selecao {
  jogadores: Jogador[];
}

const FLAGS: Record<string, string> = {
  BRA: '🇧🇷', ARG: '🇦🇷', FRA: '🇫🇷', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  ESP: '🇪🇸', POR: '🇵🇹', GER: '🇩🇪', NED: '🇳🇱',
  URU: '🇺🇾', COL: '🇨🇴', MEX: '🇲🇽', USA: '🇺🇸',
  JPN: '🇯🇵', MAR: '🇲🇦', SEN: '🇸🇳', AUS: '🇦🇺',
};

@Injectable({ providedIn: 'root' })
export class SeloesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<Selecao[]> {
    return this.http.get<Selecao[]>(`${this.apiUrl}/selecoes`);
  }

  buscarPorId(id: number): Observable<SelecaoDetalhe> {
    return this.http.get<SelecaoDetalhe>(`${this.apiUrl}/selecoes/${id}`);
  }

  getFlag(codigo: string): string {
    return FLAGS[codigo] ?? '🏳️';
  }
}
