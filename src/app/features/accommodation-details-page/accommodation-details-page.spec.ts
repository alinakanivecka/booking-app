import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { of } from 'rxjs';

import { AccommodationDetailsPage } from './accommodation-details-page';
import { AccommodationsService } from '../../core/services/accommodations.service';
import { BookingsService } from '../../core/services/bookings.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { AuthService } from '../../core/services/auth.service';
import { ReviewsService } from '../../core/services/reviews.service';
import { SnackbarService } from '../../core/services/snackbar.service';

describe('AccommodationDetailsPage', () => {
  let component: AccommodationDetailsPage;
  let fixture: ComponentFixture<AccommodationDetailsPage>;

  const accommodation = {
    id: 1,
    name: 'Test apartment',
    description: 'Test description',
    destination: 'Budapest',
    city: 'Budapest',
    country: 'Hungary',
    maxGuests: 2,
    pricePerNight: 100,
    amenities: [],
    images: [],
    rating: 0,
    hostId: 1,
    host: {
      id: 1,
      name: 'Test Host',
      avatarUrl: '',
    },
  };

  const accommodationsServiceMock = {
    getAccommodationById: () => of(accommodation),
    getAccommodationRating: () => 'No rating yet',
    replaceAmenity: (amenity: string) => amenity.replaceAll('_', ' '),
  };

  const bookingsServiceMock = {
    getBookings: () => of([]),
    bookingCreate: () => of({}),
  };

  const favoritesServiceMock = {
    isFavorite: () => false,
    addFavorite: () => of(undefined),
    removeFavorite: () => of(undefined),
  };

  const authServiceMock = {
    isAuthenticated: () => false,
    currentUser: signal(null),
  };

  const reviewsServiceMock = {
    getAccommodationsReviews: () => of([]),
    createReview: () => of({}),
  };

  const snackbarServiceMock = {
    success: () => {},
    error: () => {},
  };

  const activatedRouteMock = {
    paramMap: of(convertToParamMap({ id: '1' })),
    snapshot: {
      queryParamMap: convertToParamMap({}),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccommodationDetailsPage],
      providers: [
        provideRouter([]),
        provideNativeDateAdapter(),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AccommodationsService, useValue: accommodationsServiceMock },
        { provide: BookingsService, useValue: bookingsServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ReviewsService, useValue: reviewsServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccommodationDetailsPage);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
