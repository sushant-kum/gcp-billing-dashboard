import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Angular Mateerial Imports */
import { MatCardModule } from '@angular/material/card';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import {} from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { ServerCostsReportsRoutingModule } from './server-costs-reports-routing.module';
import { ServerCostsReportsComponent } from './server-costs-reports.component';

@NgModule({
  declarations: [ServerCostsReportsComponent],
  imports: [
    /* Angular Material Imports */
    MatCardModule,

    /* Font-awesome Impors */
    FontAwesomeModule,

    /* Other Imports */
    CommonModule,
    ServerCostsReportsRoutingModule
  ]
})
export class ServerCostsReportsModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    // fa_icon_library.addIcons(fasHeart);
    // Include regular fa icons
    // Include brand fa icons
  }
}
