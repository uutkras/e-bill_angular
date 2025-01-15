import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

interface User {
  userId: string;
  customerName: string;
  email: string;
  mobileNumber: string;
  registeredAt?: string;
  status?: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers).map((user: User) => ({
        ...user,
        status: 'Active'
      }));
      this.filteredUsers = [...this.users];
    }
  }

  searchUsers() {
    this.filteredUsers = this.users.filter(user => 
      user.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleUserStatus(user: User) {
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    this.updateLocalStorage();
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(user => user.userId !== userId);
      this.filteredUsers = this.filteredUsers.filter(user => user.userId !== userId);
      this.updateLocalStorage();
    }
  }

  private updateLocalStorage() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }
} 