import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface User {
  consumerId: string;
  billNumber: string;
  customerName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  userId: string;
  password?: string;
  registeredAt?: string;
  isAdmin?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ADMIN_CREDENTIALS = {
    userId: 'uutkrasadmin',
    password: 'uutkrasadmin'
  };

  constructor() {
    // Initialize users array if it doesn't exist
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }
  }

  login(credentials: { userId: string, password: string }): Observable<boolean> {
    // Check for admin login
    if (credentials.userId === this.ADMIN_CREDENTIALS.userId && 
        credentials.password === this.ADMIN_CREDENTIALS.password) {
      const adminUser = {
        userId: this.ADMIN_CREDENTIALS.userId,
        customerName: 'Administrator',
        email: 'admin@weenergy.com',
        mobileNumber: '0000000000',
        isAdmin: true
      };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return of(true);
    }

    // Regular user login
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => 
      u.userId === credentials.userId && u.password === credentials.password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return of(true);
    }

    return of(false);
  }

  register(user: User): Observable<boolean> {
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      const userExists = users.some((u: User) => 
        u.userId === user.userId || 
        u.email === user.email || 
        u.consumerId === user.consumerId ||
        u.mobileNumber === user.mobileNumber
      );

      if (userExists) {
        console.error('User already exists');
        return of(false);
      }

      // Add new user
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log the registration for debugging
      console.log('Registration successful:', user);
      console.log('Updated users:', users);
      
      return of(true);
    } catch (error) {
      console.error('Registration error:', error);
      return of(false);
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing current user:', error);
      return null;
    }
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isAdmin || false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  // Helper method to check registration status
  checkRegistrationStatus(): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Current registered users:', users);
  }
}
