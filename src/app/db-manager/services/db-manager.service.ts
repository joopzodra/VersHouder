import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { tap, catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as FormData from 'form-data'

import { BACKEND_URL, URL } from '../../app-tokens';
import { ListItem, PoetsListItem } from '../../models/list-items';
import { ListItemsStore, LOAD, ADD, EDIT, REMOVE } from './list-items.store';
import { Poet, Bundle } from '../../models/foreign-key-children';

/**
 * The DbManagerService sents requests to and receives responses from the backend, concerning the database API requests.
 * The service receives queries from the SearchComponent.
 * It pushes the responses from the backend to the ListItemsStore's dispatch method.
 * The queryChildren and findChildById methods receive queries from the ForeignKeySearchComponent and pushes the results directly to these components.
 */

@Injectable()
export class DbManagerService {

  private headers = new HttpHeaders().set('withCredentials', 'true');
  private backendUrl: string;
  private _searching = new BehaviorSubject<boolean>(false);
  public readonly searching$ = this._searching.asObservable();
  private _remoteError = new BehaviorSubject<number>(undefined);
  public readonly remoteError$ = this._remoteError.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(BACKEND_URL) backendUrl: string,
    private listItemsStore: ListItemsStore
  ) {
    this.backendUrl = backendUrl;
  }

  private getListItemById(listType: string, itemId: string): Observable<ListItem> {
    const options = {
      headers: this.headers,
      params: new HttpParams()
        .set('table', listType)
        .set('itemId', itemId)
    };
    return this.http.get<ListItem>(this.backendUrl + '/manager/find-by-id', options);
  }

  // searchingStart is called in the SearchComponent. From there it can call this method before the debounceTime delay, so the user will see the spinner immediately (not waiting untill the debounceTime delay has finished).
  searchingStart() {
    this._searching.next(true);
  }

  searchingEnd() {
    this._searching.next(false);
  }

  getListItems(listType: string, formValue: { query: string, searchFor: string, maxItemsPerPage: string, offset: string }): void {
    this._remoteError.next(undefined);
    this.listItemsStore.dispatch({ type: LOAD, data: [] });
    const options = {
      params: new HttpParams()
        .set('queryString', formValue.query.trim())
        .set('table', listType)
        .set('column', formValue.searchFor)
        .set('maxItems', formValue.maxItemsPerPage)
        .set('offset', formValue.offset),
      headers: this.headers
    }
    this.http.get<ListItem[]>(this.backendUrl + '/manager/find-all', options)
      .subscribe(
        listItems => {
          this.listItemsStore.dispatch({ type: LOAD, data: listItems });
          this.searchingEnd();
        },
        error => this.handleError(error)
      );
  }

  createOrUpdateListItem(listType: string, formData: FormData, listItem: ListItem): Observable<boolean | {}> {
    const options = {
      headers: this.headers,
      params: new HttpParams()
        .set('table', listType)
    };
    if (!listItem.id) {
      return this.http.post<ListItem>(this.backendUrl + '/manager/create', formData, options)
        .pipe(
          mergeMap(res => this.getListItemById(listType, res.id.toString())),
          tap(res => this.listItemsStore.dispatch({ type: ADD, data: [res] })),
          map(() => true)
        )
    } else {
      return this.http.put<{ affectedCount: Number[], imgUrl?: string }>(this.backendUrl + '/manager/update', formData, options)
        .pipe(
          tap(res => {
            if (res.imgUrl || res.imgUrl === '') {
              (<PoetsListItem>listItem).img_url = res.imgUrl;
            }
          }),
          tap(() => this.listItemsStore.dispatch({ type: EDIT, data: [listItem] })),
          map(() => true),
          catchError(error => {
            console.log(error);
            return of(false);
          })
        );
    }
  }

  deleteListItem(listType: string, listItem: ListItem): Observable<boolean> {
    let imgUrl;
    if (listType === 'poets') {
      const poetsListItem = <PoetsListItem>listItem
      imgUrl = poetsListItem.img_url ? poetsListItem.img_url : '';
    }
    const options = {
      headers: this.headers,
      params: new HttpParams()
        .set('table', listType)
        .set('id', listItem.id.toString())
        .set('imgUrl', imgUrl)
    }
    return this.http.delete(this.backendUrl + '/manager/delete', options)
      .pipe(
        tap(res => this.listItemsStore.dispatch({ type: REMOVE, data: [listItem] })),
        map(() => true),
        catchError(error => {
          console.log(error);
          return of(false);
        })
      );
  }

  handleError(error: HttpErrorResponse) {
    // If error.status === 400 the user has sent invalid data.
    // If error.status === 500 it's a remote error, not further specified.
    // If error.status === 0 it's an unknown error, indicating no connection at all by whatever cause. In this case we push 1, because the subscribers treat 0 as undefined.
    this._remoteError.next(error.status === 0 ? 1 : error.status);
    this.searchingEnd();
    console.log(error);
  }

  queryChildren(foreignKeyType: string, query: string) {
    const options = {
      params: new HttpParams()
        .set('queryString', query)
        .set('table', foreignKeyType),
      headers: this.headers
    }
    return this.http.get<Poet[] | Bundle[]>(this.backendUrl + '/manager/find-children', options);
  }

  findChildById(foreignKeyType: string, id: number) {
    const options = {
      params: new HttpParams()
        .set('id', id.toString())
        .set('table', foreignKeyType),
      headers: this.headers
    }
    return this.http.get<Poet | Bundle>(this.backendUrl + '/manager/find-child-by-id', options);
  }

}
