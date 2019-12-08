import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteNgMaterialComponent } from './palette-ng-material.component';

describe('PaletteNgMaterialComponent', () => {
  let component: PaletteNgMaterialComponent;
  let fixture: ComponentFixture<PaletteNgMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaletteNgMaterialComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaletteNgMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
