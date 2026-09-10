import type { ButtonHTMLAttributes } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary';

const base =
  'inline-flex items-center justify-center gap-[var(--spacing-2xs)] rounded-control px-[var(--spacing-m)] py-[var(--spacing-xs)] text-[length:var(--step-0)] font-medium transition-colors duration-[120ms] disabled:opacity-50 disabled:pointer-events-none min-h-11';

const variants: Record<Variant, string> = {
  // Ember is an ignition colour (UI-OVERHAUL-V4 §3.4) — the primary CTA is
  // exactly the kind of "something turning on" moment it's reserved for, so
  // its hover reuses the site's one ignition duration (§5.5) instead of the
  // base 120ms used for ordinary colour transitions.
  primary:
    'bg-ember text-on-ember duration-[var(--duration-ignition)] ease-[var(--ease-ignition)] hover:bg-ember-text',
  secondary: 'border border-border text-signal-text hover:bg-surface',
};

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

interface LinkProps extends CommonProps {
  href: string;
}

type NativeButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: LinkProps | NativeButtonProps) {
  const { variant = 'primary', className, children } = props;
  const classes = cn(base, variants[variant], className);

  if ('href' in props) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { href: _href, variant: _v, className: _c, children: _ch, ...rest } = props as NativeButtonProps & {
    href?: never;
  };
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
