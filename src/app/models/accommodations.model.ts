export interface AccommodationsResponse {
  items: Item[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  city: string;
  country: string;
  pricePerNight: number;
  maxGuests: number;
  rating: number;
  amenities: string[];
  images: string[];
  hostId: number;
  host: Host;
}

export interface Host {
  id: number;
  name: string;
  avatarUrl: string;
}
