import type { ConditionGrade } from './types';

export const conditionScale: ConditionGrade[] = [
  {
    id: 'grade-1',
    grade: 1,
    name: { ar: 'ممتاز', en: 'Excellent' },
    meaning: {
      ar: 'المعدّة تعمل أو قادرة على العمل ضمن مواصفات التصميم، بلا تآكل أو تلف يُذكر.',
      en: 'The equipment operates, or is capable of operating, within design specification, with no meaningful wear or damage.',
    },
    action: {
      ar: 'لا حاجة لتدخل. صيانة روتينية فقط.',
      en: 'No intervention needed. Routine maintenance only.',
    },
    image: {
      src: 'https://picsum.photos/seed/miqyas-grade-1/640/480',
      alt: { ar: 'معدّة صناعية بحالة ممتازة', en: 'Industrial equipment in excellent condition' },
      width: 640,
      height: 480,
    },
  },
  {
    id: 'grade-2',
    grade: 2,
    name: { ar: 'جيد', en: 'Good' },
    meaning: {
      ar: 'تآكل سطحي طفيف متوقع مع الاستخدام العادي، لا يؤثر على الأداء أو السلامة.',
      en: 'Minor surface wear consistent with normal use, with no effect on performance or safety.',
    },
    action: {
      ar: 'متابعة ضمن جدول الصيانة الاعتيادي.',
      en: 'Monitor within the normal maintenance schedule.',
    },
    image: {
      src: 'https://picsum.photos/seed/miqyas-grade-2/640/480',
      alt: { ar: 'معدّة صناعية بحالة جيدة', en: 'Industrial equipment in good condition' },
      width: 640,
      height: 480,
    },
  },
  {
    id: 'grade-3',
    grade: 3,
    name: { ar: 'مقبول', en: 'Fair' },
    meaning: {
      ar: 'تآكل أو تلف واضح يحدّ من الكفاءة أو يقصّر العمر التشغيلي المتبقي، دون أن يمنع التشغيل الحالي.',
      en: 'Visible wear or damage that limits efficiency or shortens remaining service life, without preventing current operation.',
    },
    action: {
      ar: 'يوصى بإصلاح مجدوَل خلال 6–12 شهرًا.',
      en: 'A scheduled repair within 6–12 months is recommended.',
    },
    image: {
      src: 'https://picsum.photos/seed/miqyas-grade-3/640/480',
      alt: { ar: 'معدّة صناعية بحالة مقبولة', en: 'Industrial equipment in fair condition' },
      width: 640,
      height: 480,
    },
  },
  {
    id: 'grade-4',
    grade: 4,
    name: { ar: 'ضعيف', en: 'Poor' },
    meaning: {
      ar: 'تلف إنشائي أو وظيفي جوهري. التشغيل المستمر يحمل مخاطرة على السلامة أو على معدّات أخرى مرتبطة بها.',
      en: 'Substantial structural or functional damage. Continued operation carries a risk to safety or to connected equipment.',
    },
    action: {
      ar: 'إصلاح أو استبدال قبل إعادة التشغيل.',
      en: 'Repair or replace before returning to service.',
    },
    image: {
      src: 'https://picsum.photos/seed/miqyas-grade-4/640/480',
      alt: { ar: 'معدّة صناعية بحالة ضعيفة', en: 'Industrial equipment in poor condition' },
      width: 640,
      height: 480,
    },
  },
  {
    id: 'grade-5',
    grade: 5,
    name: { ar: 'حرج', en: 'Critical' },
    meaning: {
      ar: 'فقدان جوهري للسلامة الإنشائية أو الوظيفية. المعدّة غير آمنة للتشغيل بوضعها الحالي.',
      en: 'A fundamental loss of structural or functional integrity. The equipment is not safe to operate in its current state.',
    },
    action: {
      ar: 'إيقاف عن الخدمة فورًا واستبدال.',
      en: 'Take out of service immediately and replace.',
    },
    image: {
      src: 'https://picsum.photos/seed/miqyas-grade-5/640/480',
      alt: { ar: 'معدّة صناعية بحالة حرجة', en: 'Industrial equipment in critical condition' },
      width: 640,
      height: 480,
    },
  },
];
