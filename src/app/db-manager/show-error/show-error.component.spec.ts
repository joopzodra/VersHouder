import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormGroupDirective, FormBuilder, Validators } from '@angular/forms';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ShowErrorComponent } from './show-error.component';
import { urlValidator } from '../../app-validators';

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
class TestHostComponent {
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

  it('shows warnings when the user input doesn\'t match the input element\'s constraints', () => {
    const control1 = component.editForm.get('text');
    control1.setValue('')
    control1.markAsTouched();
    fixture.detectChanges();
    let errorMessageDiv = el.querySelector('div div');
    expect(errorMessageDiv.textContent).toContain('is niet ingevuld');
    control1.setValue('testtext');
    const control2 = component.editForm.get('url');
    control2.setValue('www')
    control2.markAsTouched();
    fixture.detectChanges();
    errorMessageDiv = el.querySelector('div div');
    expect(errorMessageDiv.textContent).toContain('moet een geldige URL bevatten');
  });
});
