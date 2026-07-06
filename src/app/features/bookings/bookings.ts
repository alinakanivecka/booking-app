import { Component, inject, signal } from '@angular/core';
import { Booking } from '../../models/bookings.model';
import { BookingsService } from '../../core/services/bookings.service';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { getApiErrorMessage } from '../../shared/utils/http-error-message';
import { MatDialog } from '@angular/material/dialog';
import { CancelBookingDialog } from '../../shared/components/dialogs/cancel-booking-dialog/cancel-booking-dialog';

@Component({
  selector: 'app-bookings',
  imports: [RouterLink],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss',
})
export class Bookings {
  private bookingsService = inject(BookingsService);
  private dialog = inject(MatDialog);
  authService = inject(AuthService);

  bookingsItems = signal<Booking[]>([]);
  isLoading = signal(false);
  noResults = signal(false);
  errorMessage = signal('');

  openModal(id: number) {
    const booking = this.bookingsItems().find((item) => item.id === id);

    if (!booking) {
      this.errorMessage.set('Booking id is missing.');
      return;
    }

    const dialogRef = this.dialog.open(CancelBookingDialog, {
      data: {
        booking,
      },
      width: 'min(100vw - 2rem, 28rem)',
      maxWidth: '28rem',
      panelClass: 'custom-modal-dialog',
    });

    dialogRef.afterClosed().subscribe((wasCancelled: boolean) => {
      if (wasCancelled) {
        this.bookingsItems.update((items) =>
          items.map((item) => (item.id === id ? { ...item, status: 'cancelled' } : item)),
        );
      }
    });
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
          getApiErrorMessage(error, 'Unable to load your bookings. Please try again.'),
        );
        this.isLoading.set(false);
      },
    });
  }
}
