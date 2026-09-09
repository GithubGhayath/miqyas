'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SiteConfig } from '@/content/types';
import { submitContactForm } from '@/lib/content';
import { createContactSchema, type ContactFormValues } from '@/lib/schemas';
import { Button } from '@/components/ui/Button';
import { Field, fieldInputClass } from '@/components/ui/Field';

type SubmitState = { status: 'idle' } | { status: 'success'; reference: string } | { status: 'error' };

export function ContactForm({ site }: { site: SiteConfig }) {
  const t = useTranslations('contact');
  const schema = createContactSchema((key) => t(`validation.${key}`));
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(schema) });
  const [state, setState] = useState<SubmitState>({ status: 'idle' });
  const summaryRef = useRef<HTMLDivElement>(null);

  const errorEntries = Object.entries(errors) as [keyof ContactFormValues, { message?: string }][];

  async function onValid(values: ContactFormValues) {
    setState({ status: 'idle' });
    const result = await submitContactForm(values);
    if (result.ok) {
      setState({ status: 'success', reference: result.reference });
    } else {
      setState({ status: 'error' });
    }
  }

  useEffect(() => {
    if (errorEntries.length > 0) {
      summaryRef.current?.focus();
    }
  }, [errorEntries.length]);

  if (state.status === 'success') {
    return (
      <div className="border border-border p-[var(--spacing-l)]" role="status">
        <h2 className="u-display text-[length:var(--step-2)] text-ink">{t('successHeading')}</h2>
        <p className="mt-[var(--spacing-s)] text-ink-2">
          {t('successBody', { reference: state.reference, hours: site.responseTimeHours })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="flex flex-col gap-[var(--spacing-m)]">
      {errorEntries.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="border border-grade-5 p-[var(--spacing-s)] text-[length:var(--step--1)]"
        >
          <p className="font-medium text-grade-5">{t('errorSummaryHeading')}</p>
          <ul className="mt-[var(--spacing-2xs)] list-inside list-disc">
            {errorEntries.map(([field, err]) => (
              <li key={field}>
                <a
                  href={`#field-${field}`}
                  className="underline"
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(`field-${field}`)?.focus();
                  }}
                >
                  {err.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {state.status === 'error' ? (
        <div role="alert" className="border border-grade-5 p-[var(--spacing-s)] text-[length:var(--step--1)] text-grade-5">
          <p className="font-medium">{t('errorHeading')}</p>
          <p>{t('errorBody')}</p>
        </div>
      ) : null}

      <Field id="field-name" label={t('name')} required error={errors.name?.message}>
        <input
          id="field-name"
          className={fieldInputClass}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'field-name-error' : undefined}
          {...register('name')}
        />
      </Field>

      <Field id="field-email" label={t('email')} required error={errors.email?.message}>
        <input
          id="field-email"
          type="email"
          dir="ltr"
          className={fieldInputClass}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'field-email-error' : undefined}
          {...register('email')}
        />
      </Field>

      <Field id="field-organisation" label={t('organisation')}>
        <input id="field-organisation" className={fieldInputClass} {...register('organisation')} />
      </Field>

      <Field id="field-country" label={t('country')}>
        <input id="field-country" className={fieldInputClass} {...register('country')} />
      </Field>

      <Field id="field-facilityLocation" label={t('facilityLocation')}>
        <input id="field-facilityLocation" className={fieldInputClass} {...register('facilityLocation')} />
      </Field>

      <Field id="field-facilityType" label={t('facilityType')} required error={errors.facilityType?.message}>
        <select
          id="field-facilityType"
          className={fieldInputClass}
          defaultValue=""
          aria-invalid={!!errors.facilityType}
          aria-describedby={errors.facilityType ? 'field-facilityType-error' : undefined}
          {...register('facilityType')}
        >
          <option value="" disabled>
            —
          </option>
          <option value="factory">{t('facilityTypeOptions.factory')}</option>
          <option value="line">{t('facilityTypeOptions.line')}</option>
          <option value="warehouse">{t('facilityTypeOptions.warehouse')}</option>
          <option value="machine">{t('facilityTypeOptions.machine')}</option>
          <option value="other">{t('facilityTypeOptions.other')}</option>
        </select>
      </Field>

      <Field id="field-message" label={t('message')} required error={errors.message?.message}>
        <textarea
          id="field-message"
          rows={5}
          className={fieldInputClass}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'field-message-error' : undefined}
          {...register('message')}
        />
      </Field>

      <fieldset className="flex flex-col gap-[var(--spacing-2xs)]">
        <legend className="text-[length:var(--step--1)] text-ink-2">{t('preferredContact')}</legend>
        {(['email', 'whatsapp', 'call'] as const).map((option) => (
          <label key={option} className="flex items-center gap-[var(--spacing-2xs)] text-ink">
            <input type="radio" value={option} {...register('preferredContact')} />
            {t(`preferredContactOptions.${option}`)}
          </label>
        ))}
        {errors.preferredContact ? (
          <p role="alert" className="text-[length:var(--step--1)] text-grade-5">
            {errors.preferredContact.message}
          </p>
        ) : null}
      </fieldset>

      <div aria-live="polite" className="sr-only">
        {isSubmitting ? t('submitting') : ''}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
