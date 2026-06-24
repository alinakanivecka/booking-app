import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostAccommodations } from './host-accommodations';

describe('HostAccommodations', () => {
  let component: HostAccommodations;
  let fixture: ComponentFixture<HostAccommodations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostAccommodations],
    }).compileComponents();

    fixture = TestBed.createComponent(HostAccommodations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
