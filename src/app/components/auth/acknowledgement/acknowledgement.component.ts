import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acknowledgement',
  template: `
    <div class="acknowledgement-container">
      <div class="acknowledgement-card">
        <h2>Registration Successful!</h2>
        <p>Your account has been created successfully.</p>
        <button (click)="goToLogin()">Proceed to Login</button>
      </div>
    </div>
  `,
  styles: [`
    .acknowledgement-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f6fa;
      padding: 20px;
    }

    .acknowledgement-card {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 400px;
      width: 100%;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 20px;
    }

    p {
      color: #34495e;
      margin-bottom: 30px;
    }

    button {
      padding: 12px 24px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover {
      background: #2980b9;
    }
  `]
})
export class AcknowledgementComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 