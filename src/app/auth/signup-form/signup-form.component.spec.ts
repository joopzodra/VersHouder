import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
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

  function formUsername(username: string) {
    const form = component.signupForm.form;
    const usernameControl = form.get('username');
    usernameControl.setValue(username);
    const passwordControl = form.get('password');
    passwordControl.setValue('secret');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SignupFormComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: StubRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' } } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
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

  it('submits username and password', async(() => {
    const spy = spyOn(authService, 'signup').and.callThrough();
    fixture.whenStable().then(() => {
      formUsername('good-user');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith({ username: 'good-user', password: 'secret' });
    });
  }));

  it('handles user username-already-exists response', async(() => {
    fixture.whenStable().then(() => {
      expect(component.duplicateUsername).toBeFalsy();
      formUsername('already-existing-user');
      component.onSubmit();
      expect(component.duplicateUsername).toBeTruthy();
      fixture.detectChanges();
      expect(el.querySelector('#duplicate-username')).toBeTruthy();
    });
  }));

  it('handles error response', async(() => {
    fixture.whenStable().then(() => {
      expect(component.remoteError).toBeFalsy();
      formUsername('give-me-error');
      component.onSubmit();
      expect(component.remoteError).toBeTruthy();
      fixture.detectChanges();
      expect(el.querySelector('#remote-error')).toBeTruthy();
    });
  }));

});
