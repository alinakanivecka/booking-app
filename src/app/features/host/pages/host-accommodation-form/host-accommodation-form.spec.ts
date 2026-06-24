import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostAccommodationForm } from './host-accommodation-form';

describe('HostAccommodationForm', () => {
  let component: HostAccommodationForm;
  let fixture: ComponentFixture<HostAccommodationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostAccommodationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(HostAccommodationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
