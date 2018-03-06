import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { MockAuthService } from '../../testing/mock-auth-service';
import { StubRouter } from '../../testing/stub-router';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: StubRouter }
      ]
    });
  });

  afterEach(() => {
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'    
  });

  it('should be created', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('blocks a route if there is no valid auth-cookie', inject([AuthGuard], (guard: AuthGuard) => {
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    guard.username = 'good-user'
    expect(guard.canActivate(<any>{}, <any>{})).toBeFalsy();
  }));

  it('allows a route if there is a valid auth-cookie and a username is set', inject([AuthGuard], (guard: AuthGuard) => {
    document.cookie = 'auth=yes; path=/; max-age=3600';
    guard.username = 'good-user'
    expect(guard.canActivate(<any>{}, <any>{})).toBeTruthy();
  }));

  it('allows a route if there is a valid auth-cookie, without a username set but the backend sends a username', inject([AuthGuard, AuthService], (guard: AuthGuard, service: AuthService) => {
    document.cookie = 'auth=yes; path=/; max-age=3600';
    guard.username = undefined;
    (<any>service).isAuthenticatedOnBackend = true;
    (<Observable<boolean>>guard.canActivate(<any>{}, <any>{}))
      .subscribe(res => {
        expect(res).toBeTruthy();
      });
  }));

  it('blocks a route if there is a valid auth-cookie, without a username set and the backend throws a 401 (Unauthorized) error', inject([AuthGuard, AuthService], (guard: AuthGuard, service: AuthService) => {
    document.cookie = 'auth=yes; path=/; max-age=3600';
    guard.username = undefined;
    (<any>service).isAuthenticatedOnBackend = false;
    (<Observable<boolean>>guard.canActivate(<any>{}, <any>{}))
      .subscribe(res => {
        expect(res).toBeFalsy();
      });
  }));
});
