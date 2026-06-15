import { NgModule }       from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelecaoDetalhePage } from './selecao-detalhe.page';

const routes: Routes = [{ path: '', component: SelecaoDetalhePage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelecaoDetalhePageRoutingModule {}
