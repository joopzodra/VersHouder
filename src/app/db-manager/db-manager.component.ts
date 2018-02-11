import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './db-manager.component.html'
})
export class DbManagerComponent implements OnInit, OnDestroy {

  routerSubscription: Subscription;
  listType: string; // 'poems' | 'poets' | 'bundles'

  constructor(private router: Router) {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => {
        const url = this.router.url;
        const urlLastSegment = url.split('/db-manager/')[1];
        this.listType = urlLastSegment;
      });
   }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

}
