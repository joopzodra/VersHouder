import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ShowErrorComponent } from './show-error.component';

@Component({
  template: `
  <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
      <input type="text" class="w3-input w3-border w3-section" name="username" placeholder="gebruikersnaam" ngModel minlength="4">
      <jr-show-error text="Gebruikersnaam" path="username"></jr-show-error>
    <button class="w3-button w3-blue w3-block" type="submit">Log in</button>
  </form>
  `
})
class TestHostComponent {
  @ViewChild('loginForm') loginForm: NgForm;
  @ViewChild(ShowErrorComponent) showErrorComp: ShowErrorComponent;
  onSubmit() { }
}

describe('ShowErrorComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ShowErrorComponent, TestHostComponent],
      providers: [NgForm]
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

  it('gives an error when the username doesn\'t match the input element\'s constraints', async(() => {
    const showErrComp = component.showErrorComp;
    fixture.whenStable().then(() => {
      const input = el.querySelector('input');
      input.value = 'jim';
      input.dispatchEvent(new Event('input'));
      de.query(By.css('form')).triggerEventHandler('submit', null);
      const form = component.loginForm;
      expect(form.value['username']).toBe('jim');
      const control = form.form.get('username');
      control.markAsTouched();
      fixture.detectChanges();
      const errorMessageDiv = el.querySelector('div div');
      expect(errorMessageDiv.textContent.length).toBeGreaterThan(10);
    });

  }));

});
