import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DbManagerService } from '../services/db-manager.service';
import {BundlesListItem} from '../../models/list-items';

@Component({
  selector: 'jr-bundles-list',
  templateUrl: './bundles-list.component.html',
  styleUrls: ['./bundles-list.component.scss']
})
export class BundlesListComponent implements OnInit {

  listItems$: Observable<BundlesListItem[]>;

  constructor(private titleService: Title, private route: ActivatedRoute, private dbManagerService: DbManagerService ) { }

  ngOnInit() {
    const title = this.route.snapshot.data['title'];
    this.titleService.setTitle(title);
    this.listItems$ = <Observable<BundlesListItem[]>>(this.dbManagerService.listItems$);
  }

}
