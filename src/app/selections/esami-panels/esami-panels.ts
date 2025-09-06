import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  SimpleChanges,
} from '@angular/core';
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
import { finalize } from 'rxjs';
import { NotificationsService, NotificationType } from '../../services/notifications-service';
import { ConfermeStore, LoadingState } from '../stores/conferme.store';

enum Category {
  Ambulatori = 'ambulatori',
  Posizioni = 'posizioni',
  Esami = 'esami',
}

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EsamiPanels {
  private readonly esamiService = inject(EsamiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly notificationsService = inject(NotificationsService);

  // Not private because the loading state is used in the template
  readonly confermeStore = inject(ConfermeStore);

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

  // Necessary only for the template that needs the LoadingState type
  LoadingState = LoadingState;

  // Utility for the get functions that drops the list and show the loading spinner
  private resetAndShowLoading(category: Category) {
    switch (category) {
      case Category.Ambulatori:
        this.ambulatori.set([]);
        this.isAmbulatoriLoading.set(true);
        break;
      case Category.Posizioni:
        this.posizioni.set([]);
        this.isPosizioniLoading.set(true);
        break;
      case Category.Esami:
        this.esami.set([]);
        this.isEsamiLoading.set(true);
        break;
    }
  }

  // Drop the lists, load the ambulatori list, check the default values presence in the list and load the posizioni
  private getAmbulatori() {
    // All the ambulatori, posizioni and esami lists must be dropped before the new ones are loaded
    this.resetAndShowLoading(Category.Ambulatori);
    this.resetAndShowLoading(Category.Posizioni);
    this.resetAndShowLoading(Category.Esami);

    this.esamiService
      .getAmbulatori(this.filters())
      .pipe(
        finalize(() => {
          this.isAmbulatoriLoading.set(false);
        })
      )
      .subscribe({
        next: (ambulatori: AmbulatorioInterface[]) => {
          this.ambulatori.set(ambulatori);

          // Ensure that the ambulatorioId is present in the list, if not, set it to the first one of the list
          const id = this.esamiForm.value.ambulatorioId?.[0];
          if (!ambulatori.some((a) => a.id === id)) {
            this.esamiForm.patchValue({
              ambulatorioId: ambulatori.length > 0 ? [ambulatori[0].id] : null,
            });
            // KEEP NOTE: Don't need to launch the getPosizioni function, it will be called by the change event
          } else {
            // Load/Reload the posizioni
            this.getPosizioni();
          }
        },
        error: (_) => {
          this.isPosizioniLoading.set(false);
          this.isEsamiLoading.set(false);
        },
      });
  }

  // Load the posizioni list, check the default values presence in the list and load the esami
  private getPosizioni() {
    // All the posizioni and esami lists must be dropped before the new ones are loaded
    this.resetAndShowLoading(Category.Posizioni);
    this.resetAndShowLoading(Category.Esami);

    const ambulatorioId = this.esamiForm.value.ambulatorioId?.[0];
    if (!ambulatorioId) {
      this.isPosizioniLoading.set(false);
      this.isEsamiLoading.set(false);

      return;
    }

    this.esamiService
      .getPosizioni(this.filters(), ambulatorioId)
      .pipe(
        finalize(() => {
          this.isPosizioniLoading.set(false);
        })
      )
      .subscribe({
        next: (posizioni: PosizioneInterface[]) => {
          this.posizioni.set(posizioni);

          // Ensure that the posizioneId is present in the list, if not, set it to the first one of the list
          const id = this.esamiForm.value.posizioneId?.[0];
          if (!posizioni.some((p) => p.id === id)) {
            this.esamiForm.patchValue({
              posizioneId: posizioni.length > 0 ? [posizioni[0].id] : null,
            });
            // KEEP NOTE: Don't need to launch the getEsami function, it will be called by the change event
          } else {
            // Load/Reload the esami
            this.getEsami();
          }
        },
        error: (_) => {
          this.isEsamiLoading.set(false);
        },
      });
  }

  // Load the esami list and check the default values presence in the list
  private getEsami() {
    // All the esami list must be dropped before the new one is loaded
    this.resetAndShowLoading(Category.Esami);

    const ambulatorioId = this.esamiForm.value.ambulatorioId?.[0];
    const posizioneId = this.esamiForm.value.posizioneId?.[0];

    if (!ambulatorioId || !posizioneId) {
      this.isEsamiLoading.set(false);

      return;
    }

    this.esamiService
      .getEsami(this.filters(), ambulatorioId, posizioneId)
      .pipe(
        finalize(() => {
          this.isEsamiLoading.set(false);
        })
      )
      .subscribe({
        next: (esami: EsameInterface[]) => {
          this.esami.set(esami);

          // Ensure that the esameId is present in the list, if not, set it to the first one of the list
          const id = this.esamiForm.value.esameId?.[0];
          if (!esami.some((e) => e.id === id)) {
            this.esamiForm.patchValue({ esameId: esami.length > 0 ? [esami[0].id] : null });
          }
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

    this.esamiForm.controls.ambulatorioId.valueChanges.subscribe((_) => {
      // The ambulatorioId control is not yet updated. Wait for it
      setTimeout(() => {
        // Now that the ambulatorioId control is updated, reload the posizioni
        this.getPosizioni();
      });
    });

    this.esamiForm.controls.posizioneId.valueChanges.subscribe((_) => {
      // The posizioneId control is not yet updated. Wait for it
      setTimeout(() => {
        // Now that the posizioneId control is updated, reload the esami
        this.getEsami();
      });
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

    if (this.esamiForm.invalid) {
      this.notificationsService.notify(
        "Errore: devi selezionare un'ambulatorio, una posizione e un'esame",
        NotificationType.Error
      );
      return;
    }
    const { ambulatorioId, esameId } = this.esamiForm.value;

    // The form is valid, therefore the values are present
    this.confermeStore.createConferma(ambulatorioId![0], esameId![0]);
  }
}
