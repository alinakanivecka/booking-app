export interface Review {
  id: number;
  accommodationId: number;
  customerId: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
