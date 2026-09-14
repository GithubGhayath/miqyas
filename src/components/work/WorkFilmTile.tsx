'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { CaseStudy, Locale } from '@/content/types';
import { pick } from '@/lib/pick';
import { useLocalized } from '@/hooks/useLocalized';
import { withBasePath } from '@/lib/basePath';
import { TitleBlock } from '@/components/ui/TitleBlock';
import { TransitionLink } from '@/components/motion/TransitionLink';

/**
 * One frame on the Drag Film Reel (creative-layout-replacement §3) — cover
 * image and title only at rest (layered reveal, §3.3); clicking/tapping
 * expands it in place to show the pulled quotation, the sector/governorate/
 * year facts, and the whatThisProves line. Not a link to a new page — an
 * in-place expansion, matching the "reveal in layers" principle.
 */
export function WorkFilmTile({
  caseStudy,
  locale,
  featured,
  expanded,
  previewed = false,
  verticalOffset,
  onToggle,
}: {
  caseStudy: CaseStudy;
  locale: Locale;
  featured: boolean;
  expanded: boolean;
  /** Discoverability auto-preview (see WorkFilmReel) — a brief colour
   *  reveal taking its turn until the visitor proves they've found the
   *  interaction, same treatment as `expanded` minus the detail panel. */
  previewed?: boolean;
  verticalOffset: number;
  onToggle: () => void;
}) {
  const { t } = useLocalized();
  const tWork = useTranslations('work');
  const pullQuote = caseStudy.findings[locale][0];

  return (
    <div
      data-tile-id={caseStudy.id}
      className={`film-tile relative flex-none overflow-hidden border border-border bg-surface transition-[width,height,transform] duration-500 ${
        expanded
          ? 'film-tile--expanded w-[min(88vw,54rem)] h-[min(70vh,38rem)]'
          : featured
            ? 'w-[19rem] h-[24rem] lg:w-[30rem] lg:h-[34rem]'
            : 'w-[16rem] h-[21rem] lg:w-[22rem] lg:h-[28rem]'
      }`}
      style={{ transform: expanded ? undefined : `translateY(${verticalOffset}px)` }}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={`${expanded ? tWork('collapseDetails') : tWork('expandDetails')}: ${pick(caseStudy.title, locale)}`}
        className="film-tile__hit absolute inset-0 z-10 h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
        onClick={onToggle}
      />
      <div className={`duotone duotone-fade film-tile__cover absolute inset-0${expanded || previewed ? ' is-revealed' : ''}`}>
        <Image
          src={withBasePath(caseStudy.cover.src)}
          alt={t(caseStudy.cover.alt)}
          fill
          priority
          sizes="(min-width: 1024px) 30rem, 19rem"
          className="object-cover"
        />
      </div>
      <span className="film-tile__corner film-tile__corner--tl" aria-hidden="true" />
      <span className="film-tile__corner film-tile__corner--br" aria-hidden="true" />

      <div className="film-tile__label pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-[var(--spacing-3xs)] p-[var(--spacing-m)]">
        <span className="font-mono text-[length:var(--step--1)] text-ink-3">
          {caseStudy.status === 'pilot' ? tWork('pilotLabel') : tWork('deliveredLabel')}
        </span>
        <h2 className="u-display text-[length:var(--step-2)] text-ink">{pick(caseStudy.title, locale)}</h2>
        {!expanded ? (
          <span className="text-[length:var(--step--1)] text-ink-2">
            {pick(caseStudy.sector, locale)} — {pick(caseStudy.governorate, locale)}
          </span>
        ) : null}
      </div>

      {expanded ? (
        <div className="film-tile__detail pointer-events-none absolute inset-x-0 bottom-0 top-[42%] flex flex-col gap-[var(--spacing-s)] bg-void/90 p-[var(--spacing-m)] backdrop-blur-sm">
          <TitleBlock
            cells={[
              { label: tWork('sector'), value: pick(caseStudy.sector, locale) },
              { label: tWork('governorate'), value: pick(caseStudy.governorate, locale) },
              { label: tWork('year'), value: String(caseStudy.year) },
            ]}
          />
          <blockquote className="film-tile__quote u-display measure-block text-[length:var(--step-1)] text-ink">
            {pullQuote}
          </blockquote>
          <div>
            <span className="font-mono text-[length:var(--step--2)] text-ink-3">{tWork('provesHeading')}</span>
            <p className="text-ink-2">{pick(caseStudy.whatThisProves, locale)}</p>
          </div>
          <TransitionLink
            href={`/work/${caseStudy.slug}`}
            transition="case-reveal"
            className="pointer-events-auto mt-auto self-start font-mono text-[length:var(--step--1)] text-signal-text hover:text-ink"
          >
            {tWork('viewFullCaseStudy')} →
          </TransitionLink>
        </div>
      ) : null}
    </div>
  );
}
