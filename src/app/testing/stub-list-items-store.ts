import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ListItem } from '../models/list-items'

export class StubListItemsStore {

  listItems$ = new BehaviorSubject<ListItem[]>([]);

}