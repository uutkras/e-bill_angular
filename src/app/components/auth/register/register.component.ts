import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface EmailValidation {
  isValid: boolean;
  hasAtSymbol: boolean;
  hasDomain: boolean;
  hasValidFormat: boolean;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  currentStep = 1;
  registrationError = false;
  passwordStrength = {
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false
  };
  emailValidation: EmailValidation = {
    isValid: false,
    hasAtSymbol: false,
    hasDomain: false,
    hasValidFormat: false
  };

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
      billNumber: [{ value: '', disabled: true }],

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

    this.registerForm.get('consumerId')?.valueChanges.subscribe(value => {
      if (value && value.length === 13) {
        const last5Digits = value.slice(-5);
        this.registerForm.patchValue({
          billNumber: last5Digits
        });
      } else {
        this.registerForm.patchValue({
          billNumber: ''
        });
      }
    });

    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      this.passwordStrength = {
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[@$!%*?&]/.test(password),
        hasMinLength: password.length >= 8
      };
    });

    this.registerForm.get('email')?.valueChanges.subscribe(email => {
      this.emailValidation = {
        hasAtSymbol: email.includes('@'),
        hasDomain: email.includes('.') && email.split('.')[1]?.length >= 2,
        hasValidFormat: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
        isValid: this.registerForm.get('email')?.valid || false
      };
    });

    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.valueChanges.subscribe(() => {
        if (control.value) {
          control.markAsTouched();
        }
      });
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  isStep1Valid(): boolean {
    const consumerId = this.registerForm.get('consumerId');
    return consumerId?.valid || false;
  }

  isStep2Valid(): boolean {
    const customerName = this.registerForm.get('customerName');
    const email = this.registerForm.get('email');
    const mobileNumber = this.registerForm.get('mobileNumber');
    return customerName?.valid && email?.valid && mobileNumber?.valid || false;
  }

  isStep3Valid(): boolean {
    const userId = this.registerForm.get('userId');
    const password = this.registerForm.get('password');
    const confirmPassword = this.registerForm.get('confirmPassword');
    
    return userId?.valid && 
           password?.valid && 
           confirmPassword?.valid && 
           !this.registerForm.hasError('mismatch') || false;
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
      console.log('Form is valid, attempting registration...');
      
      // Get the raw value including disabled controls
      const formData = {
        ...this.registerForm.getRawValue(),
        registeredAt: new Date().toISOString(),
        isAdmin: false
      };
      delete formData.confirmPassword;

      console.log('Registration data:', formData);

      this.authService.register(formData).subscribe({
        next: (success) => {
          console.log('Registration response:', success);
          if (success) {
            console.log('Registration successful, navigating to acknowledgement...');
            this.router.navigate(['/acknowledgement']);
          } else {
            console.error('Registration failed');
            this.registrationError = true;
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.registrationError = true;
        }
      });
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  getPasswordStrengthMessage(): string[] {
    const messages: string[] = [];
    const strength = this.passwordStrength;

    if (!strength.hasMinLength) messages.push('At least 8 characters');
    if (!strength.hasUpperCase) messages.push('At least one uppercase letter');
    if (!strength.hasLowerCase) messages.push('At least one lowercase letter');
    if (!strength.hasNumber) messages.push('At least one number');
    if (!strength.hasSpecialChar) messages.push('At least one special character (@$!%*?&)');

    return messages;
  }

  getPasswordStrengthColor(): string {
    const strength = Object.values(this.passwordStrength).filter(Boolean).length;
    if (strength === 5) return '#28a745'; // Strong
    if (strength >= 3) return '#ffc107'; // Medium
    return '#dc3545'; // Weak
  }

  getEmailValidationMessages(): string[] {
    const messages: string[] = [];
    const validation = this.emailValidation;

    if (!validation.hasAtSymbol) messages.push('Must contain @ symbol');
    if (!validation.hasDomain) messages.push('Must have a valid domain');
    if (!validation.hasValidFormat) messages.push('Must be a valid email format');

    return messages;
  }
}
