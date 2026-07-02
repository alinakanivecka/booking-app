import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Bookings } from './bookings';
import { BookingsService } from '../../core/services/bookings.service';
import { AuthService } from '../../core/services/auth.service';

describe('Bookings', () => {
  let component: Bookings;
  let fixture: ComponentFixture<Bookings>;

  const bookingsServiceMock = {
    getBookings: () => of([]),
    cancelBooking: () => of({}),
  };

  const authServiceMock = {
    isAuthenticated: () => true,
    currentUser: signal({ id: 1, name: 'Test User', email: 'test@test.com', roles: ['user'] }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bookings],
      providers: [
        provideRouter([]),
        { provide: BookingsService, useValue: bookingsServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Bookings);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
