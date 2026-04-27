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
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? null : parseFloat(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const biomarkerFields = [
    { key: 'fastingGlucose' as keyof BiomarkerData, label: 'Fasting Glucose', unit: 'mg/dL', info: 'Measures blood sugar levels after fasting' },
    { key: 'hba1c' as keyof BiomarkerData, label: 'HbA1c', unit: '%', info: 'Average blood sugar over 2-3 months' },
    { key: 'totalCholesterol' as keyof BiomarkerData, label: 'Total Cholesterol', unit: 'mg/dL', info: 'Combined cholesterol in your blood' },
    { key: 'ldlCholesterol' as keyof BiomarkerData, label: 'LDL Cholesterol', unit: 'mg/dL', info: '"Bad" cholesterol that can build up in arteries' },
    { key: 'hdlCholesterol' as keyof BiomarkerData, label: 'HDL Cholesterol', unit: 'mg/dL', info: '"Good" cholesterol that removes LDL' },
    { key: 'triglycerides' as keyof BiomarkerData, label: 'Triglycerides', unit: 'mg/dL', info: 'Type of fat in your blood' },
    { key: 'vitaminD' as keyof BiomarkerData, label: 'Vitamin D', unit: 'ng/mL', info: 'Important for bone health and immunity' },
    { key: 'tsh' as keyof BiomarkerData, label: 'TSH', unit: 'mIU/L', info: 'Thyroid function marker' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Biomarkers</h2>
        
        <div className="space-y-4">
          {biomarkerFields.map(field => (
            <div key={field.key} className="flex items-center gap-4">
              <label className="flex-1 text-gray-700 font-medium">
                {field.label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={formData[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="--"
                />
                <span className="text-gray-600 w-16">{field.unit}</span>
                <button
                  type="button"
                  title={field.info}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ℹ️
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full mt-8 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          Analyze My Results →
        </button>
      </form>
    </div>
  );
}
