import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';

import { DbManagerService } from '../services/db-manager.service';
import { ListItemsStore } from '../services/list-items.store';
import { PoemsListItem } from '../../models/list-items';
import { EditService } from '../services/edit.service';
import { HideComponentsService } from '../services/hide-components.service';

/* The PoemsListComponent shows a list with poems.
 * It receives the poems from the ListItemsStore.
 * (Which poems it receives, is determined by the SearchComponent.)
 * It's showPoem method navigates the user to the PoemItemComponent, which will show the selected poem.
 * It hosts an EditComponent, to which it offers the listType property by an input binding.
 * It activates the EditComponent by it's addListItem method. (Editing a poem is handled by the PoemItemComponent.)
 */

@Component({
  templateUrl: './poems-list.component.html',
  styleUrls: ['./poems-list.component.scss']
})
export class PoemsListComponent implements OnInit {

  listItems$: Observable<PoemsListItem[]>;
  searching$: Observable<boolean>;
  remoteError$: Observable<number>
  searching: boolean;
  remoteError: number;
  listType = 'poems';
  hide$: Observable<boolean>;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private dbManagerService: DbManagerService,
    private listItemsStore: ListItemsStore,
    private router: Router,
    private editService: EditService,
    private hideComponentsService: HideComponentsService
  ) { }

  ngOnInit() {
    const title = this.route.snapshot.data['title'];
    this.titleService.setTitle(title);
    this.listItems$ = <Observable<PoemsListItem[]>>this.listItemsStore.listItems$;
    this.searching$ = this.dbManagerService.searching$;
    this.remoteError$ = this.dbManagerService.remoteError$;
    this.hide$ = this.hideComponentsService.hide$
  }

  showPoem(id: string) {
    this.router.navigate(['/db-manager/poems/poem', id]);
  }

  addListItem() {
    this.editService.pushListItemId(0);
  }

}
