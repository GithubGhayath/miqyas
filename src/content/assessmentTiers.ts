import type { AssessmentTierRow } from './types';

export const assessmentTiers: AssessmentTierRow[] = [
  {
    id: 'tier-basis',
    aspect: { ar: 'الأساس', en: 'Basis' },
    preliminary: { ar: 'مسح بصري فقط', en: 'Visual survey only' },
    full: { ar: 'مسح بصري إضافة إلى فحوصات مُجهّزة', en: 'Visual survey plus instrumented testing' },
  },
  {
    id: 'tier-calculations',
    aspect: { ar: 'الحسابات', en: 'Calculations' },
    preliminary: { ar: 'لا حسابات هندسية', en: 'None' },
    full: {
      ar: 'حسابات هندسية (مثل سلسلة ISO 10816/20816 للمعدات الدوّارة)',
      en: 'Engineering calculations (e.g. ISO 10816/20816 series for rotating equipment)',
    },
  },
  {
    id: 'tier-quantities',
    aspect: { ar: 'الكميات', en: 'Quantities' },
    preliminary: { ar: 'تقديرية من الملاحظة الميدانية', en: 'Estimated from field observation' },
    full: { ar: 'مقاسة أو مدقَّقة مقابل المخططات', en: 'Measured or verified against drawings' },
  },
  {
    id: 'tier-standing',
    aspect: { ar: 'المكانة', en: 'Standing' },
    preliminary: { ar: 'رأي مهني مستقل', en: 'An independent professional opinion' },
    full: { ar: 'يقترب من تقرير هندسي معتمد', en: 'Approaches a certified engineering report' },
  },
  {
    id: 'tier-use',
    aspect: { ar: 'الاستخدام المناسب', en: 'Use it for' },
    preliminary: { ar: 'اتخاذ قرار المضي من عدمه', en: 'Deciding whether to proceed at all' },
    full: { ar: 'قرار مالي أو شرائي ملزم', en: 'A binding financial or purchase decision' },
  },
];
