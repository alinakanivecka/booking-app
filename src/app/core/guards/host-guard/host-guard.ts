import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const hostGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getAccessToken()) {
    return router.createUrlTree(['/login']);
  }

  const currentUser = authService.currentUser();

  if (currentUser) {
    return currentUser.roles.includes('host') ? true : router.createUrlTree(['/profile']);
  }

  return authService.me().pipe(
    map((user) => {
      authService.currentUser.set(user);

      return user.roles.includes('host') ? true : router.createUrlTree(['/profile']);
    }),
    catchError(() => {
      authService.clearSession();
      return of(router.createUrlTree(['/login']));
    }),
  );
};
