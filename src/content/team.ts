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
      src: 'https://picsum.photos/seed/miqyas-team-1/480/480',
      alt: { ar: 'صورة العضو M-01', en: 'Portrait of member M-01' },
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
      src: 'https://picsum.photos/seed/miqyas-team-2/480/480',
      alt: { ar: 'صورة العضو M-02', en: 'Portrait of member M-02' },
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
      src: 'https://picsum.photos/seed/miqyas-team-3/480/480',
      alt: { ar: 'صورة العضو M-03', en: 'Portrait of member M-03' },
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
      src: 'https://picsum.photos/seed/miqyas-team-4/480/480',
      alt: { ar: 'صورة العضو M-04', en: 'Portrait of member M-04' },
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
      src: 'https://picsum.photos/seed/miqyas-team-5/480/480',
      alt: { ar: 'صورة العضو M-05', en: 'Portrait of member M-05' },
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
      src: 'https://picsum.photos/seed/miqyas-team-6/480/480',
      alt: { ar: 'صورة العضو M-06', en: 'Portrait of member M-06' },
      width: 480,
      height: 480,
    },
  },
];
