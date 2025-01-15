import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface BillRecord {
  month: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Due';
  selected?: boolean;
}

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.css']
})
export class ViewBillComponent implements OnInit {
  customerName: string = '';
  totalSelected: number = 0;
  
  bills: BillRecord[] = [
    { month: 'March 2024', amount: 400, dueDate: '2024-03-31', status: 'Due' },
    { month: 'February 2024', amount: 350, dueDate: '2024-02-29', status: 'Unpaid' },
    { month: 'January 2024', amount: 380, dueDate: '2024-01-31', status: 'Paid' },
    { month: 'December 2023', amount: 420, dueDate: '2023-12-31', status: 'Paid' },
    { month: 'November 2023', amount: 390, dueDate: '2023-11-30', status: 'Paid' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.customerName = currentUser.customerName || 'Guest';
    }
    this.calculateTotal();
  }

  toggleBillSelection(bill: BillRecord) {
    if (bill.status === 'Paid') return;
    bill.selected = !bill.selected;
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalSelected = this.bills
      .filter(bill => bill.selected)
      .reduce((sum, bill) => sum + bill.amount, 0);
  }

  payBill() {
    if (this.totalSelected > 0) {
      this.router.navigate(['/pay-bill'], {
        queryParams: { amount: this.totalSelected }
      });
    }
  }

  canPayBill(): boolean {
    return this.bills.some(bill => bill.selected);
  }
}
