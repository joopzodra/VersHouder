import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../services/auth.service';

/* The UserBadgeAndLogoutComponent shows the username if a user is logged in. It also contains a logout button.
 * This component is exported by the AuthModule, so it can be used anywhere in the app. It is currently used as a child component in the HeaderComponent.
 * The UserBadgeAndLogoutComponent receives the username from the AuthService.
 * Clicking on the logout button triggers the AuthService's logout method.
 */

@Component({
  selector: 'jr-user-badge-and-logout',
  templateUrl: './user-badge-and-logout.component.html',
  styleUrls: ['./user-badge-and-logout.component.scss']
})
export class UserBadgeAndLogoutComponent implements OnInit {

  username: Observable<string> ;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.username = this.authService.username$
  }

  logout() {
    this.authService.logout();
  }
}
