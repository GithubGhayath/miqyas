'use client';

import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { springSettled } from '@/lib/motion';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string[];
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => {
        const open = openId === item.id;
        const panelId = `${item.id}-panel`;
        const buttonId = `${item.id}-button`;
        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape' && open) setOpenId(null);
                }}
                className="flex w-full items-center justify-between gap-[var(--spacing-s)] py-[var(--spacing-s)] text-start text-[length:var(--step-0)] font-medium text-ink"
              >
                <span>{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  size={20}
                  className={`shrink-0 transition-transform duration-[220ms] ${open ? 'rotate-180' : ''}`}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open ? (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : springSettled}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-[var(--spacing-2xs)] pb-[var(--spacing-s)] text-ink-2">
                    {item.answer.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </m.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
