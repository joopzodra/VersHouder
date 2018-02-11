import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../services/auth.service';

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
