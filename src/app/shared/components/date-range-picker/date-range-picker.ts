import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateRange } from '../../../models/date-range.model';

@Component({
  selector: 'app-date-range-picker',
  imports: [MatDatepickerModule, MatFormFieldModule],
  templateUrl: './date-range-picker.html',
  styleUrl: './date-range-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePicker),
      multi: true,
    },
  ],
})
export class DateRangePicker implements ControlValueAccessor {
  today = new Date(new Date().setHours(0, 0, 0, 0));

  value: DateRange = {
    start: null,
    end: null,
  };

  private onChange: (value: DateRange) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: DateRange | null): void {
    this.value = value ?? {
      start: null,
      end: null,
    };
  }

  registerOnChange(fn: (value: DateRange) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setStart(start: Date | null): void {
    this.value = {
      ...this.value,
      start,
    };

    this.onChange(this.value);
    this.onTouched();
  }

  setEnd(end: Date | null): void {
    this.value = {
      ...this.value,
      end,
    };

    this.onChange(this.value);
    this.onTouched();
  }

  formattedDateRange(): string {
    const { start, end } = this.value;

    if (!start || !end) {
      return 'Check-in - Check-out';
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
}
