import { z } from 'zod';

export function createContactSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(1, { message: t('nameRequired') }),
    email: z
      .string()
      .min(1, { message: t('emailRequired') })
      .email({ message: t('emailInvalid') }),
    organisation: z.string().optional(),
    country: z.string().optional(),
    facilityLocation: z.string().optional(),
    facilityType: z.enum(['factory', 'line', 'warehouse', 'machine', 'other'], {
      message: t('facilityTypeRequired'),
    }),
    message: z.string().min(20, { message: t('messageMin') }),
    preferredContact: z.enum(['email', 'whatsapp', 'call'], {
      message: t('preferredContactRequired'),
    }),
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;
