import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentRoute: string = '';

  navItems = [
    { path: '/welcome', label: 'Home' },
    { path: '/view-bill', label: 'View Bill' },
    { path: '/register-complaint', label: 'Register Complaint' },
    { path: '/complaint-status', label: 'View Complaints' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Subscribe to router events to update current route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url.split('?')[0]; // Remove query params
      }
    });
  }

  isCurrentRoute(path: string): boolean {
    return this.currentRoute === path;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 