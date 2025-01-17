import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface ComplaintType {
  value: string;
  subTypes: string[];
}

interface ValidationState {
  isValid: boolean;
  message: string;
}

interface ComplaintValidation {
  title: ValidationState;
  description: ValidationState;
  address: ValidationState;
}

@Component({
  selector: 'app-register-complaints',
  templateUrl: './register-complaints.component.html',
  styleUrls: ['./register-complaints.component.css']
})
export class RegisterComplaintsComponent implements OnInit {
  complaintForm!: FormGroup;
  customerName: string = '';
  complaintFor: 'self' | 'other' = 'self';
  currentUser: any = null;

  complaintTypes: ComplaintType[] = [
    {
      value: 'billing',
      subTypes: ['A billing issue', 'Payment error']
    },
    {
      value: 'voltage',
      subTypes: ['Voltage fluctuations', 'Low voltage']
    },
    {
      value: 'disruption',
      subTypes: ['Frequent power cuts', 'Take something by yourself']
    },
    {
      value: 'streetLight',
      subTypes: ['Streetlight not working', 'Streetlight not switched on']
    },
    {
      value: 'pole',
      subTypes: ['Pole damage', 'Pole leaning']
    }
  ];

  availableSubTypes: string[] = [];

  validationState: ComplaintValidation = {
    title: { isValid: false, message: '' },
    description: { isValid: false, message: '' },
    address: { isValid: false, message: '' }
  };

