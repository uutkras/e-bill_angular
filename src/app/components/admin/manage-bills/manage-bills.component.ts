import { Component, OnInit } from '@angular/core';

interface Bill {
  billId: string;
  userId: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

@Component({
  selector: 'app-manage-bills',
  template: `
    <div class="manage-bills-container">
      <div class="bills-header">
        <h2>Manage Bills</h2>
        <div class="search-bar">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (input)="searchBills()"
            placeholder="Search bills...">
        </div>
      </div>

      <div class="bills-table">
        <table>
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let bill of filteredBills">
              <td>{{bill.billId}}</td>
              <td>{{bill.customerName}}</td>
              <td>₹{{bill.amount}}</td>
              <td>{{bill.dueDate | date}}</td>
              <td>
                <span class="status-badge" [class]="'status-' + bill.status.toLowerCase()">
                  {{bill.status}}
                </span>
              </td>
              <td class="action-buttons">
                <button class="btn btn-edit">Edit</button>
                <button class="btn btn-delete" (click)="deleteBill(bill.billId)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['../manage-users/manage-users.component.css']
})
export class ManageBillsComponent implements OnInit {
  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  searchTerm: string = '';

  ngOnInit() {
    this.loadBills();
  }

  loadBills() {
    // Simulated bills data
    this.bills = [
      {
        billId: 'BILL001',
        userId: 'USER001',
        customerName: 'John Doe',
        amount: 1500,
        dueDate: '2024-02-15',
        status: 'Unpaid'
      },
      // Add more sample bills
    ];
    this.filteredBills = [...this.bills];
  }

  searchBills() {
    this.filteredBills = this.bills.filter(bill => 
      bill.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      bill.billId.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteBill(billId: string) {
    if (confirm('Are you sure you want to delete this bill?')) {
      this.bills = this.bills.filter(bill => bill.billId !== billId);
      this.filteredBills = this.filteredBills.filter(bill => bill.billId !== billId);
    }
  }
} 