import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServerCostsReportsComponent } from './server-costs-reports.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ServerCostsReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerCostsReportsRoutingModule {}
