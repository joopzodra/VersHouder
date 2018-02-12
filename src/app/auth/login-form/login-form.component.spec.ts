import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms'
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
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
    const testUser = { username: 'good-user', password: 'secret' }
    component.loginForm.setValue(testUser);
    component.onSubmit(testUser);
    expect(spy).toHaveBeenCalledWith({ username: 'good-user', password: 'secret' });
  }));

  it('handles user denied response', async(() => {
    expect(component.userDenied).toBeFalsy();
    const testUser = { username: 'bad-user', password: 'secret' };
    component.loginForm.setValue(testUser);
    component.onSubmit(testUser);
    expect(component.userDenied).toBeTruthy();
    fixture.detectChanges();
    expect(el.querySelector('#user-denied')).toBeTruthy();
  }));

  it('handles error response', async(() => {
    expect(component.remoteError).toBeFalsy();
    const testUser = { username: 'give-me-error', password: 'secret' }
    component.loginForm.setValue(testUser);
    component.onSubmit(testUser);
    expect(component.remoteError).toBeTruthy();
    fixture.detectChanges();
    expect(el.querySelector('#remote-error')).toBeTruthy();
  }));

});
