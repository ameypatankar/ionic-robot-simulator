import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulatorRoutingModule } from './simulator-routing.module';
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { SimulatorComponent } from './simulator.component';
import { SvgDirectionComponent } from './content/direction.compontent';
import { SvgRoboComponent } from './content/robo.compontent';

@NgModule({
  declarations: [SimulatorComponent, SvgDirectionComponent, SvgRoboComponent],
  imports: [
    CommonModule,
    SimulatorRoutingModule,
    IonicModule,
    FormsModule
  ],

})
export class SimulatorModule { }
