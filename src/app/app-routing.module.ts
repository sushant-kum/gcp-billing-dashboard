import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadChildren: () => import('src/app/pages/login/login.module').then(module => module.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import('src/app/pages/home/home.module').then(module => module.HomeModule)
  },
  {
    path: 'server-costs',
    loadChildren: () =>
      import('src/app/pages/server-costs/server-costs.module').then(module => module.ServerCostsModule)
  },
  {
    path: 'app-info',
    loadChildren: () => import('src/app/pages/app-info/app-info.module').then(module => module.AppInfoModule)
  },
  {
    path: 'developer',
    loadChildren: () => import('src/app/pages/developer/developer.module').then(module => module.DeveloperModule)
  },
  {
    path: 'dev',
    loadChildren: () => import('src/app/pages/dev/dev.module').then(module => module.DevModule)
  },
  {
    path: 'error',
    loadChildren: () => import('src/app/errors/errors.module').then(module => module.ErrorsModule)
  },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
