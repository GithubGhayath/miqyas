import type { SiteConfig } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';
import { Link } from '@/i18n/navigation';

export function Wordmark({ site }: { site: SiteConfig }) {
  const { t } = useLocalized();
  return (
    <Link
      href="/"
      className="u-display inline-block text-[length:var(--step-1)] tracking-[0.04em] text-ink"
      aria-label={t(site.tagline)}
    >
      {t(site.name)}
    </Link>
  );
}
