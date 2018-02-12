import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ShowErrorComponent, TestHostComponent],
      providers: []
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('gives an error when the username doesn\'t match the input element\'s constraints', () => {
      const control = component.loginForm.get('username');
      control.setValue('jim')
      control.markAsTouched();
      fixture.detectChanges();
      const errorMessageDiv = el.querySelector('div div');
      expect(errorMessageDiv.textContent.length).toBeGreaterThan(10);
  });

});
