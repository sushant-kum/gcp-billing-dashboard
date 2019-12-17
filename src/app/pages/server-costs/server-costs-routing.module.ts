import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServerCostsComponent } from './server-costs.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ServerCostsComponent
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('src/app/pages/server-costs/server-costs-reports/server-costs-reports.module').then(
        module => module.ServerCostsReportsModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerCostsRoutingModule {}
