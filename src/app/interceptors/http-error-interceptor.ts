import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationsService, NotificationType } from '../services/notifications-service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationsService = inject(NotificationsService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Si è verificato un errore, riprova più tardi.';

      if (error.status === 0) {
        // Caso tipico di rete offline o server non raggiungibile
        message = `Errore di connessione. Controlla la tua rete. (${error.message})`;
      } else {
        if (error.status >= 400 && error.status < 500) {
          const backendErrorMessage = error.error?.message;
          message = `Errore nella richiesta. Controlla i dati inseriti. (${backendErrorMessage})`;
        } else if (error.status >= 500) {
          // The server error message is useless for the user, so we don't show it (the user cannot do anything about it anyway)
          message = 'Errore del server, riprova più tardi.';
        }
      }

      notificationsService.notify(message, NotificationType.Error);
      return throwError(() => error);
    })
  );
};
