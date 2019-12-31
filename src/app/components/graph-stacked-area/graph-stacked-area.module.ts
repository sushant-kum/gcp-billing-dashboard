import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraphNoDataModule } from 'src/app/components/graph-no-data/graph-no-data.module';
import { GraphStackedAreaComponent } from './graph-stacked-area.component';

@NgModule({
  declarations: [GraphStackedAreaComponent],
  imports: [CommonModule, GraphNoDataModule],
  exports: [GraphStackedAreaComponent]
})
export class GraphStackedAreaModule {}
