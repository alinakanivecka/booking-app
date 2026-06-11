export interface AccommodationsResponse {
  items: Items[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface Items {
  id: number;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  images: string[];
  hostId: number;
}
