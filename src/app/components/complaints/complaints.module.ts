import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
// ... other imports

@NgModule({
  declarations: [
    RegisterComplaintsComponent,
    ComplaintStatusComponent
  ],
  imports: [
    CommonModule,
    SharedModule,  // Add this
    // ... other imports
  ]
})
export class ComplaintsModule { } 