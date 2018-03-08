import { Component } from '@angular/core';
import { Router } from '@angular/router';

/* The  Alert401Component is used by other components which can receive 401 http-errors from the backend.
 * The Alert401Component shows the user a modal dialog which alerts him the session is terminated and he must login again. The user must click the OK button in this dialog, and is then navigated to the login page.
 * A 401 http-error in the DbManager can occur on rare occassions. For example: the user has an edit form open, stops working for an hour and then resumes and submits the form to the backend, or starts a search with the ForeignKeySearchComponent.
 */

@Component({
  selector: 'jr-alert-401',
  templateUrl: './alert-401.component.html',
  styleUrls: ['./alert-401.component.scss']
})
export class Alert401Component {

  constructor(
    private router: Router
  ) { }

  hideAuthErrorMessage() {
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    this.router.navigate(['/auth/login']);
  }

}
