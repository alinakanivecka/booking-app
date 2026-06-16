import { Component, computed, input, output, signal } from '@angular/core';
import { ClickOutsideDirective } from "../../directives/click-outside.directive";

@Component({
  selector: 'app-sorting-system',
  imports: [ClickOutsideDirective],
  templateUrl: './sorting-system.html',
  styleUrl: './sorting-system.scss',
})
export class SortingSystem {
  isDropdownOpen = signal(false);

  sortOptions = input([{ label: '', value: '' }]);
  selectedSort = input<string>();
  sortChanged = output<string>();

  selectedOption = computed(() => this.sortOptions().find((o) => o.value === this.selectedSort()));

  selectOption(value: string) {
    this.sortChanged.emit(value);
    this.isDropdownOpen.set(false);
  }

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }
}
