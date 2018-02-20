import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DbManagerService } from '../services/db-manager.service';
import { ListItemsStore } from '../services/list-items.store';
import { PoetsListItem } from '../../models/list-items';

@Component({
  selector: 'jr-poets-list',
  templateUrl: './poets-list.component.html',
  styleUrls: ['./poets-list.component.scss']
})
export class PoetsListComponent implements OnInit {

  listItems$: Observable<PoetsListItem[]>;
  searching$: Observable<boolean>;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private dbManagerService: DbManagerService,
    private listItemsStore: ListItemsStore,
    private router: Router
  ) { }

  ngOnInit() {
    const title = this.route.snapshot.data['title'];
    this.titleService.setTitle(title);
    this.listItems$ = <Observable<PoetsListItem[]>>(this.listItemsStore.listItems$);
    this.searching$ = this.dbManagerService.searching$;
  }

  editPoet(id: string) {
    this.router.navigate(['/db-manager/edit'], {queryParams: {listType: 'poets', listItemId: id}});
  }
}
