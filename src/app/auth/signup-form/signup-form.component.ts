import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { User } from '../../models/user';

/* The SignupFormComponent creates a signup form.
 * On submit it calls the AuthService signup method with the formvalue as argument.
 * In the template it uses the ShowErrorComponent to show error messages when the formvalue constraints are not met.
 */

@Component({
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent {

  duplicateUsername = false;
  remoteError = false;
  signupForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { 
    this.signupForm = fb.group({
      username: ['', [Validators.minLength(4), Validators.maxLength(15), Validators.pattern('[A-Za-z0-9]+')]],
      password: ['', [Validators.minLength(4), Validators.maxLength(15), Validators.pattern('[^ ]+')]]
    })
  }

  ngOnInit() {
    const title = this.route.snapshot.data['title'];
    this.titleService.setTitle(title);
  }

  onSubmit(formValue: User) {
    if (this.signupForm.invalid) {
      return;
    }
    this.authService.signup(formValue)
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
