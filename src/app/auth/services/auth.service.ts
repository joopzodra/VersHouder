import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as cookie from 'cookie';

import { User } from '../../models/user';
import { BACKEND_URL, URL } from '../../app-tokens';

/* This service has absolute links in the this.router.navigate() calls and redirectUrl property. You'll probably have to change them when using the auth-module in another app.
 *
 */

interface LoginResponse {
  authUser: boolean;
}
interface LogoutResponse {
  loggedOut: boolean;
}
interface SignupResponse {
  userName: string;
}

@Injectable()
export class AuthService {

  private _username = new BehaviorSubject<string>(undefined);
  public readonly username$ = this._username.asObservable();
  private headers = new HttpHeaders().set('withCredentials', 'true');
  private backendUrl: string;
  public redirectUrl = '/';

  constructor(private http: HttpClient, private router: Router, @Inject(BACKEND_URL) backendUrl: string) {
    this.backendUrl = backendUrl;
    const cookies = cookie.parse(document.cookie);
    if (cookies.auth === 'yes') {
      this.getUsername();
    }
  }

  private getUsername() {
    this.http.get<{ username: string }>(this.backendUrl + '/auth/who', {
      headers: this.headers
    })
      .subscribe(res => {
        if (res.username) {
          this._username.next(res.username);
        }
      },
      err => console.log(err)); // TO DO error handling 
  }

  public login(user: User) {
    return this.http.post<LoginResponse>(this.backendUrl + '/auth/login', user, {
      headers: this.headers
    })
      .pipe(
        map(res => {
          if (res.authUser === true) {
            document.cookie = 'auth=yes; path=/; max-age=1800';
            this._username.next(user.username);
            this.router.navigate([this.redirectUrl]);
          } else {
            return 'unauth-user';
          }
        },
          catchError((error: any) => {
            console.log(error);
            return of('remote-error');
          })
        )
      );
  }

  // TO DO: use Angular Location instead of reload() ........ 
  public logout() {
    this.http.get<LogoutResponse>(this.backendUrl + '/auth/logout', {
      headers: this.headers
    })
      .subscribe(res => {
        this._username.next(undefined);
        document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        this.router.navigate(['/']);
        this.reload();
      },
        (err: HttpErrorResponse) => alert('Uitloggen mislukt. De database reageert niet.')
      );
  }

  public signup(user: User) {
    return this.http.post<SignupResponse>(this.backendUrl + '/auth/signup', user, {
      headers: this.headers
    })
      .pipe(
        map(
          () => this.router.navigate(['/']),
          catchError((error: any) => {
            if (error.error === 'username-already-exists') {
              return of('username-already-exists');
            } else {
              console.log(error);
              return of('remote-error');
            }
          })
        )
      );
  }

  private reload() {
    location.reload(); // Reloads the app; there's no elegant way to reload only the current component is its the / component
  }

}