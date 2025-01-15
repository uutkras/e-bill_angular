import { Component, OnInit } from '@angular/core';

type ComplaintStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
type ComplaintPriority = 'High' | 'Medium' | 'Low';

interface Complaint {
  complaintId: string;
  userId: string;
  customerName: string;
  complaintType: string;
  subType: string;
  problemTitle: string;
  problemDescription: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  assignedTo?: string;
  submittedDate: string;
  lastUpdated?: string;
}

@Component({
  selector: 'app-manage-complaints',
  templateUrl: './manage-complaints.component.html',
  styleUrls: ['../manage-users/manage-users.component.css']
})
export class ManageComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  searchTerm: string = '';
  statusFilters: ComplaintStatus[] = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
  selectedStatus: ComplaintStatus | 'All' = 'All';
  priorityFilters: ComplaintPriority[] = ['High', 'Medium', 'Low'];
  selectedPriority: ComplaintPriority | 'All' = 'All';

  engineers: string[] = [
    'Rajesh Kumar',
    'Priya Sharma',
    'Amit Patel',
    'Deepika Singh',
    'Suresh Verma'
  ];

  ngOnInit() {
    this.loadComplaints();
  }

  loadComplaints() {
    const storedComplaints = localStorage.getItem('complaints');
    if (storedComplaints) {
      this.complaints = JSON.parse(storedComplaints);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.filteredComplaints = this.complaints.filter(complaint => {
      const matchesSearch = 
        complaint.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        complaint.complaintId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        complaint.problemTitle.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = 
        this.selectedStatus === 'All' || complaint.status === this.selectedStatus;

      const matchesPriority = 
        this.selectedPriority === 'All' || complaint.priority === this.selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  updateStatus(complaint: Complaint, newStatus: ComplaintStatus) {
    complaint.status = newStatus;
    complaint.lastUpdated = new Date().toISOString();
    this.updateLocalStorage();
  }

  updatePriority(complaint: Complaint, newPriority: ComplaintPriority) {
    complaint.priority = newPriority;
    complaint.lastUpdated = new Date().toISOString();
    this.updateLocalStorage();
  }

  assignEngineer(complaint: Complaint, engineer: string) {
    complaint.assignedTo = engineer;
    complaint.status = 'Assigned';
    complaint.lastUpdated = new Date().toISOString();
    this.updateLocalStorage();
  }

  deleteComplaint(complaintId: string) {
    if (confirm('Are you sure you want to delete this complaint?')) {
      this.complaints = this.complaints.filter(c => c.complaintId !== complaintId);
      this.applyFilters();
      this.updateLocalStorage();
    }
  }

  private updateLocalStorage() {
    localStorage.setItem('complaints', JSON.stringify(this.complaints));
  }

  getStatusColor(status: ComplaintStatus): string {
    const colors: Record<ComplaintStatus, string> = {
      'Pending': '#ffc107',
      'Assigned': '#17a2b8',
      'In Progress': '#007bff',
      'Resolved': '#28a745',
      'Closed': '#6c757d'
    };
    return colors[status] || '#6c757d';
  }

  getPriorityColor(priority: ComplaintPriority): string {
    const colors: Record<ComplaintPriority, string> = {
      'High': '#dc3545',
      'Medium': '#ffc107',
      'Low': '#28a745'
    };
    return colors[priority] || '#6c757d';
  }
} 