import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface ComplaintType {
  value: string;
  subTypes: string[];
}

@Component({
  selector: 'app-register-complaints',
  templateUrl: './register-complaints.component.html',
  styleUrls: ['./register-complaints.component.css']
})
export class RegisterComplaintsComponent implements OnInit {
  complaintForm!: FormGroup;
  customerName: string = '';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.customerName = currentUser.customerName || 'Guest';
    this.initForm();
  }

  initForm() {
    this.complaintForm = this.fb.group({
      complaintType: ['', Validators.required],
      subType: [{ value: '', disabled: true }, Validators.required],
      userId: [{ 
        value: this.authService.getCurrentUser()?.userId || '', 
        disabled: true 
      }, Validators.required],
      userName: [{ 
        value: this.customerName, 
        disabled: true 
      }, [
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
        Validators.maxLength(100),
        Validators.pattern('^[a-zA-Z0-9\\s,.-]{5,100}$')
      ]],
      problemTitle: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9\\s,.!?-]{5,50}$')
      ]],
      problemDescription: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(250),
        Validators.pattern('^[a-zA-Z0-9\\s,.!?-]{10,250}$')
      ]]
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
}
