import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DbManagerService } from '../services/db-manager.service';
import { ListItemsStore } from '../services/list-items.store';
import { PoemsListItem } from '../../models/list-items';

/* The PoemsListComponent shows a list with poems.
 * It receives the poems from the DbManagerService.
 * (Which poems it receives, is determined by the SearchComponent.)
 */

@Component({
  selector: 'jr-poems-list',
  templateUrl: './poems-list.component.html'
})
export class PoemsListComponent implements OnInit {

  listItems$: Observable<PoemsListItem[]>;
  searching$: Observable<boolean>;
  
  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private dbManagerService: DbManagerService,
    private listItemsStore: ListItemsStore
  ) { }

  ngOnInit() {
    const title = this.route.snapshot.data['title'];
    this.titleService.setTitle(title);
    this.listItems$ = <Observable<PoemsListItem[]>>this.listItemsStore.listItems$;
    this.searching$ = this.dbManagerService.searching$;
  }
}
