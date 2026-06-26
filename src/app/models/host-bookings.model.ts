export interface HostBookinsResponse {
  items: HostBooking[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface HostBooking {
  id: number;
  accommodationId: number;
  accommodationName: string;
  checkIn: string;
  checkOut: string;
  guest: HostBookingGuest;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface HostBookingGuest {
  id: number;
  name: string;
}
