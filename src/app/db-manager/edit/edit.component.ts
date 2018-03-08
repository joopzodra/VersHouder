import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';

import { ListItem, PoemsListItem, PoetsListItem, BundlesListItem } from '../../models/list-items';
import { ListItemsStore } from '../services/list-items.store';
import { DbManagerService } from '../services/db-manager.service';
import { EditService } from '../services/edit.service';
import { Poet, Bundle } from '../../models/foreign-key-children';
import { urlValidator, urlLabelValidator } from '../../app-validators';

/* The EditComponent offers the user a form to edit a poem, poet or bundle, or to create a new one.
 * The EditComponent is hosted by the PoemItemComponent, PoetsListComponent and BundlesComponent.
 * Which formfields the form contains, is determined by the listType input binding.
 * The EditComponent prefills the form with data it receives from the ListItemStore. This data is based on the id of the poem, poet or bundle which the EditComponent receives from the EditService.
 * If the id === 0, it means a new listItem must be added. When the id === 0 no listItem will be filtered out. In this case the EditComponent offer the user a blank form.
 * If the id === -1, it means the form must be hidden. The id === -1 is triggered by the EditComponent itself, by its onSubmit method.
 */

@Component({
  selector: 'jr-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  editForm: FormGroup;
  listItem: ListItem;
  listItemSubscription: Subscription;
  headerInfo = {
    'poems': 'Gedicht',
    'poets': 'Dichter',
    'bundles': 'Bundel'
  }
  askDeleteConfirmationDisplay = 'none';
  remoteError = false;
  authError = false;

  _listType: string;
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
    private editService: EditService,
    private router: Router
  ) { }

  ngOnInit() {
    const title = this.activatedRoute.snapshot.data['title'];
    this.titleService.setTitle(title);

    const id$ = this.editService.listItemId$;
    const listItems$ = this.listItemsStore.listItems$;
    this.listItemSubscription = combineLatest(id$, listItems$).subscribe(([id, listItems]) => {
      if (id === -1) {
        this.hideForm()
        return;
      }
      if (id === 0) {
        this.listItem = this.newListItem();
      } else {
        this.listItem = listItems.filter(listItem => listItem.id === id)[0];
      }
      this.editForm.patchValue(this.listItem);
    });
  }

  buildForm(fb: FormBuilder) {
    switch (this.listType) {
      case 'poems':
        this.editForm = fb.group({
          text: ['', [Validators.maxLength(30000), Validators.required]],
          title: '',
          poet_id: '',
          poet_name: '',
          bundle_id: '',
          bundle_title: '',
          url: ['', urlValidator],
          url_label: '',
          comment: ''
        },
          { validator: urlLabelValidator }
        );
        break;
      case 'poets':
        this.editForm = fb.group({
          name: ['', Validators.required],
          born: ['', Validators.pattern(/^\d{4}$/)],
          died: ['', Validators.pattern(/^\d{4}$/)]
        });
        break;
      case 'bundles':
        this.editForm = fb.group({
          title: ['', Validators.required],
          year: ['', Validators.pattern(/^\d{4}$/)],
          poet_id: '',
          poet_name: ''
        });
        break;
    }
  }

  newListItem(): ListItem {
    // Returns an empty listItem
    switch (this.listType) {
      case 'poems':
        return { text: '' }
      case 'poets':
        return { name: '' }
      case 'bundles':
        return { title: '' }
    }
  }

  onSubmit(formValue: any) {
    const editedItem = Object.assign(this.listItem, formValue);
    this.dbManagerService.createOrUpdateListItem(this.listType, editedItem)
      .subscribe(
        succes => this.editService.pushListItemId(-1),
        error => this.handleError(error)
      );
  }

  hideRemoteErrorMessage() {
    this.remoteError = false;
  }

  hideForm() {
    this.listItem = undefined;
    this.editForm.reset();
    return false;
  }

  askDeleteConfirmation() {
    this.askDeleteConfirmationDisplay = 'block';
    return false;
  }

  hideDeleteConfirmation() {
    this.askDeleteConfirmationDisplay = 'none';
  }

  deleteListItem() {
    this.dbManagerService.deleteListItem(this.listType, this.listItem)
      .subscribe(
        succes => this.editService.pushListItemId(-1),
        error => this.handleError(error)
      );
    return false;
  }

  handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.status === 401) {
      this.authError = true;
    }
    else {
      this.remoteError = true;
    }
  }

  // onForeignKeyChange is triggered by the ForeignKeySearch child components.
  onForeignKeyChange(event: Poet | Bundle) {
    function isTypePoet(value: Poet | Bundle): value is Poet {
      return value.hasOwnProperty('name')
    }
    if (isTypePoet(event)) {
      this.editForm.patchValue({
        poet_id: event.id,
        poet_name: event.name
      })
    } else {
      this.editForm.patchValue({
        bundle_id: event.id,
        bundle_title: event.title
      })
    }
  }

  ngOnDestroy() {
    this.listItemSubscription.unsubscribe();
  }
}
