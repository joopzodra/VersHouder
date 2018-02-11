import { Component, Input, Optional } from '@angular/core';
import { NgForm, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'jr-show-error',
  template: `
    <div *ngIf="errorMessages" class="w3-panel w3-yellow">
      <div *ngFor="let errorMessage of errorMessages">                  
        {{errorMessage}}                         
      </div>                          
    </div>
    `
})
export class ShowErrorComponent {
  @Input('path') controlPath: string;
  @Input('text') displayName = '';

  constructor(private ngForm: NgForm) { }

  get errorMessages(): string[] {
    const messages = [];
    const form: FormGroup = this.ngForm.form;
    const control = form.get(this.controlPath);
    if (!control || !(control.touched) || !control.errors) {
      return undefined;
    }
    for (const code in control.errors) {
      if (control.errors.hasOwnProperty(code)) {
        const error = control.errors[code];
        let message = '';
        switch (code) {
          case 'required':
            message = `${this.displayName} is niet ingevuld.`;
            break;
          case 'minlength':
            message = `${this.displayName} moet minstens ${error.requiredLength} tekens bevatten.`;
            break;
          case 'maxlength':
            message = `${this.displayName} mag maximaal ${error.requiredLength} tekens bevatten. (Bevat nu ${error.actualLength} tekens.)`;
            break;
          case 'pattern':
            if (this.controlPath === 'username') {
              message = `${this.displayName} mag alleen letters of cijfers bevatten.`
            } else {
              message = `${this.displayName} mag geen spaties bevatten.`
            }
            break;
        }
        messages.push(message);
      }
    }
    return messages;
  }
}
