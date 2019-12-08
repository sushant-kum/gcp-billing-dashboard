import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeveloperRoutingModule } from './developer-routing.module';
import { DeveloperComponent } from './developer.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import {
  faGlobe as fasGlobe,
  faEnvelopeOpen as fasEnvelopeOpen,
  faArrowLeft as fasArrowLeft
} from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import { faGithubAlt as fabGithubAlt } from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [DeveloperComponent],
  imports: [CommonModule, DeveloperRoutingModule, MatCardModule, MatButtonModule, FontAwesomeModule]
})
export class DeveloperModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasGlobe, fasEnvelopeOpen, fasArrowLeft);
    // Include regular fa icons
    // Include brand fa icons
    fa_icon_library.addIcons(fabGithubAlt);
  }
}
