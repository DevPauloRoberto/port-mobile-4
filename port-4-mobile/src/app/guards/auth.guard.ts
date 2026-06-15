import { Injectable }       from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const usuario = localStorage.getItem('copa2026_usuario');
    if (usuario) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
