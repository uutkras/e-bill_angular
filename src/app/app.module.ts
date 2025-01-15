import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';
import { AdminModule } from './components/admin/admin.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ViewBillComponent } from './components/billing/view-bill/view-bill.component';
import { PayBillComponent } from './components/billing/pay-bill/pay-bill.component';
import { PaymentSuccessComponent } from './components/billing/payment-success/payment-success.component';
import { AcknowledgementComponent } from './components/auth/acknowledgement/acknowledgement.component';
import { RegisterComplaintsComponent } from './components/complaints/register-complaints/register-complaints.component';
import { ComplaintStatusComponent } from './components/complaints/complaint-status/complaint-status.component';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    WelcomeComponent,
    ViewBillComponent,
    PayBillComponent,
    PaymentSuccessComponent,
    AcknowledgementComponent,
    RegisterComplaintsComponent,
    ComplaintStatusComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    SharedModule,
    AdminModule,
    AppRoutingModule
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
