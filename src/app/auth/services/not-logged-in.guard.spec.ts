import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { NotLoggedInGuard } from './not-logged-in.guard';
import { AuthService } from '../services/auth.service';
import { MockAuthService } from '../../testing/mock-auth-service';
import { StubRouter } from '../../testing/stub-router';

describe('NotLoggedInGuard', () => {

  let service: AuthService;
  let router: Router;
  let guard: NotLoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotLoggedInGuard,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: StubRouter }
      ]
    });
  });

  beforeEach(inject([AuthService, Router, NotLoggedInGuard], (_service: AuthService, _router: Router, _guard: NotLoggedInGuard) => {
    service = _service;
    router = _router;
    guard = _guard;
  }));

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('blocks a route if there is a valid auth-cookie (which means the user is logged in; note: this guard is used to test if the user can navigate to the login and signup pages)', () => {
    document.cookie = 'auth=yes; path=/; max-age=1800';
    const spy = spyOn(router, 'navigate');
    (<boolean>guard.canActivate(<any>{}, <any>{}));
    expect(spy).toHaveBeenCalledWith(['/']);
  });

  it('allows a route if there is not a valid auth-cookie. It does so even when the app has set a username. This situation happens when a logged-in user manually removed the cookie by clearing the browser data.', () => {
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    (<any>service).username$.next('good-user');
    const canActivate = (<boolean>guard.canActivate(<any>{}, <any>{}));
    expect(canActivate).toBeTruthy();
  });

  it('when it allows a route if there is not a valid auth-cookie, it also calls the AuthService\'s clearUsername method.', () => {
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    (<any>service).username$.next('good-user');
    const canActivate = (<boolean>guard.canActivate(<any>{}, <any>{}));
    (<any>service).username$.subscribe((username: string) => {
      expect(username).toBeUndefined(); // 
    });
  });
});
