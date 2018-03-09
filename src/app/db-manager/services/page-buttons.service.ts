import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { PageButtonsData } from '../../models/page-buttons-data'

@Injectable()
export class PageButtonsService {

  private show = new BehaviorSubject<PageButtonsData>({ showContainer: false, showPreviousButton: false, showNextButton: false });
  show$ = this.show.asObservable();

  private pageAction = new Subject<'previous' | 'next'>();
  pageAction$ = this.pageAction.asObservable();

  pushPageButtonsData(pageButtonsData: PageButtonsData) {
    this.show.next(pageButtonsData);
  }

  pushPageAction(pageAction: 'previous' | 'next') {
    this.pageAction.next(pageAction);
  }

}
