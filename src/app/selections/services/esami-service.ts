import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FiltersInterface } from '../models/filters-interface';
import { EsameInterface } from '../models/esame-interface';
import { Observable } from 'rxjs';
import { PosizioneInterface } from '../models/posizione-interface';
import { AmbulatorioInterface } from '../models/ambulatorio-interface';

@Injectable({
  providedIn: 'root',
})
export class EsamiService {
  http = inject(HttpClient);

  private prepareFiltersParams(filters: FiltersInterface) {
    return {
      [filters.selectedField]: filters.valueField,
    };
  }

  getAmbulatori(filters: FiltersInterface) {
    return this.http.get<AmbulatorioInterface[]>('ambulatori', {
      params: this.prepareFiltersParams(filters),
    });
  }

  getPosizioni(filters: FiltersInterface, ambulatorioId: number): Observable<PosizioneInterface[]> {
    return this.http.get<PosizioneInterface[]>('posizioni', {
      params: { ...this.prepareFiltersParams(filters), ambulatorioId },
    });
  }

  getEsami(
    fiters: FiltersInterface,
    ambulatorioId: number,
    posizioneId: number
  ): Observable<EsameInterface[]> {
    return this.http.get<EsameInterface[]>('esami', {
      params: { ...this.prepareFiltersParams(fiters), ambulatorioId, posizioneId },
    });
  }
}
