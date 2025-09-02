import { Component, inject, input, signal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { FiltersInterface } from '../models/filters-interface';
import { EsamiService } from '../services/esami-service';
import { EsameInterface } from '../models/esame-interface';
import { AmbulatorioInterface } from '../models/ambulatorio-interface';
import { PosizioneInterface } from '../models/posizione-interface';

@Component({
  selector: 'app-esami-panels',
  imports: [MatCardModule, MatSelectionList, MatListOption, MatButtonModule],
  templateUrl: './esami-panels.html',
  styleUrl: './esami-panels.css',
})
export class EsamiPanels {
  private esamiService = inject(EsamiService);
  filters = input.required<FiltersInterface>();

  ambulatorioIdDefault = input.required<number>();
  posizioneIdDefault = input.required<number>();
  esameIdDefault = input.required<number>();

  ambulatorioId = signal<number>(0);
  posizioneId = signal<number>(0);
  esameId = signal<number>(0);

  ambulatori = signal<AmbulatorioInterface[]>([]);
  posizioni = signal<PosizioneInterface[]>([]);
  esami = signal<EsameInterface[]>([]);

  // TODO: Define the form

  private getAmbulatori() {
    this.esamiService.getAmbulatori(this.filters()).subscribe({
      next: (ambulatori: AmbulatorioInterface[]) => {
        this.ambulatori.set(ambulatori);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private getPosizioni() {
    this.esamiService.getPosizioni(this.filters(), this.ambulatorioId()).subscribe({
      next: (posizioni: PosizioneInterface[]) => {
        this.posizioni.set(posizioni);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private getEsami() {
    this.esamiService.getEsami(this.filters(), this.ambulatorioId(), this.posizioneId()).subscribe({
      next: (esami: EsameInterface[]) => {
        this.esami.set(esami);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnInit() {
    //TODO: on ambulatorio/posizione/esame change, reload the remaining lists and update the form
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const inputName in changes) {
      const inputValues = changes[inputName];
      switch (inputName) {
        case 'ambulatorioIdDefault':
          this.ambulatorioId.set(inputValues.currentValue);
          break;
        case 'posizioneIdDefault':
          this.posizioneId.set(inputValues.currentValue);
          break;
        case 'esameIdDefault':
          this.esameId.set(inputValues.currentValue);
          break;
        case 'filters':
          this.getAmbulatori();
          break;
      }
    }
  }
}
