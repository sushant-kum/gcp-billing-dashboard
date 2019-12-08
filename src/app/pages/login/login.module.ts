import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Material Imports */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import {
  faUser as fasUser,
  faKey as fasKey,
  faEye as fasEye,
  faEyeSlash as fasEyeSlash,
  faSignInAlt as fasSignInAlt,
  faCircleNotch as fasCircleNotch
} from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

/* Components Imports */
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    /* Angular Imports */
    FormsModule,
    ReactiveFormsModule,

    /* Angular Material Imports */
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

    /* Font-awesome Impors */
    FontAwesomeModule,

    /* Other Imports */
    CommonModule,
    LoginRoutingModule
  ]
})
export class LoginModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasUser, fasKey, fasEye, fasEyeSlash, fasSignInAlt, fasCircleNotch);
    // Include regular fa icons
    // Include brand fa icons
  }
}
