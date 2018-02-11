import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})

export class LoginFormComponent implements OnInit {

  userDenied = false;
  remoteError = false;
  @ViewChild('loginForm') loginForm: NgForm;

  constructor(private authService: AuthService, private titleService: Title, private route: ActivatedRoute) { }

  ngOnInit() {
    const title = this.route.snapshot.data['title'];
    this.titleService.setTitle(title);
  }

  onSubmit() {
    this.userDenied = false;
    this.remoteError = false;
    if (this.loginForm.invalid) {
      return
    }
    this.authService.login(this.loginForm.value)
      // If login has succes, user cookie is set and user is navigated away from login component, so we don't need to handle the success case.
      .subscribe(res => {
        switch (res) {
          case 'unauth-user':
            this.alertUserDenied();
            break;
        }
      },
      (error: HttpErrorResponse) => {
        switch (error.error) {
          case 'remote-error':
            this.alertRemoteError();
            break;
          default:
            this.alertRemoteError();
        }
      });
  }

  alertUserDenied() {
    this.userDenied = true;
    this.loginForm.reset();
  }

  alertRemoteError() {
    this.remoteError = true;
  }
}
