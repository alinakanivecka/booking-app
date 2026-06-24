import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { hostGuard } from './host-guard';
import { AuthService } from '../../services/auth.service';

describe('hostGuard', () => {
  let authServiceMock: {
    getAccessToken: () => string | null;
    userRoles: () => string[];
  };

  let routerMock: {
    createUrlTree: (commands: string[]) => string;
  };

  const runGuard = () => TestBed.runInInjectionContext(() => hostGuard({} as any, {} as any));

  beforeEach(() => {
    authServiceMock = {
      getAccessToken: () => null,
      userRoles: () => [],
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
    authServiceMock.userRoles = () => ['user', 'host'];

    const result = runGuard();

    expect(result).toBe(true);
  });

  it('should redirect to profile when authenticated user is not host', () => {
    authServiceMock.getAccessToken = () => 'access-token';
    authServiceMock.userRoles = () => ['user'];

    const result = runGuard();

    expect(result).toBe('/profile');
  });
});
