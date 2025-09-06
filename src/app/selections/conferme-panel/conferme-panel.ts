import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { ConfermeStore, LoadingState } from '../stores/conferme.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-conferme-panel',
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    DatePipe,
    MatIconModule,
    MatSortModule,
    MatButtonModule,
  ],
  templateUrl: './conferme-panel.html',
  styleUrl: './conferme-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfermePanel {
  readonly confermeStore = inject(ConfermeStore);

  displayedColumns: string[] = [
    'esameAmbulatorio.ambulatorio.descrizioneAmbulatorio',
    'esameAmbulatorio.esame.posizione.descrizionePosizione',
    'esameAmbulatorio.esame.descrizioneEsame',
    'esameAmbulatorio.esame.codiceMinisteriale',
    'esameAmbulatorio.esame.codiceInterno',
    'createdAt',
    'actions',
  ];

  /**
   * Reference to the Angular Material `MatSort` component, used to manage the sorting of rows in a table.
   * It is obtained via the `@ViewChild` decorator to allow access and manipulation of the sorting behavior within the component.
   */
  @ViewChild(MatSort)
  sort!: MatSort;

  LoadingState = LoadingState;

  onSortChange(sort: Sort) {
    const { active, direction } = sort;
    this.confermeStore.updateSort(active, direction);
  }

  onDelete(id: number) {
    this.confermeStore.removeConferma(id);
  }

  getConferme() {
    this.confermeStore.getConferme();
  }
}
