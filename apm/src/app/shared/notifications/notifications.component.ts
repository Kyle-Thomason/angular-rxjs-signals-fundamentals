import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'pm-notifications',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent {
  constructor(private snackBar: MatSnackBar) {}

  showNotification(message: string, type: 'info' | 'error'): void {
    const duration = type === 'error' ? undefined : 3000; // 3 seconds for info, undefined for error
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}