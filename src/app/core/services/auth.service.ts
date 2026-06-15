import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { AuthResponse } from '../../features/auth/models/auth-response.model';
import { RegisterPayload } from '../../features/auth/models/register-payload.model';
import { LoginPayload } from '../../features/auth/models/login-payload.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);
  userRoles = computed(() => this.currentUser()?.roles ?? []);

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload, {
      withCredentials: true,
    });
  }

  saveAuthData(response: AuthResponse) {
    localStorage.setItem('accessToken', response.accessToken);
    this.currentUser.set(response.user);
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload, {
      withCredentials: true,
    });
  }

  loginWithGoogle(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/google`,
      { identityToken: idToken },
      { withCredentials: true },
    );
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
    return this.http
      .post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.clearSession()));
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
    this.currentUser.set(null);
  }
}
