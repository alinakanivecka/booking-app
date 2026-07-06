import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Booking } from '../../../../models/bookings.model';
import { BookingsService } from '../../../../core/services/bookings.service';
import { getApiErrorMessage } from '../../../utils/http-error-message';

type DialogData = {
  booking: Booking;
};

@Component({
  selector: 'app-cancel-booking-dialog',
  templateUrl: './cancel-booking-dialog.html',
  styleUrl: './cancel-booking-dialog.scss',
})
export class CancelBookingDialog {
  private dialogRef = inject(MatDialogRef<CancelBookingDialog>);
  private bookingsService = inject(BookingsService);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  isCancelling = signal(false);
  errorMessage = signal('');

  close() {
    this.dialogRef.close(false);
  }

  cancelBooking() {
    if (this.isCancelling()) {
      return;
    }

    this.isCancelling.set(true);
    this.errorMessage.set('');

    this.bookingsService.cancelBooking(this.data.booking.id).subscribe({
      next: () => {
        this.isCancelling.set(false);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isCancelling.set(false);
        this.errorMessage.set(
          getApiErrorMessage(error, 'Unable to cancel booking. Please try again.'),
        );
      },
    });
  }
}
