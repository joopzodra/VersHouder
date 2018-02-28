import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormGroupDirective, FormBuilder, Validators } from '@angular/forms';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ShowErrorComponent } from './show-error.component';

@Component({
  template: `
  <form (ngSubmit)="onSubmit(loginForm.value)" [formGroup]="loginForm">
      <input type="text" class="w3-input w3-border w3-section" name="username" placeholder="gebruikersnaam" ngFormGroup="username">
      <jr-show-error text="Gebruikersnaam" path="username"></jr-show-error>
    <button class="w3-button w3-blue w3-block" type="submit">Log in</button>
  </form>
  `
})
class TestHostComponent {
  loginForm: FormGroup;
  @ViewChild(ShowErrorComponent) showErrorComp: ShowErrorComponent;
  constructor(private fb: FormBuilder) {
    this.loginForm = fb.group({
      username: ['', Validators.minLength(4)],
    })    
  }
  onSubmit(formValue: any) { }
}

describe('ShowErrorComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ShowErrorComponent, TestHostComponent],
      providers:[FormGroupDirective]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component.showErrorComp).toBeTruthy();
  });
});
