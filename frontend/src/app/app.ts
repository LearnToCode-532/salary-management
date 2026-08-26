import {
  Component,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-root',

  imports: [
    RouterOutlet,
    RouterLink
  ],

  templateUrl: './app.html',

  styleUrl: './app.scss'
})
export class App {

  protected readonly title =
    signal('frontend');

  constructor(
    private readonly router: Router
  ) {}

  isDashboard(): boolean {
    return this.router.url === '/'
      || this.router.url === '/dashboard';
  }

  isEmployees(): boolean {
    return this.router.url.startsWith(
      '/employees'
    );
  }

}