import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostAccommodations } from './host-accommodations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { HostService } from '../../../../core/services/host.service';

describe('HostAccommodations', () => {
  let component: HostAccommodations;
  let fixture: ComponentFixture<HostAccommodations>;

  const hostServiceMock = {
    getHostAccommodations: () => of([]),
    removeHostAccommodation: () => of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostAccommodations],
      providers: [provideRouter([]), { provide: HostService, useValue: hostServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HostAccommodations);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
