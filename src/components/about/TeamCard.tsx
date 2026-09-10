import type { Locale, TeamMember } from '@/content/types';
import { pick } from '@/lib/pick';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { TeamPortrait } from '@/components/about/TeamPortrait';

export function TeamCard({ member, locale }: { member: TeamMember; locale: Locale }) {
  const name = pick(member.name, locale);
  return (
    <article className="flex flex-col gap-[var(--spacing-s)]">
      <TeamPortrait portrait={member.portrait} name={name} />
      <div>
        <KineticHeading as="h3" className="u-display text-[length:var(--step-2)] text-ink">
          {name}
        </KineticHeading>
        <div className="mt-[var(--spacing-3xs)] flex items-center gap-[var(--spacing-2xs)]">
          <span className="font-mono text-[length:var(--step--1)] text-signal-text">{pick(member.role, locale)}</span>
          <span className="team-role-accent" aria-hidden="true" />
        </div>
        <p className="mt-[var(--spacing-2xs)] text-ink-2">{pick(member.contribution, locale)}</p>
      </div>
    </article>
  );
}
