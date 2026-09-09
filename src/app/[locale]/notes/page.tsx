import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getFieldNotes } from '@/lib/content';
import { pick } from '@/lib/pick';
import { buildMetadata } from '@/lib/metadata';
import { formatIsoDate } from '@/lib/utils';
import { PageShell } from '@/components/layout/PageShell';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { TransitionLink } from '@/components/motion/TransitionLink';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'notes' });
  return buildMetadata({ locale, pathname: '/notes', title: t('title'), description: t('title') });
}

export default async function NotesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const [t, notes] = await Promise.all([getTranslations('notes'), getFieldNotes()]);
  const sorted = [...notes].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <PageShell>
      <header>
        <KineticHeading as="h1" className="u-display text-[length:var(--step-4)] text-ink">{t('title')}</KineticHeading>
      </header>

      <div className="divide-y divide-border border-y border-border">
        {sorted.map((note) => (
          <TransitionLink
            key={note.id}
            href={`/notes/${note.slug}`}
            transition="nav-forward"
            className="flex flex-col gap-[var(--spacing-2xs)] py-[var(--spacing-m)] hover:bg-surface/60"
          >
            <span className="flex flex-wrap gap-x-[var(--spacing-m)] font-mono text-[length:var(--step--1)] text-ink-3">
              <span>{formatIsoDate(note.publishedAt, l)}</span>
              <span>
                {note.readingMinutes} {t('readingTime')}
              </span>
            </span>
            <span className="text-[length:var(--step-1)] font-medium text-ink">{pick(note.title, l)}</span>
            <span className="measure-block text-ink-3">{pick(note.standfirst, l)}</span>
          </TransitionLink>
        ))}
      </div>
    </PageShell>
  );
}
