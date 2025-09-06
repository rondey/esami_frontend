import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum NotificationType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly snackBar = inject(MatSnackBar);

  private _getEmoji(type: NotificationType): string {
    switch (type) {
      case NotificationType.Success:
        return '✅';
      case NotificationType.Info:
        return 'ℹ️';
      case NotificationType.Warning:
        return '⚠️';
      case NotificationType.Error:
        return '❌';
      default:
        return '';
    }
  }

  notify(message: string, type: NotificationType = NotificationType.Error): void {
    const emoji = this._getEmoji(type);
    this.snackBar.open(`${emoji} ${message}`, 'Chiudi', { duration: 4000 });
  }
}
