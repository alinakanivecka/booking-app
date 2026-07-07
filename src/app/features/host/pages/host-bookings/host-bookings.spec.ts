import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HostBookings } from './host-bookings';
import { HostService } from '../../../../core/services/host.service';

describe('HostBookings', () => {
  let component: HostBookings;
  let fixture: ComponentFixture<HostBookings>;

  const hostServiceMock = {
    getHostBookings: () =>
      of({
        items: [],
        totalItems: 0,
        totalPages: 0,
        page: 1,
        pageSize: 20,
      }),
    getHostAccommodations: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostBookings],
      providers: [{ provide: HostService, useValue: hostServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HostBookings);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
