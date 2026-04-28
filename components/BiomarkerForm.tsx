'use client';

import { useState } from 'react';
import { BiomarkerData } from '@/types/biomarkers';

interface BiomarkerFormProps {
  onSubmit: (data: BiomarkerData) => void;
}

export default function BiomarkerForm({ onSubmit }: BiomarkerFormProps) {
  const [formData, setFormData] = useState<BiomarkerData>({
    fastingGlucose: 120,
    hba1c: 5.8,
    totalCholesterol: 210,
    ldlCholesterol: 140,
    hdlCholesterol: 45,
    triglycerides: 180,
    vitaminD: 22,
    tsh: 2.5,
  });

  const handleChange = (field: keyof BiomarkerData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === '' ? null : parseFloat(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const biomarkerFields = [
    {
      key: 'fastingGlucose' as keyof BiomarkerData,
      label: 'Fasting Glucose',
      unit: 'mg/dL',
      info: 'Measures blood sugar levels after fasting',
    },
    {
      key: 'hba1c' as keyof BiomarkerData,
      label: 'HbA1c',
      unit: '%',
      info: 'Average blood sugar over 2-3 months',
    },
    {
      key: 'totalCholesterol' as keyof BiomarkerData,
      label: 'Total Cholesterol',
      unit: 'mg/dL',
      info: 'Combined cholesterol in your blood',
    },
    {
      key: 'ldlCholesterol' as keyof BiomarkerData,
      label: 'LDL Cholesterol',
      unit: 'mg/dL',
      info: '"Bad" cholesterol that can build up in arteries',
    },
    {
      key: 'hdlCholesterol' as keyof BiomarkerData,
      label: 'HDL Cholesterol',
      unit: 'mg/dL',
      info: '"Good" cholesterol that removes LDL',
    },
    {
      key: 'triglycerides' as keyof BiomarkerData,
      label: 'Triglycerides',
      unit: 'mg/dL',
      info: 'Type of fat in your blood',
    },
    {
      key: 'vitaminD' as keyof BiomarkerData,
      label: 'Vitamin D',
      unit: 'ng/mL',
      info: 'Important for bone health and immunity',
    },
    {
      key: 'tsh' as keyof BiomarkerData,
      label: 'TSH',
      unit: 'mIU/L',
      info: 'Thyroid function marker',
    },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-stone-200/70 bg-white p-8 shadow-[2px_2px_5px_rgba(0,0,0,0.02)]"
      >
        <h2 className="mb-2 font-tight text-3xl font-semibold tracking-[-1.6px]">
          Enter your biomarkers
        </h2>
        <p className="mb-8 max-w-2xl text-sm leading-relaxed tracking-[-0.2px] text-stone-500">
          Use your latest lab report. You can leave fields blank if you don’t have a value.
        </p>

        <div className="space-y-4">
          {biomarkerFields.map((field) => (
            <div key={field.key} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium tracking-[-0.2px] text-stone-800">
                  {field.label}
                </label>
                <p className="mt-0.5 text-xs leading-relaxed text-stone-500">{field.info}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  value={formData[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full min-w-40 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm tracking-[-0.2px] text-stone-900 shadow-sm placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 sm:w-40"
                  placeholder="--"
                />
                <span className="w-16 text-sm text-stone-500">{field.unit}</span>
                <button
                  type="button"
                  title={field.info}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-sm text-stone-700 transition-colors hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
                >
                  <span aria-hidden>ℹ️</span>
                  <span className="sr-only">{field.info}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-10 inline-flex w-full items-center justify-center rounded-[33px] border border-lime-950 bg-lime-950 px-8 py-4 text-base font-semibold tracking-[-0.4px] text-lime-100 shadow-[2px_2px_5px_rgba(0,0,0,0.06)] transition-colors hover:bg-lime-950/90 hover:border-lime-950/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
        >
          Analyze My Results →
        </button>
      </form>
    </div>
  );
}
