import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register } from './register';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  const authServiceMock = {
    register: () =>
      of({
        accessToken: 'token',
        user: { id: 1, name: 'Test User', email: 'test@test.com', roles: ['user'] },
      }),
    saveAuthData: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([]), { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
