import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardLinkComponent } from './card-link.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [CardLinkComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [CardLinkComponent]
})
export class CardLinkModule {}
