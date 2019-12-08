import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevComponent } from './dev.component';
import { TypographyComponent } from './typography/typography.component';
import { PaletteCssComponent } from './palette-css/palette-css.component';
import { PaletteNgMaterialComponent } from './palette-ng-material/palette-ng-material.component';

const routes: Routes = [
  {
    path: '',
    component: DevComponent,
    children: [
      {
        path: 'typography',
        component: TypographyComponent
      },
      {
        path: 'palette',
        redirectTo: 'palette/css'
      },
      {
        path: 'palette/css',
        component: PaletteCssComponent
      },
      {
        path: 'palette/ng-material',
        component: PaletteNgMaterialComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevRoutingModule {}
