import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
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

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);
  // isAuthenticated = signal(false);
  userRoles = computed(() => this.currentUser()?.roles ?? []);

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload);
  }

  saveAuthData(response: AuthResponse) {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload);
  }

  me(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/me`);
  }

  restoreSession(): void {
    const token = this.getAccessToken();

    if (!token) {
      this.clearSession();
      return;
    }

    this.me().subscribe({
      next: (user) => {
        this.currentUser.set(user);
      },
      error: () => {
        this.clearSession();
      },
    });
  }

  logout() {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}).pipe(tap(() => this.clearSession()));
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true },
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
