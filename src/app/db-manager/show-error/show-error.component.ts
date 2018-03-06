import { Component, Input, Optional } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

/* The ShowErrorComponent is used as child component on multiple places in the LoginComponent and SignupComponent. It checks the form constantly (due to Angular's change detection) on errors in respect to the form contstaints.
 * These constraint are defined in the form definitions in the LoginComponent and SignupComponent.
 * When errors occur, the ShowErrorComponent displays them in it's own template.
 */

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

  constructor(private formGroup: FormGroupDirective) { }

  get errorMessages(): string[] {
    const messages = [];
    const form: FormGroup = this.formGroup.form;
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
          case 'maxlength':
            message = `${this.displayName} mag maximaal ${error.requiredLength} tekens bevatten. (Bevat nu ${error.actualLength} tekens.)`;
            break;
          case 'pattern':
            if (this.controlPath === 'born' || this.controlPath === 'died' || this.controlPath === 'year') {
              message = `${this.displayName} moet uit vier cijfers bestaan.`;
            } else {
              message = ''; // Currently no else cases. Keeping if-else just for the case we once may need it some day.
              //message = `${this.displayName} mag geen spaties bevatten.`
            }
            break;
          case 'invalidUrl':
            message = `${this.displayName} moet een geldige URL bevatten.`;
            break;
        }
        messages.push(message);
      }
    }
    return messages;
  }
}
