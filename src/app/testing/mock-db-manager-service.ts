import { Subject } from 'rxjs/Subject';
import { PoemsListItem } from '../models/list-items';
import { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of';

import { Poet, Bundle } from '../models/foreign-key-children';
import { ListItem } from '../models/list-items';

export class MockDbManagerService {
  listItems$ = new Subject<PoemsListItem[]>();
  stubListItems: PoemsListItem[] = [{ id: 1, text: 'text poem1' }, { id: 2, text: 'text poem2' }];

  getListItems(listType: string, formValue: { query: string, searchFor: string, maxItemsPerPage: string }): void {
    this.listItems$.next(this.stubListItems);
  }

  createOrUpdateListItem(listType: string, listItem: ListItem): Observable<boolean>{
    return of(true);
  }

  deleteListItem(listType: string, listItem: ListItem): Observable<boolean>{
    return of(true);
  }

  searchingStart() { }

  queryChildren(foreignKeyType: string, query: string): Observable<Poet[] | Bundle[]>{
    return of([{id: 13, name: 'poet13'}, {id: 14, name: 'poet 14'}]);
  }

  findChildById(foreignKeyType: string, id: number): Observable<Poet | Bundle>{
    return of({id: 12, name: 'poet12'});
  }

}