import { inject, Injectable } from '@angular/core';
import { ConfermaInterface } from '../models/conferma-interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfermeService {
  http = inject(HttpClient);

  getConferme(sortBy: string, sortOrder: string): Observable<ConfermaInterface[]> {
    return this.http.get<ConfermaInterface[]>('conferme', {
      params: { sortBy, sortOrder },
    });
  }

  createConferma(ambulatorioId: number, esameId: number): Observable<ConfermaInterface> {
    return this.http.post<ConfermaInterface>('conferme', {
      ambulatorioId,
      esameId,
    });
  }

  removeConferma(id: number): Observable<ConfermaInterface> {
    return this.http.delete<ConfermaInterface>(`conferme/${id}`);
  }
}
