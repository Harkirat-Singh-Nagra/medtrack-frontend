import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Medication } from '../types';
import { initialMedications } from '../data/mockData';

interface Ctx {
  medications: Medication[];
  addMedication: (m: Medication) => void;
  markTaken: (id: string) => void;
}

const MedicationContext = createContext<Ctx | null>(null);

export function MedicationProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);

  const addMedication = (m: Medication) => setMedications(prev => [...prev, m]);
  const markTaken = (id: string) =>
    setMedications(prev => prev.map(m =>
      m.id === id ? { ...m, remaining: Math.max(0, m.remaining - m.tabletsPerIntake) } : m));

  return (
    <MedicationContext.Provider value={{ medications, addMedication, markTaken }}>
      {children}
    </MedicationContext.Provider>
  );
}

export function useMedications() {
  const ctx = useContext(MedicationContext);
  if (!ctx) throw new Error('useMedications must be used inside MedicationProvider');
  return ctx;
}