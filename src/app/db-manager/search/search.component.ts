import { Component, OnChanges, Input, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { debounceTime, tap, map } from 'rxjs/operators';

import { DbManagerService } from '../services/db-manager.service';
import { HideComponentsService } from '../services/hide-components.service';
import { PageButtonsService } from '../services/page-buttons.service';
import { ListItemsStore } from '../services/list-items.store';

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
  hide$: Observable<boolean>;
  maxItemsPerPage = 10;
  previousOffset = 0;
  offset = 0;
  itemsCount: number;
  pageButtonsVisible = false;

  constructor(
    private dbManagerService: DbManagerService,
    private fb: FormBuilder,
    private hideComponentsService: HideComponentsService,
    private pageButtonService: PageButtonsService,
    private listItemStore: ListItemsStore
  ) {
    this.searchForm = fb.group({
      searchFor: [this.defaultSearchFor],
      query: [''],
      maxItemsPerPage: ['10'],
      offset: ['0']
    })
  }

  ngOnInit() {
    this.searchFormSubscription = this.searchForm.valueChanges
      .pipe(
        tap(() => this.dbManagerService.searchingStart()),
        // Offset is different from previous offset if formvalue change is caused by pagination buttons.
        // In that case, keep offset in form value unchanged (only set previousOffset for next search). Otherwise reset offset because searchFor, query or maxItemsPerPage has changed and we want to get items with offset = 0.
        map((value: any) => {
          if (value.offset !== this.previousOffset) {
            this.previousOffset = this.offset;
            return value;
          } else {
            value.offset = this.offset = 0;
            return value;
          }
        }),
        debounceTime(300)
      )
      .subscribe((formValue: { searchFor: string, query: string, maxItemsPerPage: string, offset: string }) => {
        this.dbManagerService.getListItems(this.listType, formValue);
        this.maxItemsPerPage = +formValue.maxItemsPerPage;
      });
    this.searchForm.patchValue({ searchFor: this.defaultSearchFor() });

    this.listItemStore.listItems$.subscribe(items => {
      this.itemsCount = items.length;
      this.pushPageButtonsData(true);
    });

    this.hide$ = this.hideComponentsService.hide$;
    this.pageButtonService.pageAction$
      .subscribe((action: 'previous' | 'next') => {
        if (action === 'next') {
          this.nextPage();
        } else {
          this.previousPage();
        }
      });
  }

  ngOnChanges() {
    this.searchForm.reset({ searchFor: this.defaultSearchFor(), query: '', maxItemsPerPage: '10', offset: '0' });
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

  previousPage() {
    this.pushPageButtonsData(false);
    this.previousOffset = this.offset;
    this.offset -= this.maxItemsPerPage;
    this.searchForm.patchValue({ offset: this.offset });
  }

  nextPage() {
    this.pushPageButtonsData(false);
    this.previousOffset = this.offset;
    this.offset += this.maxItemsPerPage;
    this.searchForm.patchValue({ offset: this.offset });
  }

  pushPageButtonsData(showContainer: boolean) {
    const pageButtonsData = {
      showContainer: showContainer,
      showPreviousButton: this.offset ? true : false,
      showNextButton: this.itemsCount < this.maxItemsPerPage ? false : true
    };
    this.pageButtonService.pushPageButtonsData(pageButtonsData);
  }

  ngOnDestroy() {
    this.searchFormSubscription.unsubscribe();
  }
}

