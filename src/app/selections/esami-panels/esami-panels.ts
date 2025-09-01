import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListOption, MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-esami-panels',
  imports: [MatCardModule, MatSelectionList, MatListOption, MatButtonModule],
  templateUrl: './esami-panels.html',
  styleUrl: './esami-panels.css',
})
export class EsamiPanels {}
