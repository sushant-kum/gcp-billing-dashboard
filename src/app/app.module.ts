import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* Angular Material Imports */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import {
  faUnlockAlt as fasUnlockAlt,
  faHome as fasHome,
  faCogs as fasCogs,
  faUser as fasUser,
  faSlidersH as fasSlidersH,
  faUsers as fasUsers,
  faCode as fasCode,
  faCircleNotch as fasCircleNotch,
  faSignOutAlt as fasSignOutAlt,
  faCopyright as fasCopyright,
  faTimes as fasTimes,
  faThList as fasThList,
  faFileInvoice as fasFileInvoice,
  faTools as fasTools,
  faLayerGroup as fasLayerGroup,
  faFileCode as fasFileCode
} from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import { faSlackHash as fabSlackHash } from '@fortawesome/free-brands-svg-icons';

/* Config Imports */
import { Config } from 'src/app/configs/config';

/* Components Imports */
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { AlertComponent, AlertModalComponent } from 'src/app/components/alert/alert.component';
import { ConfirmComponent, ConfirmModalComponent } from './components/confirm/confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AlertComponent,
    AlertModalComponent,
    ConfirmComponent,
    ConfirmModalComponent
  ],
  imports: [
    /* Angular Imports Begin */
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    /* Angular Imports End */
    /**/
    /* Angular Material Imports Begin */
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
    /* Angular Material Imports End */
    /**/
    /* Fontawesome Imports Begin */
    FontAwesomeModule
    /* Fontaweseom Imports End */
    /**/
    /* Other Imports Begin */
    /* Other Imports End */
  ],
  providers: [SidebarComponent, Config],
  bootstrap: [AppComponent],
  entryComponents: [AlertModalComponent, ConfirmModalComponent]
})
export class AppModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(
      fasUnlockAlt,
      fasHome,
      fasCogs,
      fasUser,
      fasSlidersH,
      fasUsers,
      fasCode,
      fasCircleNotch,
      fasSignOutAlt,
      fasCopyright,
      fasTimes,
      fasThList,
      fasFileInvoice,
      fasTools,
      fasLayerGroup,
      fasFileCode
    );
    // Include regular fa icons
    // Include brand fa icons
    fa_icon_library.addIcons(fabSlackHash);
  }
}
