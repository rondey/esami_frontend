import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { ConfermeStore } from '../stores/conferme.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-conferme-panel',
  imports: [MatTableModule, MatProgressSpinnerModule, DatePipe, MatIconModule, MatSortModule],
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

  @ViewChild(MatSort) sort!: MatSort;

  onSortChange(sort: Sort) {
    const { active, direction } = sort;
    this.confermeStore.updateSort(active, direction);
  }

  onDelete(id: number) {
    this.confermeStore.removeConferma(id);
  }
}
