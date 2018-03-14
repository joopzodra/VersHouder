import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/**
 * EditService handles the interaction between the PoemItemComponent, PoetsListComponent, BundlesListComponent and the EditComponent.
 * It receives the id of the listitem that the EditComponent should handle from the PoemItemComponent, PoetsListComponent or BundlesListComponent, and sends it to the EditComponent. 
 * The EditService is provided by the DbManagerComponent, so only available to that component and its children.
 */

@Injectable()
export class EditService {

  private _listItemId = new Subject<number>();
  listItemId$ = this._listItemId.asObservable();

  pushListItemId(id: number) {
    this._listItemId.next(id);
  }
}
