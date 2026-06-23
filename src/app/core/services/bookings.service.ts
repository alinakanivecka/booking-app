import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateBookingPayload, Booking } from '../../models/bookings.model';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private http = inject(HttpClient);

  bookingCreate(bookingsPayload: CreateBookingPayload): Observable<Booking> {
    return this.http.post<Booking>(`${environment.apiUrl}/bookings`, bookingsPayload);
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${environment.apiUrl}/bookings`, {});
  }

  cancelBooking(id: number) {
    return this.http.patch<Booking>(`${environment.apiUrl}/bookings/${id}/cancel`, {});
  }
}
