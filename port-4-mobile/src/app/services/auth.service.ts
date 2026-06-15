import { Injectable }        from '@angular/core';
import { HttpClient }        from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap }               from 'rxjs/operators';
import { environment }       from '../../environments/environment';

export interface Usuario {
  id:            number;
  nome:          string;
  email:         string;
  pais_favorito: string | null;
}

const STORAGE_KEY = 'copa2026_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);

  usuario$: Observable<Usuario | null> = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      this.usuarioSubject.next(JSON.parse(salvo));
    }
  }

  get usuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  login(email: string, senha: string): Observable<{ usuario: Usuario }> {
    return this.http
      .post<{ usuario: Usuario }>(`${this.apiUrl}/auth/login`, { email, senha })
      .pipe(tap(res => this.salvarUsuario(res.usuario)));
  }

  cadastro(dados: Partial<Usuario> & { senha: string }): Observable<{ usuario: Usuario }> {
    return this.http
      .post<{ usuario: Usuario }>(`${this.apiUrl}/auth/cadastro`, dados)
      .pipe(tap(res => this.salvarUsuario(res.usuario)));
  }

  solicitarNovaSenha(email: string, nova_senha: string): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(
      `${this.apiUrl}/auth/solicitar-senha`,
      { email, nova_senha }
    );
  }

  atualizarPerfil(id: number, dados: Partial<Usuario>): Observable<{ usuario: Usuario }> {
    return this.http
      .put<{ usuario: Usuario }>(`${this.apiUrl}/auth/perfil/${id}`, dados)
      .pipe(tap(res => this.salvarUsuario(res.usuario)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.usuarioSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.usuarioSubject.value;
  }

  private salvarUsuario(usuario: Usuario): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }
}
