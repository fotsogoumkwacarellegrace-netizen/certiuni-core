import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [`
    :host { display: block; min-height: 100vh; }
  `]
})
export class App {
  protected readonly title = signal('CertiUni');
}