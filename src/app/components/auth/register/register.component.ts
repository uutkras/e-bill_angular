import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  currentStep = 1;
  registrationError = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      // Step 1
      consumerId: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{13}$')
      ]],
      billNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{5}$')
      ]],

      // Step 2
      customerName: ['', [
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]{2,50}$')
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      countryCode: ['+91', Validators.required],
      mobileNumber: ['', [
        Validators.required,
        Validators.pattern('^[6-9][0-9]{9}$')
      ]],

      // Step 3
      userId: ['', [
        Validators.required,
        Validators.pattern('^[A-Za-z0-9]{5,20}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$')
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  isStep1Valid(): boolean {
    const consumerId = this.registerForm.get('consumerId');
    const billNumber = this.registerForm.get('billNumber');
    return consumerId?.valid && billNumber?.valid || false;
  }

  isStep2Valid(): boolean {
    const customerName = this.registerForm.get('customerName');
    const email = this.registerForm.get('email');
    const mobileNumber = this.registerForm.get('mobileNumber');
    return customerName?.valid && email?.valid && mobileNumber?.valid || false;
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  resetForm() {
    this.registerForm.reset();
    this.currentStep = 1;
    this.registerForm.patchValue({
      countryCode: '+91'
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${controlName} is required`;
      if (control.errors['email']) return 'Invalid email format';
      if (control.errors['pattern']) {
        switch (controlName) {
          case 'consumerId':
            return 'Consumer ID must be exactly 13 digits';
          case 'billNumber':
            return 'Bill Number must be exactly 5 digits';
          case 'customerName':
            return 'Name must contain only letters and spaces';
          case 'mobileNumber':
            return 'Mobile number must be 10 digits starting with 6-9';
          case 'userId':
            return 'User ID must be 5-20 alphanumeric characters';
          case 'password':
            return 'Password must include uppercase, lowercase, number and special character';
          default:
            return 'Invalid format';
        }
      }
      if (control.errors['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
      }
      if (control.errors['mismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = {
        ...this.registerForm.value,
        registeredAt: new Date().toISOString(),
        isAdmin: false
      };
      delete formData.confirmPassword;

      this.authService.register(formData).subscribe(
        success => {
          if (success) {
            this.router.navigate(['/acknowledgement']);
          } else {
            this.registrationError = true;
          }
        }
      );
    }
  }
}
