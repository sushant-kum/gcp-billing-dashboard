import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerCostsReportsComponent } from './server-costs-reports.component';

describe('ServerCostsReportsComponent', () => {
  let component: ServerCostsReportsComponent;
  let fixture: ComponentFixture<ServerCostsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServerCostsReportsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerCostsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
