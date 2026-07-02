import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { of } from 'rxjs';

import { Search } from './search';
import { AccommodationsService } from '../../core/services/accommodations.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { AuthService } from '../../core/services/auth.service';

describe('Search', () => {
  let component: Search;
  let fixture: ComponentFixture<Search>;

  const accommodationsServiceMock = {
    getAccommodations: () =>
      of({
        items: [],
        page: 1,
        pageSize: 20,
        totalItems: 0,
        totalPages: 0,
      }),
    getImageUrl: () => 'assets/logo.png',
    getAccommodationRating: () => 'No rating yet',
    replaceAmenity: (amenity: string) => amenity.replaceAll('_', ' '),
  };

  const favoritesServiceMock = {
    isFavorite: () => false,
    addFavorite: () => of(undefined),
    removeFavorite: () => of(undefined),
  };

  const snackbarServiceMock = {
    success: () => {},
    error: () => {},
  };

  const authServiceMock = {
    isAuthenticated: () => false,
  };

  const activatedRouteMock = {
    snapshot: {
      queryParamMap: convertToParamMap({}),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Search],
      providers: [
        provideRouter([]),
        provideNativeDateAdapter(),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AccommodationsService, useValue: accommodationsServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Search);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
