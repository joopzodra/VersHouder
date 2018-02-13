import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { User } from '../../models/user';

@Component({
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})

export class LoginFormComponent implements OnInit {
  userDenied = false;
  remoteError = false;
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private titleService: Title,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.loginForm = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {
    const title = this.route.snapshot.data['title'];
    this.titleService.setTitle(title);
  }

  onSubmit(formValue: User) {
    this.userDenied = false;
    this.remoteError = false;
    if (this.loginForm.invalid) {
      return
    }
    this.authService.login(formValue)
      // If login has succes, an 'auth=yes' cookie is set and user is navigated away from login component, so we don't need to handle the success case.
      .subscribe(
        () => { },
        (error: HttpErrorResponse) => {
          switch (error.error) {
            case 'unauth-user':
              this.alertUserDenied();
              break;
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
