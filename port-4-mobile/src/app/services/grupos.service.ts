import { Injectable }  from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Classificacao {
  id:          number;
  selecao_id:  number;
  grupo:       string;
  pontos:      number;
  jogos:       number;
  vitorias:    number;
  empates:     number;
  derrotas:    number;
  gols_pro:    number;
  gols_contra: number;
  saldo_gols:  number;
  nome:        string;
  codigo:      string;
  confederacao:string;
}

@Injectable({ providedIn: 'root' })
export class GruposService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<Classificacao[]> {
    return this.http.get<Classificacao[]>(`${this.apiUrl}/grupos`);
  }

  listarPorGrupo(grupo: string): Observable<Classificacao[]> {
    return this.http.get<Classificacao[]>(`${this.apiUrl}/grupos/${grupo}`);
  }
}
