import { Component, OnInit } from '@angular/core';
import { PageButtonsService } from '../services/page-buttons.service';
import {PageButtonsData } from '../../models/page-buttons-data';

/**
 * The PageButtonsComponent displays the page buttons below the list items table.
 * It should only show the Next button if there are as many items in the list as the maximum items per page that the user has indicated.
 * It should only show the Previous button if there are previous pages.
 * It receives the data on these issues from the SearchComponent by the intermediair PageButtonService.
 */

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
