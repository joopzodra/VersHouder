import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject'
import { ListItem } from '../../models/list-items';

/**
 * The ListItemStore is a redux store for ListItem data (poems, poets, bundles).
 * It receives data from the DbManagerService.
 */

export const LOAD = 'LOAD'
export const ADD = 'ADD'
export const EDIT = 'EDIT'
export const REMOVE = 'REMOVE'

@Injectable()
export class ListItemsStore {
  public listItems$ = new BehaviorSubject<ListItem[]>([]);
  private _listItems: ListItem[] = [];
  public dispatch(action: { type: string, data: ListItem[] }) {
    this._listItems = this.reduce(this._listItems, action);
    this.listItems$.next(this._listItems);
  }
  private reduce(listItems: ListItem[], action: { type: string, data: ListItem[] }): ListItem[] {
    switch (action.type) {
      case LOAD:
        return [...action.data];
      case ADD:
        return listItems.concat(action.data);
      case EDIT:
        return listItems.map(listItem => {
          const editedListItem = action.data[0];
          if (listItem.id !== editedListItem.id) {
            return listItem;
          }
          return editedListItem;
        });
      case REMOVE:
        return listItems.filter(listItem => listItem.id !== action.data[0].id);
      default:
        return listItems;
    }
  }
}
