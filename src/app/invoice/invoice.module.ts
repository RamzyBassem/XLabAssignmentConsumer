import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,FormsModule
  ],
  exports:[
    HomeComponent,FormsModule
  ]
})
export class InvoiceModule { }
