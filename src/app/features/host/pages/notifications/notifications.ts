import { Component, inject, signal } from '@angular/core';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  private notificationsService = inject(NotificationsService);

  notifications = this.notificationsService.notifications;
  isLoading = signal(false);
  errorMessage = signal('');

  loadNotifications() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.notificationsService.loadNotifications().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Unable to load notifications');
      },
    });
  }

  constructor() {
    this.loadNotifications();
  }
}
