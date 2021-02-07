import { ChartsComponent } from './charts/charts.component';
import { AboutComponent } from './about/about.component';
import { GasComponent } from './gas/gas.component';
import { CalcComponent } from './calc/calc.component';
import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: CalcComponent },
  { path: 'gas', component: GasComponent },
  { path: 'charts', component: ChartsComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
