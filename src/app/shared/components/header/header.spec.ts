import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { NotificationsService } from '../../../core/services/notifications.service';
import { AuthService } from '../../../core/services/auth.service';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  const currentUser = signal(null);

  const authServiceMock = {
    currentUser,
    isAuthenticated: () => false,
    logout: () => of({}),
    clearSession: () => {},
  };

  const notificationsServiceMock = {
    unreadCount: signal(0),
    loadNotifications: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationsService, useValue: notificationsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
