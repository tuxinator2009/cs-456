export interface BookingSummary {
  tripId: string;
  tripCode: string;
  tripName: string;
  bookingCount: number;
  travelerCount: number;
  totalRevenue: number;
  earliestBooking: string;
  latestBooking: string;
}
