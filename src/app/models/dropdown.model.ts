export type DropdownValue = string | number | null;

export interface DropdownOption {
  label: string;
  value: DropdownValue;
  disabled?: boolean;
}
