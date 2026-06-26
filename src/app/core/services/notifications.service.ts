import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification } from '../../models/notifications.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private http = inject(HttpClient);

  notifications = signal<Notification[]>([]);
  readonly unreadCount = computed(() => this.notifications().filter((item) => !item.isRead).length);

  loadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiUrl}/notifications`).pipe(
      tap((response) => {
        this.notifications.set(response);
      }),
    );
  }
}
