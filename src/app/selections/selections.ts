import { Component, inject } from '@angular/core';
import { FiltersPanel } from './filters-panel/filters-panel';
import { FiltersInterface } from './models/filters-interface';
import { FieldFilterEnum } from './models/field-filter-enum';
import { PredefinitiFiltriService } from './services/predefiniti-filtri-service';
import { PredefinitiFiltri } from './models/predefiniti-filtri';
import { EsamiPanels } from './esami-panels/esami-panels';

@Component({
  selector: 'app-selections',
  imports: [FiltersPanel, EsamiPanels],
  templateUrl: './selections.html',
  styleUrl: './selections.css',
})
export class Selections {
  private predefinitiFiltriService = inject(PredefinitiFiltriService);

  filters: FiltersInterface = {
    selectedField: FieldFilterEnum.nessuno,
    valueField: '',
  };

  ngOnInit() {
    this.predefinitiFiltriService.getPredefinitiFiltri().subscribe({
      next: (predefinitiFiltri: PredefinitiFiltri) => {
        // Ensure the selected field is valid
        const selectedFieldApi =
          (predefinitiFiltri.campoDiFiltraggio as FieldFilterEnum) ?? FieldFilterEnum.nessuno;

        this.filters = {
          selectedField: selectedFieldApi,
          valueField: predefinitiFiltri.valoreDiFiltraggio,
        };
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
