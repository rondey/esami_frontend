import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { ConfermaInterface } from '../models/conferma-interface';
import { ConfermeService } from '../services/conferme-service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { NotificationsService, NotificationType } from '../../services/notifications-service';
import { SortDirection } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';

export enum LoadingState {
  Loading = 'loading',
  Loaded = 'loaded',
  Error = 'error',
}

type ConfermeState = {
  conferme: ConfermaInterface[];
  loadingState: LoadingState;
  filter: { sortBy: string; sortOrder: SortDirection };
};

const initialState: ConfermeState = {
  conferme: [],
  loadingState: LoadingState.Loading,
  filter: { sortBy: '', sortOrder: '' },
};

export const ConfermeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      confermeService = inject(ConfermeService),
      notificationsService = inject(NotificationsService)
    ) => ({
      updateSort(sortBy: string, sortOrder: SortDirection): void {
        // Angular Material Table doesn't reset the active sort when the direction is resetted. Let's do it manually
        if (sortOrder === '') sortBy = '';

        patchState(store, (state) => ({ filter: { ...state.filter, sortBy, sortOrder } }));
        this.getConferme();
      },

      _updateLoadingStateOnError(error: HttpErrorResponse): void {
        if (error.status < 100 || error.status >= 500) {
          // Error unrecoverable. The conferme list should not be visible
          patchState(store, { loadingState: LoadingState.Error });
          return;
        }

        // Error recoverable that was made by the user. The conferme list should be visible
        patchState(store, { loadingState: LoadingState.Loaded });
      },

      async getConferme(): Promise<void> {
        const { sortBy, sortOrder } = store.filter();

        patchState(store, { loadingState: LoadingState.Loading });
        confermeService.getConferme(sortBy, sortOrder).subscribe({
          next: (conferme: ConfermaInterface[]) => {
            patchState(store, { conferme, loadingState: LoadingState.Loaded });
          },
          error: this._updateLoadingStateOnError,
        });
      },

      async createConferma(ambulatorioId: number, esameId: number): Promise<void> {
        patchState(store, { loadingState: LoadingState.Loading });

        confermeService.createConferma(ambulatorioId, esameId).subscribe({
          next: (_) => {
            notificationsService.notify(
              'La conferma è stata creata con successo!',
              NotificationType.Success
            );
            this.getConferme();
          },
          error: this._updateLoadingStateOnError,
        });
      },

      async removeConferma(id: number): Promise<void> {
        patchState(store, { loadingState: LoadingState.Loading });

        confermeService.removeConferma(id).subscribe({
          next: (_) => {
            notificationsService.notify(
              'La conferma è stata cancellata con successo!',
              NotificationType.Success
            );
            this.getConferme();
          },
          error: this._updateLoadingStateOnError,
        });
      },
    })
  ),
  withHooks({
    onInit(store) {
      store.getConferme();
    },
  })
);
