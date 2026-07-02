import { Component, DestroyRef, effect, inject, input, OnInit, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FiltersType } from '../../../models/filters-type.model';
import { DateRangePicker } from '../date-range-picker/date-range-picker';
import { DateRange } from '../../../models/date-range.model';
import { GuestControl } from '../guest-control/guest-control';
import { formatDateForApi } from '../../utils/date-format';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-panel',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    DateRangePicker,
    GuestControl,
  ],
  templateUrl: './search-panel.html',
  styleUrl: './search-panel.scss',
})
export class SearchPanel implements OnInit {
  private destroyRef = inject(DestroyRef);
  filters = input<Partial<FiltersType>>({});
  search = output<Partial<FiltersType>>();

  fb = inject(FormBuilder);

  searchForm = this.fb.group({
    destination: [''],
    dateRange: this.fb.control<DateRange>({
      start: null,
      end: null,
    }),
    guests: this.fb.control(1),
  });

  submitSearch() {
    this.searchForm.updateValueAndValidity();
  }

  constructor() {
    effect(() => {
      const filters = this.filters();

      this.searchForm.patchValue(
        {
          destination: filters.destination ?? '',
          guests: filters.guests ?? 1,
          dateRange: {
            start: filters.checkIn ? new Date(filters.checkIn) : null,
            end: filters.checkOut ? new Date(filters.checkOut) : null,
          },
        },
        { emitEvent: false },
      );
    });
  }

  ngOnInit() {
    this.searchForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.search.emit({
        destination: value.destination?.trim() || undefined,
        guests: value.guests ?? undefined,
        checkIn: value.dateRange?.start ? formatDateForApi(value.dateRange.start) : undefined,
        checkOut: value.dateRange?.end ? formatDateForApi(value.dateRange.end) : undefined,
      });
    });
  }

  clearDestination() {
    this.searchForm.controls.destination.setValue('');
  }
}
