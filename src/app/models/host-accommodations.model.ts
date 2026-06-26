export interface HostAccommodation {
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

export interface CreateHostAccommodationPayload {
  name: string;
  description: string;
  city: string;
  country: string;
  pricePerNight: number;
  maxGuests: number;
  amenities: string[];
}

export interface HostAccommodationImageResponse {
  id: number;
  url: string;
  fileName: string;
}
