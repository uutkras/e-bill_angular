import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  currentImageIndex = 0;
  images = [
    'https://g.foolcdn.com/editorial/images/464328/solar-panels-with-mountains-in-background.jpg',
    'https://tse2.mm.bing.net/th/id/OIP.ZhR2z-keM5SKOUxrzwKp6AHaE3?rs=1&pid=ImgDetMain',
    'https://electric.guide/wp-content/uploads/2020/09/what-is-hydroelectric-power.jpg'
  ];

  billingStats = {
    totalBilled: 1200,
    totalPaid: 800,
    totalOutstanding: 400
  };

  teamMembers = [
    { name: 'Utkarsh Bhangale', id: '2791126' },
    { name: 'Shreyas Shipate', id: '2799266' },
    { name: 'Bhushan Yelpale', id: '2799169' },
    { name: 'Rishikesh Patil', id: '2791131' },
    { name: 'Gayatri Chaudhari', id: '2815381' }
  ];

  services = [
    {
      title: 'Customer Support',
      description: '24/7 assistance for all your inquiries.'
    },
    {
      title: 'Online Billing',
      description: 'View and pay your bills online easily.'
    },
    {
      title: 'Complaints Registration',
      description: 'Register your complaints quickly and efficiently.'
    },
    {
      title: 'Status Tracking',
      description: 'Track the status of your complaints in real-time.'
    }
  ];

  ngOnInit() {
    this.startCarousel();
  }

  startCarousel() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 3000);
  }
}
