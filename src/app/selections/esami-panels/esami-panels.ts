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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-esami-panels',
  imports: [
    MatCardModule,
    MatSelectionList,
    MatListOption,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
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

  ambulatori = signal<AmbulatorioInterface[]>([]);
  posizioni = signal<PosizioneInterface[]>([]);
  esami = signal<EsameInterface[]>([]);

  esamiForm = this.formBuilder.group({
    ambulatorioId: this.formBuilder.control<number[] | null>(null, {
      validators: Validators.required,
    }),
    posizioneId: this.formBuilder.control<number[] | null>(null, {
      validators: Validators.required,
    }),
    esameId: this.formBuilder.control<number[] | null>(null, { validators: Validators.required }),
  });

  isAmbulatoriLoading = signal<boolean>(true);
  isPosizioniLoading = signal<boolean>(true);
  isEsamiLoading = signal<boolean>(true);

  // Drop the lists, load the ambulatori list, check the default values presence in the list and load the posizioni
  private getAmbulatori() {
    // All the ambulatori, posizioni and esami lists must be dropped before the new ones are loaded
    this.ambulatori.set([]);
    this.posizioni.set([]);
    this.esami.set([]);

    // Accordingly, the default values must be set to null
    this.esamiForm.patchValue({
      ambulatorioId: null,
      posizioneId: null,
      esameId: null,
    });

    this.isAmbulatoriLoading.set(true);
    this.isPosizioniLoading.set(true);
    this.isEsamiLoading.set(true);

    this.esamiService.getAmbulatori(this.filters()).subscribe({
      next: (ambulatori: AmbulatorioInterface[]) => {
        this.ambulatori.set(ambulatori);

        // Ensure that the ambulatorioId is present in the list, if not, set it to the first one of the list
        const id = this.esamiForm.value.ambulatorioId?.[0];
        if (!ambulatori.some((a) => a.id === id)) {
          this.esamiForm.patchValue({
            ambulatorioId: ambulatori.length > 0 ? [ambulatori[0].id] : null,
          });
        }

        // Load/Reload the posizioni.
        this.getPosizioni();
      },
      error: (error) => {
        console.error(error);

        this.isPosizioniLoading.set(false);
        this.isEsamiLoading.set(false);
      },
      complete: () => {
        this.isAmbulatoriLoading.set(false);
      },
    });
  }

  // Load the posizioni list, check the default values presence in the list and load the esami
  private getPosizioni() {
    const ambulatorioId = this.esamiForm.value.ambulatorioId?.[0];
    if (!ambulatorioId) return;

    this.esamiService.getPosizioni(this.filters(), ambulatorioId).subscribe({
      next: (posizioni: PosizioneInterface[]) => {
        this.posizioni.set(posizioni);

        // Ensure that the posizioneId is present in the list, if not, set it to the first one of the list
        const id = this.esamiForm.value.posizioneId?.[0];
        if (!posizioni.some((p) => p.id === id)) {
          this.esamiForm.patchValue({
            posizioneId: posizioni.length > 0 ? [posizioni[0].id] : null,
          });
        }

        // Load/Reload the esami.
        this.getEsami();
      },
      error: (error) => {
        console.error(error);

        this.isEsamiLoading.set(false);
      },
      complete: () => {
        this.isPosizioniLoading.set(false);
      },
    });
  }

  // Load the esami list and check the default values presence in the list
  private getEsami() {
    const ambulatorioId = this.esamiForm.value.ambulatorioId?.[0];
    const posizioneId = this.esamiForm.value.posizioneId?.[0];

    if (!ambulatorioId || !posizioneId) return;

    this.esamiService.getEsami(this.filters(), ambulatorioId, posizioneId).subscribe({
      next: (esami: EsameInterface[]) => {
        this.esami.set(esami);

        // Ensure that the esameId is present in the list, if not, set it to the first one of the list
        const id = this.esamiForm.value.esameId?.[0];
        if (!esami.some((e) => e.id === id)) {
          this.esamiForm.patchValue({ esameId: esami.length > 0 ? [esami[0].id] : null });
        }
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.isEsamiLoading.set(false);
      },
    });
  }

  ngOnInit() {
    // Set the default ids
    this.esamiForm.patchValue({
      ambulatorioId: [this.ambulatorioIdDefault()],
      posizioneId: [this.posizioneIdDefault()],
      esameId: [this.esameIdDefault()],
    });

    // This is unnecessary, since the ngOnChanges will trigger the getAmbulatori
    // this.getAmbulatori();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const inputName in changes) {
      if (inputName === 'filters') {
        this.getAmbulatori();
        break;
      }
    }
  }

  isFieldInvalid(control: keyof typeof this.esamiForm.controls): boolean {
    const c = this.esamiForm.controls[control];
    return c.invalid && c.touched;
  }

  onSubmit() {
    this.esamiForm.markAllAsTouched();
    console.log('Submit', this.esamiForm.value);
  }
}
