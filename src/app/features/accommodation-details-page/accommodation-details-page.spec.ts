import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationDetailsPage } from './accommodation-details-page';

describe('AccommodationDetailsPage', () => {
  let component: AccommodationDetailsPage;
  let fixture: ComponentFixture<AccommodationDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccommodationDetailsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AccommodationDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
