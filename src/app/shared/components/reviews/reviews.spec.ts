import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { Reviews } from './reviews';
import { ReviewsService } from '../../../core/services/reviews.service';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

describe('Reviews', () => {
  let component: Reviews;
  let fixture: ComponentFixture<Reviews>;

  const reviewsServiceMock = {
    getAccommodationsReviews: () => of([]),
  };

  const authServiceMock = {
    currentUser: signal(null),
    isAuthenticated: () => false,
  };

  const activatedRouteMock = {
    paramMap: of(convertToParamMap({ id: '1' })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reviews],
      providers: [
        { provide: ReviewsService, useValue: reviewsServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Reviews);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
