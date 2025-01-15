import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface Complaint {
  complaintId: string;
  userId: string;
  userName: string;
  complaintType: string;
  subType: string;
  problemTitle: string;
  problemDescription: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
  date: string;
  assignedTo?: string;
  expectedResolution?: string;
  lastUpdated?: string;
  priority: 'High' | 'Medium' | 'Low';
  comments?: string[];
}

@Component({
  selector: 'app-complaint-status',
  templateUrl: './complaint-status.component.html',
  styleUrls: ['./complaint-status.component.css']
})
export class ComplaintStatusComponent implements OnInit {
  complaints: Complaint[] = [];
  customerName: string = '';
  userId: string = '';
  statusColors = {
    'Pending': '#ffc107',
    'Assigned': '#17a2b8',
    'In Progress': '#007bff',
    'Resolved': '#28a745',
    'Closed': '#6c757d'
  };

  priorityLabels = {
    'High': 'Urgent',
    'Medium': 'Normal',
    'Low': 'Routine'
  };

  constructor(
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
    this.userId = currentUser.userId || '';
    this.loadComplaints();
  }

  loadComplaints() {
    const allComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    this.complaints = allComplaints
      .filter((complaint: Complaint) => complaint.userId === this.userId)
      .map((complaint: Complaint) => ({
        ...complaint,
        assignedTo: this.getRandomEmployee(),
        expectedResolution: this.getExpectedResolution(complaint.status),
        lastUpdated: new Date(complaint.date).toLocaleString(),
        priority: this.getRandomPriority()
      }))
      .sort((a: Complaint, b: Complaint) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }

  private getRandomEmployee(): string {
    const employees = [
      'Rajesh Kumar (Field Engineer)',
      'Priya Sharma (Technical Support)',
      'Amit Patel (Senior Technician)',
      'Deepika Singh (Customer Service)',
      'Suresh Verma (Maintenance Specialist)'
    ];
    return employees[Math.floor(Math.random() * employees.length)];
  }

  private getExpectedResolution(status: string): string {
    if (status === 'Resolved' || status === 'Closed') {
      return 'Completed';
    }
    
    const today = new Date();
    const days = Math.floor(Math.random() * 5) + 1;
    today.setDate(today.getDate() + days);
    return today.toLocaleDateString();
  }

  private getRandomPriority(): 'High' | 'Medium' | 'Low' {
    const priorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  }

  getStatusColor(status: string): string {
    return this.statusColors[status as keyof typeof this.statusColors] || '#6c757d';
  }

  getPriorityLabel(priority: string): string {
    return this.priorityLabels[priority as keyof typeof this.priorityLabels] || priority;
  }

  registerNewComplaint() {
    this.router.navigate(['/register-complaint']);
  }
} 