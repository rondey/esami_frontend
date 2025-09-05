import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ConfermaInterface } from '../models/conferma-interface';
import { ConfermeService } from '../services/conferme-service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { NotificationsService, NotificationType } from '../../services/notifications-service';

export type SortOrderType = 'ASC' | 'DESC';

type ConfermeState = {
  conferme: ConfermaInterface[];
  isLoading: boolean;
  filter: { sortBy: string; sortOrder: SortOrderType };
};

const initialState: ConfermeState = {
  conferme: [],
  isLoading: false,
  filter: { sortBy: 'id', sortOrder: 'ASC' },
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
      updateSortBy(sortBy: string): void {
        patchState(store, (state) => ({ filter: { ...state.filter, sortBy } }));
      },
      updateSortOrder(sortOrder: SortOrderType): void {
        patchState(store, (state) => ({ filter: { ...state.filter, sortOrder } }));
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
  )
);
