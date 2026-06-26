import { Component, computed, input, output, signal } from '@angular/core';
import { DropdownOption, DropdownValue } from '../../../models/dropdown.model';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-dropdown',
  imports: [ClickOutsideDirective],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  options = input.required<DropdownOption[]>();
  selectedValue = input<DropdownValue>(null);
  label = input('');
  placeholder = input('Select option');
  disabled = input(false);

  valueChanged = output<DropdownValue>();

  isDropdownOpen = signal(false);

  selectedOption = computed(() =>
    this.options().find((option) => option.value === this.selectedValue()),
  );

  toggleDropdown() {
    if (this.disabled()) return;
    this.isDropdownOpen.update((value) => !value);
  }

  selectOption(option: DropdownOption) {
    if (option.disabled) return;

    this.valueChanged.emit(option.value);
    this.isDropdownOpen.set(false);
  }
}
