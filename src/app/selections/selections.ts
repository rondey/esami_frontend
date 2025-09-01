import { Component } from '@angular/core';
import { FiltersPanel } from './filters-panel/filters-panel';

@Component({
  selector: 'app-selections',
  imports: [FiltersPanel],
  templateUrl: './selections.html',
  styleUrl: './selections.css',
})
export class Selections {}
