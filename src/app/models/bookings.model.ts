export interface CreateBookingPayload {
  accommodationId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface Booking {
  id: number;
  accommodationId: number;
  accommodationName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice?: number;
  status?: string;
  createdAt: string;
}
