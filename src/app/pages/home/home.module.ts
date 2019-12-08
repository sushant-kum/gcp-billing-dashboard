import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Angular Material Imports */
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CardLinkModule } from 'src/app/components/card-link/card-link.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    /* Angular Material Imports */
    MatCardModule,
    MatButtonModule,

    /* Font-awesome Impors */
    FontAwesomeModule,

    /* Other Imports */
    CommonModule,
    HomeRoutingModule,
    CardLinkModule
  ]
})
export class HomeModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasHeart);
    // Include regular fa icons
    // Include brand fa icons
  }
}
