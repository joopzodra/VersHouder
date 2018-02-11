import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormGroup } from '@angular/forms'
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

import { LoginFormComponent } from './login-form.component';
import { AuthService } from '../services/auth.service';
import { MockAuthService } from '../../testing/mock-auth-service'

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let el: HTMLElement;
  let authService: AuthService;

  function formUsername(username: string) {
    const form = component.loginForm.form;
    const usernameControl = form.get('username');
    usernameControl.setValue(username);
    const passwordControl = form.get('password');
    passwordControl.setValue('secret');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginFormComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' } } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
    authService = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('submits username and password', async(() => {
    const spy = spyOn(authService, 'login').and.callThrough();
    fixture.whenStable().then(() => {
      formUsername('good-user');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith({ username: 'good-user', password: 'secret' });
    });
  }));

  it('handles user denied response', async(() => {
    fixture.whenStable().then(() => {
      expect(component.userDenied).toBeFalsy();
      formUsername('bad-user');
      component.onSubmit();
      expect(component.userDenied).toBeTruthy();
      fixture.detectChanges();
      expect(el.querySelector('#user-denied')).toBeTruthy();
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
