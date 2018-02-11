import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../models/user';

export class MockAuthService {

  public username$ = new BehaviorSubject<string>(undefined);

  public login(value: User): Observable<any> {
    if (value.username === 'bad-user') {
     return Observable.of('unauth-user');     
    }
    if (value.username === 'give-me-error') {
     return Observable.throw({ status: 500, statusText: 'Database error (JR)' })
    }
    else return Observable.of(''); // Necessary to heaten up observable; otherwise error: Cannot read property 'subscribe' of undefined
  }
  
  public signup(value: User): Observable<any> {
    if (value.username === 'already-existing-user') {
     return Observable.throw({status: 401, statusText: 'username-already-exists', error: 'username-already-exists'});     
    }
    if (value.username === 'give-me-error') {
     return Observable.throw({ status: 500, statusText: 'Database error (JR)' })
    }
    else return Observable.of(''); // Necessary to heaten up observable,
  }}
