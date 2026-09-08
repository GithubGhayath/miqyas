import type { SurveyPin } from './types';

// Coordinates are percentages against the hero figure, matched to
// public/hero photography (seed: miqyas-hero-line).
export const surveyPins: SurveyPin[] = [
  {
    id: 'pin-conveyor',
    xPct: 22,
    yPct: 62,
    equipment: { ar: 'ناقل حزامي رئيسي', en: 'Main belt conveyor' },
    grade: 3,
    measure: { value: 340, unit: 'kW' },
    observation: {
      ar: 'بكرات وسيطة متآكلة، الحزام نفسه سليم.',
      en: 'Idlers worn; the belt itself is sound.',
    },
  },
  {
    id: 'pin-motor',
    xPct: 61,
    yPct: 48,
    equipment: { ar: 'محرك تشغيل رئيسي', en: 'Main drive motor' },
    grade: 2,
    measure: { value: 90, unit: 'kW' },
    observation: {
      ar: 'يعمل ضمن حدود لوحة البيانات بعد الاختبار.',
      en: 'Runs within nameplate limits after testing.',
    },
  },
  {
    id: 'pin-boiler',
    xPct: 78,
    yPct: 70,
    equipment: { ar: 'مرجل بخاري', en: 'Steam boiler' },
    grade: 4,
    measure: { value: 12, unit: 'bar' },
    observation: {
      ar: 'صمام أمان متجاوز لتاريخ الصلاحية.',
      en: 'Safety valve past its certification date.',
    },
    hideOnMobile: true,
  },
  {
    id: 'pin-panel',
    xPct: 39,
    yPct: 30,
    equipment: { ar: 'لوحة تحكم كهربائية', en: 'Electrical control panel' },
    grade: 3,
    measure: { value: 380, unit: 'V' },
    observation: {
      ar: 'أسلاك سليمة، القواطع تحتاج فحصًا مخبريًا.',
      en: 'Wiring intact; breakers need lab testing.',
    },
    hideOnMobile: true,
  },
];
