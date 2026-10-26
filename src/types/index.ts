export type Severity = 'Low' | 'Medium' | 'High';

export interface Medication {
  id: string;
  name: string;
  dosage: string;          // "10 mg"
  tabletsPerIntake: number;
  condition: string;
  intakeTimes: string[];   // ["08:00", "21:00"]
  remaining: number;
  refillThreshold: number; // spec: alert when below 5
  pharmacyId: string;
  remindersOn: boolean;
  notes?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  distanceKm: number;
  open: boolean;
  closes: string;
  address: string;
}

export interface AlertItem {
  id: string;
  type: 'Reminder' | 'Refill' | 'DDI';
  message: string;
  severity: Severity;
  timestamp: string;
}

export interface IntakeRecord {
  id: string;
  date: string; // "2026-10-16"
  time: string; // "08:00"
  medicationName: string;
  dosage: string;
  status: 'Taken' | 'Missed' | 'Skipped';
}