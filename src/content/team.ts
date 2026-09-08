import type { TeamMember } from './types';

export const team: TeamMember[] = [
  {
    id: 'team-1',
    name: { ar: 'أنس دياب', en: 'Anas Diab' },
    role: { ar: 'مهندس ميكانيكي', en: 'Mechanical engineer' },
    contribution: {
      ar: 'يقود الفحص الميداني ويحدد درجات الحالة لكل نظام رئيسي.',
      en: 'Leads the field inspection and sets the condition grade for every major system.',
    },
    portrait: {
      src: 'https://picsum.photos/seed/miqyas-team-1/480/480',
      alt: { ar: 'صورة أنس دياب', en: 'Portrait of Anas Diab' },
      width: 480,
      height: 480,
    },
  },
  {
    id: 'team-2',
    name: { ar: 'رهف الحلبي', en: 'Rahaf Halabi' },
    role: { ar: 'مهندسة برمجيات', en: 'Software engineer' },
    contribution: {
      ar: 'تبني الأدوات التي تحوّل الملاحظات الميدانية إلى مخططات CAD وجداول حالة رقمية.',
      en: 'Builds the tools that turn field notes into CAD layouts and digital condition tables.',
    },
    portrait: {
      src: 'https://picsum.photos/seed/miqyas-team-2/480/480',
      alt: { ar: 'صورة رهف الحلبي', en: 'Portrait of Rahaf Halabi' },
      width: 480,
      height: 480,
    },
  },
  {
    id: 'team-3',
    name: { ar: 'كريم عساف', en: 'Karim Assaf' },
    role: { ar: 'منسق ميداني', en: 'Field coordinator' },
    contribution: {
      ar: 'يرتب الوصول إلى المواقع ويقابل الحراس والمشغّلين السابقين قبل كل زيارة.',
      en: 'Arranges site access and interviews caretakers and former operators ahead of every visit.',
    },
    portrait: {
      src: 'https://picsum.photos/seed/miqyas-team-3/480/480',
      alt: { ar: 'صورة كريم عساف', en: 'Portrait of Karim Assaf' },
      width: 480,
      height: 480,
    },
  },
];
