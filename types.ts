
export interface Activity {
  time: string;
  activity: string;
  location: string;
  description: string;
  cost_estimate: string;
  clinical_grade: boolean;
  duration_mins: number;
  type: 'Protocol' | 'Recovery' | 'Immersion' | 'Nourishment';
  biological_impact: string;
  biological_load: number; // -10 (Recovery) to +10 (High Intensity Protocol)
  suitability_tags: string[];
  verification_url?: string;
}

export interface DayPlan {
  day_number: number;
  date: string;
  focus: string;
  total_recovery_score: number;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  itinerary_name: string;
  destination: string;
  biological_goal: string;
  cellular_optimization_score: number;
  days: DayPlan[];
  longevity_hacks: string[];
  grounding_sources?: {title: string, uri: string}[];
}

export interface ProtocolInputs {
  destination: string;
  startDate: string;
  endDate: string;
  biologicalGoal: 'Cellular Regeneration' | 'Cognitive Peak' | 'Stress Deceleration' | 'Athletic Recovery';
  medicalProtocol: string;
  luxuryTier: 'Ultra-Luxe' | 'Sovereign' | 'Clinical Focus';
  specificNeeds: string[];
}
