import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphNoDataComponent } from './graph-no-data.component';

describe('GraphNoDataComponent', () => {
  let component: GraphNoDataComponent;
  let fixture: ComponentFixture<GraphNoDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphNoDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphNoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
