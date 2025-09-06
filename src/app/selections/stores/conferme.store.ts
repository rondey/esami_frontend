import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { ConfermaInterface } from '../models/conferma-interface';
import { ConfermeService } from '../services/conferme-service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { NotificationsService, NotificationType } from '../../services/notifications-service';
import { SortDirection } from '@angular/material/sort';

type ConfermeState = {
  conferme: ConfermaInterface[];
  isLoading: boolean;
  filter: { sortBy: string; sortOrder: SortDirection };
};

const initialState: ConfermeState = {
  conferme: [],
  isLoading: false,
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

      async getConferme(): Promise<void> {
        const { sortBy, sortOrder } = store.filter();

        patchState(store, { isLoading: true });
        confermeService
          .getConferme(sortBy, sortOrder)
          .pipe(
            finalize(() => {
              patchState(store, { isLoading: false });
            })
          )
          .subscribe({
            next: (conferme: ConfermaInterface[]) => {
              patchState(store, { conferme });
            },
          });
      },

      async createConferma(ambulatorioId: number, esameId: number): Promise<void> {
        patchState(store, { isLoading: true });

        confermeService
          .createConferma(ambulatorioId, esameId)
          .pipe(
            finalize(() => {
              patchState(store, { isLoading: false });
            })
          )
          .subscribe({
            next: (_) => {
              notificationsService.notify(
                'La conferma è stata creata con successo!',
                NotificationType.Success
              );
              this.getConferme();
            },
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
