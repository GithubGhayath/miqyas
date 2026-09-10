'use client';

import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@/i18n/navigation';
import { useDirection } from '@/hooks/useDirection';
import { springSettled } from '@/lib/motion';

interface NavLink {
  href: string;
  label: string;
}

export function MobileNav({
  links,
  contactLabel,
  contactHref,
}: {
  links: NavLink[];
  contactLabel: string;
  contactHref: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('nav');
  const { sign } = useDirection();
  const reduceMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    // Portal target (document.body) only exists client-side; this also
    // conveniently defers the portal's first render past hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key === 'Tab' && focusable && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-control text-ink md:hidden"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t('openMenu')}
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" size={22} />
      </button>
      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <m.div
                  className="fixed inset-0 z-50 bg-ink/40 md:hidden"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.22 }}
                  onClick={() => setOpen(false)}
                >
                  <m.div
                    id={panelId}
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('openMenu')}
                    className="absolute inset-y-0 end-0 flex w-[80vw] max-w-[20rem] flex-col gap-[var(--spacing-m)] bg-void p-[var(--spacing-l)]"
                    initial={reduceMotion ? false : { x: `${sign * 100}%`, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: `${sign * 100}%`, opacity: 0 }}
                    transition={reduceMotion ? { duration: 0 } : springSettled}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="inline-flex h-11 w-11 items-center justify-center self-end rounded-control text-ink"
                      aria-label={t('closeMenu')}
                      onClick={() => setOpen(false)}
                    >
                      <X aria-hidden="true" size={22} />
                    </button>
                    <nav className="flex flex-col gap-[var(--spacing-s)]">
                      {links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="text-[length:var(--step-1)] text-ink"
                          onClick={() => setOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                    <Link
                      href={contactHref}
                      className="mt-auto inline-flex items-center justify-center rounded-control bg-ember px-[var(--spacing-m)] py-[var(--spacing-xs)] text-on-ember"
                      onClick={() => setOpen(false)}
                    >
                      {contactLabel}
                    </Link>
                  </m.div>
                </m.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
