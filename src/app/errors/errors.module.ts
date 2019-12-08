import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Material Imports */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import {
  faExclamationCircle as fasExclamationCircle,
  faChevronRight as fasChevronRight,
  faArrowLeft as fasArrowLeft,
  faHome as fasHome
} from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { ErrorsRoutingModule } from './errors-routing.module';
import { Error404Component } from './error404/error404.component';

@NgModule({
  declarations: [Error404Component],
  imports: [
    /* Angular Imports */
    FormsModule,
    ReactiveFormsModule,

    /* Angular Material Imports */
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,

    /* Font-awesome Impors */
    FontAwesomeModule,

    /* Other Imports */
    CommonModule,
    ErrorsRoutingModule
  ]
})
export class ErrorsModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasExclamationCircle, fasChevronRight, fasArrowLeft, fasHome);
    // Include regular fa icons
    // Include brand fa icons
  }
}
