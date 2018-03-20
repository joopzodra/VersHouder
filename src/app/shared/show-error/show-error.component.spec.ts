import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ShowErrorComponent } from './show-error.component';
import { urlValidator } from '../app-validators';

@Component({
  template: `
  <form (ngSubmit)="onSubmit(loginForm.value)" [formGroup]="loginForm">
      <input type="text" class="w3-input w3-border w3-section" name="username" placeholder="gebruikersnaam" ngFormGroup="username">
      <jr-show-error text="Gebruikersnaam" path="username"></jr-show-error>
    <button class="w3-button w3-blue w3-block" type="submit">Log in</button>
  </form>
  `
})
class TestLoginHostComponent {
  loginForm: FormGroup;
  @ViewChild(ShowErrorComponent) showErrorComp: ShowErrorComponent;
  constructor(private fb: FormBuilder) {
    this.loginForm = fb.group({
      username: ['', Validators.minLength(4)],
    })
  }
  onSubmit(formValue: any) { }
}

@Component({
  template: `
  <form (ngSubmit)="onSubmit(editForm.value)" [formGroup]="editForm">
      <textarea class="w3-input w3-border" rows=12 formControlName="text" placeholder="verplicht, maximale lengte 30.000 tekens"></textarea>
      <jr-show-error text="Gedicht" path="text"></jr-show-error>
      <input class="w3-input w3-border" type="text" formControlName="url" placeholder="niet verplicht, begin met 'http://' of 'https://'">
      <jr-show-error text="Hyperlink-URL" path="url"></jr-show-error>
    <button class="w3-button w3-blue w3-block" type="submit">Log in</button>
  </form>
  `
})
class TestEditHostComponent {
  editForm: FormGroup;
  @ViewChild(ShowErrorComponent) showErrorComp: ShowErrorComponent;
  constructor(private fb: FormBuilder) {
    this.editForm = fb.group({
      text: ['', [Validators.maxLength(30000), Validators.required]],
      url: ['', urlValidator]
    })
  }
  onSubmit(formValue: any) { }
}

describe('ShowErrorComponent', () => {
  let loginComponent: TestLoginHostComponent;
  let loginFixture: ComponentFixture<TestLoginHostComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ShowErrorComponent, TestLoginHostComponent, TestEditHostComponent],
      providers: []
    });
  }));

  it('should create', () => {
    loginFixture = TestBed.createComponent(TestLoginHostComponent);
    loginComponent = loginFixture.componentInstance;
    loginFixture.detectChanges();
    expect(loginComponent).toBeTruthy();
  });

  it('shows warnings in the login form when the user input doesn\'t match the input element\'s constraints', () => {
    loginFixture = TestBed.createComponent(TestLoginHostComponent);
    loginComponent = loginFixture.componentInstance;
    loginFixture.detectChanges();
    de = loginFixture.debugElement;
    el = de.nativeElement;
    const control = loginComponent.loginForm.get('username');
    control.setValue('jim')
    control.markAsTouched();
    loginFixture.detectChanges();
    const errorMessageDiv = el.querySelector('div div');
    expect(errorMessageDiv.textContent.length).toBeGreaterThan(10);
  });

  it('shows warnings in the edit form when the user input doesn\'t match the input element\'s constraints', () => {
    const editFixture = TestBed.createComponent(TestEditHostComponent);
    const editComponent = editFixture.componentInstance;
    editFixture.detectChanges();
    de = editFixture.debugElement;
    el = de.nativeElement;
    const control1 = editComponent.editForm.get('text');
    control1.setValue('')
    control1.markAsTouched();
    editFixture.detectChanges();
    let errorMessageDiv = el.querySelector('div div');
    expect(errorMessageDiv.textContent).toContain('is niet ingevuld');
    control1.setValue('testtext');
    const control2 = editComponent.editForm.get('url');
    control2.setValue('www')
    control2.markAsTouched();
    editFixture.detectChanges();
    errorMessageDiv = el.querySelector('div div');
    expect(errorMessageDiv.textContent).toContain('moet een geldige URL bevatten');
  });

});
