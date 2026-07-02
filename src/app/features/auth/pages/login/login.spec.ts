import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { GoogleAccountsApi } from '../../models/google-accounts.model';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  const authServiceMock = {
    login: () =>
      of({
        accessToken: 'token',
        user: { id: 1, name: 'Test User', email: 'test@test.com', avatarUrl: '', roles: ['user'] },
      }),
    loginWithGoogle: () =>
      of({
        accessToken: 'token',
        user: { id: 1, name: 'Test User', email: 'test@test.com', avatarUrl: '', roles: ['user'] },
      }),
    saveAuthData: () => {},
  };

  beforeEach(async () => {
    const googleMock: GoogleAccountsApi = {
      accounts: {
        id: {
          initialize: () => {},
          renderButton: () => {},
          prompt: () => {},
        },
      },
    };

    (globalThis as typeof globalThis & { google?: GoogleAccountsApi }).google = googleMock;

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
