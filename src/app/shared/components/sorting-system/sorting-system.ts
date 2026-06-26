import { Component, input, output } from '@angular/core';
import { DropdownOption, DropdownValue } from '../../../models/dropdown.model';
import { Dropdown } from "../dropdown/dropdown";

@Component({
  selector: 'app-sorting-system',
  imports: [Dropdown],
  templateUrl: './sorting-system.html',
  styleUrl: './sorting-system.scss',
})
export class SortingSystem {
  sortOptions = input<DropdownOption[]>([]);
  selectedSort = input<string>('');
  sortChanged = output<string>();

  selectSort(value: DropdownValue) {
    this.sortChanged.emit(value?.toString() || '');
  }
}
