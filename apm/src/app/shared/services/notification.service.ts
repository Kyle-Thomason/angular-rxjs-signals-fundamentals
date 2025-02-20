// notification.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showNotification(config: {
    message: string;
    action: string;
    type: 'error' | 'info';
  }): void {
    const duration = config.type === 'error' ? undefined : 2000;
    
    this.snackBar.open(config.message, config.action, {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}