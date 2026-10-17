import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Info, X } from 'lucide-react';
import { useMedications } from '../context/MedicationContext';
import { pharmacies } from '../data/mockData';

interface FormState {
  name: string;
  dosage: string;
  condition: string;
  remaining: string;
  intakeTimes: string[];
  tabletsPerIntake: string;
  remindersOn: boolean;
  refillThreshold: string;
  pharmacyId: string;
  notes: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  name: '',
  dosage: '',
  condition: '',
  remaining: '',
  intakeTimes: [],
  tabletsPerIntake: '1',
  remindersOn: true,
  refillThreshold: '5',
  pharmacyId: '',
  notes: '',
};

const stepLabels = ['Medication Details', 'Schedule & Pharmacy', 'Review'];

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200';

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

function Field({ label, htmlFor, required, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function AddMedicationPage() {
  const navigate = useNavigate();
  const { addMedication } = useMedications();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [newTime, setNewTime] = useState('');

  // Update one field of the form
  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function addTime() {
    if (!newTime) return;
    if (form.intakeTimes.includes(newTime)) {
      setNewTime('');
      return;
    }
    update('intakeTimes', [...form.intakeTimes, newTime].sort());
    setNewTime('');
  }

  function removeTime(time: string) {
    update('intakeTimes', form.intakeTimes.filter(t => t !== time));
  }

  function validate(stepToCheck: number): boolean {
    const e: Errors = {};

    if (stepToCheck === 1) {
      if (!form.name.trim()) e.name = 'Medication name is required.';
      if (!form.dosage.trim()) e.dosage = 'Dosage is required (e.g. 10 mg).';
      if (!form.condition.trim()) e.condition = 'Disease / condition is required.';
      if (form.remaining.trim() === '') {
        e.remaining = 'Quantity remaining is required.';
      } else if (!/^\d+$/.test(form.remaining.trim())) {
        e.remaining = 'Enter a whole number, 0 or higher.';
      }
    }

    if (stepToCheck === 2) {
      if (form.intakeTimes.length === 0) e.intakeTimes = 'Add at least one intake time.';
      if (!/^[1-9]\d*$/.test(form.tabletsPerIntake.trim())) {
        e.tabletsPerIntake = 'Enter a number of 1 or more.';
      }
      if (!form.pharmacyId) e.pharmacyId = 'Please choose a pharmacy.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validate(step)) setStep(step + 1);
  }

  function back() {
    setErrors({});
    setStep(step - 1);
  }

  function save() {
    // Re-check both steps before saving
    if (!validate(1)) return setStep(1);
    if (!validate(2)) return setStep(2);

    addMedication({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      dosage: form.dosage.trim(),
      tabletsPerIntake: Number(form.tabletsPerIntake),
      condition: form.condition.trim(),
      intakeTimes: form.intakeTimes,
      remaining: Number(form.remaining),
      refillThreshold: Number(form.refillThreshold),
      pharmacyId: form.pharmacyId,
      remindersOn: form.remindersOn,
      notes: form.notes.trim() || undefined,
    });
    navigate('/medications');
  }

  const selectedPharmacy = pharmacies.find(p => p.id === form.pharmacyId);

  return (
    <div>
      {/* Page title */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/medications')}
          aria-label="Back to medications"
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-blue-900">Add Medication</h1>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        {/* Step indicator */}
        <ol className="mb-8 flex items-center gap-4" aria-label="Progress">
          {stepLabels.map((label, i) => {
            const number = i + 1;
            const active = number === step;
            const done = number < step;
            return (
              <li key={label} className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    active || done ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {done ? <Check size={16} /> : number}
                </span>
                <span className={`text-sm ${active ? 'font-semibold text-blue-700' : 'text-slate-500'}`}>
                  {label}
                </span>
                {number < stepLabels.length && <span className="mx-2 h-px w-10 bg-slate-300" />}
              </li>
            );
          })}
        </ol>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Medication name" htmlFor="name" required error={errors.name}>
              <input
                id="name"
                className={inputClass}
                placeholder="e.g. Lisinopril"
                value={form.name}
                onChange={e => update('name', e.target.value)}
              />
            </Field>

            <Field label="Dosage" htmlFor="dosage" required error={errors.dosage}>
              <input
                id="dosage"
                className={inputClass}
                placeholder="e.g. 10 mg"
                value={form.dosage}
                onChange={e => update('dosage', e.target.value)}
              />
            </Field>

            <Field label="Disease / Condition" htmlFor="condition" required error={errors.condition}>
              <input
                id="condition"
                className={inputClass}
                placeholder="e.g. High Blood Pressure"
                value={form.condition}
                onChange={e => update('condition', e.target.value)}
              />
            </Field>

            <Field label="Quantity remaining" htmlFor="remaining" required error={errors.remaining}>
              <input
                id="remaining"
                type="number"
                min={0}
                className={inputClass}
                placeholder="e.g. 30 tablets"
                value={form.remaining}
                onChange={e => update('remaining', e.target.value)}
              />
            </Field>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Field label="Intake times" htmlFor="newTime" required error={errors.intakeTimes}>
                <div className="flex gap-2">
                  <input
                    id="newTime"
                    type="time"
                    className={inputClass}
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={addTime}
                    className="rounded-lg bg-sky-100 px-4 font-semibold text-blue-800 hover:bg-sky-200"
                  >
                    Add
                  </button>
                </div>
              </Field>
              {form.intakeTimes.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {form.intakeTimes.map(t => (
                    <li key={t} className="flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-sm">
                      {t}
                      <button type="button" onClick={() => removeTime(t)} aria-label={`Remove ${t}`}>
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Field label="Tablets per intake" htmlFor="tabletsPerIntake" required error={errors.tabletsPerIntake}>
              <input
                id="tabletsPerIntake"
                type="number"
                min={1}
                className={inputClass}
                value={form.tabletsPerIntake}
                onChange={e => update('tabletsPerIntake', e.target.value)}
              />
            </Field>

            <div className="flex items-center gap-3">
              <input
                id="remindersOn"
                type="checkbox"
                className="h-5 w-5"
                checked={form.remindersOn}
                onChange={e => update('remindersOn', e.target.checked)}
              />
              <label htmlFor="remindersOn" className="text-base font-medium">
                Set reminder
              </label>
            </div>

            <Field label="Refill threshold" htmlFor="refillThreshold">
              <select
                id="refillThreshold"
                className={inputClass}
                value={form.refillThreshold}
                onChange={e => update('refillThreshold', e.target.value)}
              >
                {[3, 5, 7, 10, 14].map(n => (
                  <option key={n} value={n}>
                    Alert when below {n} tablets
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Pharmacy" htmlFor="pharmacyId" required error={errors.pharmacyId}>
              <select
                id="pharmacyId"
                className={inputClass}
                value={form.pharmacyId}
                onChange={e => update('pharmacyId', e.target.value)}
              >
                <option value="">Select a pharmacy</option>
                {pharmacies.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.distanceKm} km)
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Notes (optional)" htmlFor="notes">
              <textarea
                id="notes"
                rows={3}
                className={inputClass}
                placeholder="e.g. Take with food"
                value={form.notes}
                onChange={e => update('notes', e.target.value)}
              />
            </Field>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">Please review your medication</h2>
            <dl className="grid gap-x-8 gap-y-3 md:grid-cols-2">
              {[
                ['Medication name', form.name],
                ['Dosage', form.dosage],
                ['Condition', form.condition],
                ['Quantity remaining', `${form.remaining} tablets`],
                ['Intake times', form.intakeTimes.join(', ')],
                ['Tablets per intake', form.tabletsPerIntake],
                ['Reminder', form.remindersOn ? 'On' : 'Off'],
                ['Refill alert below', `${form.refillThreshold} tablets`],
                ['Pharmacy', selectedPharmacy?.name ?? ''],
                ['Notes', form.notes || '—'],
              ].map(([term, value]) => (
                <div key={term} className="border-b border-slate-100 pb-2">
                  <dt className="text-sm text-slate-500">{term}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={step === 1 ? () => navigate('/medications') : back}
            className="flex-1 rounded-lg bg-sky-100 px-5 py-3 font-semibold text-blue-800 hover:bg-sky-200"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={save}
              className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Save Medication
            </button>
          )}
        </div>

        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Info size={16} /> Alerts are assistance only and are not medical advice or diagnosis.
        </p>
      </div>
    </div>
  );
}