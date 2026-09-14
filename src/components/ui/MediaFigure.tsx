import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { ImageRef, Localized } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';
import { withBasePath } from '@/lib/basePath';

export function MediaFigure({
  image,
  caption,
  sizes,
  priority,
  viewTransitionName,
  imageClassName,
  containerClassName,
  /** When a containerClassName sets its own `aspect-ratio` (e.g. `.letterbox`),
   *  pass false so the inline style below doesn't win over it. */
  useIntrinsicAspectRatio = true,
}: {
  image: ImageRef;
  caption?: Localized;
  sizes?: string;
  priority?: boolean;
  /** Names this figure's container as a View Transition target — UI-REFACTOR-PROMPT §3.1(a). */
  viewTransitionName?: string;
  imageClassName?: string;
  containerClassName?: string;
  useIntrinsicAspectRatio?: boolean;
}) {
  const { t } = useLocalized();
  return (
    <figure>
      <div
        className={`relative overflow-hidden border border-border bg-surface${containerClassName ? ` ${containerClassName}` : ''}`}
        style={
          {
            ...(useIntrinsicAspectRatio ? { aspectRatio: `${image.width} / ${image.height}` } : {}),
            ...(viewTransitionName ? { viewTransitionName } : {}),
          } as CSSProperties
        }
      >
        <Image
          src={withBasePath(image.src)}
          alt={t(image.alt)}
          fill
          priority={priority}
          sizes={sizes ?? '(min-width: 768px) 50vw, 100vw'}
          className={`object-cover${imageClassName ? ` ${imageClassName}` : ''}`}
        />
      </div>
      {caption ? (
        <figcaption className="mt-[var(--spacing-2xs)] text-[length:var(--step--1)] text-ink-3">
          {t(caption)}
          {image.credit ? ` — ${image.credit}` : ''}
        </figcaption>
      ) : null}
    </figure>
  );
}
