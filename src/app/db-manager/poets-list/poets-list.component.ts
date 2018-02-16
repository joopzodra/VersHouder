import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DbManagerService } from '../services/db-manager.service';
import {PoetsListItem} from '../../models/list-items';

@Component({
  selector: 'jr-poets-list',
  templateUrl: './poets-list.component.html',
  styleUrls: ['./poets-list.component.scss']
})
export class PoetsListComponent implements OnInit {
  
  listItems$: Observable<PoetsListItem[]>;

  constructor(private titleService: Title, private route: ActivatedRoute, private dbManagerService: DbManagerService ) { }

  ngOnInit() {
    const title = this.route.snapshot.data['title'];
    this.titleService.setTitle(title);
    this.listItems$ = <Observable<PoetsListItem[]>>(this.dbManagerService.listItems$);
  }
}
