import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Favorites } from './favorites';
import { FavoritesService } from '../../core/services/favorites.service';
import { AuthService } from '../../core/services/auth.service';
import { AccommodationsService } from '../../core/services/accommodations.service';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;

  const favorites = signal([]);

  const favoritesServiceMock = {
    favorites,
    loadFavorites: () => of([]),
    removeFavorite: () => of(undefined),
    isFavorite: () => false,
  };

  const authServiceMock = {
    isAuthenticated: () => false,
    currentUser: signal(null),
  };

  const accommodationsServiceMock = {
    getImageUrl: () => 'assets/logo.png',
    getAccommodationRating: () => 'No rating yet',
    replaceAmenity: (amenity: string) => amenity.replaceAll('_', ' '),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [
        provideRouter([]),
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: AccommodationsService, useValue: accommodationsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
