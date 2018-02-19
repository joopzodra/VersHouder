import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import * as cookie from 'cookie';

import { AuthService } from './auth.service';

/* Allows a user to pass only if a username has been set. It handles three posibilities:
 * 1. There is no auth-cookie. This cookie is set by the app after login. If it's not set, the user is not logged in, hence no username. The user is refused to pass the guard.
 * 2. There is a username. User can pass the guard.
 * 3. There is an auth-cookie but no username. This happens when a logged in user opens a new browser tab or window. Then a new instance of the app is created, in which no username is set yet. The guard requests the username from the backend via AuthService's getUsername method.
 * Case #3 also catches the error. An 401-error is thrown if we ask for the username but the user is not logged in in the backend. This scenario can happen if the session-cookie is removed manually or by accident. The user should then log in. We then disable the auth-cookie, otherwise in the NotLoggedInGuard this cookie could block navigating to the login page.
 */

@Injectable()
export class AuthGuard implements CanActivate {

  username: string;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.username$.subscribe(username => this.username = username);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    const cookies = cookie.parse(document.cookie);
    if (!cookies.auth || cookies.auth !== 'yes') {
      let url: string = state.url;
      this.authService.redirectUrl = url;
      this.router.navigate(['/auth/login']);
      return false;
    }
    if (this.username) {
      return true;
    }
    return this.authService.getUsername()
      .pipe(
        map(username => {
          this.username = username;
          return true;
        }),
        catchError((err: any) => {
          document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          this.router.navigate(['/auth/login']);
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.canActivate(route, state);
  }
}
