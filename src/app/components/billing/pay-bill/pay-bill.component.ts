import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface ValidationResult {
  [key: string]: boolean;
}

type PaymentMode = 'credit' | 'debit' | 'netbanking' | 'upi';

@Component({
  selector: 'app-pay-bill',
  templateUrl: './pay-bill.component.html',
  styleUrls: ['./pay-bill.component.css']
})
export class PayBillComponent implements OnInit {
  paymentForm!: FormGroup;
  currentYear = new Date().getFullYear();
  months = Array.from({length: 12}, (_, i) => i + 1);
  years = Array.from({length: 12}, (_, i) => this.currentYear + i);
  paymentAmount: number = 0;
  selectedPaymentMode: PaymentMode = 'credit';

  banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.paymentForm = this.fb.group({
      paymentMode: ['credit', Validators.required],
      cardNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{16}$')
      ]],
      expiryMonth: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(12)
      ]],
      expiryYear: ['', [
        Validators.required,
        Validators.min(this.currentYear),
        Validators.max(this.currentYear + 10)
      ]],
      cvv: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{3}$')
      ]],
      cardholderName: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]{3,50}$'),
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      bank: [''],
      upiId: ['', [
        Validators.pattern('^[a-zA-Z0-9._-]{3,}@[a-zA-Z]{3,}$')
      ]]
    });

    // Subscribe to payment mode changes
    this.paymentForm.get('paymentMode')?.valueChanges.subscribe((mode: PaymentMode) => {
      this.selectedPaymentMode = mode;
      this.updateValidators();
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
    }

    // Get amount from route parameters
    this.route.queryParams.subscribe(params => {
      this.paymentAmount = Number(params['amount']) || 0;
    });
  }

  updateValidators() {
    const cardControls = ['cardNumber', 'expiryMonth', 'expiryYear', 'cvv', 'cardholderName'];
    const bankingControls = ['bank'];
    const upiControls = ['upiId'];

    // Reset all validators
    [...cardControls, ...bankingControls, ...upiControls].forEach(control => {
      this.paymentForm.get(control)?.clearValidators();
      this.paymentForm.get(control)?.updateValueAndValidity();
    });

    // Apply validators based on payment mode
    switch (this.selectedPaymentMode) {
      case 'credit':
      case 'debit':
        cardControls.forEach(control => {
          this.paymentForm.get(control)?.setValidators([Validators.required]);
        });
        break;
      case 'netbanking':
        this.paymentForm.get('bank')?.setValidators([Validators.required]);
        break;
      case 'upi':
        this.paymentForm.get('upiId')?.setValidators([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$')
        ]);
        break;
    }

    this.paymentForm.updateValueAndValidity();
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    event.target.value = formattedValue;
    // Update form control with unformatted value
    this.paymentForm.get('cardNumber')?.setValue(value);
  }

  validateName() {
    return (control: any): ValidationResult | null => {
      const value = control.value;
      if (!value) return null;

      const words = value.trim().split(/\s+/);
      
      if (words.length < 3) {
        return { minWords: true };
      }

      if (words.every((word: string) => word.toLowerCase() === words[0].toLowerCase())) {
        return { sameName: true };
      }

      return null;
    };
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      // Ensure amount is a number
      const amount = Number(this.paymentAmount).toFixed(2);
      this.router.navigate(['/payment-success'], {
        queryParams: { amount }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.paymentForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${controlName} is required`;
      if (control.errors['pattern']) {
        switch(controlName) {
          case 'cardNumber': return 'Card number must be 16 digits';
          case 'cvv': return 'CVV must be 3 digits';
          case 'cardholderName': return 'Name must contain only letters';
          default: return 'Invalid format';
        }
      }
      if (control.errors['minWords']) return 'Name must consist of at least 3 words';
      if (control.errors['sameName']) return 'All parts of the name cannot be the same';
    }
    return '';
  }

  onCancel() {
    this.router.navigate(['/view-bill']);
  }
} 