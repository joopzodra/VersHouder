import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpErrorResponse } from '@angular/common/http';

import { Poet, Bundle } from '../../models/foreign-key-children';
import { DbManagerService } from '../services/db-manager.service';

/**
 * The ForeignKeySearchComponent searches poets or bundles in the backend database to be consumend as children by PoemListItems or BundleListItems. These children are used to set new foreign keys for poets or bundles when the user changes these on a ListItem.
 * When the user types a search query in the input field, the component receives corresponding children – poets or bundles. The user can select one of these to be consumed by the EditComponent.
 * PoemListItems get the author's name and the bundle's title from separate tables in the backend. The same holds for BundleListItems' author's names. Therefore we need this separate search.
 * By keeping author's names and the bundle's titles in separate tables, we don't get accidentally duplicate but misspelled names or titles.
 * If ForeignKeySearchComponent is passed a foreignKey by its parent, it retreives the corresponding child from the backend database and sets it as the selectedChild. This causes the form input to be hidden and no showing of suggestedChildren.
 */

@Component({
  selector: 'jr-foreign-key-search',
  templateUrl: './foreign-key-search.component.html',
  styleUrls: ['./foreign-key-search.component.scss']
})
export class ForeignKeySearchComponent implements OnInit {

  @Input() foreignKeyType: string;
  @Input() foreignKey: number;
  @Output() onForeignKeyChange = new EventEmitter<Poet | Bundle>();
  searchChildForm: FormGroup;
  suggestedChildren$: Observable<Poet[] | Bundle[]>;
  selectedChild: Poet | Bundle;
  dbError = false;
  authError = false;
  showSearch = false;

  constructor(
    private fb: FormBuilder,
    private dbManagerService: DbManagerService
  ) {
    this.searchChildForm = fb.group({
      query: ['']
    });
  }

  ngOnInit() {
    if (this.foreignKey) {
      this.dbManagerService.findChildById(this.foreignKeyType, this.foreignKey)
        .pipe(
          tap(() => this.dbError = false)
        )
        .subscribe(
          child => this.selectedChild = child,
          error => this.handleError(error)
        );
    }
    this.suggestedChildren$ = this.searchChildForm.valueChanges
      .pipe(
        tap(() => this.dbError = false),
        switchMap(value => {
          if (value.query === '') {
            return of(<any>[]);
          }
          return this.dbManagerService.queryChildren(this.foreignKeyType, value.query)
        }),
        catchError(error => {
          this.handleError(error);
          return of([]);
        })
      );
  }

  handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.status === 401) {
      this.authError = true;
    }
    else {
      this.dbError = true;
    }
  }

  showChild(child: Poet | Bundle) {
    function isTypePoet(value: Poet | Bundle): value is Poet {
      return value.hasOwnProperty('name')
    }
    if (isTypePoet(child)) {
      return child.name + (child.born ? ' (' + child.born : '') + (child.died ? ' – ' + child.died : '') + (child.born ? ')' : '');
    } else {
      return child.title + (child.year ? ' (' + child.year + ')' : '');
    }
  }

  selectChild(child: Poet | Bundle) {
    this.onForeignKeyChange.emit(child);
    this.selectedChild = child;
    this.hideSearchInput();
  }

  removeSelectedChild() {
    this.selectedChild = undefined;
    this.showSearch = true;
  }

  showSearchInput() {
    this.showSearch = true;
  }

  hideSearchInput() {
    this.showSearch = false;
    this.searchChildForm.setValue({query: ''});
  }
}
