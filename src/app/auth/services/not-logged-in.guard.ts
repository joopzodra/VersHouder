import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as cookie from 'cookie';

import { AuthService } from './auth.service';

/* Allows a user only to navigate to the login or signup pages if he's not logged in. Otherwise he's redirected to the app's root page.
 * Loggin in twice or creating a new account when already logged in is no problem, but it's unnessecary. Therefore we redirect.
 * If the user wants to create another account, he first has to log out.
 */

@Injectable()
export class NotLoggedInGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    const cookies = cookie.parse(document.cookie);
    if (cookies.auth && cookies.auth === 'yes') {
      this.router.navigate(['/']);
      return false;
    }
    return this.authService.username$
      .map((username: string) => {
        if (username) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      });
  }
}
