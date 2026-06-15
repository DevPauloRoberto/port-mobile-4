import { Injectable }  from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Partida {
  id:                number;
  selecao_casa_id:   number;
  selecao_fora_id:   number;
  fase:              string;
  grupo:             string | null;
  data_hora:         string;
  estadio:           string;
  cidade:            string;
  gols_casa:         number;
  gols_fora:         number;
  status:            string;
  casa_nome:         string;
  casa_codigo:       string;
  fora_nome:         string;
  fora_codigo:       string;
}

@Injectable({ providedIn: 'root' })
export class PartidasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<Partida[]> {
    return this.http.get<Partida[]>(`${this.apiUrl}/partidas`);
  }

  listarPorFase(fase: string): Observable<Partida[]> {
    return this.http.get<Partida[]>(`${this.apiUrl}/partidas/fase/${encodeURIComponent(fase)}`);
  }

  formatarData(dataHora: string): string {
    const d = new Date(dataHora);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  formatarHora(dataHora: string): string {
    const d = new Date(dataHora);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}
