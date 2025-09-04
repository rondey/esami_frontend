import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private snackBar = inject(MatSnackBar);

  notify(message: string) {
    this.snackBar.open(message, 'Chiudi', { duration: 4000 });
  }
}
