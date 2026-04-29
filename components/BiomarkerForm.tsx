'use client';

import { useState } from 'react';
import { parsePdfFile } from '@/lib/client/pdf/parsePdfFile';
import { BiomarkerData } from '@/types/biomarkers';
import { TextInput } from '@/components/ui';

interface BiomarkerFormProps {
  onSubmit: (data: BiomarkerData) => void;
}

export default function BiomarkerForm({ onSubmit }: BiomarkerFormProps) {
  const [formData, setFormData] = useState<BiomarkerData>({
    fastingGlucose: null,
    hba1c: null,
    totalCholesterol: null,
    ldlCholesterol: null,
    hdlCholesterol: null,
    triglycerides: null,
    vitaminD: null,
    tsh: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (field: keyof BiomarkerData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === '' ? null : parseFloat(value),
    }));
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Please choose a PDF file.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const { text: pdfText } = await parsePdfFile(file);
      const res = await fetch('/api/extract-biomarkers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pdfText }),
      });
      if (!res.ok) {
        let message = 'Failed to extract data from lab report';
        try {
          const err = (await res.json()) as { error?: string };
          if (typeof err.error === 'string') message = err.error;
        } catch {
          // ignore
        }
        throw new Error(message);
      }
      const extractedData: BiomarkerData = await res.json();

      const hasAnyValue = Object.values({
        fastingGlucose: extractedData.fastingGlucose ?? null,
        hba1c: extractedData.hba1c ?? null,
        totalCholesterol: extractedData.totalCholesterol ?? null,
        ldlCholesterol: extractedData.ldlCholesterol ?? null,
        hdlCholesterol: extractedData.hdlCholesterol ?? null,
        triglycerides: extractedData.triglycerides ?? null,
        vitaminD: extractedData.vitaminD ?? null,
        tsh: extractedData.tsh ?? null,
      }).some((value) => value !== null);

      if (!hasAnyValue) {
        setUploadError("Couldn't find matching values from that PDF. Please enter them manually.");
        return;
      }

      setFormData({
        fastingGlucose: extractedData.fastingGlucose ?? null,
        hba1c: extractedData.hba1c ?? null,
        totalCholesterol: extractedData.totalCholesterol ?? null,
        ldlCholesterol: extractedData.ldlCholesterol ?? null,
        hdlCholesterol: extractedData.hdlCholesterol ?? null,
        triglycerides: extractedData.triglycerides ?? null,
        vitaminD: extractedData.vitaminD ?? null,
        tsh: extractedData.tsh ?? null,
      });
    } catch (error) {
      console.error('PDF upload error:', error);
      setUploadError(
        error instanceof Error
          ? error.message
          : 'Failed to extract data from PDF. Please enter values manually.',
      );
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
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
        <p className="mb-4 max-w-2xl text-sm leading-relaxed tracking-[-0.2px] text-stone-500">
          Use your latest lab report. You can leave fields blank if you don’t have a value.
        </p>

        <section
          aria-label="PDF upload"
          className="mb-8 rounded-lg border border-stone-200 bg-stone-50 p-4"
        >
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            disabled={isUploading}
            className="sr-only"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <label
              htmlFor={isUploading ? undefined : 'pdf-upload'}
              aria-disabled={isUploading}
              className={[
                'min-w-0',
                isUploading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
              ].join(' ')}
            >
              <p className="text-sm font-medium tracking-[-0.2px] text-stone-900">
                Upload a PDF lab report
              </p>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">
                Upload your lab report PDF to automatically extract biomarker values
              </p>
              {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
            </label>

            <label
              htmlFor={isUploading ? undefined : 'pdf-upload'}
              aria-disabled={isUploading}
              className={[
                'inline-flex shrink-0 items-center justify-center gap-2 rounded-[33px] border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium tracking-[-0.4px] text-stone-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900',
                isUploading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-stone-100',
              ].join(' ')}
            >
              {isUploading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
                  Extracting…
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload PDF
                </>
              )}
            </label>
          </div>
        </section>

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
                <TextInput
                  type="number"
                  step="0.1"
                  value={formData[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="min-w-40 sm:w-40"
                  placeholder="--"
                />
                <span className="w-16 text-sm text-stone-500">{field.unit}</span>
                <button
                  type="button"
                  title={field.info}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-sm text-stone-700 transition-colors cursor-pointer hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
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
          className="mt-10 inline-flex w-full items-center justify-center rounded-[33px] border border-lime-950 bg-lime-950 px-8 py-4 text-base font-semibold tracking-[-0.4px] text-lime-100 shadow-[2px_2px_5px_rgba(0,0,0,0.06)] transition-colors cursor-pointer hover:bg-lime-950/90 hover:border-lime-950/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
        >
          Analyze My Results →
        </button>
      </form>
    </div>
  );
}
