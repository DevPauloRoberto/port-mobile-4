import { NgModule }             from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard }            from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'cadastro',
    loadChildren: () =>
      import('./pages/cadastro/cadastro.module').then(m => m.CadastroPageModule),
  },
  {
    path: 'esqueci-senha',
    loadChildren: () =>
      import('./pages/esqueci-senha/esqueci-senha.module').then(m => m.EsqueciSenhaPageModule),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'selecao/:id',
    loadChildren: () =>
      import('./pages/selecao-detalhe/selecao-detalhe.module').then(m => m.SelecaoDetalhePageModule),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
