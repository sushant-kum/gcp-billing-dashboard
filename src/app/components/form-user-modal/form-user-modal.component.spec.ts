import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUserModalComponent } from './form-user-modal.component';

describe('FormUserModalComponent', () => {
  let component: FormUserModalComponent;
  let fixture: ComponentFixture<FormUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormUserModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
