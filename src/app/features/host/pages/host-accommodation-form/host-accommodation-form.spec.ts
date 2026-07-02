import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { HostAccommodationForm } from './host-accommodation-form';
import { HostService } from '../../../../core/services/host.service';
import { AccommodationsService } from '../../../../core/services/accommodations.service';

describe('HostAccommodationForm', () => {
  let component: HostAccommodationForm;
  let fixture: ComponentFixture<HostAccommodationForm>;

  const hostServiceMock = {
    createHostAccommodation: () =>
      of({
        id: 1,
        name: 'Test',
        description: 'Test',
        city: 'Budapest',
        country: 'Hungary',
        maxGuests: 2,
        pricePerNight: 100,
        amenities: [],
        images: [],
      }),
    editHostAccommodation: () => of({}),
    uploadHostAccommodationImages: () => of([]),
  };

  const accommodationsServiceMock = {
    getAccommodationById: () =>
      of({
        id: 1,
        name: 'Test',
        description: 'Test',
        city: 'Budapest',
        country: 'Hungary',
        maxGuests: 2,
        pricePerNight: 100,
        amenities: [],
        images: [],
        rating: null,
      }),
  };

  const activatedRouteMock = {
    paramMap: of(convertToParamMap({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostAccommodationForm],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: HostService, useValue: hostServiceMock },
        { provide: AccommodationsService, useValue: accommodationsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostAccommodationForm);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
