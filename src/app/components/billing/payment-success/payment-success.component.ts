import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  paymentAmount: number = 0;
  transactionId: string = '';
  paymentDate: Date = new Date();
  customerName: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Generate random transaction ID
    this.transactionId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.customerName = currentUser.customerName || 'Guest';

    this.route.queryParams.subscribe(params => {
      this.paymentAmount = Number(params['amount']) || 0;
    });
  }

  downloadInvoice() {
    const invoice = document.createElement('a');
    const content = `
      WE Energy - Payment Receipt
      -------------------------
      Transaction ID: ${this.transactionId}
      Date: ${this.paymentDate.toLocaleString()}
      Customer Name: ${this.customerName}
      Amount Paid: ₹${this.paymentAmount}
      Status: Payment Successful
      -------------------------
      Thank you for your payment!
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    invoice.href = window.URL.createObjectURL(blob);
    invoice.download = `Invoice_${this.transactionId}.txt`;
    invoice.click();
  }

  goToHome() {
    this.router.navigate(['/welcome']);
  }
}
