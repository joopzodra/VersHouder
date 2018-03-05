import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import 'rxjs/add/observable/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../models/user';

export class MockAuthService {

  username$ = new BehaviorSubject<string>(undefined);
  isAuthenticatedOnBackend: boolean;

  login(value: User): Observable<any> {
    if (value.username === 'bad-user') {
     return _throw({ status: 401, statusText: 'unauth-user', error: 'unauth-user' });     
    }
    if (value.username === 'give-me-error') {
     return _throw({ status: 500, statusText: 'Database error (JR)', error: 'remote-error' })
    }
    else return of(''); // Necessary to heaten up observable; otherwise error: Cannot read property 'subscribe' of undefined
  }
  
  signup(value: User): Observable<any> {
    if (value.username === 'existingUser') {
     return _throw({status: 401, statusText: 'username-already-exists', error: 'username-already-exists'});     
    }
    if (value.username === 'giveMeError') {
     return _throw({ status: 500, statusText: 'Database error (JR)', error: 'remote-error' })
    }
    else return of(''); // Necessary to heaten up observable,
  }

  getUsername(): Observable<any> {
    if (this.isAuthenticatedOnBackend) {
      return of({username: 'good-user'});
    } else {
      return _throw({ status: 401, statusText: 'unauth-user', error: 'unauth-user' });
    }    
  }

  logout() {}

  clearUsername() {
    this.username$.next(undefined);
  }
}
