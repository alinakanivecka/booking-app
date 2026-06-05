import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  accessToken: string;
  expiresAt: string;
  user: User;
}

export interface User {
  avatarUrl: string;
  email: string;
  id: number;
  name: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  register(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, payload);
  }

  saveAuthData(response: RegisterResponse) {
    localStorage.setItem('accessToken', response.accessToken);
  }
}
