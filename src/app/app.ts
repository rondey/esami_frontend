import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { Selections } from './selections/selections';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, Selections],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Esami');
}
