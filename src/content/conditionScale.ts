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
      src: '/images/grades/grade-1-excellent.jpg',
      alt: {
        ar: 'صفوف نظيفة من مكابس صناعية في صالة إنتاج جيدة الإضاءة',
        en: 'Clean rows of industrial press machines on a well-lit factory floor',
      },
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
      src: '/images/grades/grade-2-good.jpg',
      alt: {
        ar: 'عامل يشغّل آلة لحام صناعية تظهر عليها آثار استخدام عادية',
        en: 'A worker operating a welding machine showing normal wear from use',
      },
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
      src: '/images/grades/grade-3-fair.jpg',
      alt: {
        ar: 'آلة صناعية سليمة لكن متسخة، مع طبقة واضحة من الغبار والشحم على سطحها',
        en: 'An intact but grimy industrial machine with a visible layer of dust and grease',
      },
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
      src: '/images/grades/grade-4-poor.jpg',
      alt: {
        ar: 'معدّات صناعية ثقيلة صدئة بشدة في موقع خارجي',
        en: 'Heavily rusted heavy machinery at an outdoor site',
      },
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
      src: '/images/grades/grade-5-critical.jpg',
      alt: {
        ar: 'حفارة ثقيلة مهجورة داخل مبنى متهالك، وقد تآكلت بشدة من الصدأ',
        en: 'An abandoned heavy excavator inside a derelict building, severely corroded by rust',
      },
      width: 640,
      height: 480,
    },
  },
];
