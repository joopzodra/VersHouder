import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { BACKEND_URL, URL } from '../../app-tokens';
import { Poem, Poet, Bundle } from '../../models/poem-poet-bundle';
import { PoemsListItem } from '../../models/list-items';

@Injectable()
export class DbManagerService {

  private headers = new HttpHeaders().set('withCredentials', 'true');
  private backendUrl: string;
  private _listItems = new Subject<PoemsListItem[]>();
  public readonly listItems$ = this._listItems.asObservable();

  constructor(private http: HttpClient, @Inject(BACKEND_URL) backendUrl: string) {
    this.backendUrl = backendUrl;
  }

  getListItems(listType: string, formValue: { query: string, searchFor: string, maxItemsPerPage: string }): void {
    const options = {
      params: new HttpParams()
        .set('queryString', formValue.query.trim())
        .set('table', listType)
        .set('column', formValue.searchFor)
        .set('maxItems', formValue.maxItemsPerPage)
    }
    this.http.get<PoemsListItem[]>(this.backendUrl + '/manager/find-all', options)
      .subscribe(listItems => this._listItems.next(listItems), this.handleError);
  }

  /*  addPoem(poem: Poem) {
      this.http.post<Poem>(this.backendUrl + '/manager/edit', poem, { headers: this.headers })
        .subscribe(res => {
          console.log(res);
        });
    }*/


    handleError(err: HttpErrorResponse){
      console.log(err); // TO DO proper error handling
    }
}
