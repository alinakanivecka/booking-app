import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-guest-control',
  imports: [],
  templateUrl: './guest-control.html',
  styleUrl: './guest-control.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GuestControl),
      multi: true,
    },
  ],
})
export class GuestControl implements ControlValueAccessor {
  value = 1;

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(value: number | null): void {
    this.value = value ?? 1;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  increase(): void {
    this.setValue(this.value + 1);
  }

  decrease(): void {
    if (this.value <= 1) return;

    this.setValue(this.value - 1);
  }

  private setValue(value: number): void {
    this.value = value;
    this.onChange(this.value);
    this.onTouched();
  }
}
