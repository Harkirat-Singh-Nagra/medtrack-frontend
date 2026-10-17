import { Link } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { useMedications } from '../context/MedicationContext';

export default function MedicationsPage() {
  const { medications } = useMedications();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-900">My Medications</h1>
        <Link to="/medications/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          <Plus size={20} /> Add Medication
        </Link>
      </div>

      <h2 className="mb-2 text-lg font-semibold">Current Medications</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left">
          <thead className="text-sm text-slate-600">
            <tr>
              <th className="p-3">Medication</th><th>Dosage</th><th>Next Intake</th>
              <th>Remaining</th><th>Refill Status</th><th>Condition</th><th></th>
            </tr>
          </thead>
          <tbody>
            {medications.map(m => {
              const low = m.remaining < m.refillThreshold;
              return (
                <tr key={m.id} className="border-t border-slate-100">
                  <td className="p-3 font-semibold">{m.name} <span className="font-normal text-slate-500">{m.dosage}</span></td>
                  <td>{m.tabletsPerIntake} tablet</td>
                  <td>{m.intakeTimes[0]}</td>
                  <td>{m.remaining} tablets</td>
                  <td>
                    <span className={`rounded px-2 py-1 text-sm font-medium ${
                      low ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                      {low ? 'Low (refill soon)' : 'Good'}
                    </span>
                  </td>
                  <td>{m.condition}</td>
                  <td><ChevronRight /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Next: add a "Today's Schedule" section below, as small cards with a checkbox that calls markTaken */}
    </div>
  );
}