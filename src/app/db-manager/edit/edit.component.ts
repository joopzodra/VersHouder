import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ListItem, PoemsListItem, PoetsListItem, BundlesListItem } from '../../models/list-items';
import { ListItemsStore } from '../services/list-items.store';
import { DbManagerService } from '../services/db-manager.service';
import { EditService } from '../services/edit.service';

/* The EditComponent offers the user a form to edit a poem, poet or bundle, or to create a new one.
 * The EditComponent is hosted by the PoemItemComponent, PoetsListComponent and BundlesComponent.
 * Which formfields the form contains, is determined by the listType input binding.
 * The EditComponent prefills the form with data it receives from the ListItemStore. This data is based on the id of the poem, poet or bundle which the EditComponent receives from the EditService.
 * If the id === 0, it means a new listItem must be added. When the id === 0 no listItem will be filtered out. In this case the EditComponent offer the user a blank form.
 */

@Component({
  selector: 'jr-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent /*implements OnInit, OnDestroy*/ {

  editForm: FormGroup;
  listItem: ListItem;
  _listType: string
  listItemId: number;
  listItemSubscription: Subscription;

  headerInfo = {
    'poems': 'Gedicht',
    'poets': 'Dichter',
    'bundles': 'Bundel'
  }

  @Input()
  set listType(listType: string) {
    this._listType = listType;
    this.buildForm(this.fb);
  };
  get listType(): string {
    return this._listType;
  }
  
 constructor(
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private fb: FormBuilder,
    private listItemsStore: ListItemsStore,
    private dbManagerService: DbManagerService,
    private location: Location,
    private editService: EditService
  ) { }

  ngOnInit() {
    const title = this.activatedRoute.snapshot.data['title'];
    this.titleService.setTitle(title);

    const id$ = this.editService.listItemId$;
    const listItem$ = this.listItemsStore.listItems$;
    this.listItemSubscription = combineLatest(id$, listItem$).subscribe(([id, listItems]) => {
      let listItem = listItems.filter(listItem => listItem.id === id)[0];
      if (!listItem) {
        listItem = this.newListItem();
      }
      this.editForm.patchValue(listItem);
      this.listItem = listItem;
    });
  }

  buildForm(fb: FormBuilder) {
    switch (this._listType) {
      case 'poems':
        this.editForm = fb.group({
          text: [''],
          title: [''],
          poetId: [],
          bundleId: [],
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
          year: [],
          poetId: []
        });
        break;
    }
  }

  newListItem(): ListItem {
    switch (this._listType) {
      case 'poems':
        return {text: ''}
      case 'poets':
        return {name: ''}
      case 'bundles':
        return {title: ''}
    }
  }

  onSubmit(formValue: any) {
    const editedItem = Object.assign(this.listItem, formValue);
    this.dbManagerService.editListItem(this.listType, editedItem);
    this.listItem = undefined;
  }

  hideForm() {
    this.listItem = undefined;
    return false;
  }

  ngOnDestroy() {
    this.listItemSubscription.unsubscribe();
  }
}


