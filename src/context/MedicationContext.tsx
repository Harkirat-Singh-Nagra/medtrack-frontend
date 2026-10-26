import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Medication } from '../types';
import { initialMedications } from '../data/mockData';

interface Ctx {
  medications: Medication[];
  takenDoses: string[]; // keys like "m1|08:00"
  addMedication: (m: Medication) => void;
  markDoseTaken: (medicationId: string, time: string) => void;
}

const MedicationContext = createContext<Ctx | null>(null);

export function MedicationProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [takenDoses, setTakenDoses] = useState<string[]>([]);

  const addMedication = (m: Medication) => setMedications(prev => [...prev, m]);

  const markDoseTaken = (medicationId: string, time: string) => {
    const key = `${medicationId}|${time}`;
    if (takenDoses.includes(key)) return; // already taken
    setTakenDoses(prev => [...prev, key]);
    setMedications(prev =>
      prev.map(m =>
        m.id === medicationId
          ? { ...m, remaining: Math.max(0, m.remaining - m.tabletsPerIntake) }
          : m
      )
    );
  };

  return (
    <MedicationContext.Provider value={{ medications, takenDoses, addMedication, markDoseTaken }}>
      {children}
    </MedicationContext.Provider>
  );
}

export function useMedications() {
  const ctx = useContext(MedicationContext);
  if (!ctx) throw new Error('useMedications must be used inside MedicationProvider');
  return ctx;
}