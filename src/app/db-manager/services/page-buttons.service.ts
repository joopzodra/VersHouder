import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { PageButtonsData } from '../../models/page-buttons-data'

/**
 * The PageButtonsService handles the communication from the SearchComponent to the PageButtonsComponent.
 * It receives data about which page buttons to show or hide from the SearchComponent and pushes these to the PageButtonsComponent.
 */

@Injectable()
export class PageButtonsService {

  private show = new BehaviorSubject<PageButtonsData>({ showContainer: false, showPreviousButton: false, showNextButton: false });
  show$ = this.show.asObservable();

  private pageAction = new Subject<'previous' | 'next'>();
  pageAction$ = this.pageAction.asObservable();

  private cachedData: PageButtonsData;

  pushPageButtonsData(pageButtonsData: PageButtonsData) {
    this.show.next(pageButtonsData);
    this.cachedData = pageButtonsData;
  }

  pushPageAction(pageAction: 'previous' | 'next') {
    this.pageAction.next(pageAction);
  }

  pushPageButtonsHide(hide: boolean) {
    this.show.next({
      showContainer: !hide,
      showPreviousButton: this.cachedData.showPreviousButton,
      showNextButton: this.cachedData.showNextButton
    })
  }

}
