import type { Medication, Pharmacy } from '../types';

export const pharmacies: Pharmacy[] = [
  { id: 'p1', name: 'Riverside Pharmacy', distanceKm: 0.8, open: true, closes: '9:00 PM', address: '12 River St' },
  { id: 'p2', name: 'HealthPlus Pharmacy', distanceKm: 1.4, open: true, closes: '10:00 PM', address: '45 Main St' },
  { id: 'p3', name: 'Sunrise Pharmacy', distanceKm: 2.1, open: true, closes: '8:00 PM', address: '9 Oak Ave' },
  { id: 'p4', name: 'Wellness Pharmacy', distanceKm: 3.5, open: true, closes: '9:00 PM', address: '77 King Rd' },
];

export const initialMedications: Medication[] = [
  { id: 'm1', name: 'Lisinopril', dosage: '10 mg', tabletsPerIntake: 1, condition: 'High Blood Pressure',
    intakeTimes: ['08:00'], remaining: 20, refillThreshold: 5, pharmacyId: 'p1', remindersOn: true },
  { id: 'm2', name: 'Metformin', dosage: '500 mg', tabletsPerIntake: 1, condition: 'Type 2 Diabetes',
    intakeTimes: ['08:00', '20:00'], remaining: 3, refillThreshold: 5, pharmacyId: 'p2', remindersOn: true },
  { id: 'm3', name: 'Atorvastatin', dosage: '20 mg', tabletsPerIntake: 1, condition: 'High Cholesterol',
    intakeTimes: ['21:00'], remaining: 28, refillThreshold: 5, pharmacyId: 'p1', remindersOn: true },
];