import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import {
  faFont as fasFont,
  faPalette as fasPalette,
  faChevronRight as fasChevronRight,
  faSwatchbook as fasSwatchbook
} from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import { faAngular as fasAngular } from '@fortawesome/free-brands-svg-icons';

import { DevRoutingModule } from './dev-routing.module';
import { DevComponent } from './dev.component';
import { TypographyComponent } from './typography/typography.component';
import { PaletteCssComponent } from './palette-css/palette-css.component';
import { PaletteNgMaterialComponent } from './palette-ng-material/palette-ng-material.component';

@NgModule({
  declarations: [DevComponent, TypographyComponent, PaletteCssComponent, PaletteNgMaterialComponent],
  imports: [
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    FontAwesomeModule,
    CommonModule,
    DevRoutingModule
  ]
})
export class DevModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasFont, fasPalette, fasChevronRight, fasSwatchbook);
    // Include regular fa icons
    // Include brand fa icons
    fa_icon_library.addIcons(fasAngular);
  }
}
