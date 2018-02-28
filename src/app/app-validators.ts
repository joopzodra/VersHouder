import { AbstractControl } from '@angular/forms';
const validUrl = require('valid-url');

export function urlValidator(control: AbstractControl): { [key: string]: any } {
  if (control.value === '' || validUrl.isWebUri(control.value)) {
    return null;
  }
  return { 'invalidUrl': true };
}

export function urlLabelValidator(formGroup: AbstractControl): { [key: string]: any } {
  const urlControl = formGroup.get('url');
  if (urlControl.value !== '' && urlControl.valid) {
    return null;
  }
  return { 'invalidUrlLabel': true };
}
