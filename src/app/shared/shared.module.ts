import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ShowErrorComponent } from './show-error/show-error.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ShowErrorComponent
  ],
  exports : [
    CommonModule, ReactiveFormsModule, HttpClientModule,
    ShowErrorComponent
  ]
})
export class SharedModule { }
