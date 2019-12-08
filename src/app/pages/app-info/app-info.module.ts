import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppInfoRoutingModule } from './app-info-routing.module';
import { AppInfoComponent } from './app-info.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import { faArrowLeft as fasArrowLeft } from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [AppInfoComponent],
  imports: [MatCardModule, MatButtonModule, FontAwesomeModule, CommonModule, AppInfoRoutingModule]
})
export class AppInfoModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasArrowLeft);
    // Include regular fa icons
    // Include brand fa icons
  }
}
