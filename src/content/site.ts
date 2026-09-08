import type { SiteConfig } from './types';

// Brand identity — the single source of truth for name, tagline, and contact facts.
// MIQYAS / مقياس — "gauge, measure, standard"
export const site: SiteConfig = {
  name: { ar: 'مقياس', en: 'MIQYAS' },
  tagline: {
    ar: 'تقييم فني مستقل للمنشآت الصناعية',
    en: 'Independent technical assessment for industrial facilities',
  },
  location: { ar: 'دمشق، سوريا', en: 'Damascus, Syria' },
  timezone: 'UTC+3',
  email: 'field@miqyas.example',
  responseTimeHours: 48,
  workingHours: {
    ar: 'الأحد–الخميس، 9 صباحًا–5 مساءً (بتوقيت دمشق)',
    en: 'Sunday–Thursday, 9am–5pm Damascus time',
  },
  languages: { ar: 'العربية، الإنجليزية', en: 'Arabic, English' },
};
