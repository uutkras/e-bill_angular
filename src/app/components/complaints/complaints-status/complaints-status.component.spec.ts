import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintsStatusComponent } from './complaints-status.component';

describe('ComplaintsStatusComponent', () => {
  let component: ComplaintsStatusComponent;
  let fixture: ComponentFixture<ComplaintsStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplaintsStatusComponent]
    });
    fixture = TestBed.createComponent(ComplaintsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
