import { AbstractControl } from '@angular/forms';
declare var require: (filename: string) => any;
const validUrl = require('valid-url');

export function urlValidator(control: AbstractControl): { [key: string]: any } {
  if (!control.value || control.value === '' || validUrl.isWebUri(control.value)) {
    return null;
  }
  return { 'invalidUrl': true };
}

export function urlLabelValidator(formGroup: AbstractControl): { [key: string]: any } {
  const urlControl = formGroup.get('url');
  const urlLabelControl = formGroup.get('url_label');
  if (!urlLabelControl.value || urlLabelControl.value === '') {
    return null;
  } else {
    if (urlControl.value !== '' && urlControl.valid) {
      return null;
    }
    return { 'invalidUrlLabel': true };
  }

}
