import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServerCostsComponent } from './server-costs.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ServerCostsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerCostsRoutingModule {}
