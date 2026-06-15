import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule }  from '@ionic/angular';
import { SelecaoDetalhePageRoutingModule } from './selecao-detalhe-routing.module';
import { SelecaoDetalhePage }  from './selecao-detalhe.page';

@NgModule({
  imports: [CommonModule, IonicModule, SelecaoDetalhePageRoutingModule],
  declarations: [SelecaoDetalhePage],
})
export class SelecaoDetalhePageModule {}
