import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ViewBillComponent } from './components/billing/view-bill/view-bill.component';
import { PayBillComponent } from './components/billing/pay-bill/pay-bill.component';
import { PaymentSuccessComponent } from './components/billing/payment-success/payment-success.component';
import { AcknowledgementComponent } from './components/auth/acknowledgement/acknowledgement.component';
import { RegisterComplaintsComponent } from './components/complaints/register-complaints/register-complaints.component';
import { ComplaintStatusComponent } from './components/complaints/complaint-status/complaint-status.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Default route
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'acknowledgement', component: AcknowledgementComponent },

  // Protected user routes
  { 
    path: 'welcome', 
    component: WelcomeComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'view-bill', 
    component: ViewBillComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'pay-bill', 
    component: PayBillComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'payment-success', 
    component: PaymentSuccessComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'register-complaint', 
    component: RegisterComplaintsComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'complaint-status', 
    component: ComplaintStatusComponent, 
    canActivate: [AuthGuard] 
  },

  // Admin routes (lazy loaded)
  {
    path: 'admin',
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },

  // Wildcard route for 404
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
