import { CalcComponent } from './calc/calc.component';
import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: CalcComponent },
  { path: ':dailyInit', component: CalcComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
