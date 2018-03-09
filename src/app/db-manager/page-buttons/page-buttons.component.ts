import { Component, OnInit } from '@angular/core';
import { PageButtonsService } from '../services/page-buttons.service';
import {PageButtonsData } from '../../models/page-buttons-data';

@Component({
  selector: 'jr-page-buttons',
  templateUrl: './page-buttons.component.html',
  styleUrls: ['./page-buttons.component.scss']
})
export class PageButtonsComponent implements OnInit {

  showContainer = false;
  showPreviousButton = false;
  showNextButton = false;

  constructor(
    private pageButtonService: PageButtonsService
    ) { }

  ngOnInit() {
    this.pageButtonService.show$
      .subscribe((data: PageButtonsData) => {
        this.showContainer = data.showContainer;
        this.showPreviousButton = data.showPreviousButton;
        this.showNextButton = data.showNextButton;
      })
  }

  previousPage() {
    this.pageButtonService.pushPageAction('previous')
  }

  nextPage() {
    this.pageButtonService.pushPageAction('next');
  }

}
