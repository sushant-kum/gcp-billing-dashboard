import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewUserModalComponent } from './view-user-modal.component';

/* Angular Material Imports */
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import {
  faTimes as fasTimes,
  faCheck as fasCheck,
  faAddressCard as fasAddressCard,
  faTasks as fasTasks
} from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { SubHeadModule } from 'src/app/components/sub-head/sub-head.module';

@NgModule({
  declarations: [ViewUserModalComponent],
  imports: [
    /* Angular Material Imports */
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,

    /* Font-awesome Impors */
    FontAwesomeModule,

    /* Other Imports */
    CommonModule,
    SubHeadModule
  ],
  exports: [ViewUserModalComponent]
})
export class ViewUserModalModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasTimes, fasCheck, fasAddressCard, fasTasks);
    // Include regular fa icons
    // Include brand fa icons
  }
}
