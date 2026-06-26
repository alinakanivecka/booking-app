import { Component, computed, inject, signal } from '@angular/core';
import { Booking } from '../../models/bookings.model';
import { BookingsService } from '../../core/services/bookings.service';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-bookings',
  imports: [ClickOutsideDirective, RouterLink],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss',
})
export class Bookings {
  private bookingsService = inject(BookingsService);
  authService = inject(AuthService);

  bookingsItems = signal<Booking[]>([]);
  isModalOpen = signal(false);
  selectedBookingId = signal<number | null>(null);

  isLoading = signal(false);
  noResults = signal(false);
  errorMessage = signal('');

  selectedBooking = computed(() =>
    this.bookingsItems().find((booking) => booking.id === this.selectedBookingId()),
  );

  confirmCancelBooking() {
    this.isModalOpen.set(false);

    const id = Number(this.selectedBookingId());

    this.isLoading.set(true);

    this.bookingsService.cancelBooking(id).subscribe({
      next: () => {
        this.bookingsItems.update((items) =>
          items.map((item) => (item.id === id ? { ...item, status: 'cancelled' } : item)),
        );
        this.isLoading.set(false);
        this.selectedBookingId.set(null);
        this.isModalOpen.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Something went wrong');
      },
    });
  }

  openModal(id: number) {
    this.selectedBookingId.set(id);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedBookingId.set(null);
  }

  constructor() {
    this.loadBookings();
  }

  loadBookings(): void {
    this.errorMessage.set('');
    this.noResults.set(false);
    this.isLoading.set(true);

    this.bookingsService.getBookings().subscribe({
      next: (response) => {
        this.bookingsItems.set(response);
        this.noResults.set(response.length === 0);
        this.isLoading.set(false);
      },
      error: (error) => {
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
