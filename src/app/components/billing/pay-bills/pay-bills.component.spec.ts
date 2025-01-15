import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayBillsComponent } from './pay-bills.component';

describe('PayBillsComponent', () => {
  let component: PayBillsComponent;
  let fixture: ComponentFixture<PayBillsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayBillsComponent]
    });
    fixture = TestBed.createComponent(PayBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
