import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'

import { SignupFormComponent } from './signup-form.component';
import { AuthService } from '../services/auth.service';
import { MockAuthService } from '../../testing/mock-auth-service';
import { StubRouter } from '../../testing/stub-router';

describe('SignupFormComponent', () => {
  let component: SignupFormComponent;
  let fixture: ComponentFixture<SignupFormComponent>;
  let el: HTMLElement;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SignupFormComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: StubRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' } } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
    authService = TestBed.get(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('after a submit it sends the submitted username and password to AuthService\'s submit method', async(() => {
    const spy = spyOn(authService, 'signup').and.callThrough();
    const testUser = { username: 'goodUser', password: 'secret' }
    component.signupForm.setValue(testUser);
    component.onSubmit(testUser);
    expect(spy).toHaveBeenCalledWith({ username: 'goodUser', password: 'secret' });
  }));

  it('handles user username-already-exists response if it receives one from the backend by the AuthService\'s signup method', async(() => {
    expect(component.duplicateUsername).toBeFalsy();
    const testUser = { username: 'existingUser', password: 'secret' }
    component.signupForm.setValue(testUser);
    component.onSubmit(testUser);
    expect(component.duplicateUsername).toBeTruthy();
    fixture.detectChanges();
    expect(el.querySelector('#duplicate-username')).toBeTruthy();
  }));

  it('handles error response if it receives one from the backend by the AuthService\'s signup method', async(() => {
    expect(component.remoteError).toBeFalsy();
    const testUser = { username: 'giveMeError', password: 'secret' }
    component.signupForm.setValue(testUser);
    component.onSubmit(testUser);
    expect(component.remoteError).toBeTruthy();
    fixture.detectChanges();
    expect(el.querySelector('#remote-error')).toBeTruthy();
  }));

});
