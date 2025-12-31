
export interface Activity {
  time: string;
  activity: string;
  location: string;
  description: string;
  cost_estimate: string;
  reservation_flag: boolean;
  duration_mins: number;
  tech_feature?: string;
  efficiency_note?: string;
  accessibility_note?: string; // New: For mobility or sensory needs
  suitability_tags: string[]; // New: e.g. ["Kid-friendly", "Senior-friendly", "Wheelchair-accessible"]
  booking_url?: string;
  provider?: 'Expedia' | 'Booking.com' | 'Viator' | 'Resy' | 'Local';
}

export interface DayPlan {
  day_number: number;
  date: string;
  summary: string;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  trip_name: string;
  destination: string;
  days: DayPlan[];
  tech_travel_tips: string[];
  inclusivity_summary?: string; // New: Brief overview of how trip fits the traveler profile
}

export interface TripInputs {
  destination: string;
  startDate: string;
  endDate: string;
  interests: string[];
  travelStyle: string;
  budget: string;
  travelerType: string; // New: Solo, Family, Seniors, Mobility-Needs, etc.
  pace: string; // New: Leisurely, Balanced, Intense
  hotelLocation?: string;
}
