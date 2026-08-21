import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';
import { TopbarComponent } from './components/topbar/topbar';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,SidebarComponent , TopbarComponent ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'CertiUni';
}