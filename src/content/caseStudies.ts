import type { CaseStudy } from './types';

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-canning',
    slug: 'idle-food-canning-line-rural-damascus',
    title: {
      ar: 'خط تعليب أغذية متوقف — ريف دمشق',
      en: 'Idle food-canning line, Rural Damascus',
    },
    sector: { ar: 'الصناعات الغذائية', en: 'Food processing' },
    governorate: { ar: 'ريف دمشق', en: 'Rural Damascus' },
    year: 2024,
    status: 'pilot',
    brief: {
      ar: [
        'مصنع تعليب أغذية متوقف عن العمل منذ عام 2012. طلب المالك، المقيم خارج سوريا، رأيًا مستقلًا حول سبب التوقف الفعلي قبل التفكير في إعادة تشغيله.',
        'هذا المشروع وثائقي وأُنجز دون مقابل، كأول عمل ميداني كامل للفريق.',
      ],
      en: [
        'A food-canning plant idle since 2012. The owner, based outside Syria, asked for an independent opinion on the actual cause of the shutdown before considering a restart.',
        'This case was documented and delivered at no charge, as the team\'s first complete field assignment.',
      ],
    },
    findings: {
      ar: [
        'المسح البصري لم يكشف عطلًا ميكانيكيًا يفسّر التوقف الكامل للخط.',
        'مقابلة عامل سابق ما يزال يقيم قرب الموقع كشفت أن التوقف كان بسبب انقطاع التيار الكهربائي المتكرر، لا عطل في المعدّات نفسها.',
      ],
      en: [
        'The visual survey found no mechanical fault severe enough to explain the line\'s complete shutdown.',
        'Interviewing a former operator still living near the site revealed that the stoppage was driven by unreliable grid supply, not equipment failure.',
      ],
    },
    decisionEnabled: {
      ar: [
        'بدلًا من تمويل إعادة تأهيل كاملة للخط بناءً على افتراض تلف المعدّات، موّل المالك مولدًا احتياطيًا مستقلًا — بكلفة أقل بكثير.',
      ],
      en: [
        'Instead of funding a full line refurbishment on the assumption of equipment damage, the owner funded an independent generator instead — at a fraction of the cost.',
      ],
    },
    whatThisProves: {
      ar: 'أثبت أن توقف الخط كان مشكلة كهرباء، لا مشكلة آلات.',
      en: "Proved the line's shutdown was a power problem, not a machine problem.",
    },
    equipment: [
      {
        id: 'eq-canning-1',
        name: { ar: 'خط تعليب رئيسي', en: 'Main canning line' },
        make: 'FBR Elpo',
        rating: '15 kW',
        yearInstalled: 2005,
        grade: 2,
        note: { ar: 'تآكل سطحي فقط، يعمل بعد تشحيم واختبار.', en: 'Surface wear only; runs after lubrication and testing.' },
      },
      {
        id: 'eq-canning-2',
        name: { ar: 'غلاية تعقيم', en: 'Sterilisation boiler' },
        make: 'Fessmann',
        rating: '45 kW',
        yearInstalled: 2005,
        grade: 3,
        note: { ar: 'صمام أمان يحتاج استبدالًا قبل التشغيل.', en: 'Safety valve needs replacement before operation.' },
      },
    ],
    cover: {
      src: '/images/cases/canning-cover.jpg',
      alt: {
        ar: 'مقربة لخط تعليب نشط، عبوات معدنية تتحرك أسفل رؤوس التعبئة',
        en: 'A close-up of an active canning line, cans moving beneath the filling heads',
      },
      width: 1200,
      height: 800,
    },
    beforeAfter: {
      before: {
        src: '/images/cases/canning-before.jpg',
        alt: {
          ar: 'قاعة صناعية فارغة ومتوقفة عن العمل بجدران زرقاء متقشرة',
          en: 'An empty, idle industrial hall with peeling blue-painted walls',
        },
        width: 1200,
        height: 800,
      },
      after: {
        src: '/images/cases/clean-line-reference.jpg',
        alt: {
          ar: 'معدّات معالجة غذائية نظيفة من الفولاذ المقاوم للصدأ في منشأة مضاءة جيدًا',
          en: 'Spotless stainless-steel food-processing equipment in a well-lit facility',
        },
        width: 1200,
        height: 800,
      },
    },
    gallery: [
      {
        src: '/images/cases/canning-gallery-1.jpg',
        alt: {
          ar: 'شرر متطاير أثناء تشغيل آلة قص معدني على أرضية الورشة',
          en: 'Sparks flying as a metal-cutting machine runs on the shop floor',
        },
        width: 900,
        height: 600,
      },
      {
        src: '/images/cases/canning-gallery-2.jpg',
        alt: {
          ar: 'علب ألمنيوم مصطفة على ناقل قبل التعبئة',
          en: 'Aluminium cans queued on a conveyor before filling',
        },
        width: 900,
        height: 600,
      },
    ],
  },
  {
    id: 'case-foundry',
    slug: 'partially-damaged-metal-foundry-aleppo',
    title: {
      ar: 'مسبك معادن جزئي التضرر — حلب',
      en: 'Partially damaged metal foundry, Aleppo',
    },
    sector: { ar: 'المعادن والصب', en: 'Metal casting' },
    governorate: { ar: 'حلب', en: 'Aleppo' },
    year: 2024,
    status: 'delivered',
    brief: {
      ar: [
        'مسبك تعرّض لأضرار جزئية. طلب مستثمر يفحص الاستحواذ على الأصل تقييمًا هيكليًا وميكانيكيًا قبل تقديم عرض.',
      ],
      en: [
        'A foundry that suffered partial damage. An investor evaluating an acquisition of the asset requested a structural and mechanical assessment before making an offer.',
      ],
    },
    findings: {
      ar: [
        'الغلاف الإنشائي للمبنى سليم إجمالًا.',
        'مسار الرافعة العلوية خارج المحاذاة ويحتاج تصحيحًا قبل أي استخدام آمن.',
        'ثلاثة من ثمانية محركات تجاوزت حد الجدوى الاقتصادية للإصلاح.',
      ],
      en: [
        'The building\'s structural envelope is sound overall.',
        'The overhead crane runway is out of alignment and needs correction before safe use.',
        'Three of eight motors are beyond economic repair.',
      ],
    },
    decisionEnabled: {
      ar: [
        'أعاد المستثمر التفاوض على سعر الاستحواذ بناءً على كلفة تصحيح مسار الرافعة واستبدال المحركات الثلاثة، بدلًا من الاعتماد على تقدير عام.',
      ],
      en: [
        'The investor renegotiated the acquisition price based on the actual cost of correcting the crane runway and replacing the three motors, rather than a general estimate.',
      ],
    },
    whatThisProves: {
      ar: 'أثبت أن الأصل يستحق سعرًا أقل مما طُلب، لا أن يُرفض تمامًا.',
      en: 'Proved the asset was worth a lower price, not a walk-away.',
    },
    equipment: [
      {
        id: 'eq-foundry-1',
        name: { ar: 'رافعة علوية', en: 'Overhead crane' },
        rating: '10 t',
        yearInstalled: 1998,
        grade: 4,
        note: { ar: 'مسار خارج المحاذاة، إصلاح ضروري قبل التشغيل.', en: 'Runway out of alignment; correction required before use.' },
      },
      {
        id: 'eq-foundry-2',
        name: { ar: 'محرك فرن الصهر', en: 'Melting furnace motor' },
        rating: '380 kW',
        yearInstalled: 1995,
        grade: 5,
        note: { ar: 'تجاوز الجدوى الاقتصادية للإصلاح.', en: 'Beyond economic repair.' },
      },
    ],
    cover: {
      src: '/images/cases/foundry-cover.jpg',
      alt: {
        ar: 'معدن منصهر يُصبّ في مسبك، والشرر يضيء الورشة',
        en: 'Molten metal being poured in a foundry, sparks lighting up the shop',
      },
      width: 1200,
      height: 800,
    },
    gallery: [
      {
        src: '/images/cases/foundry-gallery-1.jpg',
        alt: {
          ar: 'خطاف رافعة علوية بسعة طن واحد معلّق من عربته',
          en: 'A one-tonne-rated overhead crane hook hanging from its trolley',
        },
        width: 900,
        height: 600,
      },
    ],
  },
  {
    id: 'case-warehouse',
    slug: 'warehouse-material-handling-homs',
    title: {
      ar: 'مستودع ومناولة مواد — حمص',
      en: 'Warehouse and material handling, Homs',
    },
    sector: { ar: 'الخدمات اللوجستية', en: 'Logistics' },
    governorate: { ar: 'حمص', en: 'Homs' },
    year: 2025,
    status: 'delivered',
    brief: {
      ar: ['مستودع بنظام مناولة مواد متوقف جزئيًا. طلب المالك تقييمًا لجدوى إعادة تشغيل نظام النواقل قبل استئجار المستودع لطرف ثالث.'],
      en: ['A warehouse with a partly idle material-handling system. The owner requested an assessment of restarting the conveyor system before leasing the warehouse to a third party.'],
    },
    findings: {
      ar: [
        'نظام النواقل قابل للاستعادة ميكانيكيًا.',
        'علبة تروس المحرك الرئيسي و40٪ من البكرات الوسيطة تحتاج استبدالًا.',
      ],
      en: [
        'The belt conveyor system is mechanically recoverable.',
        'The drive gearbox and 40% of the idlers require replacement.',
      ],
    },
    decisionEnabled: {
      ar: ['حدد المالك كلفة إعادة التشغيل بدقة قبل التفاوض على عقد الإيجار، بدل تسعير المستودع كمساحة فارغة فقط.'],
      en: ['The owner priced the restart accurately before negotiating the lease, rather than pricing the warehouse as empty space alone.'],
    },
    whatThisProves: {
      ar: 'أثبت أن المستودع أصل يعمل جزئيًا، لا مساحة فارغة تُقيَّم من الصفر.',
      en: 'Proved the warehouse was a partly working asset, not empty space priced from zero.',
    },
    equipment: [
      {
        id: 'eq-warehouse-1',
        name: { ar: 'علبة تروس المحرك الرئيسي', en: 'Main drive gearbox' },
        rating: '22 kW',
        yearInstalled: 2010,
        grade: 4,
        note: { ar: 'يحتاج استبدالًا.', en: 'Requires replacement.' },
      },
      {
        id: 'eq-warehouse-2',
        name: { ar: 'بكرات الناقل', en: 'Conveyor idlers' },
        yearInstalled: 2010,
        grade: 3,
        note: { ar: '40٪ من البكرات تحتاج استبدالًا.', en: '40% of idlers require replacement.' },
      },
    ],
    cover: {
      src: '/images/cases/warehouse-cover.jpg',
      alt: {
        ar: 'داخل مستودع صناعي مهجور وشاهق، بأرفف فارغة تحت سقف مرتفع',
        en: 'The interior of a tall, abandoned industrial warehouse, empty racking under a high roof',
      },
      width: 1200,
      height: 800,
    },
    gallery: [
      {
        src: '/images/cases/warehouse-gallery-1.jpg',
        alt: {
          ar: 'صورة أرشيفية بالأبيض والأسود لهيكل ناقل في منشأة معالجة قديمة',
          en: 'A black-and-white archival view of a conveyor structure at an old processing plant',
        },
        width: 900,
        height: 600,
      },
    ],
  },
];
