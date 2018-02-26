import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { BACKEND_URL, URL } from '../../app-tokens';
import { ListItem } from '../../models/list-items';
import { ListItemsStore, LOAD, ADD, EDIT, REMOVE } from './list-items.store';

/* The DbManagerService sents requests to and receives responses from the backend, concerning the database API requests.
 * The service receives queries from the SearchComponent.
 * It pushes the responses from the backend as listItems to subscribers.
 * Subscribers are the PoemsListComponent, ....
 */

@Injectable()
export class DbManagerService {

  private headers = new HttpHeaders().set('withCredentials', 'true');
  private backendUrl: string;
  private _searching = new BehaviorSubject<boolean>(false);
  public readonly searching$ = this._searching.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(BACKEND_URL) backendUrl: string,
    private listItemsStore: ListItemsStore
  ) {
    this.backendUrl = backendUrl;
  }

  // searchingStart is called in the SearchComponent. From there it can call this method before the debounceTime delay, so the user will see the spinner immediately (not waiting untill the debounceTime delay has finished).
  searchingStart() {
    this._searching.next(true);
  }

  searchingEnd() {
    this._searching.next(false);
  }

  getListItems(listType: string, formValue: { query: string, searchFor: string, maxItemsPerPage: string }): void {
    //console.log(listType, formValue)
    this.listItemsStore.dispatch({ type: LOAD, data: [] });
    const options = {
      params: new HttpParams()
        .set('queryString', formValue.query.trim())
        .set('table', listType)
        .set('column', formValue.searchFor)
        .set('maxItems', formValue.maxItemsPerPage),
      headers: this.headers
    }
    this.http.get<ListItem[]>(this.backendUrl + '/manager/find-all', options)
      .subscribe(listItems => {
        this.listItemsStore.dispatch({ type: LOAD, data: listItems });
        this.searchingEnd();
      },
        this.handleError
      );
  }

  createOrUpdateListItem(listType: string, listItem: ListItem) {
    const options = {
      headers: this.headers,
      params: new HttpParams()
        .set('table', listType)
    };
    if (!listItem.id) {
      this.http.post<ListItem>(this.backendUrl + '/manager/create', listItem, options)
        .subscribe(res => {
          this.listItemsStore.dispatch({ type: ADD, data: [res] });
        },
          this.handleError
        );
    } else {
      this.http.put<ListItem>(this.backendUrl + '/manager/update', listItem, options)
        .subscribe(() => {
          this.listItemsStore.dispatch({ type: EDIT, data: [listItem] });
        },
          this.handleError
        );
    }
  }

  deleteListItem(listType: string, listItem: ListItem) {
    const options = {
      headers: this.headers,
      params: new HttpParams()
        .set('table', listType)
        .set('id', listItem.id.toString())
    }
    this.http.delete(this.backendUrl + '/manager/delete', options)
      .subscribe(() => {
        this.listItemsStore.dispatch({ type: REMOVE, data: [listItem] });
      },
        this.handleError
      );
  }

  handleError(err: HttpErrorResponse) {
    console.log(err); // TO DO proper error handling
  }
}
