import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';

import { EditService } from './services/edit.service';

/* The DbManagerComponent is the parentcomponent of:
 *  - the NavigationComponent,
 *  - the SearchComponent,
 *  - the routeroutlet (for the PoemsListComponent, PoetsListComponent and BundleListComponent).
 *  It retrieves the list type (poems, poets, bundles) from the router and passes it to the SearchComponent, so the SearchComponent knows on which types of columns the user can searched.
 */

@Component({
  templateUrl: './db-manager.component.html',
  styleUrls: ['./db-manager.component.scss'],
  providers: [EditService]
})
export class DbManagerComponent implements OnDestroy {

  routerSubscription: Subscription;
  listType: string; // 'poems' | 'poets' | 'bundles';

  constructor(
    private router: Router,
  ) {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
    )
      .subscribe(() => {
        const url = this.router.url;
        const urlListTypeSegment = url.split('/')[2]; // This segment is: 'poems', 'poets' or 'bundles'
        this.listType = urlListTypeSegment;
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

}
