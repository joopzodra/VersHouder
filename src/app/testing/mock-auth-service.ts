import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../models/user';

export class MockAuthService {

  username$ = new BehaviorSubject<string>(undefined);
  isAuthenticatedOnBackend: boolean;

  login(value: User): Observable<any> {
    if (value.username === 'bad-user') {
     return Observable.throw({ status: 401, statusText: 'unauth-user', error: 'unauth-user' });     
    }
    if (value.username === 'give-me-error') {
     return Observable.throw({ status: 500, statusText: 'Database error (JR)', error: 'remote-error' })
    }
    else return Observable.of(''); // Necessary to heaten up observable; otherwise error: Cannot read property 'subscribe' of undefined
  }
  
  signup(value: User): Observable<any> {
    if (value.username === 'alreadyExistingUser') {
     return Observable.throw({status: 401, statusText: 'username-already-exists', error: 'username-already-exists'});     
    }
    if (value.username === 'giveMeError') {
     return Observable.throw({ status: 500, statusText: 'Database error (JR)', error: 'remote-error' })
    }
    else return Observable.of(''); // Necessary to heaten up observable,
  }

  getUsername(): Observable<any> {
    if (this.isAuthenticatedOnBackend) {
      return Observable.of({username: 'good-user'});
    } else {
      return Observable.throw({ status: 401, statusText: 'unauth-user', error: 'unauth-user' });
    }    
  }

  logout() {}
}
