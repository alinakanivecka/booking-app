import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FiltersType } from '../../../models/filters-type.model';

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
export class SearchPanel {
  search = output<Partial<FiltersType>>();

  fb = inject(FormBuilder);

  searchForm = this.fb.group({
    destination: [''],
    dateRange: this.fb.group({
      start: [null],
      end: [null],
    }),
    adults: [2],
  });

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  formattedDateRange(): string {
    const start = this.searchForm.controls.dateRange.controls.start.value;
    const end = this.searchForm.controls.dateRange.controls.end.value;

    if (!start || !end) {
      return 'Check-in  —  Check-out';
    }

    return `${this.formatDate(start)} - ${this.formatDate(end)}`;
  }

  submitSearch() {
    const start = this.searchForm.controls.dateRange.controls.start.value;
    const end = this.searchForm.controls.dateRange.controls.end.value;

    this.search.emit({
      city: this.searchForm.controls.destination.value ?? undefined,
      guests: this.searchForm.controls.adults.value ?? undefined,
      checkIn: start ?? undefined,
      checkOut: end ?? undefined,
    });
  }

  clearDestination() {
    this.searchForm.controls.destination.setValue('');
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
