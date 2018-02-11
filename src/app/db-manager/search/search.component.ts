import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable'

import { DbManagerService } from '../services/db-manager.service';

@Component({
  selector: 'jr-search-entries',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {  
  query = '';
  @Input() listType: string;
  searchForm: FormGroup;
  searchFormSubscription: Subscription;

  constructor(private dbManagerService: DbManagerService, private fb: FormBuilder) {
    this.searchForm = fb.group({
      searchFor: [this.defaultSearchFor],
      query: [''],
      maxItemsPerPage: ['']
    })
  }

  ngOnInit() {
   this.searchFormSubscription =  this.searchForm.valueChanges
      .debounceTime(200)
      .subscribe((formValue: { searchFor: string, query: string, maxItemsPerPage: string }) => this.dbManagerService.getListItems(this.listType, formValue)) // Toevoegen: this.offset, +this.maxListItems);
    this.searchForm.patchValue({ searchFor: this.defaultSearchFor() });
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

