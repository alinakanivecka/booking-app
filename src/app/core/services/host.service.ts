import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HostAccommodation } from '../../models/host-accommodations.model';
import { HostBookinsResponse } from '../../models/host-bookings.model';

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
}
