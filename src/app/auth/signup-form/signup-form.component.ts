import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { User } from '../../models/user';

@Component({
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent {

  duplicateUsername = false;
  remoteError = false;
  @ViewChild('signupForm') signupForm: NgForm;

  constructor(private authService: AuthService, private router: Router, private titleService: Title, private route: ActivatedRoute) { }

  ngOnInit() {
    const title = this.route.snapshot.data['title'];
    this.titleService.setTitle(title);
  }

  onSubmit() {
    this.authService.signup(this.signupForm.value)
      // If login has succes, user is navigated to login component, so we don't need to handle the success case.
      .subscribe(() => { }, (error: HttpErrorResponse) => {
        switch (error.error) {
          case 'username-already-exists':
            this.alertDuplicateUsername();
            break;
          case 'remote-error':
            this.alertRemoteError();
            break;
          default:
            this.alertRemoteError();
        }
      });
  }

  alertDuplicateUsername() {
    this.duplicateUsername = true;
    this.signupForm.reset();
  }

  alertRemoteError() {
    this.remoteError = true;
  }

}
