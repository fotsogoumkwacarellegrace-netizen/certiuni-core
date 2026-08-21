import { Component, signal } from '@angular/core';
import { VerifyComponent } from './components/verify.component/verify.component';


@Component({
  selector: 'app-root',
  imports: [VerifyComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecran1');
}
