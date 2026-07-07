import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { HostService } from '../../../../core/services/host.service';
import { HostAccommodation } from '../../../../models/host-accommodations.model';
import { HostBooking } from '../../../../models/host-bookings.model';
import { RouterLink } from '@angular/router';
import { getApiErrorMessage } from '../../../../shared/utils/http-error-message';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, RouterLink],
  templateUrl: './host-dashboard.html',
  styleUrl: './host-dashboard.scss',
})
export class HostDashboard {
  private hostService = inject(HostService);

  accommodations = signal<HostAccommodation[]>([]);
  bookings = signal<HostBooking[]>([]);

  isLoading = signal(false);
  errorMessage = signal('');

  accommodationsCount = computed(() => this.accommodations().length);
  totalBookings = signal(0);

  recentBookings = computed(() =>
    [...this.bookings()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
  );

  constructor() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    forkJoin({
      accommodations: this.hostService.getHostAccommodations(),
      bookingsResponse: this.hostService.getHostBookings(),
    }).subscribe({
      next: ({ accommodations, bookingsResponse }) => {
        this.accommodations.set(accommodations);
        this.bookings.set(bookingsResponse.items);
        this.totalBookings.set(bookingsResponse.totalItems);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.accommodations.set([]);
        this.bookings.set([]);
        this.isLoading.set(false);
        this.errorMessage.set(
          getApiErrorMessage(error, 'Unable to load dashboard data. Please try again.'),
        );
      },
    });
  }
}
