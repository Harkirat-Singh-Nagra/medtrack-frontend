import type { Medication, AlertItem } from '../types';

// Tiny sample interaction table. A real version would come from the backend/DB.
const interactions = [
  { a: 'lisinopril', b: 'atorvastatin', severity: 'High' as const,
    note: 'May increase the risk of certain side effects. Consult your healthcare provider.' },
];

export function getRefillAlerts(meds: Medication[]): AlertItem[] {
  return meds
    .filter(m => m.remaining < m.refillThreshold)
    .map(m => ({
      id: `refill-${m.id}`,
      type: 'Refill',
      message: `${m.name} ${m.dosage} has ${m.remaining} tablets remaining (below ${m.refillThreshold}).`,
      severity: 'Medium',
      timestamp: new Date().toISOString(),
    }));
}

export function getInteractionAlerts(meds: Medication[]): AlertItem[] {
  const names = meds.map(m => m.name.toLowerCase());
  return interactions
    .filter(i => names.includes(i.a) && names.includes(i.b))
    .map(i => ({
      id: `ddi-${i.a}-${i.b}`,
      type: 'DDI',
      message: `${i.a} + ${i.b}: ${i.note}`,
      severity: i.severity,
      timestamp: new Date().toISOString(),
    }));
}