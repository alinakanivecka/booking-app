export interface FiltersType {
  page: number;
  pageSize: number;
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  amenities?: string[];
  sort?: string;
}

export interface HostFiltersType {
  accommodationId?: number;
  status?: string;
  page: number;
  pageSize: number;
}
