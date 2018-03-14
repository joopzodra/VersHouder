import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { map, tap } from 'rxjs/operators';

import { PoemsListItem } from '../../models/list-items';
import { ListItemsStore } from '../services/list-items.store';
import { EditService } from '../services/edit.service';
import { HideComponentsService } from '../services/hide-components.service';

/**
 * The PoemItemComponent shows the full text of a poem and some more info about the poem.
 * It receives the poem from the ListItemsStore.
 * (Which poem it receives, is determined by the route params.)
 * It hosts an EditComponent, to which it offers the listType property by an input binding.
 * It activates the EditComponent by it's editListItem method. (Adding a poem is handled by the PoemsListComponent.)
 */

@Component({
  templateUrl: './poem-item.component.html',
  styleUrls: ['./poem-item.component.scss']
})
export class PoemItemComponent implements OnInit, OnDestroy {

  listItemsStoreSubscription: Subscription;
  poemItem$: Observable<PoemsListItem>;
  poemsListItemId: number;
  listType = 'poems';

  constructor(
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private listItemsStore: ListItemsStore,
    private location: Location,
    private editService: EditService,
    private router: Router,
    private hideComponentsService: HideComponentsService
  ) {
    const paramsId = this.activatedRoute.snapshot.params.id;
    this.poemsListItemId = +paramsId;
    this.hideComponentsService.pushHide(true);
  }

  ngOnInit() {
    const title = this.activatedRoute.snapshot.data['title'];
    this.titleService.setTitle(title);
    this.poemItem$ = this.listItemsStore.listItems$
      .pipe(
        map((poemsListItems: PoemsListItem[]) => poemsListItems.filter(poemItem => poemItem.id === this.poemsListItemId)[0]),
        tap(poemItem => {
          // When the user navigates by the browser's adressbar, the app doesn't always have the requested poem in the ListItemStore. In such case, navigate to the PoemsList.
          if (!poemItem) {
            this.router.navigate(['/db-manager/poems']);
          }
        })
      );
  }

  hidePoemItem() {
    this.location.back();
  }

  editListItem(id: string) {
    const idNum = +id;
    this.editService.pushListItemId(idNum);
  }

  ngOnDestroy() {
    this.hideComponentsService.pushHide(false);
  }
}
