import { Component, OnChanges, Input, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { debounceTime, tap } from 'rxjs/operators';

import { DbManagerService } from '../services/db-manager.service';

/* The SearchComponent offers a seach field (html input element) by which the user can search for listItems (poems, poets or bundles).
 * When the user types a search term, a query is sent to the DbManagerService's getListItems method.
 * The user can select in which column of the listItems table he wants to search (this value is set in the searchFor formcontrol).
 * The user can also select the maximum number of listItems per page.
 */

@Component({
  selector: 'jr-search-entries',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnChanges, OnDestroy, OnChanges {
  query = '';
  @Input() listType: string;
  searchForm: FormGroup;
  searchFormSubscription: Subscription;
  searching: EventEmitter<boolean>;

  constructor(private dbManagerService: DbManagerService, private fb: FormBuilder) {
    this.searchForm = fb.group({
      searchFor: [this.defaultSearchFor],
      query: [''],
      maxItemsPerPage: ['100']
    })
  }

  ngOnInit() {
    this.searchFormSubscription = this.searchForm.valueChanges
      .pipe(
        tap(() => this.dbManagerService.searchingStart()),
        debounceTime(300)
      )
      .subscribe((formValue: { searchFor: string, query: string, maxItemsPerPage: string }) => {
        this.dbManagerService.getListItems(this.listType, formValue);
      }); // Toevoegen: this.offset, +this.maxListItems);
    this.searchForm.patchValue({ searchFor: this.defaultSearchFor() });
  }

  ngOnChanges() {
    this.searchForm.reset({ searchFor: this.defaultSearchFor(), query: '', maxItemsPerPage: '100' });
  }

  defaultSearchFor() {
    switch (this.listType) {
      case 'poems':
        return 'poems.text';
      case 'poets':
        return undefined;
      case 'bundles':
        return 'bundles.title';
    }
  }

  ngOnDestroy() {
    this.searchFormSubscription.unsubscribe();
  }
}

