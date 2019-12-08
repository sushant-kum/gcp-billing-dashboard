import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteCssComponent } from './palette-css.component';

describe('PaletteCssComponent', () => {
  let component: PaletteCssComponent;
  let fixture: ComponentFixture<PaletteCssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaletteCssComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaletteCssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
