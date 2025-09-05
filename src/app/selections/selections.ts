import { Component, inject, signal } from '@angular/core';
import { FiltersPanel } from './filters-panel/filters-panel';
import { FiltersInterface } from './models/filters-interface';
import { FieldFilterEnum } from './models/field-filter-enum';
import { PredefinitiFiltriService } from './services/predefiniti-filtri-service';
import { PredefinitiFiltri } from './models/predefiniti-filtri';
import { EsamiPanels } from './esami-panels/esami-panels';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-selections',
  imports: [FiltersPanel, EsamiPanels],
  templateUrl: './selections.html',
  styleUrl: './selections.css',
})
export class Selections {
  private readonly predefinitiFiltriService = inject(PredefinitiFiltriService);

  filtersResetted: FiltersInterface = {
    selectedField: FieldFilterEnum.nessuno,
    valueField: '',
  };

  filters: FiltersInterface = this.filtersResetted;

  ambulatorioId = signal<number>(0);
  posizioneId = signal<number>(0);
  esameId = signal<number>(0);

  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.predefinitiFiltriService
      .getPredefinitiFiltri()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (predefinitiFiltri: PredefinitiFiltri) => {
          // Ensure the selected field is valid
          const selectedFieldApi =
            (predefinitiFiltri.campoDiFiltraggio as FieldFilterEnum) ?? FieldFilterEnum.nessuno;

          this.filters = {
            selectedField: selectedFieldApi,
            valueField: predefinitiFiltri.valoreDiFiltraggio,
          };

          this.ambulatorioId.set(predefinitiFiltri.ambulatorioId);
          this.posizioneId.set(predefinitiFiltri.posizioneId);
          this.esameId.set(predefinitiFiltri.esameId);
        },
      });
  }
}
