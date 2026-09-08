import type { FaqItem } from './types';

export const faq: FaqItem[] = [
  {
    id: 'faq-payment',
    question: {
      ar: 'كيف تتم عملية الدفع من خارج سوريا؟',
      en: 'How does payment work from outside Syria?',
    },
    answer: {
      ar: [
        'يمكن ترتيب الدفع عبر ممثل داخل سوريا أو حوالة إلى ما يعادلها بحسب اتفاق كل حالة على حدة. نتفق على طريقة الدفع قبل تأكيد موعد الزيارة.',
      ],
      en: [
        'Payment can be arranged through a representative inside Syria, or as an equivalent transfer, agreed case by case. We settle the method before confirming the visit date.',
      ],
    },
  },
  {
    id: 'faq-travel',
    question: {
      ar: 'هل يسافر الفريق خارج دمشق؟',
      en: 'Does the team travel outside Damascus?',
    },
    answer: {
      ar: ['نعم. نفّذنا زيارات في ريف دمشق وحلب وحمص، وننسّق كلفة التنقل والإقامة حسب موقع المنشأة.'],
      en: ['Yes. We have carried out visits in Rural Damascus, Aleppo, and Homs, and coordinate travel and accommodation cost by facility location.'],
    },
  },
  {
    id: 'faq-ownership',
    question: {
      ar: 'من يملك التقرير النهائي؟',
      en: 'Who owns the final report?',
    },
    answer: {
      ar: ['التقرير ملك كامل للطرف الذي طلبه، ويمكنه مشاركته مع أي بنك أو شريك أو ممول يراه مناسبًا.'],
      en: ['The report is entirely the requesting party\'s property, and they may share it with any bank, partner, or lender they choose.'],
    },
  },
  {
    id: 'faq-access',
    question: {
      ar: 'ماذا لو تعذّر الوصول إلى الموقع؟',
      en: 'What happens if the site cannot be accessed?',
    },
    answer: {
      ar: [
        'إن تعذّر الوصول الآمن إلى الموقع في تاريخ الزيارة، نعيد جدولتها. لا نصدر رأيًا فنيًا عن منشأة لم نعاينها فعليًا.',
      ],
      en: [
        'If safe access to the site is not possible on the scheduled date, we reschedule. We do not issue a technical opinion on a facility we have not physically inspected.',
      ],
    },
  },
  {
    id: 'faq-duration',
    question: {
      ar: 'كم يستغرق التسليم؟',
      en: 'How long does delivery take?',
    },
    answer: {
      ar: ['غالبًا 7 إلى 10 أيام من تاريخ الزيارة الميدانية للتقييم الأولي الكامل، بحسب حجم المنشأة.'],
      en: ['Typically 7 to 10 days from the site visit for a full preliminary assessment, depending on the size of the facility.'],
    },
  },
  {
    id: 'faq-bank',
    question: {
      ar: 'هل يمكن عرض التقرير على بنك؟',
      en: 'Can the report be shown to a bank?',
    },
    answer: {
      ar: [
        'نعم، وهذا أحد الاستخدامات الشائعة له. لكن التقرير تقييم أولي غير معتمد، لا تقرير هندسي مرخّص — وهذا مذكور بوضوح في التقرير نفسه.',
      ],
      en: [
        'Yes, and that is one of its common uses. But the report is a preliminary, non-certified assessment, not a licensed engineering report — and that is stated plainly in the report itself.',
      ],
    },
  },
];
