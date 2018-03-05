import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/* The HideComponentService handles hiding or displaying the SearchComponent and the ListItem components (PoemsListComponent, PoetsListComponent and BundlesListComponent).
 * We want these component to be hidden when the PoemItemComponent or the EditComponent is displayed. 
 * The HideComponentService offers an Observable<boolean> which can be consumed by *ngIf directives.
 */

@Injectable()
export class HideComponentsService {

  private hide = new BehaviorSubject<boolean>(false);
  hide$ = this.hide.asObservable();

  pushHide(hide: boolean) {
    this.hide.next(hide);
  }
}
