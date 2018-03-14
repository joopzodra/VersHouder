import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DbManagerService } from '../services/db-manager.service';
import { ListItemsStore } from '../services/list-items.store';
import { PoetsListItem } from '../../models/list-items';
import { EditService } from '../services/edit.service';

/**
 * The PoetsListComponent shows a list with poets.
 * It receives the poets from the ListItemsStore.
 * (Which poets it receives, is determined by the SearchComponent.)
 * It hosts an EditComponent, to which it offers the listType property by an input binding.
 * It activates the EditComponent by it's editListItem and addListItem methods.
 */

@Component({
  templateUrl: './poets-list.component.html',
  styleUrls: ['./poets-list.component.scss']
})
export class PoetsListComponent implements OnInit {

  listItems$: Observable<PoetsListItem[]>;
  searching$: Observable<boolean>;
  remoteError$: Observable<number>
  listType = 'poets';

  constructor(
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private dbManagerService: DbManagerService,
    private listItemsStore: ListItemsStore,
    private editService: EditService
  ) { }

  ngOnInit() {
    const title = this.activatedRoute.snapshot.data['title'];
    this.titleService.setTitle(title);
    this.listItems$ = <Observable<PoetsListItem[]>>(this.listItemsStore.listItems$);
    this.searching$ = this.dbManagerService.searching$;
    this.remoteError$ = this.dbManagerService.remoteError$;
  }

  editListItem(id: string) {
    const idNum = +id;
    this.editService.pushListItemId(idNum);
  }

  addListItem(){
    this.editService.pushListItemId(0);
  }
}
