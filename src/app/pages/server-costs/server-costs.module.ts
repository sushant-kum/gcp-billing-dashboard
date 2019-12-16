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

import { ServerCostsRoutingModule } from './server-costs-routing.module';
import { ServerCostsComponent } from './server-costs.component';
import { CardLinkModule } from 'src/app/components/card-link/card-link.module';

@NgModule({
  declarations: [ServerCostsComponent],
  imports: [
    /* Angular Material Imports */
    MatCardModule,

    /* Font-awesome Impors */
    FontAwesomeModule,

    /* Other Imports */
    CommonModule,
    ServerCostsRoutingModule,
    CardLinkModule
  ]
})
export class ServerCostsModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    // fa_icon_library.addIcons(fasHeart);
    // Include regular fa icons
    // Include brand fa icons
  }
}
