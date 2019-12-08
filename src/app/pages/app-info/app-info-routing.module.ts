import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppInfoComponent } from './app-info.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AppInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppInfoRoutingModule {}
