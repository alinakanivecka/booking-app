import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  CreateHostAccommodationPayload,
  HostAccommodation,
} from '../../models/host-accommodations.model';
import { HostBookinsResponse } from '../../models/host-bookings.model';
import { Accommodation } from '../../models/accommodations.model';

@Injectable({
  providedIn: 'root',
})
export class HostService {
  private http = inject(HttpClient);

  getHostAccommodations(): Observable<HostAccommodation[]> {
    return this.http.get<HostAccommodation[]>(`${environment.apiUrl}/host/accommodations`);
  }

  getHostBookings(): Observable<HostBookinsResponse> {
    return this.http.get<HostBookinsResponse>(`${environment.apiUrl}/host/bookings`);
  }

  createHostAccommodation(payload: CreateHostAccommodationPayload): Observable<Accommodation> {
    return this.http.post<Accommodation>(`${environment.apiUrl}/host/accommodations`, payload);
  }
}
