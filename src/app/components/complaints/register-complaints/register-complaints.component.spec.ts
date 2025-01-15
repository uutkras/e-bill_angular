import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComplaintsComponent } from './register-complaints.component';

describe('RegisterComplaintsComponent', () => {
  let component: RegisterComplaintsComponent;
  let fixture: ComponentFixture<RegisterComplaintsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComplaintsComponent]
    });
    fixture = TestBed.createComponent(RegisterComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
