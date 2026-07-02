import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangePicker } from './date-range-picker';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('DateRangePicker', () => {
  let component: DateRangePicker;
  let fixture: ComponentFixture<DateRangePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangePicker],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangePicker);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
