import { Component } from '@angular/core';

@Component({
  selector: 'jr-root',
  template: `
    <jr-header></jr-header>
    <router-outlet></router-outlet>
    `
})
export class AppComponent {
}
