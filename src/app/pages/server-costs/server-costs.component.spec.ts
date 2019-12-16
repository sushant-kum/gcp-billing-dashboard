import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerCostsComponent } from './server-costs.component';

describe('ServerCostsComponent', () => {
  let component: ServerCostsComponent;
  let fixture: ComponentFixture<ServerCostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerCostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
