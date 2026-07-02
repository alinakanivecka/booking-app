import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { hostGuard } from './host-guard';
import { AuthService } from '../../services/auth.service';

describe('hostGuard', () => {
  const currentUser = signal<any>(null);

  let authServiceMock: {
    getAccessToken: () => string | null;
    currentUser: typeof currentUser;
    me: () => any;
    clearSession: () => void;
  };

  let routerMock: {
    createUrlTree: (commands: string[]) => string;
  };

  const runGuard = () => TestBed.runInInjectionContext(() => hostGuard({} as any, {} as any));

  beforeEach(() => {
    currentUser.set(null);

    authServiceMock = {
      getAccessToken: () => null,
      currentUser,
      me: () => of(null),
      clearSession: () => {},
    };

    routerMock = {
      createUrlTree: (commands: string[]) => commands.join('/'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should redirect to login when user is not authenticated', () => {
    authServiceMock.getAccessToken = () => null;

    const result = runGuard();

    expect(result).toBe('/login');
  });

  it('should allow access when user has host role', () => {
    authServiceMock.getAccessToken = () => 'access-token';
    currentUser.set({
      id: 1,
      email: 'host@test.com',
      name: 'Host User',
      avatarUrl: '',
      roles: ['user', 'host'],
    });

    const result = runGuard();

    expect(result).toBe(true);
  });

  it('should redirect to profile when authenticated user is not host', () => {
    authServiceMock.getAccessToken = () => 'access-token';
    currentUser.set({
      id: 1,
      email: 'user@test.com',
      name: 'Regular User',
      avatarUrl: '',
      roles: ['user'],
    });

    const result = runGuard();

    expect(result).toBe('/profile');
  });
});
