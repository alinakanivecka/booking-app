import { Component, inject, signal } from '@angular/core';
import { AccommodationsService } from '../../core/services/accommodations.service';
import { Booking } from '../../models/bookings.model';

@Component({
  selector: 'app-bookings',
  imports: [],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss',
})
export class Bookings {
  private accommodationService = inject(AccommodationsService);

  bookingsItems = signal<Booking[]>([]);

  isLoading = signal(false);
  noResults = signal(false);
  errorMessage = signal('');

  constructor() {
    this.loadBookings();
  }

  loadBookings(): void {
    this.errorMessage.set('');
    this.noResults.set(false);
    this.isLoading.set(true);

    this.accommodationService.getBookings().subscribe({
      next: (response) => {
        this.bookingsItems.set(response);
        this.noResults.set(response.length === 0);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.log(error);

        this.bookingsItems.set([]);
        this.noResults.set(false);
        this.errorMessage.set(
          error.error?.detail || 'Unable to load your bookings. Please try again.',
        );
        this.isLoading.set(false);
      },
    });
  }
}
