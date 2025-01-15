import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface DashboardStat {
  title: string;
  value: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStat[] = [
    { 
      title: 'Total Users', 
      value: 0, 
      icon: '👥',
      color: '#007bff'
    },
    { 
      title: 'Active Complaints', 
      value: 0, 
      icon: '⚠️',
      color: '#dc3545'
    },
    { 
      title: 'Pending Bills', 
      value: 0, 
      icon: '📄',
      color: '#ffc107'
    },
    { 
      title: 'Revenue (₹)', 
      value: 0, 
      icon: '💰',
      color: '#28a745'
    }
  ];

  recentComplaints: any[] = [];
  recentPayments: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    this.stats[0].value = users.length;

    // Load complaints
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    this.stats[1].value = complaints.filter((c: any) => 
      c.status !== 'Resolved' && c.status !== 'Closed'
    ).length;

    // Load recent complaints
    this.recentComplaints = complaints
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // Load bills and payments
    const bills = JSON.parse(localStorage.getItem('bills') || '[]');
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    
    this.stats[2].value = bills.filter((b: any) => !b.isPaid).length;
    this.stats[3].value = payments.reduce((sum: number, payment: any) => 
      sum + Number(payment.amount), 0
    );

    // Load recent payments
    this.recentPayments = payments
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  navigateTo(route: string) {
    this.router.navigate(['/admin/' + route]);
  }
} 