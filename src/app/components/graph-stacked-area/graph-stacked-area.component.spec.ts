import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphStackedAreaComponent } from './graph-stacked-area.component';

describe('GraphStackedAreaComponent', () => {
  let component: GraphStackedAreaComponent;
  let fixture: ComponentFixture<GraphStackedAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphStackedAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphStackedAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
