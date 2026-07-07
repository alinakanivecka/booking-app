import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AccommodationsService } from '../../core/services/accommodations.service';
import { Accommodation } from '../../models/accommodations.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { DateRangePicker } from '../../shared/components/date-range-picker/date-range-picker';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DateRange } from '../../models/date-range.model';
import { GuestControl } from '../../shared/components/guest-control/guest-control';
import { Booking, CreateBookingPayload } from '../../models/bookings.model';
import { BookingsService } from '../../core/services/bookings.service';
import { Reviews } from '../../shared/components/reviews/reviews';
import { SnackbarService } from '../../core/services/snackbar.service';
import { formatDateForApi } from '../../shared/utils/date-format';
import { getApiErrorMessage } from '../../shared/utils/http-error-message';
import { MatDialog } from '@angular/material/dialog';
import { LeaveReviewDialog } from '../../shared/components/dialogs/leave-review-dialog/leave-review-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-accommodation-details-page',
  imports: [DateRangePicker, ReactiveFormsModule, GuestControl, Reviews, MatTooltipModule],
  templateUrl: './accommodation-details-page.html',
  styleUrl: './accommodation-details-page.scss',
})
export class AccommodationDetailsPage {
  private accommodationService = inject(AccommodationsService);
  private bookingsService = inject(BookingsService);
  private favoritesService = inject(FavoritesService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  accommodation = signal<Accommodation | null>(null);
  selectedImage = signal<string | null>(null);
  reviewsCount = signal(0);
  hasCurrentUserReview = signal<boolean | null>(null);

  userBookings = signal<Booking[]>([]);
  bookingsLoaded = signal(false);

  isAccommodationLoading = signal(false);
  isBookingLoading = signal(false);
  noResults = signal(false);
  errorMessage = signal('');
  bookingErrorMessage = signal('');

  @ViewChild(Reviews)
  reviewsComponent!: Reviews;

  openFormReviewModal(accommodationId: number) {
    const dialogRef = this.dialog.open(LeaveReviewDialog, {
      data: {
        accommodationId,
      },
      width: 'min(100vw - 2rem, 34rem)',
      maxWidth: '34rem',
      panelClass: 'custom-modal-dialog',
    });

    dialogRef.afterClosed().subscribe((reviewCreated: boolean) => {
      if (reviewCreated) {
        this.onReviewCreated();
      }
    });
  }

  bookingForm = this.fb.group({
    dateRange: this.fb.control<DateRange>({
      start: null,
      end: null,
    }),
    guests: this.fb.control(1),
  });

  canLeaveReview = computed(() => {
    const accommodation = this.accommodation();

    if (!accommodation || !this.authService.isAuthenticated()) {
      return false;
    }

    const today = new Date();

    return this.userBookings().some((booking) => {
      const isSameAccommodation = booking.accommodationId === accommodation.id;
      const isNotCancelled = booking.status !== 'cancelled';
      const stayFinished = new Date(booking.checkOut) < today;

      return isSameAccommodation && isNotCancelled && stayFinished;
    });
  });

  reloadReviews() {
    const accommodation = this.accommodation();

    if (!accommodation || !this.reviewsComponent) {
      return;
    }

    this.reviewsComponent.loadReviews(accommodation.id);
  }

  onReviewCreated() {
    this.hasCurrentUserReview.set(true);
    this.reloadReviews();
  }

  bookNow() {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    if (this.isBookingLoading()) {
      return;
    }

    this.bookingErrorMessage.set('');

    const accommodation = this.accommodation();
    const dateRange = this.bookingForm.controls.dateRange.value;
    const guests = Number(this.bookingForm.controls.guests.value);

    if (!accommodation || !dateRange?.start || !dateRange?.end || this.nightsCount() === 0) {
      this.bookingErrorMessage.set('Please select at least one night.');
      return;
    }

    if (guests < 1) {
      this.bookingErrorMessage.set('Please select at least one guest.');
      return;
    }

    if (guests > accommodation.maxGuests) {
      this.bookingErrorMessage.set(
        `This accommodation allows up to ${accommodation.maxGuests} guests.`,
      );
      return;
    }

    const bookingsPayload: CreateBookingPayload = {
      accommodationId: accommodation.id,
      checkIn: formatDateForApi(dateRange.start),
      checkOut: formatDateForApi(dateRange.end),
      guests,
    };

    this.isBookingLoading.set(true);

    this.bookingsService.bookingCreate(bookingsPayload).subscribe({
      next: () => {
        this.isBookingLoading.set(false);
        this.router.navigate(['/bookings']);
      },
      error: (error) => {
        this.isBookingLoading.set(false);
        this.bookingErrorMessage.set(
          getApiErrorMessage(error, 'Unable to create booking. Please try again.'),
        );
      },
    });
  }

  selectImage(image: string) {
    this.selectedImage.set(image);
  }

  getMainImage(accommodation: Accommodation): string {
    const image = this.selectedImage() || accommodation.images?.[0];

    return image ? `${environment.apiUrl}${image}` : 'assets/logo.png';
  }

  getImageUrlByPath(image: string): string {
    return `${environment.apiUrl}${image}`;
  }

  replaceAmenity(ammenity: string): string {
    return this.accommodationService.replaceAmenity(ammenity);
  }

  isFavorite = (accommodationId: number): boolean => {
    return this.favoritesService.isFavorite(accommodationId);
  };

  toggleFavorite(accommodationId: number) {
    if (this.favoritesService.isFavorite(accommodationId)) {
      this.favoritesService.removeFavorite(accommodationId).subscribe({
        next: () => {
          this.snackbarService.success('Removed from favorites');
        },
        error: () => {
          this.snackbarService.error('Unable to remove favorite');
        },
      });

      return;
    }

    this.favoritesService.addFavorite(accommodationId).subscribe({
      next: () => {
        this.snackbarService.success('Added to favorites');
      },
      error: () => {
        this.snackbarService.error('Unable to add favorite');
      },
    });
  }

  accommodationRatingLabel() {
    const item = this.accommodation()!;
    return this.accommodationService.getAccommodationRating(item);
  }

  loadUserBookings() {
    if (!this.authService.isAuthenticated()) {
      this.userBookings.set([]);
      this.bookingsLoaded.set(true);
      return;
    }

    this.bookingsLoaded.set(false);

    this.bookingsService.getBookings().subscribe({
      next: (bookings) => {
        this.userBookings.set(bookings);
        this.bookingsLoaded.set(true);
      },
      error: () => {
        this.userBookings.set([]);
        this.bookingsLoaded.set(true);
      },
    });
  }

  nightsCount(): number {
    const dateRange = this.bookingForm.controls.dateRange.value;

    if (!dateRange?.start || !dateRange?.end) {
      return 0;
    }

    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diff = end.getTime() - start.getTime();

    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  totalPrice(): number {
    const accommodation = this.accommodation();

    if (!accommodation || this.nightsCount() === 0) {
      return 0;
    }

    return accommodation.pricePerNight * this.nightsCount();
  }

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = Number(params.get('id'));

      this.accommodation.set(null);
      this.errorMessage.set('');
      this.isAccommodationLoading.set(true);

      this.accommodationService.getAccommodationById(id).subscribe({
        next: (response) => {
          this.hasCurrentUserReview.set(null);
          this.accommodation.set(response);
          this.loadUserBookings();
          this.isAccommodationLoading.set(false);
        },
        error: () => {
          this.isAccommodationLoading.set(false);
          this.errorMessage.set('Unable to load accommodation');
        },
      });
    });

    const params = route.snapshot.queryParamMap;

    this.bookingForm.patchValue({
      dateRange: {
        start: params.get('checkIn') ? new Date(params.get('checkIn')!) : null,
        end: params.get('checkOut') ? new Date(params.get('checkOut')!) : null,
      },
      guests: params.get('guests') ? Number(params.get('guests')) : 1,
    });

    this.bookingForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.bookingErrorMessage.set('');
    });
  }
}
