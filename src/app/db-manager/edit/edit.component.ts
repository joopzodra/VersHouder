import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { Subscription } from 'rxjs/Subscription';
import { filter, map } from 'rxjs/operators';

import { ListItem, PoemsListItem, PoetsListItem, BundlesListItem } from '../../models/list-items';
import { ListItemsStore } from '../services/list-items.store';

@Component({
  selector: 'jr-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  header: string;
  editForm: FormGroup;
  listItem: ListItem;
  listType: string;
  listItemId: number;
  listItemsStoreSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private listItemsStore: ListItemsStore
  ) {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.listType = queryParams.listType;
    // When typing an url manually the listType query parameter could be omitted. Without listType we cannot build the form, so navigate the user away to root.
    if (this.listType === undefined) {
      this.router.navigate(['/']);
    }
    this.listItemId = +queryParams.listItemId;
    this.buildForm(fb);
  }

  ngOnInit() {
    //this.editForm.valueChanges.subscribe(val => console.log(val));
    this.listItemsStoreSubscription = this.listItemsStore.listItems$
      .pipe(
        map((listItems: ListItem[]) => listItems.filter(listItem => listItem.id === this.listItemId)[0])
      )
      .subscribe(listItem => {
        this.listItem = listItem; console.log(listItem)
        if (this.listItem === undefined) {
          return;
        }
        this.editForm.patchValue(listItem);
      });
  }

  buildForm(fb: FormBuilder) {
    switch (this.listType) {
      case 'poems':
        this.editForm = fb.group({
          text: [''],
          title: [''],
          poetId: 0,
          bundleId: 0,
          url: [''],
          comment: ['']
        });
        break;
      case 'poets':
        this.editForm = fb.group({
          name: [''],
          born: [],
          died: []
        });
        break;
      case 'bundles':
        this.editForm = fb.group({
          title: [''],
          year: 0,
          poetId: 0
        });
        break;
    }
  }

  hideForm() {

  }

  ngOnDestroy() {
    // When typing an url manually the listType query parameter could be omitted. Then the user navigates away, before the listItemSubscription has been set. To prevent an error, we check if the listItemSubscription has been set before we unsubscribe.
    if (this.listItemsStoreSubscription) {
      this.listItemsStoreSubscription.unsubscribe();
    }
  }
}


