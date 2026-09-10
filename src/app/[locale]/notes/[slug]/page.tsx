import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getFieldNote, getFieldNotes } from '@/lib/content';
import { pick } from '@/lib/pick';
import { buildMetadata } from '@/lib/metadata';
import { formatIsoDate } from '@/lib/utils';
import { routing } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { MediaFigure } from '@/components/ui/MediaFigure';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { KineticHeading } from '@/components/motion/KineticHeading';

export async function generateStaticParams() {
  const notes = await getFieldNotes();
  return routing.locales.flatMap((locale) => notes.map((n) => ({ locale, slug: n.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const note = await getFieldNote(slug);
  if (!note) return {};
  return buildMetadata({
    locale,
    pathname: `/notes/${slug}`,
    title: pick(note.title, locale as Locale),
    description: pick(note.standfirst, locale as Locale),
  });
}

export default async function FieldNotePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const [t, note] = await Promise.all([getTranslations('notes'), getFieldNote(slug)]);
  if (!note) notFound();

  return (
    <>
      <PageShell>
        <article>
          <TransitionLink
            href="/notes"
            transition="nav-back"
            className="mb-[var(--spacing-m)] inline-flex items-center gap-[var(--spacing-2xs)] text-[length:var(--step--1)] text-signal-text hover:underline"
          >
            <ArrowLeft aria-hidden="true" size={16} className="rtl:-scale-x-100" />
            {t('backToNotes')}
          </TransitionLink>
          <header>
            <span className="flex flex-wrap gap-x-[var(--spacing-m)] font-mono text-[length:var(--step--1)] text-ink-3">
              <span>{formatIsoDate(note.publishedAt, l)}</span>
              <span>
                {note.readingMinutes} {t('readingTime')}
              </span>
            </span>
            <KineticHeading as="h1" className="mt-[var(--spacing-2xs)] u-display text-[length:var(--step-4)] text-ink">
              {pick(note.title, l)}
            </KineticHeading>
            <p className="mt-[var(--spacing-s)] measure-block text-[length:var(--step-1)] text-ink-2">
              {pick(note.standfirst, l)}
            </p>
          </header>
        </article>
      </PageShell>

      {/* Full-bleed cover, not frame-constrained (UI-OVERHAUL-V4 §11) — the
          body text below stays measure-width for legibility, but the cover
          image is the page's one cinematic moment. */}
      <div className="bleed">
        <MediaFigure image={note.cover} priority useIntrinsicAspectRatio={false} containerClassName="letterbox" />
      </div>

      <PageShell>
        <article>
          <div className="measure-block flex flex-col gap-[var(--spacing-s)] text-ink-2">
            {pick(note.body, l).map((paragraph, index) => {
              const figure = note.figures?.find((f) => f.after === index);
              return (
                <div key={index} className="flex flex-col gap-[var(--spacing-m)]">
                  <p>{paragraph}</p>
                  {figure ? <MediaFigure image={figure.image} caption={figure.caption} /> : null}
                </div>
              );
            })}
          </div>
        </article>
      </PageShell>
    </>
  );
}
