import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule }  from '@ionic/angular';
import { PartidasPageRoutingModule } from './partidas-routing.module';
import { PartidasPage } from './partidas.page';

@NgModule({
  imports: [CommonModule, IonicModule, PartidasPageRoutingModule],
  declarations: [PartidasPage],
})
export class PartidasPageModule {}
