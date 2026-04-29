import Link from 'next/link';
import { cx } from '@/lib/client/cx';

export type SpinnerProps = {
  className?: string;
  size?: number;
  label?: string;
};

export function Spinner({ className, size = 16, label = 'Loading' }: SpinnerProps) {
  const px = `${size}px`;

  return (
    <span className="inline-flex items-center justify-center">
      <span
        aria-hidden={label ? undefined : true}
        className={cx(
          'inline-block animate-spin rounded-full border-2 border-stone-300 border-t-stone-900',
          className,
        )}
        style={{ width: px, height: px }}
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}

export type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  className?: string;
};

export function CtaLink({ href, children, variant, className }: CtaLinkProps) {
  const ctaBase =
    'inline-flex items-center justify-center rounded-[33px] border px-6 py-3.5 text-sm font-medium -tracking-[0.4px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900';

  const ctaVariant = {
    primary:
      'border-lime-950 bg-lime-950 text-lime-100 hover:bg-lime-950/90 hover:border-lime-950/90',
    secondary: 'border-stone-300 bg-white text-stone-900 hover:bg-stone-100',
  } as const;

  return (
    <Link href={href} className={cx(ctaBase, ctaVariant[variant], className)}>
      {children}
    </Link>
  );
}

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export function TextInput({ className, ...props }: TextInputProps) {
  return (
    <input
      {...props}
      className={cx(
        'w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm tracking-[-0.2px] text-stone-900 shadow-sm placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900',
        className,
      )}
    />
  );
}

export function AccentWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-instrument tracking-[-1.6px] italic text-lime-800 text-[52px] sm:text-[62px] md:text-[68px]">
      {children}
    </span>
  );
}
