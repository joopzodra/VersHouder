import { Subject } from 'rxjs/Subject';
import {PoemsListItem} from '../models/list-items';

export class MockDbManagerService {
  listItems$ = new Subject<PoemsListItem[]>();
  stubListItems: PoemsListItem[] = [{ id: 1, text: 'text poem1' }, { id: 2, text: 'text poem2' }];

  getListItems(listType: string, formValue: { query: string, searchFor: string, maxItemsPerPage: string }): void {
      this.listItems$.next(this.stubListItems);
  }

}