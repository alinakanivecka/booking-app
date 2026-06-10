import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();

  const request = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(request).pipe(
    catchError((error) => {
      const isAuthRequest =
        req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('/auth/refresh');

      if (error.status !== 401 || isAuthRequest) {
        return throwError(() => error);
      }

      if (!token) {
        authService.clearSession();
        router.navigate(['/login']);
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap((response) => {
          authService.saveAuthData(response);

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          });

          return next(retryReq);
        }),
        catchError((refreshError) => {
          authService.clearSession();
          router.navigate(['/login']);

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
