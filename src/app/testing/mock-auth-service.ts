import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../models/user';

export class MockAuthService {

  public username$ = new BehaviorSubject<string>(undefined);

  public login(value: User): Observable<any> {
    if (value.username === 'bad-user') {
     return Observable.throw({ status: 401, statusText: 'unauth-user', error: 'unauth-user' });     
    }
    if (value.username === 'give-me-error') {
     return Observable.throw({ status: 500, statusText: 'Database error (JR)', error: 'remote-error' })
    }
    else return Observable.of(''); // Necessary to heaten up observable; otherwise error: Cannot read property 'subscribe' of undefined
  }
  
  public signup(value: User): Observable<any> {
    if (value.username === 'alreadyExistingUser') {
     return Observable.throw({status: 401, statusText: 'username-already-exists', error: 'username-already-exists'});     
    }
    if (value.username === 'giveMeError') {
     return Observable.throw({ status: 500, statusText: 'Database error (JR)', error: 'remote-error' })
    }
    else return Observable.of(''); // Necessary to heaten up observable,
  }}
