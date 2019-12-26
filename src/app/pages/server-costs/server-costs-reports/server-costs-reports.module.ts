import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/* Angular Mateerial Imports */
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import {
  faArrowsAltH as fasArrowsAltH,
  faCalendarDay as fasCalendarDay,
  faObjectGroup as fasObjectGroup,
  faArrowUp as fasArrowUp,
  faArrowDown as fasArrowDown,
  faExchangeAlt as fasExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { ServerCostsReportsRoutingModule } from './server-costs-reports-routing.module';
import { ServerCostsReportsComponent } from './server-costs-reports.component';

@NgModule({
  declarations: [ServerCostsReportsComponent],
  imports: [
    /* Angular Imports */
    ReactiveFormsModule,

    /* Angular Material Imports */
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,

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
    fa_icon_library.addIcons(fasArrowsAltH, fasCalendarDay, fasObjectGroup, fasArrowUp, fasArrowDown, fasExchangeAlt);
    // Include regular fa icons
    // Include brand fa icons
  }
}
