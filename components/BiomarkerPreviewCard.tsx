import type { BiomarkerResult, BiomarkerStatus } from '@/types/biomarkers';

export type BiomarkerPreviewCardProps = {
  title: string;
  value: string;
  status: 'warning' | 'ok';
  lead: string;
  description: string;
  recommendation: string;
  pill: string;
};

export function BiomarkerPreviewCard({
  title,
  value,
  status,
  lead,
  description,
  recommendation,
  pill,
}: BiomarkerPreviewCardProps) {
  const statusEmoji = status === 'warning' ? '⚠️' : '✅';
  const valueClassName = status === 'warning' ? 'text-amber-600' : 'text-lime-800';

  return (
    <div className="rounded-xl border border-stone-200/70 bg-white p-7 shadow-[2px_2px_5px_rgba(0,0,0,0.02)]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h4 className="text-lg font-medium tracking-[-0.3px]">{title}</h4>
          <p className={`text-2xl font-semibold ${valueClassName}`}>{value}</p>
        </div>
        <span className="text-2xl" aria-hidden>
          {statusEmoji}
        </span>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-stone-500">
        <span className="font-medium">{lead}</span> {description}
      </p>
      <p className="text-sm font-medium">→ {recommendation}</p>
      <p className="mt-6">
        <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-800">
          {pill}
        </span>
      </p>
    </div>
  );
}

export type BiomarkerCardProps = {
  biomarker: BiomarkerResult;
};

const STATUS_TO_PILL_CLASSNAME: Record<BiomarkerStatus, string> = {
  optimal: 'border-lime-200 bg-lime-50 text-lime-800',
  suboptimal: 'border-amber-200 bg-amber-50 text-amber-800',
  concerning: 'border-rose-200 bg-rose-50 text-rose-800',
};

const STATUS_TO_EMOJI: Record<BiomarkerStatus, string> = {
  optimal: '✅',
  suboptimal: '⚠️',
  concerning: '❌',
};

export function BiomarkerCard({ biomarker }: BiomarkerCardProps) {
  const statusEmoji = STATUS_TO_EMOJI[biomarker.status] ?? '⚪';
  const pillClassName =
    STATUS_TO_PILL_CLASSNAME[biomarker.status] ?? 'border-stone-200 bg-stone-100 text-stone-800';

  return (
    <div className="rounded-xl border border-stone-200/70 bg-white p-7 shadow-[2px_2px_5px_rgba(0,0,0,0.02)]">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium tracking-[-0.2px] text-stone-500">{biomarker.name}</h3>
          <p className="mt-1 text-2xl font-semibold tracking-[-1px] text-stone-900">
            {biomarker.value} {biomarker.unit}
          </p>
        </div>
        <span className="text-xl" aria-hidden>
          {statusEmoji}
        </span>
      </div>
      <span
        className={`mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${pillClassName}`}
      >
        {biomarker.statusLabel}
      </span>
    </div>
  );
}
