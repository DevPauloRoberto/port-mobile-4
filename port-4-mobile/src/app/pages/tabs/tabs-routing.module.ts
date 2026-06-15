import { NgModule }     from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage }     from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'grupos',
        loadChildren: () =>
          import('../grupos/grupos.module').then(m => m.GruposPageModule),
      },
      {
        path: 'partidas',
        loadChildren: () =>
          import('../partidas/partidas.module').then(m => m.PartidasPageModule),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../perfil/perfil.module').then(m => m.PerfilPageModule),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports:  [RouterModule.forChild(routes)],
  exports:  [RouterModule],
})
export class TabsPageRoutingModule {}
