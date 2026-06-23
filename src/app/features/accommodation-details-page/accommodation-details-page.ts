import { Component, inject, signal } from '@angular/core';
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
import { CreateBookingPayload } from '../../models/bookings.model';

@Component({
  selector: 'app-accommodation-details-page',
  imports: [DateRangePicker, ReactiveFormsModule, GuestControl],
  templateUrl: './accommodation-details-page.html',
  styleUrl: './accommodation-details-page.scss',
})
export class AccommodationDetailsPage {
  private accommodationService = inject(AccommodationsService);
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  accommodation = signal<Accommodation | null>(null);
  selectedImage = signal<string | null>(null);

  isLoading = signal(false);
  noResults = signal(false);
  errorMessage = signal('');

  bookingForm = this.fb.group({
    dateRange: this.fb.control<DateRange>({
      start: null,
      end: null,
    }),
    guests: this.fb.control(1),
  });

  private formatDate(date: Date | null | undefined): string {
    if (!date) {
      return '';
    }

    return date.toISOString().split('T')[0];
  }

  bookNow() {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.errorMessage.set('');

    const accommodation = this.accommodation();
    const dateRange = this.bookingForm.controls.dateRange.value;

    if (!accommodation || !dateRange?.start || !dateRange?.end) {
      this.errorMessage.set('Please select check-in and check-out dates.');
      return;
    }

    const bookingsPayload: CreateBookingPayload = {
      accommodationId: accommodation.id,
      checkIn: this.formatDate(dateRange.start),
      checkOut: this.formatDate(dateRange.end),
      guests: Number(this.bookingForm.controls.guests.value),
    };

    this.isLoading.set(true);

    this.accommodationService.bookingCreate(bookingsPayload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/bookings']);
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage.set('These dates are already booked. Please choose different dates.');
          return;
        }
        this.errorMessage.set('Something went wrong. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  selectImage(image: string) {
    this.selectedImage.set(image);
  }

  getMainImage(accommodation: Accommodation): string {
    const image = this.selectedImage() || accommodation.images?.[0];

    return image ? `${environment.apiUrl}${image}` : 'assets/placeholder.jpg';
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
      this.favoritesService.removeFavorite(accommodationId).subscribe();

      return;
    }

    this.favoritesService.addFavorite(accommodationId).subscribe();
  }

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = Number(params.get('id'));

      this.isLoading.set(true);

      this.accommodationService.getAccommodationDetails(id).subscribe({
        next: (response) => {
          this.accommodation.set(response);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
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
  }
}
