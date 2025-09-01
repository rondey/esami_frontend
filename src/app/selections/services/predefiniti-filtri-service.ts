import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PredefinitiFiltri } from '../models/predefiniti-filtri';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PredefinitiFiltriService {
  http = inject(HttpClient);

  getPredefinitiFiltri(): Observable<PredefinitiFiltri> {
    return this.http.get<PredefinitiFiltri>('predefiniti-filtri');
  }
}