  titleMinLength = 5;
  titleMaxLength = 50;
  descriptionMinLength = 10;
  descriptionMaxLength = 250;
  addressMinLength = 5;
  addressMaxLength = 100;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.customerName = this.currentUser.customerName || 'Guest';
    this.initForm();
  }

  initForm() {
    this.complaintForm = this.fb.group({
      complaintType: ['', Validators.required],
      subType: [{ value: '', disabled: true }, Validators.required],
      complaintFor: ['self', Validators.required],
      userId: ['', Validators.required],
      userName: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]{2,50}$')
      ]],
      billNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]],
      mobileNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]],
      address: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      problemTitle: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)
      ]],
      problemDescription: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(250)
      ]]
    });

    // Fill form with user details if complaining for self
    if (this.currentUser) {
      this.fillUserDetails();
    }

    // Listen for complaintFor changes
    this.complaintForm.get('complaintFor')?.valueChanges.subscribe(value => {
      if (value === 'self' && this.currentUser) {
        this.fillUserDetails();
        this.disableUserFields();
      } else {
        this.enableUserFields();
        this.clearUserFields();
      }
    });

    // Enable/disable subType based on complaintType selection
    this.complaintForm.get('complaintType')?.valueChanges.subscribe(type => {
      const subTypeControl = this.complaintForm.get('subType');
      if (type) {
        subTypeControl?.enable();
        this.updateSubTypes(type);
      } else {
        subTypeControl?.disable();
        this.availableSubTypes = [];
      }
    });

    // Add real-time validation subscriptions
    this.complaintForm.get('problemTitle')?.valueChanges.subscribe(value => {
      this.validationState.title = this.validateTitle(value);
    });

    this.complaintForm.get('problemDescription')?.valueChanges.subscribe(value => {
      this.validationState.description = this.validateDescription(value);
    });

    this.complaintForm.get('address')?.valueChanges.subscribe(value => {
      this.validationState.address = this.validateAddress(value);
    });
  }

  fillUserDetails() {
    this.complaintForm.patchValue({
      userId: this.currentUser.userId,
      userName: this.currentUser.customerName,
      billNumber: this.currentUser.billNumber,
      mobileNumber: this.currentUser.mobileNumber
    });
  }

  disableUserFields() {
    ['userId', 'userName', 'billNumber', 'mobileNumber'].forEach(field => {
      this.complaintForm.get(field)?.disable();
    });
  }

  enableUserFields() {
    ['userId', 'userName', 'billNumber', 'mobileNumber'].forEach(field => {
      this.complaintForm.get(field)?.enable();
    });
  }

  clearUserFields() {
    ['userId', 'userName', 'billNumber', 'mobileNumber'].forEach(field => {
      this.complaintForm.get(field)?.setValue('');
    });
  }

  updateSubTypes(type: string) {
    const selectedType = this.complaintTypes.find(t => t.value === type);
    this.availableSubTypes = selectedType?.subTypes || [];
    this.complaintForm.patchValue({ subType: '' });
  }

  onSubmit() {
    if (this.complaintForm.valid) {
      const complaintData = {
        ...this.complaintForm.value,
        status: 'Pending',
        date: new Date().toISOString(),
        complaintId: 'COMP' + Date.now()
      };

      // Save to localStorage
      const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      complaints.push(complaintData);
      localStorage.setItem('complaints', JSON.stringify(complaints));

      // Show success message and navigate
      alert('Complaint registered successfully! Your complaint ID is: ' + complaintData.complaintId);
      this.router.navigate(['/welcome']);
    } else {
      Object.keys(this.complaintForm.controls).forEach(key => {
        const control = this.complaintForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.complaintForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${controlName.replace(/([A-Z])/g, ' $1').trim()} is required`;
      if (control.errors['pattern']) {
        if (controlName === 'mobileNumber') return 'Mobile number must be 10 digits';
        if (controlName === 'billNumber') return 'Bill number must be 10 digits';
        return 'Invalid format';
      }
      if (control.errors['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
      }
      if (control.errors['maxlength']) {
        return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed`;
      }
    }
    return '';
  }

  onReset() {
    this.complaintForm.reset();
    this.availableSubTypes = [];
  }

  validateTitle(value: string): ValidationState {
    if (!value) {
      return { isValid: false, message: 'Title is required' };
    }
    if (value.length < this.titleMinLength) {
      return { 
        isValid: false, 
        message: `Title must be at least ${this.titleMinLength} characters` 
      };
    }
    if (value.length > this.titleMaxLength) {
      return { 
        isValid: false, 
        message: `Title cannot exceed ${this.titleMaxLength} characters` 
      };
    }
    if (!/^[a-zA-Z0-9\s,.!?-]+$/.test(value)) {
      return { 
        isValid: false, 
        message: 'Title can only contain letters, numbers, and basic punctuation' 
      };
    }
    return { isValid: true, message: '' };
  }

  validateDescription(value: string): ValidationState {
    if (!value) {
      return { isValid: false, message: 'Description is required' };
    }
    if (value.length < this.descriptionMinLength) {
      return { 
        isValid: false, 
        message: `Description must be at least ${this.descriptionMinLength} characters` 
      };
    }
    if (value.length > this.descriptionMaxLength) {
      return { 
        isValid: false, 
        message: `Description cannot exceed ${this.descriptionMaxLength} characters` 
      };
    }
    return { isValid: true, message: '' };
  }

  validateAddress(value: string): ValidationState {
    if (!value) {
      return { isValid: false, message: 'Address is required' };
    }
    if (value.length < this.addressMinLength) {
      return { 
        isValid: false, 
        message: `Address must be at least ${this.addressMinLength} characters` 
      };
    }
    if (value.length > this.addressMaxLength) {
      return { 
        isValid: false, 
        message: `Address cannot exceed ${this.addressMaxLength} characters` 
      };
    }
    return { isValid: true, message: '' };
  }

  getRemainingChars(field: string): number {
    const control = this.complaintForm.get(field);
    if (!control) return 0;
    
    switch(field) {
      case 'problemTitle':
        return this.titleMaxLength - (control.value?.length || 0);
      case 'problemDescription':
        return this.descriptionMaxLength - (control.value?.length || 0);
      case 'address':
        return this.addressMaxLength - (control.value?.length || 0);
      default:
        return 0;
    }
  }
}
