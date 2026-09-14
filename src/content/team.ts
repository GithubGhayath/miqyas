import type { TeamMember } from './types';

// PLACEHOLDER roster (FIX-AND-POLISH-V1 §3.4) — reference-coded (M-01…M-06)
// rather than invented personal names, the same REF convention already used
// on case studies and equipment rows, until real names and photographs are
// supplied. The `contribution` line for each is also a placeholder in the
// same sense as the rest of the site's placeholder content — replace with
// the real person's actual contribution once known, not left as-is.
const mechanicalRole = { ar: 'مهندس تصميم ميكانيكي — خطوط إنتاج', en: 'Mechanical Design Engineer — Production Lines' };

export const team: TeamMember[] = [
  {
    id: 'team-1',
    name: { ar: 'M-01', en: 'M-01' },
    role: mechanicalRole,
    contribution: {
      ar: 'يقود الفحص الميداني وتصنيف حالة المعدات.',
      en: 'Leads the field inspection and equipment condition grading.',
    },
    portrait: {
      src: '/images/team/team-1.jpg',
      alt: {
        ar: 'مهندس يفحص قاعة إنتاج صناعية مظلمة باستخدام جهاز لوحي',
        en: 'An engineer inspecting a dark industrial hall using a tablet',
      },
      width: 480,
      height: 480,
    },
  },
  {
    id: 'team-2',
    name: { ar: 'M-02', en: 'M-02' },
    role: mechanicalRole,
    contribution: {
      ar: 'يتولى التوثيق بالـ CAD ورسومات توزيع الخط.',
      en: 'Handles CAD documentation and line layout drawings.',
    },
    portrait: {
      src: '/images/team/team-2.jpg',
      alt: {
        ar: 'عامل بخوذة بيضاء واقفًا بجانب معدّات صناعية خضراء',
        en: 'A worker in a white hard hat standing beside green industrial machinery',
      },
      width: 480,
      height: 480,
    },
  },
  {
    id: 'team-3',
    name: { ar: 'M-03', en: 'M-03' },
    role: mechanicalRole,
    contribution: {
      ar: 'يراجع التقارير من حيث المنهجية والاتساق.',
      en: 'Reviews reports for methodology and consistency.',
    },
    portrait: {
      src: '/images/team/team-3.jpg',
      alt: {
        ar: 'مهندسة بخوذة أمان تعمل على حاسوب محمول في موقع إنشائي',
        en: 'A woman engineer in a hard hat working on a laptop at a construction site',
      },
      width: 480,
      height: 480,
    },
  },
  {
    id: 'team-4',
    name: { ar: 'M-04', en: 'M-04' },
    role: mechanicalRole,
    contribution: {
      ar: 'ينسّق الزيارات الميدانية والتواصل مع العميل.',
      en: 'Coordinates site visits and client communication.',
    },
    portrait: {
      src: '/images/team/team-4.jpg',
      alt: {
        ar: 'رجل بخوذة صفراء يحمل لوح تدوين في موقع إنشائي، ورافعة خلفه',
        en: 'A man in a yellow hard hat holding a clipboard on site, a crane structure behind him',
      },
      width: 480,
      height: 480,
    },
  },
  {
    id: 'team-5',
    name: { ar: 'M-05', en: 'M-05' },
    role: { ar: 'مهندس كهرباء', en: 'Electrical Engineer' },
    contribution: {
      ar: 'يقيّم الأنظمة الكهربائية ومصادر الطاقة.',
      en: 'Assesses electrical systems and power supply.',
    },
    portrait: {
      src: '/images/team/team-5.jpg',
      alt: {
        ar: 'مهندس كهرباء يفحص لوحة تحكم كهربائية مفتوحة',
        en: 'An electrical engineer inspecting an open control panel',
      },
      width: 480,
      height: 480,
    },
  },
  {
    id: 'team-6',
    name: { ar: 'M-06', en: 'M-06' },
    role: {
      ar: 'مهندس تصميم ميكانيكي وبرمجيات، المؤسس',
      en: 'Mechanical Design Engineer & Software, Founder',
    },
    contribution: {
      ar: 'بنى نظام التقارير والأدوات الرقمية للفريق.',
      en: "Built the reporting system and the firm's digital tools.",
    },
    portrait: {
      src: '/images/team/team-6.jpg',
      alt: {
        ar: 'رجل بسترة صفراء عاكسة يحمل خوذته في موقع صناعي مفتوح',
        en: 'A man in a yellow safety vest holding his hard hat at an open industrial site',
      },
      width: 480,
      height: 480,
    },
  },
];
