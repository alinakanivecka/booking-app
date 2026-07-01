import { Component, computed, inject, signal } from '@angular/core';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  notificationsService = inject(NotificationsService);

  notifications = this.notificationsService.notifications;
  openedDropdownId = signal<number | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  readNotification(id: number) {
    this.errorMessage.set('');

    this.notificationsService.markNotificationAsRead(id).subscribe({
      next: () => {
        this.closeDropdown();
      },
      error: () => {
        this.errorMessage.set('Something went wrong');
      },
    });
  }

  removeNotification(id: number) {
    this.closeDropdown();
    return this.notificationsService.deleteNotification(id);
  }

  toggleDropdown(notificationId: number, event: MouseEvent) {
    event.stopPropagation();

    this.openedDropdownId.update((currentId) =>
      currentId === notificationId ? null : notificationId,
    );
  }

  closeDropdown() {
    this.openedDropdownId.set(null);
  }

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
