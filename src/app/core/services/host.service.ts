import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  CreateHostAccommodationPayload,
  HostAccommodation,
  HostAccommodationImageResponse,
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

  editHostAccommodation(
    id: number,
    payload: CreateHostAccommodationPayload,
  ): Observable<Accommodation> {
    return this.http.patch<Accommodation>(
      `${environment.apiUrl}/host/accommodations/${id}`,
      payload,
      {},
    );
  }

  removeHostAccommodation(id: number) {
    return this.http.delete<Accommodation>(`${environment.apiUrl}/host/accommodations/${id}`);
  }

  uploadHostAccommodationImages(
    id: number,
    files: File[],  
  ): Observable<HostAccommodationImageResponse[]> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    return this.http.post<HostAccommodationImageResponse[]>(
      `${environment.apiUrl}/host/accommodations/${id}/images`,
      formData,
    );
  }
}
