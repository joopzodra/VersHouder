import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DbManagerService } from '../services/db-manager.service';
import { ListItemsStore } from '../services/list-items.store';
import { BundlesListItem } from '../../models/list-items';
import { EditService } from '../services/edit.service';

/* The BundlesListComponent shows a list with bundles.
 * It receives the bundles from the ListItemsStore.
 * (Which bundles it receives, is determined by the SearchComponent.)
 * It hosts an EditComponent, to which it offers the listType property by an input binding.
 * It activates the EditComponent by it's editListItem and addListItem methods.
 */

@Component({
  selector: 'jr-bundles-list',
  templateUrl: './bundles-list.component.html',
  styleUrls: ['./bundles-list.component.scss']
})
export class BundlesListComponent implements OnInit {

  listItems$: Observable<BundlesListItem[]>;
  searching$: Observable<boolean>;
  remoteError$: Observable<number>
  listType = 'bundles';

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private dbManagerService: DbManagerService,
    private listItemsStore: ListItemsStore,
    private editService: EditService
  ) { }

  ngOnInit() {
    const title = this.route.snapshot.data['title'];
    this.titleService.setTitle(title);
    this.listItems$ = <Observable<BundlesListItem[]>>(this.listItemsStore.listItems$);
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
