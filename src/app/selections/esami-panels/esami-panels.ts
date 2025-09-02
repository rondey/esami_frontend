import { Component, inject, input, signal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { FiltersInterface } from '../models/filters-interface';
import { EsamiService } from '../services/esami-service';
import { EsameInterface } from '../models/esame-interface';
import { AmbulatorioInterface } from '../models/ambulatorio-interface';
import { PosizioneInterface } from '../models/posizione-interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-esami-panels',
  imports: [MatCardModule, MatSelectionList, MatListOption, MatButtonModule, ReactiveFormsModule],
  templateUrl: './esami-panels.html',
  styleUrl: './esami-panels.css',
})
export class EsamiPanels {
  private esamiService = inject(EsamiService);
  private formBuilder = inject(FormBuilder);

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

  esamiForm = this.formBuilder.group({
    // Id must have a min value of 1
    ambulatorioId: [0, Validators.required, Validators.min(1)],
    posizioneId: [0, Validators.required, Validators.min(1)],
    esameId: [0, Validators.required, Validators.min(1)],
  });

  // Load the ambulatori list, check the default values presence in the list and load the posizioni
  private getAmbulatori() {
    this.esamiService.getAmbulatori(this.filters()).subscribe({
      next: (ambulatori: AmbulatorioInterface[]) => {
        this.ambulatori.set(ambulatori);

        // Ensure that the ambulatorioId is present in the list, if not, set it to the first one of the list
        if (!ambulatori.some((ambulatorio) => ambulatorio.id === this.ambulatorioId())) {
          this.ambulatorioId.set(ambulatori[0].id);
        }

        // Load/Reload the posizioni.
        this.getPosizioni();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  // Load the posizioni list, check the default values presence in the list and load the esami
  private getPosizioni() {
    this.esamiService.getPosizioni(this.filters(), this.ambulatorioId()).subscribe({
      next: (posizioni: PosizioneInterface[]) => {
        this.posizioni.set(posizioni);

        // Ensure that the posizioneId is present in the list, if not, set it to the first one of the list
        if (!posizioni.some((posizione) => posizione.id === this.posizioneId())) {
          this.posizioneId.set(posizioni[0].id);
        }

        // Load/Reload the esami.
        this.getEsami();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  // Load the esami list and check the default values presence in the list
  private getEsami() {
    this.esamiService.getEsami(this.filters(), this.ambulatorioId(), this.posizioneId()).subscribe({
      next: (esami: EsameInterface[]) => {
        this.esami.set(esami);

        // Ensure that the esameId is present in the list, if not, set it to the first one of the list
        if (!esami.some((esame) => esame.id === this.esameId())) {
          this.esameId.set(esami[0].id);
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnInit() {
    // Set the default ids
    this.ambulatorioId.set(this.ambulatorioIdDefault());
    this.posizioneId.set(this.posizioneIdDefault());
    this.esameId.set(this.esameIdDefault());

    // This is unnecessary, since the ngOnChanges will trigger the getAmbulatori
    // this.getAmbulatori();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('OnChanges');
    for (const inputName in changes) {
      if (inputName === 'filters') {
        this.getAmbulatori();
        break;
      }
    }
  }

  onSubmit() {
    console.log('Submit', this.esamiForm.value);
  }
}
