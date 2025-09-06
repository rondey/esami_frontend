import { Component, HostListener, inject, input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  imports: [MatToolbarModule],
})
export class NavComponent {
  name = input<string>();

  scrolled = false;

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 0;
  }
}
