import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FiltersType } from '../../../models/filters-type.model';
import { U } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-search-panel',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './search-panel.html',
  styleUrl: './search-panel.scss',
})
export class SearchPanel implements OnInit {
  filters = input<Partial<FiltersType>>({});
  search = output<Partial<FiltersType>>();

  fb = inject(FormBuilder);

  searchForm = this.fb.group({
    destination: [''],
    dateRange: this.fb.group({
      start: [null as Date | null],
      end: [null as Date | null],
    }),
    adults: [1],
  });

  submitSearch() {
    this.searchForm.updateValueAndValidity();
  }

  constructor() {
    effect(() => {
      const filters = this.filters();

      this.searchForm.patchValue(
        {
          destination: filters.city ?? '',
          adults: filters.guests ?? 2,
          // dateRange: {
          //   start: filters.checkIn ? new Date(filters.checkIn) : null,
          //   end: filters.checkOut ? new Date(filters.checkOut) : null,
          // },
        },
        { emitEvent: false },
      );
    });
  }

  ngOnInit() {
    this.searchForm.valueChanges.subscribe((value) => {
      this.search.emit({
        city: value.destination?.trim() || undefined,
        guests: value.adults ?? undefined,
        checkIn: value.dateRange?.start ? this.formatDateForApi(value.dateRange.start) : undefined,
        checkOut: value.dateRange?.end ? this.formatDateForApi(value.dateRange.end) : undefined,
      });
    });
  }

  clearDestination() {
    this.searchForm.controls.destination.setValue('');
  }

  formattedDateRange(): string {
    const start = this.searchForm.controls.dateRange.controls.start.value;
    const end = this.searchForm.controls.dateRange.controls.end.value;

    if (!start || !end) {
      return 'Check-in  —  Check-out';
    }

    return `${this.formatDate(start)} - ${this.formatDate(end)}`;
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  private formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  increase(controlName: 'adults') {
    const control = this.searchForm.controls[controlName];
    control.setValue((control.value ?? 0) + 1);
  }

  decrease(controlName: 'adults') {
    const control = this.searchForm.controls[controlName];
    const currentValue = control.value ?? 0;

    if (controlName === 'adults' && currentValue <= 1) return;

    control.setValue(currentValue - 1);
  }
}
