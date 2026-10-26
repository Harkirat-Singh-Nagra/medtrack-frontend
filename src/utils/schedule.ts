import type { Medication } from '../types';

export interface Dose {
  key: string; // unique id for one dose: "medicationId|time"
  medication: Medication;
  time: string; // "08:00"
}

// Every dose scheduled for today, sorted by time
export function getTodaysDoses(meds: Medication[]): Dose[] {
  return meds
    .flatMap(m =>
      m.intakeTimes.map(t => ({ key: `${m.id}|${t}`, medication: m, time: t }))
    )
    .sort((a, b) => a.time.localeCompare(b.time));
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// "08:00" -> "8:00 AM"
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

// The next dose not yet taken. If every remaining dose is already past,
// returns the earliest one (it is overdue).
export function getNextDose(doses: Dose[], taken: string[], now = new Date()): Dose | null {
  const pending = doses.filter(d => !taken.includes(d.key));
  if (pending.length === 0) return null;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return pending.find(d => toMinutes(d.time) >= nowMinutes) ?? pending[0];
}

// "in 25 min", "in 2 h 10 min", or "overdue"
export function timeUntil(time: string, now = new Date()): string {
  const diff = toMinutes(time) - (now.getHours() * 60 + now.getMinutes());
  if (diff < 0) return 'overdue';
  if (diff < 60) return `in ${diff} min`;
  return `in ${Math.floor(diff / 60)} h ${diff % 60} min`;
}